import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ItemDetails.css';
import { Link } from 'react-router-dom';
import CommentsSection from '../../CommentsSection/CommentsSection.jsx';
import { useAuth } from '../../../contexts/AuthContext.jsx';

const ItemDetails = ({ item, itemType }) => {
  const { label } = useParams();
  const [references, setReferences] = useState([]);
  const [activeTab, setActiveTab] = useState("details");
  const navigate = useNavigate();
  const { currentUser, hasRole } = useAuth();

  const handleAddReference = () => {
    navigate(`/admin/references/add/${itemType}/${item.Label}`, {
      state: {
        createType: "withTypeAndLabel"
      }
    });
  };

  useEffect(() => {
    if (label) {
      // Fetch references for the item if label is available
      fetch(`${import.meta.env.VITE_API_URL}/api/references/${itemType}/${item.Label}`)
        .then(response => response.json())
        .then(data => setReferences(data.data))
        .catch(error => console.error("Error fetching references:", error));
    }
  }, [label, item.Label, itemType]);

  const isAdmin = hasRole && hasRole('admin');

  return (
    <div className="item-details">
      <div className="tabs">
        <button 
          className={activeTab === "details" ? "tab active" : "tab"} 
          onClick={() => setActiveTab("details")}
        >
          Details
        </button>
        <button 
          className={activeTab === "references" ? "tab active" : "tab"} 
          onClick={() => setActiveTab("references")}
        >
          References ({references.length})
        </button>
        <button 
          className={activeTab === "comments" ? "tab active" : "tab"} 
          onClick={() => setActiveTab("comments")}
        >
          Comments
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === "details" && (
          <div className="details-content">
            {/* Main Content Sections */}
            <div className="content-section">
              <div className="text-column">
                {item.DefinitionAndScope && (
                  <>
                    <h2>Definition & Scope</h2>
                    <p>{item.DefinitionAndScope}</p>
                  </>
                )}
                
                {item.RelevanceAndImpactForFidelidade && (
                  <>
                    <h2>Relevance & Impact for Fidelidade</h2>
                    <p>{item.RelevanceAndImpactForFidelidade}</p>
                  </>
                )}

                {item.Impact && (
                  <>
                    <h2>Impact</h2>
                    <p>{item.Impact}</p>
                  </>
                )}

                {item.Scope && (
                  <>
                    <h2>Scope</h2>
                    <p>{item.Scope}</p>
                  </>
                )}
              </div>

              <div className="info-column">
                <div className="detail-grid-compact">
                  <div className="detail-item">
                    <h3>Stage</h3>
                    <span className={`stage-badge ${item.Stage?.toLowerCase()}`}>
                      {item.Stage}
                    </span>
                  </div>
                  
                  {item.TechnologySegment && (
                    <div className="detail-item">
                      <h3>Technology Segment</h3>
                      <p>{item.TechnologySegment}</p>
                    </div>
                  )}
                  
                  {item.TechnologyMaturity && (
                    <div className="detail-item">
                      <h3>Technology Maturity</h3>
                      <p>{item.TechnologyMaturity}</p>
                    </div>
                  )}
                  
                  {item.RecommendedAction && (
                    <div className="detail-item">
                      <h3>Recommended Action</h3>
                      <p>{item.RecommendedAction}</p>
                    </div>
                  )}
                  
                  {item.ContentSource && (
                    <div className="detail-item">
                      <h3>Content Source</h3>
                      <p>{item.ContentSource}</p>
                    </div>
                  )}
                  
                  {item.LastReviewDate && (
                    <div className="detail-item">
                      <h3>Last Review Date</h3>
                      <p>{new Date(item.LastReviewDate).toLocaleDateString('pt-PT')}</p>
                    </div>
                  )}

                  {item.Category && (
                    <div className="detail-item">
                      <h3>Category</h3>
                      <p>{item.Category}</p>
                    </div>
                  )}
                  
                  {item.Type && (
                    <div className="detail-item">
                      <h3>Type</h3>
                      <p>{item.Type}</p>
                    </div>
                  )}
                  
                  {item.BusinessValue && (
                    <div className="detail-item">
                      <h3>Business Value</h3>
                      <p>{item.BusinessValue}</p>
                    </div>
                  )}
                  
                  {item.TechnicalDetails && (
                    <div className="detail-item">
                      <h3>Technical Details</h3>
                      <p>{item.TechnicalDetails}</p>
                    </div>
                  )}
                  
                  {item.Timeline && (
                    <div className="detail-item">
                      <h3>Timeline</h3>
                      <p>{item.Timeline}</p>
                    </div>
                  )}
                  
                  {item.ExpectedOutcome && (
                    <div className="detail-item">
                      <h3>Expected Outcome</h3>
                      <p>{item.ExpectedOutcome}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "references" && (
          <div className="references-content">
            <div className="references-header">
              <h3>References</h3>
              {isAdmin && (
                <button 
                  onClick={handleAddReference}
                  className="add-reference-btn"
                >
                  Add Reference
                </button>
              )}
            </div>
            
            {references.length > 0 ? (
              <div className="references-list">
                {references.map((reference, index) => (
                  <div key={index} className="reference-item">
                    <h4>
                      <a 
                        href={reference.URL} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="reference-link"
                      >
                        {reference.Title}
                      </a>
                    </h4>
                    <p className="reference-description">{reference.Description}</p>
                    <span className="reference-type">{reference.Type}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-references">
                <p>No references available for this {itemType}.</p>
                {isAdmin && (
                  <button 
                    onClick={handleAddReference}
                    className="add-first-reference-btn"
                  >
                    Add the first reference
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        
        {activeTab === "comments" && (
          <div className="comments-content">
            <CommentsSection 
              entityType={itemType}
              entityLabel={item.Label}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetails;
