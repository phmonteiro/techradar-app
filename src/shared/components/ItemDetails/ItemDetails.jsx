import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ItemDetails.css';
import { Link } from 'react-router-dom';
import CommentsSection from '../CommentsSection/CommentsSection.jsx';
import RatingsDisplay from '../RatingsDisplay/RatingsDisplay.jsx';
import { getAverageRatingsForItem, transformApiRatings } from '../../../services/ratingsService';
import { useAuth } from '../../../contexts/AuthContext.jsx';

const ItemDetails = ({ item, itemType }) => {
  const { generatedId } = useParams();
  const [references, setReferences] = useState([]);
  const [itemRatings, setItemRatings] = useState([]);
  const [ratingsLoading, setRatingsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const navigate = useNavigate();
  const { currentUser, hasRole } = useAuth();

  const handleAddReference = () => {
    navigate(`/admin/references/add/${itemType}/${item.GeneratedID}`, {
      state: {
        createType: "withTypeAndLabel"
      }
    });
  };

  // Load average ratings from API for display
  const loadRatings = async () => {
    if (!item.GeneratedID || !itemType) {
      console.log('⚠️ loadRatings: Missing GeneratedID or itemType');
      return;
    }
    
    console.log('📥 Loading average ratings from API for:', { itemType, generatedId: item.GeneratedID });
    setRatingsLoading(true);
    try {
      const apiRatings = await getAverageRatingsForItem(itemType, item.GeneratedID);
      const transformedRatings = transformApiRatings(apiRatings);
      console.log('📊 Loaded average ratings:', transformedRatings);
      setItemRatings(transformedRatings);
    } catch (error) {
      console.error("❌ Error loading ratings:", error);
      setItemRatings([]);
    } finally {
      setRatingsLoading(false);
    }
  };

  useEffect(() => {
    if (generatedId) {
      // Fetch references for the item if generatedId is available
      fetch(`${import.meta.env.VITE_API_URL}/api/references/${itemType}/${item.GeneratedID}`)
        .then(response => response.json())
        .then(data => setReferences(data.data))
        .catch(error => console.error("Error fetching references:", error));
      
      // Load ratings from API
      loadRatings();
    }
  }, [generatedId, item.GeneratedID, itemType]);

  const isAdmin = hasRole && hasRole('Admin');

  // Helper function to ensure URL has proper protocol
  const formatUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    return `https://${url}`;
  };

  // Handler for when ratings are updated in the modal
  const handleRatingsUpdated = () => {
    console.log('🔄 handleRatingsUpdated called - reloading ratings from API...');
    loadRatings(); // Reload ratings after update
  };

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
                
                {item.RelevanceAndImpactforFidelidade && (
                  <>
                    <h2>Relevance & Impact for Fidelidade</h2>
                    <p>{item.RelevanceAndImpactforFidelidade}</p>
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
                {/* Ratings Section */}
                {(itemRatings.length > 0 || ratingsLoading) && (
                  <div className="ratings-section">
                    {ratingsLoading ? (
                      <div className="ratings-loading">
                        <p>Loading ratings...</p>
                      </div>
                    ) : (
                      <RatingsDisplay 
                        ratings={itemRatings}
                        title="Rating"
                        itemType={itemType}
                        generatedId={item.GeneratedID}
                        onRatingsUpdated={handleRatingsUpdated}
                      />
                    )}
                  </div>
                )}
                
                {/* Detail items moved to ItemView component */}
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
                        href={formatUrl(reference.Url)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="reference-link"
                        onClick={(e) => {
                          // Debug logging
                          console.log('Link clicked:', reference.Url);
                          console.log('Formatted URL:', formatUrl(reference.Url));
                          
                          // Prevent default if URL is invalid
                          if (!reference.Url || reference.Url.trim() === '') {
                            e.preventDefault();
                            alert('No URL provided for this reference');
                          }
                        }}
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
              generatedId={item.GeneratedID}
              type={itemType}
            />
          </div>
        )}
      </div>

    </div>
  );
};

export default ItemDetails;
