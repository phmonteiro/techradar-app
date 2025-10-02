// The MIT License (MIT)

// Copyright (c) 2017-2024 Zalando SE

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to  // adjust with config.scale.
  config.scale = config.scale || 0.75; // reduced from 0.85 to make radar more compacteal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.


function radar_visualization(config) {

  // Add CSS for right-aligned legend titles and tooltip styling
  if (!document.getElementById('radar-legend-styles')) {
    const style = document.createElement('style');
    style.id = 'radar-legend-styles';
    style.textContent = `
      .legend-title-right-aligned {
        text-align: right !important;
        direction: ltr !important;
        width: 100% !important;
        display: block !important;
        font-size: 16px !important;
        font-weight: bold !important;
      }
      .legend-title-left-aligned {
        text-align: left !important;
        direction: ltr !important;
        width: 100% !important;
        display: block !important;
        font-size: 16px !important;
        font-weight: bold !important;
      }
      #bubble {
        z-index: 9999 !important;
        pointer-events: none !important;
      }
      #bubble text {
        font-size: 14px !important;
        font-weight: bold !important;
      }
      #bubble rect {
        z-index: 9998 !important;
      }
      #bubble path {
        z-index: 9998 !important;
      }
    `;
    document.head.appendChild(style);
  }

  config.svg_id = config.svg || "radar";
  config.width = config.width || 1450;
  config.height = config.height || 1000;
  config.colors = ("colors" in config) ? config.colors : {
      background: "#fff",
      grid: '#dddde0',
      inactive: "#ddd"
    };
  config.print_layout = ("print_layout" in config) ? config.print_layout : true;
  // New option: render legend outside SVG as HTML to prevent overlap
  config.html_legend = ("html_legend" in config) ? config.html_legend : true;
  // Max height per quadrant column before scrolling (only for html legend)
  config.html_legend_max_height = config.html_legend_max_height || 480;
  // Optional mode: place each quadrant legend beside its quadrant (left/right stacked)
  config.html_legend_mode = config.html_legend_mode || 'grid'; // 'grid' | 'sided'
  config.links_in_new_tabs = ("links_in_new_tabs" in config) ? config.links_in_new_tabs : true;
  config.repo_url = config.repo_url || '#';
  config.print_ring_descriptions_table = ("print_ring_descriptions_table" in config) ? config.print_ring_descriptions_table : false;
  config.legend_offset = config.legend_offset || [
    { x: 450, y: 90 },
    { x: -675, y: 90 },
    { x: -675, y: -310 },
    { x: 450, y: -310 }
  ]
  config.title_offset = config.title_offset || { x: -675, y: -420 };
  config.footer_offset = config.footer_offset || { x: -155, y: 450 };
  config.legend_column_width = config.legend_column_width || 180;
  config.legend_line_height = config.legend_line_height || 12

  // In sided legend mode, optionally reduce radar width/height symmetrically so panels on both sides are closer
  if (config.html_legend && config.html_legend_mode === 'sided' && !config._sided_compact_applied) {
    const sidedWidth = config.sided_width || 800; // reduced from 1000 to bring radar closer to panels
    const sidedHeight = config.sided_height || config.height; // keep height unless overridden
    config.width = sidedWidth;
    config.height = sidedHeight;
    config._sided_compact_applied = true; // prevent repeated shrinking on re-renders
  }

  // custom random number generator, to make random sequence reproducible
  // source: https://stackoverflow.com/questions/521295
  var seed = 42;
  function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  function random_between(min, max) {
    return min + random() * (max - min);
  }

  function normal_between(min, max) {
    return min + (random() + random()) * 0.5 * (max - min);
  }

  // radial_min / radial_max are multiples of PI
  const quadrants = [
    { radial_min: 0, radial_max: 0.5, factor_x: 1, factor_y: 1 },
    { radial_min: 0.5, radial_max: 1, factor_x: -1, factor_y: 1 },
    { radial_min: -1, radial_max: -0.5, factor_x: -1, factor_y: -1 },
    { radial_min: -0.5, radial_max: 0, factor_x: 1, factor_y: -1 }
  ];

  const rings = [
    { radius: 130 },
    { radius: 220 },
    { radius: 310 },
    { radius: 400 }
  ];

  function polar(cartesian) {
    var x = cartesian.x;
    var y = cartesian.y;
    return {
      t: Math.atan2(y, x),
      r: Math.sqrt(x * x + y * y)
    }
  }

  function cartesian(polar) {
    return {
      x: polar.r * Math.cos(polar.t),
      y: polar.r * Math.sin(polar.t)
    }
  }

  function bounded_interval(value, min, max) {
    var low = Math.min(min, max);
    var high = Math.max(min, max);
    return Math.min(Math.max(value, low), high);
  }

  function bounded_ring(polar, r_min, r_max) {
    return {
      t: polar.t,
      r: bounded_interval(polar.r, r_min, r_max)
    }
  }

  function bounded_box(point, min, max) {
    return {
      x: bounded_interval(point.x, min.x, max.x),
      y: bounded_interval(point.y, min.y, max.y)
    }
  }

  function segment(quadrant, ring) {
    // Add validation to prevent out-of-bounds ring index
    if (ring < 0 || ring >= rings.length) {
      console.error(`Invalid ring index: ${ring}. Must be between 0 and ${rings.length - 1}`);
      // Return a default segment or use a fallback ring
      ring = Math.min(Math.max(0, ring), rings.length - 1);
    }

    var polar_min = {
      t: quadrants[quadrant].radial_min * Math.PI,
      r: ring === 0 ? 30 : rings[ring - 1].radius
    };
    var polar_max = {
      t: quadrants[quadrant].radial_max * Math.PI,
      r: rings[ring].radius
    };
    var cartesian_min = {
      x: 15 * quadrants[quadrant].factor_x,
      y: 15 * quadrants[quadrant].factor_y
    };
    var cartesian_max = {
      x: rings[3].radius * quadrants[quadrant].factor_x,
      y: rings[3].radius * quadrants[quadrant].factor_y
    };
    return {
      clipx: function(d) {
        var c = bounded_box(d, cartesian_min, cartesian_max);
        var p = bounded_ring(polar(c), polar_min.r + 15, polar_max.r - 15);
        d.x = cartesian(p).x; // adjust data too!
        return d.x;
      },
      clipy: function(d) {
        var c = bounded_box(d, cartesian_min, cartesian_max);
        var p = bounded_ring(polar(c), polar_min.r + 15, polar_max.r - 15);
        d.y = cartesian(p).y; // adjust data too!
        return d.y;
      },
      random: function() {
        return cartesian({
          t: random_between(polar_min.t, polar_max.t),
          r: normal_between(polar_min.r, polar_max.r)
        });
      }
    }
  }

  // position each entry randomly in its segment
  for (var i = 0; i < config.entries.length; i++) {
    var entry = config.entries[i];
    entry.segment = segment(entry.quadrant, entry.ring);
    var point = entry.segment.random();
    entry.x = point.x;
    entry.y = point.y;
    entry.color = entry.active || config.print_layout ?
      config.rings[entry.ring].color : config.colors.inactive;
  }

  // partition entries according to segments
  var segmented = new Array(4);
  for (let quadrant = 0; quadrant < 4; quadrant++) {
    segmented[quadrant] = new Array(4);
    for (var ring = 0; ring < 4; ring++) {
      segmented[quadrant][ring] = [];
    }
  }
  for (var i=0; i<config.entries.length; i++) {
    var entry = config.entries[i];
    segmented[entry.quadrant][entry.ring].push(entry);
  }

  // assign unique sequential id to each entry
  var id = 1;
  for (quadrant of [2,3,1,0]) {
    for (var ring = 0; ring < 4; ring++) {
      var entries = segmented[quadrant][ring];
      entries.sort(function(a,b) { return a.name.localeCompare(b.name); })
      for (var i=0; i<entries.length; i++) {
        entries[i].id = "" + id++;
      }
    }
  }

  function translate(x, y) {
    return "translate(" + x + "," + y + ")";
  }

  function viewbox(quadrant) {
    return [
      Math.max(0, quadrants[quadrant].factor_x * 400) - 420,
      Math.max(0, quadrants[quadrant].factor_y * 400) - 420,
      440,
      440
    ].join(" ");
  }

  // adjust with config.scale.
  config.scale = config.scale || 0.85;
  var scaled_width = config.width * config.scale;
  var scaled_height = config.height * config.scale;

  var svg = d3.select("svg#" + config.svg_id)
    .style("background-color", config.colors.background)
    .attr("width", scaled_width)
    .attr("height", scaled_height);

  var radar = svg.append("g");
  if ("zoomed_quadrant" in config) {
    svg.attr("viewBox", viewbox(config.zoomed_quadrant));
  } else {
    // Center normally; allow optional fine-tune via sided_shift_x (default 0 for symmetry)
    let baseX = scaled_width / 2;
    if (config.html_legend && config.html_legend_mode === 'sided') {
      const shift = (typeof config.sided_shift_x === 'number') ? config.sided_shift_x : 0;
      baseX -= shift;
    }
    radar.attr("transform", translate(baseX, scaled_height / 2).concat(`scale(${config.scale})`));
  }

  var grid = radar.append("g");

  // define default font-family
  config.font_family = config.font_family || "Arial, Helvetica";

  // draw grid lines
  grid.append("line")
    .attr("x1", 0).attr("y1", -400)
    .attr("x2", 0).attr("y2", 400)
    .style("stroke", config.colors.grid)
    .style("stroke-width", 1);
  grid.append("line")
    .attr("x1", -400).attr("y1", 0)
    .attr("x2", 400).attr("y2", 0)
    .style("stroke", config.colors.grid)
    .style("stroke-width", 1);

  // background color. Usage `.attr("filter", "url(#solid)")`
  // SOURCE: https://stackoverflow.com/a/31013492/2609980
  var defs = grid.append("defs");
  var filter = defs.append("filter")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 1)
    .attr("height", 1)
    .attr("id", "solid");
  filter.append("feFlood")
    .attr("flood-color", "rgb(0, 0, 0, 0.8)");
  filter.append("feComposite")
    .attr("in", "SourceGraphic");

  // draw rings
  for (var i = 0; i < rings.length; i++) {
    grid.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", rings[i].radius)
      .style("fill", "none")
      .style("stroke", config.colors.grid)
      .style("stroke-width", 1);
    if (config.print_layout) {
      grid.append("text")
        .text(config.rings[i].name)
        .attr("y", -rings[i].radius + 62)
        .attr("text-anchor", "middle")
        .style("fill", config.rings[i].color)
        .style("opacity", 0.35)
        .style("font-family", config.font_family)
        .style("font-size", "42px")
        .style("font-weight", "bold")
        .style("pointer-events", "none")
        .style("user-select", "none");
    }
  }

  function legend_transform(quadrant, ring, legendColumnWidth, index=null, previousHeight = null) {
    const dx = ring < 2 ? 0 : legendColumnWidth;
    let dy = (index == null ? -16 : index * config.legend_line_height);

    if (ring % 2 === 1) {
      dy = dy + 36 + previousHeight;
    }

    return translate(
      config.legend_offset[quadrant].x + dx,
      config.legend_offset[quadrant].y + dy
    );
  }

  // draw title and legend (only in print layout)
  if (config.print_layout && !config.html_legend) {
    // title
    radar.append("a")
      .attr("href", config.repo_url)
      .attr("transform", translate(config.title_offset.x, config.title_offset.y))
      .append("text")
      .attr("class", "hover-underline")  // add class for hover effect
      .text(config.title)
      .style("font-family", config.font_family)
      .style("font-size", "30")
      .style("font-weight", "bold")

    // date
    radar
      .append("text")
      .attr("transform", translate(config.title_offset.x, config.title_offset.y + 20))
      .text(config.date || "")
      .style("font-family", config.font_family)
      .style("font-size", "14")
      .style("fill", "#999")

    // footer
    radar.append("text")
      .attr("transform", translate(config.footer_offset.x, config.footer_offset.y))
      .text("▲ moved up     ▼ moved down     ★ new     ⬤ no change")
      .attr("xml:space", "preserve")
      .style("font-family", config.font_family)
      .style("font-size", "12px");

    // legend
    const legend = radar.append("g");
    for (let quadrant = 0; quadrant < 4; quadrant++) {
      legend.append("text")
        .attr("transform", translate(
          config.legend_offset[quadrant].x,
          config.legend_offset[quadrant].y - 45
        ))
        .text(config.quadrants[quadrant].name)
        .style("font-family", config.font_family)
        .style("font-size", "18px")
        .style("font-weight", "bold");
      let previousLegendHeight = 0
      for (let ring = 0; ring < 4; ring++) {
        if (ring % 2 === 0) {
          previousLegendHeight = 0
        }
        legend.append("text")
          .attr("transform", legend_transform(quadrant, ring, config.legend_column_width, null, previousLegendHeight))
          .text(config.rings[ring].name)
          .style("font-family", config.font_family)
          .style("font-size", "12px")
          .style("font-weight", "bold")
          .style("fill", config.rings[ring].color);
        legend.selectAll(".legend" + quadrant + ring)
          .data(segmented[quadrant][ring])
          .enter()
            .append("a")
              .attr("href", function (d, i) {
                 return d.link ? d.link : "#"; // stay on same page if no link was provided
              })
              // Add a target if (and only if) there is a link and we want new tabs
              .attr("target", function (d, i) {
                 return (d.link && config.links_in_new_tabs) ? "_blank" : null;
              })
            .append("text")
              .attr("transform", function(d, i) { return legend_transform(quadrant, ring, config.legend_column_width, i, previousLegendHeight); })
              .attr("class", "legend" + quadrant + ring)
              .attr("id", function(d, i) { return "legendItem" + d.id; })
              .text(function(d) { return d.id + ". " + d.name; })
              .style("font-family", config.font_family)
              .style("font-size", "8px")
              .on("mouseover", function(d) { showBubble(d); highlightLegendItem(d); highlightBlip(d); })
              .on("mouseout", function(d) { hideBubble(d); unhighlightLegendItem(d); unhighlightBlip(d); })
              .call(wrap_text)
              .each(function() {
                previousLegendHeight += d3.select(this).node().getBBox().height;
              });
      }
    }
  }

  // HTML legend rendering (non-overlapping, responsive, scrollable)
  if (config.print_layout && config.html_legend && config.html_legend_mode === 'grid') {
    // Ensure a container exists next to the SVG
    let host = document.querySelector('.tech-radar-container') || document.body;
    let existing = document.getElementById('radar-html-legend');
    if (existing) { existing.remove(); }
    const legendWrapper = document.createElement('div');
    legendWrapper.id = 'radar-html-legend';
    legendWrapper.style.display = 'grid';
    legendWrapper.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
    legendWrapper.style.gap = '32px';
    legendWrapper.style.margin = '32px auto';
    legendWrapper.style.maxWidth = '1800px';
    legendWrapper.style.fontFamily = config.font_family;
    legendWrapper.style.fontSize = '10px';
    legendWrapper.style.lineHeight = '1.3';
    legendWrapper.style.padding = '0 32px 48px';

    function createRingGroup(ringName, color) {
      const h = document.createElement('h5');
      h.textContent = ringName;
      h.style.margin = '8px 0 4px';
      h.style.fontSize = '10px';
      h.style.letterSpacing = '0.5px';
      h.style.color = color;
      h.style.fontWeight = '700';
      return h;
    }

    for (let q = 0; q < 4; q++) {
      const quadrantDiv = document.createElement('div');
      quadrantDiv.className = 'legend-quadrant';
      quadrantDiv.style.border = '1px solid #e2e2e2';
      quadrantDiv.style.borderRadius = '12px';
      quadrantDiv.style.padding = '16px 18px 20px';
      quadrantDiv.style.background = '#fff';
      quadrantDiv.style.boxShadow = '0 4px 12px -2px rgba(0,0,0,0.06)';
      quadrantDiv.style.maxHeight = (config.html_legend_max_height + 120) + 'px';
      quadrantDiv.style.overflow = 'hidden';
      quadrantDiv.style.display = 'flex';
      quadrantDiv.style.flexDirection = 'column';

      const qTitle = document.createElement('h3');
      qTitle.textContent = config.quadrants[q].name;
      qTitle.style.margin = '0 0 4px';
      qTitle.style.fontSize = '10px';
      qTitle.style.lineHeight = '1.2';
      qTitle.style.fontWeight = '700';
      quadrantDiv.appendChild(qTitle);

      const scrollArea = document.createElement('div');
      scrollArea.style.overflowY = 'auto';
      scrollArea.style.paddingRight = '6px';
      scrollArea.style.maxHeight = config.html_legend_max_height + 'px';
      scrollArea.style.scrollbarWidth = 'thin';

      // Group by ring inside quadrant
      for (let r = 0; r < 4; r++) {
        const ringHeader = createRingGroup(config.rings[r].name, config.rings[r].color);
        scrollArea.appendChild(ringHeader);

        const list = document.createElement('ol');
        list.style.margin = '0 0 8px 18px';
        list.style.padding = '0';
        list.style.listStyle = 'decimal';
        list.style.columnGap = '16px';
        list.style.breakInside = 'avoid';

        // Sort entries as before (by name)
        const entries = segmented[q][r].slice().sort((a,b)=> a.name.localeCompare(b.name));
        entries.forEach(e => {
          const li = document.createElement('li');
          li.style.margin = '0 0 2px';
          li.style.fontSize = '5px';
          li.style.lineHeight = '1.25';
          li.style.fontWeight = e.moved === 2 ? '600' : '400';
          if (!e.active) { li.style.opacity = 0.55; }
          const link = document.createElement('a');
            link.textContent = e.id + '. ' + e.name;
            link.style.textDecoration = 'underline';
            link.style.cursor = 'pointer';
            link.style.color = '#111';
            link.onmouseenter = () => { highlightLegendItem(e); highlightBlip(e); showBubble(e); };
            link.onmouseleave = () => { unhighlightLegendItem(e); unhighlightBlip(e); hideBubble(e); };
            if (e.link) {
              link.href = e.link;
              if (config.links_in_new_tabs) link.target = '_blank';
            } else {
              link.href = '#';
            }
          li.appendChild(link);
          list.appendChild(li);
        });
        scrollArea.appendChild(list);
      }

      quadrantDiv.appendChild(scrollArea);
      legendWrapper.appendChild(quadrantDiv);
    }

    host.appendChild(legendWrapper);
  }

  // SIDE LEGEND MODE (each quadrant list positioned beside its quadrant)
  if (config.print_layout && config.html_legend && config.html_legend_mode === 'sided') {
    const svgEl = document.getElementById(config.svg_id);
    if (svgEl) {
      // Reuse existing wrapper if already set up to avoid duplicated columns
      let wrapper = document.querySelector('.radar-layout-wrapper');
      if (!wrapper) {
        // Use the immediate container of the svg as insertion reference
        const originalContainer = svgEl.parentElement;
        wrapper = document.createElement('div');
        wrapper.className = 'radar-layout-wrapper';
        wrapper.style.display = 'grid';
  // Compact layout: narrower side columns and smaller gap to bring radar and panels closer
  wrapper.style.gridTemplateColumns = 'minmax(280px, 320px) auto minmax(280px, 320px)';
  wrapper.style.alignItems = 'stretch';
  wrapper.style.gap = '6px';
        wrapper.style.width = '100%';
        wrapper.style.maxWidth = '1600px'; // reduced from 1900px for more compact layout
        wrapper.style.margin = '0 auto 40px';
        // Create columns
        const leftCol = document.createElement('div'); leftCol.className = 'radar-side-col left'; leftCol.style.display='flex'; leftCol.style.flexDirection='column'; leftCol.style.gap='8px';
        const centerCol = document.createElement('div'); centerCol.className='radar-center'; centerCol.style.display='flex'; centerCol.style.justifyContent='center';
        const rightCol = document.createElement('div'); rightCol.className = 'radar-side-col right'; rightCol.style.display='flex'; rightCol.style.flexDirection='column'; rightCol.style.gap='8px';
        // Insert wrapper before original container then move svg
        originalContainer.parentElement.insertBefore(wrapper, originalContainer);
        centerCol.appendChild(svgEl);
        wrapper.appendChild(leftCol);
        wrapper.appendChild(centerCol);
        wrapper.appendChild(rightCol);
        // Remove the now-empty original container (optional)
        if (originalContainer.children.length === 0) {
          originalContainer.remove();
        }
        // Mark svg so we know setup happened
        svgEl.dataset.sideLegendSetup = 'true';
      }

      const leftCol = wrapper.querySelector('.radar-side-col.left');
      const rightCol = wrapper.querySelector('.radar-side-col.right');
      // Clear old content each invocation (update scenario)
      if (leftCol) leftCol.innerHTML = '';
      if (rightCol) rightCol.innerHTML = '';

      // Map quadrants to side/top-bottom panels (visual ordering: inverted - bottom then top for each side)
      const quadrantPlacement = [
        { quadrant: 2, side: 'left', position: 'top' },     // Lower Left -> Top Left
        { quadrant: 1, side: 'left', position: 'bottom' },  // Upper Left -> Bottom Left
        { quadrant: 3, side: 'right', position: 'top' },    // Lower Right -> Top Right
        { quadrant: 0, side: 'right', position: 'bottom' }  // Upper Right -> Bottom Right
      ];

      const halfHeight = (config.height * config.scale / 2) || 500; // original height reference

      function createPanel(qIndex, side) {
        const panel = document.createElement('div');
        panel.className = 'quadrant-panel';
        panel.style.flex = '1 1 0';
        panel.style.minHeight = '0';
        panel.style.display = 'flex';
        panel.style.flexDirection = 'column';
        panel.style.border = '1px solid #e1e5eb';
        panel.style.borderRadius = '14px';
        panel.style.background = '#fff';
        panel.style.boxShadow = '0 4px 18px -4px rgba(0,0,0,0.08)';
        panel.style.padding = '2px 4px 4px'; // reduced padding for more compact layout
        panel.style.maxHeight = (halfHeight - 12) + 'px';
        panel.style.overflow = 'hidden';
        panel.style.fontFamily = config.font_family;

        const title = document.createElement('h3');
        title.textContent = config.quadrants[qIndex].name;
        title.style.margin = '0 0 2px'; // reduced margin
        title.style.fontSize = '14px'; // smaller font
        title.style.lineHeight = '1.1';
        title.style.fontWeight = '700';
        // Apply consistent styling to all panel titles
        console.log(`Panel: ${config.quadrants[qIndex].name}, qIndex: ${qIndex}, side: ${side}`);
        if (side === 'left') {
          title.className = 'legend-title-right-aligned';
          console.log(`Applied right alignment to: ${config.quadrants[qIndex].name}`);
        } else {
          title.className = 'legend-title-left-aligned';
          console.log(`Applied left alignment to: ${config.quadrants[qIndex].name}`);
        }
        panel.appendChild(title);

        const scroll = document.createElement('div');
        scroll.style.overflowY = 'auto';
        scroll.style.paddingRight = '6px';
        scroll.style.scrollbarWidth = 'thin';
        scroll.style.flex = '1 1 auto';
        panel.appendChild(scroll);

        // Rings in order (0..3)
        for (let r=0; r<4; r++) {
          const ringHeader = document.createElement('h5');
          ringHeader.textContent = config.rings[r].name;
          ringHeader.style.margin = '6px 0 2px'; // reduced margins
          ringHeader.style.fontSize = '12px'; // smaller font
          ringHeader.style.fontWeight = '700';
          ringHeader.style.letterSpacing = '0.3px';
          ringHeader.style.color = config.rings[r].color;
          // Right-align ring headers for left side panels
          if (side === 'left') {
            ringHeader.style.textAlign = 'right';
          }
          scroll.appendChild(ringHeader);

            const list = document.createElement('ol');
            list.style.margin = '0 0 4px 6px'; // reduced margins
            list.style.padding = '0';
            list.style.listStyle = 'decimal';
            list.style.fontSize = '13px'; // smaller font
            list.style.lineHeight = '1.55'; // tighter line height

            const entries = segmented[qIndex][r].slice().sort((a,b)=> a.name.localeCompare(b.name));
            entries.forEach(e => {
              const li = document.createElement('li');
              li.style.margin = '0 0 1px'; // reduced bottom margin
              li.style.padding = '0'; // ensure no extra padding
              if (!e.active) li.style.opacity = 0.55;
              const link = document.createElement('a');
              link.textContent = e.id + '. ' + e.name;
              link.style.textDecoration = 'underline';
              link.style.cursor = 'pointer';
              link.style.color = '#111';
              if (e.link) { link.href = e.link; if (config.links_in_new_tabs) link.target='_blank'; } else { link.href='#'; }
              link.onmouseenter = () => {
                highlightLegendItem(e);
                highlightBlip(e);
                showBubble(e);
              };
              link.onmouseleave = () => {
                unhighlightLegendItem(e);
                unhighlightBlip(e);
                hideBubble(e);
              };
              li.appendChild(link);
              list.appendChild(li);
            });
          scroll.appendChild(list);
        }

        return panel;
      }

      quadrantPlacement.forEach(qp => {
        const panel = createPanel(qp.quadrant, qp.side);
        if (qp.side === 'left' && leftCol) {
          leftCol.appendChild(panel);
        } else if (rightCol) {
          rightCol.appendChild(panel);
        }
      });
    }
  }

  function wrap_text(text) {
    let heightForNextElement = 0;

    text.each(function() {
      const textElement = d3.select(this);
      const words = textElement.text().split(" ");
      let line = [];

      // Use '|' at the end of the string so that spaces are not trimmed during rendering.
      const number = `${textElement.text().split(".")[0]}. |`;
      const legendNumberText = textElement.append("tspan").text(number);
      const legendBar = textElement.append("tspan").text('|');
      const numberWidth = legendNumberText.node().getComputedTextLength() - legendBar.node().getComputedTextLength();

      textElement.text(null);

      let tspan = textElement
          .append("tspan")
          .attr("x", 0)
          .attr("y", heightForNextElement)
          .attr("dy", 0);

      for (let position = 0; position < words.length; position++) {
        line.push(words[position]);
        tspan.text(line.join(" "));

        // Avoid wrap for first line (position !== 1) to not end up in a situation where the long text without
        // whitespace is wrapped (causing the first line near the legend number to be blank).
        if (tspan.node().getComputedTextLength() > config.legend_column_width && position !== 1) {
          line.pop();
          tspan.text(line.join(" "));
          line = [words[position]];

          tspan = textElement.append("tspan")
              .attr("x", numberWidth)
              .attr("dy", config.legend_line_height)
              .text(words[position]);
        }
      }

      const textBoundingBox = textElement.node().getBBox();
      heightForNextElement = textBoundingBox.y + textBoundingBox.height;
    });
  }

  // layer for entries
  var rink = radar.append("g")
    .attr("id", "rink");

  // Bubble will be created at the end to ensure it appears on top

  function showBubble(d) {
    if (d.active || config.print_layout) {
      var tooltip = d3.select("#radar-tooltip")
        .text(d.name);
      
      // Get the actual blip element and its screen position
      var blipElement = d3.select("#blip-" + d.id).node();
      if (blipElement) {
        var blipRect = blipElement.getBoundingClientRect();
        
        // Account for page scroll to position tooltip correctly
        var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;
        
        // Position tooltip relative to the actual blip position on screen + scroll offset
        tooltip
          .style("left", (blipRect.left + scrollX + blipRect.width / 2) + "px")
          .style("top", (blipRect.top + scrollY - 35) + "px")
          .style("opacity", 0.9)
          .style("transform", "translateX(-50%)"); // Center the tooltip horizontally
      } else {
        // Fallback to manual calculation if blip element not found
        var svgElement = d3.select("svg#" + config.svg_id).node();
        var svgRect = svgElement.getBoundingClientRect();
        var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;
        
        let baseX = scaled_width / 2;
        if (config.html_legend && config.html_legend_mode === 'sided') {
          const shift = (typeof config.sided_shift_x === 'number') ? config.sided_shift_x : 0;
          baseX -= shift;
        }
        
        let transformedX = baseX + (d.x * config.scale);
        let transformedY = (scaled_height / 2) + (d.y * config.scale);
        
        tooltip
          .style("left", (svgRect.left + scrollX + transformedX) + "px")
          .style("top", (svgRect.top + scrollY + transformedY - 35) + "px")
          .style("opacity", 0.9)
          .style("transform", "translateX(-50%)");
      }
    }
  }

  function hideBubble(d) {
    d3.select("#radar-tooltip")
      .style("opacity", 0);
  }

  function highlightLegendItem(d) {
    var legendItem = document.getElementById("legendItem" + d.id);
    if (legendItem) {
      legendItem.setAttribute("filter", "url(#solid)");
      legendItem.setAttribute("fill", "white");
    }
  }

  function unhighlightLegendItem(d) {
    var legendItem = document.getElementById("legendItem" + d.id);
    if (legendItem) {
      legendItem.removeAttribute("filter");
      legendItem.removeAttribute("fill");
    }
  }

  function highlightBlip(d) {
    var blipElement = d3.select("#blip-" + d.id);
    var shape = blipElement.select("circle, path");
    
    if (!shape.empty()) {
      // Check if already highlighted to prevent re-highlighting
      if (shape.attr("data-highlighted") === "true") return;
      
      // Store original values only if not already stored
      var originalR = shape.attr("data-original-r") || shape.attr("r");
      var originalTransform = shape.attr("data-original-transform") || shape.attr("transform");
      
      // Enhanced visual feedback
      shape
        .attr("data-original-r", originalR)
        .attr("data-original-transform", originalTransform || "")
        .attr("data-highlighted", "true")
        .style("stroke", "#fff")
        .style("stroke-width", "3px")
        .style("filter", "drop-shadow(0 0 8px rgba(0,0,0,0.4))")
        .transition()
        .duration(150)
        .attr("r", function() {
          // Increase size for circles
          if (this.tagName === "circle") {
            var r = parseFloat(originalR);
            return r ? r * 1.3 : originalR;
          }
          return null;
        })
        .attr("transform", function() {
          // Scale up paths (triangles, stars)
          if (this.tagName === "path") {
            var baseTransform = originalTransform || "";
            return baseTransform + " scale(1.3)";
          }
          return originalTransform || "";
        });
    }
  }

  function unhighlightBlip(d) {
    var blipElement = d3.select("#blip-" + d.id);
    var shape = blipElement.select("circle, path");
    
    if (!shape.empty()) {
      // Check if actually highlighted
      if (shape.attr("data-highlighted") !== "true") return;
      
      var originalR = shape.attr("data-original-r");
      var originalTransform = shape.attr("data-original-transform");
      
      shape
        .attr("data-highlighted", "false")
        .style("stroke", null)
        .style("stroke-width", null)
        .style("filter", null)
        .transition()
        .duration(150)
        .attr("r", originalR)
        .attr("transform", originalTransform || "");
    }
  }

  // draw blips on radar
  var blips = rink.selectAll(".blip")
    .data(config.entries)
    .enter()
      .append("g")
        .attr("class", "blip")
        .attr("id", function(d){ return 'blip-' + d.id; })
        .attr("transform", function(d) { return translate(d.x, d.y); })
        .on("mouseover", function(d) { showBubble(d); highlightLegendItem(d); highlightBlip(d); })
        .on("mouseout", function(d) { hideBubble(d); unhighlightLegendItem(d); unhighlightBlip(d); });

  // configure each blip
  blips.each(function(d) {
    var blip = d3.select(this);

    // blip link
    if (d.active && Object.prototype.hasOwnProperty.call(d, "link") && d.link) {
      blip = blip.append("a")
        .attr("xlink:href", d.link);

      if (config.links_in_new_tabs) {
        blip.attr("target", "_blank");
      }
    }

    // blip shape
    if (d.moved == 1) {
      blip.append("path")
        .attr("d", "M -11,5 11,5 0,-13 z") // triangle pointing up
        .style("fill", d.color);
    } else if (d.moved == -1) {
      blip.append("path")
        .attr("d", "M -11,-5 11,-5 0,13 z") // triangle pointing down
        .style("fill", d.color);
    } else if (d.moved == 2) {
      blip.append("path")
        .attr("d", d3.symbol().type(d3.symbolStar).size(200))
        .style("fill", d.color);
    } else {
      blip.append("circle")
        .attr("r", 9)
        .attr("fill", d.color);
    }

    // blip text
    if (d.active || config.print_layout) {
      var blip_text = config.print_layout ? d.id : d.name.match(/[a-z]/i);
      blip.append("text")
        .text(blip_text)
        .attr("y", 3)
        .attr("text-anchor", "middle")
        .style("fill", "#fff")
        .style("font-family", config.font_family)
        .style("font-size", function(d) { return blip_text.length > 2 ? "8px" : "9px"; })
        .style("pointer-events", "none")
        .style("user-select", "none");
    }
  });

  // make sure that blips stay inside their segment
  function ticked() {
    blips.attr("transform", function(d) {
      return translate(d.segment.clipx(d), d.segment.clipy(d));
    })
  }

  // distribute blips, while avoiding collisions
  d3.forceSimulation()
    .nodes(config.entries)
    .velocityDecay(0.19) // magic number (found by experimentation)
    .force("collision", d3.forceCollide().radius(12).strength(0.85))
    .on("tick", ticked);

  function ringDescriptionsTable() {
    var table = d3.select("body").append("table")
      .attr("class", "radar-table")
      .style("border-collapse", "collapse")
      .style("position", "relative")
      .style("top", "-70px")  // Adjust this value to move the table closer vertically
      .style("margin-left", "50px")
      .style("margin-right", "50px")
      .style("font-family", config.font_family)
      .style("font-size", "13px")
      .style("text-align", "left");

    var thead = table.append("thead");
    var tbody = table.append("tbody");

    // define fixed width for each column
    var columnWidth = `${100 / config.rings.length}%`;

    // create table header row with ring names
    var headerRow = thead.append("tr")
      .style("border", "1px solid #ddd");

    headerRow.selectAll("th")
      .data(config.rings)
      .enter()
      .append("th")
      .style("padding", "8px")
      .style("border", "1px solid #ddd")
      .style("background-color", d => d.color)
      .style("color", "#fff")
      .style("width", columnWidth)
      .text(d => d.name);

    // create table body row with descriptions
    var descriptionRow = tbody.append("tr")
      .style("border", "1px solid #ddd");

    descriptionRow.selectAll("td")
      .data(config.rings)
      .enter()
      .append("td")
      .style("padding", "8px")
      .style("border", "1px solid #ddd")
      .style("width", columnWidth)
      .text(d => d.description);
  }

  if (config.print_ring_descriptions_table) {
    ringDescriptionsTable();
  }

  // Create HTML tooltip that floats above the SVG (guaranteed to appear on top)
  var tooltip = d3.select("body").append("div")
    .attr("id", "radar-tooltip")
    .style("position", "absolute")
    .style("background-color", "#333")
    .style("color", "#fff")
    .style("padding", "8px 12px")
    .style("border-radius", "4px")
    .style("font-family", config.font_family)
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .style("pointer-events", "none")
    .style("opacity", 0)
    .style("z-index", "10000")
    .style("box-shadow", "0 2px 8px rgba(0,0,0,0.3)")
    .style("white-space", "nowrap");
}
