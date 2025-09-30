import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TechDetails.css';  // Assuming you have a CSS file
import { Link } from 'react-router-dom';
import CommentsSection from '../../../CommentsSection/CommentsSection.jsx';
import { useAuth } from '../../../contexts/AuthContext.jsx'; // 

const TechDetails = ({ technology }) => {
  const { label } = useParams();
  const [references, setReferences] = useState([]);
  const [activeTab, setActiveTab] = useState("details");
  const navigate = useNavigate(); // Add this hook
  const currentUser = useAuth();

  const handleAddReference = () => {
    navigate(`/admin/references/add/${technology.Label}`); // Adjust the route as needed
  };

  useEffect(() => {
    if (label) {
      // Fetch comments for the technology if label is available
      fetch(`${import.meta.env.VITE_API_URL}/api/references/technology/${label}`)
      .then(response => response.json())
      .then(data => setReferences(data.data))
      .catch(error => console.error("Error fetching references:", error));
      
    }
  }, [label]);

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
              <p>{technology?.DefinitionAndScope || 'No definition available'}</p>
              <h2>Relevance & Impact for Fidelidade</h2>
              <p>{technology?.RelevanceAndImpactForFidelidade || 'No impact information available'}</p>
              <button className="read-more">Read more...</button>
            </div>
            <div className="trend-info-column">
              <div className="trend-section">
                <h3>
                  Technology Segment <span className="info-icon">ⓘ</span>
                </h3>
                <p>{technology?.TechnologySegment || 'N/A'}</p>
              </div>

              <div className="trend-section">
                <h3>
                  Technology Maturity <span className="info-icon">ⓘ</span>
                </h3>
                <p>{technology?.TechnologyMaturity || 'N/A'} <span className="status-dot">●</span></p> 
              </div>

              <div className="trend-section">
                <h3>
                  Recommended Action <span className="info-icon">ⓘ</span>
                </h3>
                <p>
                {technology?.RecommendedAction || 'N/A'} <span className="status-dot">●</span>
                </p>
              </div>

              <div className="trend-section">
                <h3>
                  Content Source <span className="info-icon">ⓘ</span>
                </h3>
                <p>{technology?.ContentSource || 'N/A'}</p>
              </div>

              <div className="last-review-date">
                <h3>
                Last Review Date <span className="info-icon">ⓘ</span>
                </h3>
                <p>{technology?.LastReviewDate || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="references-section">
            <div className="references-header-main">
              <h2>References</h2>
              {currentUser && currentUser.currentUser.role === 'Admin' && <div className="view-options">
                  <button className="view-btn" onClick={handleAddReference}>
                    + Add Reference
                  </button>
              </div>}
            </div>
            <div className="references-header">
              <div className="reference-tabs">
                <button className="tab active">All ({references?.length > 0 ? references.length : 0})</button>
                <button className="tab">Links ({references?.length > 0 ? references.length : 0})</button>
              </div>
              <div className="view-options">
                <button className="view-btn">
                  View <span>▼</span>
                </button>
              </div>
            </div>

            <div className="references-grid">
              {references?.length > 0 ? (
                references.map((reference, index) => (
                  <div className="reference-card" key={index}>
                    {reference.ImageUrl && (
                      <img
                        src={reference.ImageUrl}
                        alt={reference.Title}
                        className="reference-logo"
                      />
                    )}
                    
                    <a href={reference.Link} className="reference-link" target="_blank" rel="noopener noreferrer">
                      <p>{reference.Title}</p>
                      <p>{reference.Link}</p>
                    </a>
                    
                  </div>
                ))
              ) : (
                <div className="reference-card">
                  <h3>No references available</h3>
                </div>
              )}
            </div>
          </div>

          <CommentsSection generatedId={label} type="technology" />

        </>
      )}

      {activeTab === "signals" && (
        <div className="signals-content">
          <p>Signal information would be displayed here.</p>
        </div>
      )}
    </div>
  );
};

export default TechDetails;