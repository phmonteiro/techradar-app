import { useState } from "react";
import "./TabbedContent.css";

const TabbedContent = () => {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <div className="tabbed-content">
      <div className="tabs">
        <button
          className={`tab ${activeTab === "details" ? "active" : ""}`}
          onClick={() => setActiveTab("details")}
        >
          Details
        </button>
        <button
          className={`tab ${activeTab === "signals" ? "active" : ""}`}
          onClick={() => setActiveTab("signals")}
        >
          Signals
        </button>
      </div>

      {activeTab === "details" && (
        <>
          <div className="content-section">
            <div className="text-column">
              <h2>Definition & Scope</h2>
              <p>
                Robot chefs are automated cooking devices that utilize robotics
                and artificial intelligence to prepare food. Key aspects of this
                trend include:
              </p>

              <ul>
                <li>
                  <strong>Automation of Cooking Tasks:</strong> Robot chefs can
                  perform a variety of cooking functions, including chopping,
                  stirring, frying, and baking, reducing the time and effort
                  required for meal preparation.
                </li>
                <li>
                  <strong>Precision and Consistency:</strong> These machines can
                  replicate recipes with high accuracy, ensuring consistent
                  results every time, which is particularly beneficial for busy
                  households and restaurants.
                </li>
                <li>
                  <strong>Integration with Smart Home Technology:</strong> Many
                  robot chefs can connect to smart home systems, allowing users
                  to control them remotely via smartphone apps, receive recipe
                  suggestions, and monitor cooking progress.
                </li>
                <li>
                  <strong>Customization:</strong> Advanced robot chefs can adapt
                  recipes based on individual dietary preferences and
                  restrictions, providing personalized meal options for users.
                </li>
                <li>
                  <strong>Market Growth Potential:</strong> The market for robot
                  chefs is expected to grow significantly as consumers seek
                  innovative solutions for meal preparation and cooking
                  efficiency.
                </li>
              </ul>

              <h2>Relevance & Impact for Fidelidade</h2>
              <p>
                The trend of robot chefs is highly relevant for Fidelidade for
                several reasons:
              </p>

              <ul>
                <li>
                  <strong>Insurance Opportunities:</strong> As robot chefs
                  become more prevalent in homes and commercial kitchens, there
                  will be a need for specialized insurance products that cover
                  the unique risks associated with their use, including
                  liability for equipment malfunctions and potential injuries.
                </li>
                <li>
                  <strong>Risk Management:</strong> Understanding the specific
                  risks associated with robot chefs, such as safety concerns and
                  the reliability of automated cooking processes, will be
                  crucial for effective underwriting and risk assessment.
                </li>
                <li>
                  <strong>Market Positioning:</strong> By engaging with the
                  robot chef trend, Fidelidade can position itself as an
                  innovative insurer, appealing to clients involved in the
                  culinary and smart home technology sectors.
                </li>
              </ul>

              <p>However, there are challenges to consider:</p>

              <ul>
                <li>
                  <strong>Regulatory Environment:</strong> The use of robot
                  chefs may be subject to regulations regarding food safety and
                  appliance standards, which could influence insurance product
                  development.
                </li>
                <li>
                  <strong>Public Acceptance:</strong> Gaining acceptance for
                  robot chefs in traditional cooking practices may require
                  effective communication strategies to educate consumers about
                  their benefits and reliability.
                </li>
              </ul>

              <p>
                Overall, the trend of robot chefs presents both opportunities
                and challenges for Fidelidade, necessitating strategic
                engagement and...
              </p>
              <button className="read-more">Read more...</button>
            </div>
            <div className="trend-info-column">
              <div className="trend-section">
                <h3>
                  Trend Segment <span className="info-icon">ⓘ</span>
                </h3>
                <p>Home</p>
              </div>

              <div className="trend-section">
                <h3>
                  Trend Sub-Segment <span className="info-icon">ⓘ</span>
                </h3>
                <p>Smart Houses</p>
              </div>

              <div className="trend-section">
                <h3>
                  Trend Maturity Level <span className="info-icon">ⓘ</span>
                </h3>
                <p>
                  Emerging <span className="status-dot">●</span>
                </p>
              </div>

              <div className="trend-section">
                <h3>
                  Internal Status <span className="info-icon">ⓘ</span>
                </h3>
                <p>1- No internal activities</p>
              </div>
            </div>
          </div>

          <div className="references-section">
            <h2>References</h2>
            <div className="references-header">
              <div className="reference-tabs">
                <button className="tab active">All (3)</button>
                <button className="tab">Links (3)</button>
              </div>
              <div className="view-options">
                <button className="view-btn">
                  View <span>▼</span>
                </button>
              </div>
            </div>

            <div className="references-grid">
              <div className="reference-card">
                <img
                  src="/ktchn-rebel-logo.png"
                  alt="Kitchen Rebel"
                  className="reference-logo"
                />
                <h3>The future is now: how robots will...</h3>
                <a
                  href="https://www.ktchnrebel.com/smart..."
                  className="reference-link"
                >
                  https://www.ktchnrebel.com/smart...
                </a>
              </div>
              <div className="reference-card">
                <img
                  src="/ktchn-rebel-logo.png"
                  alt="Kitchen Rebel"
                  className="reference-logo"
                />
                <h3>The future is now: how robots will...</h3>
                <a
                  href="https://www.ktchnrebel.com/smart..."
                  className="reference-link"
                >
                  https://www.ktchnrebel.com/smart...
                </a>
              </div>
              <div className="reference-card">
                <img
                  src="/moley-logo.png"
                  alt="Moley Robotics"
                  className="reference-logo"
                />
                <h3>Moley Robotics - the world's first f...</h3>
                <a href="https://moley.com/" className="reference-link">
                  https://moley.com/
                </a>
              </div>
            </div>
          </div>

          <div className="comments-section">
            <div className="comments-header">
              <h2>Comments (1)</h2>{" "}
              {/* Updated count to reflect the placeholder comment */}
              <button className="sort-btn">
                Sort <span>▼</span>
              </button>
            </div>

            {/* Placeholder Comment */}
            <div className="comment">
              <p>
                <strong>John Doe:</strong> This is a placeholder comment. Feel
                free to add your thoughts!
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TabbedContent;
