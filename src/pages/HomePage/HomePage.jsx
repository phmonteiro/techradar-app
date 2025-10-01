import React, { useEffect, useRef, useState } from "react";
import "./TechnologyRadar.css"; // Ensure radar.css is in the same directory
import { getTechnologyRadarConfig } from './TechnologyRadarConfig';
import Navbar from "../../components/Navbar/Navbar";

const HomePage = () => {
  const radarRef = useRef(null);
  const { config, loading, error } = getTechnologyRadarConfig();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Dynamically load D3.js and radar.js
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    async function initializeRadar() {
      try {
        await loadScript("https://d3js.org/d3.v4.min.js"); // Load D3.js
        await loadScript("/radar.js"); // Load radar.js from public folder

        if (window.radar_visualization) {
          console.log('Calling radar_visualization with config:', config);
          console.log('Entries being passed:', config.entries);
          
          window.radar_visualization({
            repo_url: "https://github.com/zalando/tech-radar",
            title: "Fidelidade Tech Radar",
            date: config.date,
            html_legend: true,
            html_legend_mode: 'sided',
            quadrants: [
              { name: "Operate & Automate" }, // 0  
              { name: "Build & Connect" }, // 1
              { name: "Scale & Monetize" }, // 2
              { name: "Inspire & Understand" }, // 3
            ],
            rings: [
              { name: "ADOPT", color: "#5ba300" }, // 0
              { name: "TRIAL", color: "#009eb0" }, // 1
              { name: "INVESTIGATE", color: "#c7ba00" }, // 2
              { name: "WATCH", color: "#e09b96" }, // 3
            ],
            entries: config.entries,
          });

          setIsLoaded(true);
        }
      } catch (error) {
        console.error("Error loading radar visualization:", error);
      }
    }

    initializeRadar();
  }, [config]);

  if (loading) return <div>Loading tech radar...</div>;
  if (error) return <div>Error loading tech radar: {error}</div>;
  if (!config) return <div>No configuration available</div>;

  return (
    <div className="tech-radar-container">
      <Navbar />
      <div className="radar-content">
        {!isLoaded && <p>Loading radar visualization...</p>}
        <div className="tech-radar-svg-container">
          <svg id="radar" ref={radarRef}></svg>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
