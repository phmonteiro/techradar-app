import React, { useState } from 'react';
import './ProgressTrack.css';

const ProgressTrack = ({ 
  currentStage = 'Planned', 
  isAdmin = false, 
  itemLabel, 
  onStageUpdate, 
  stages = [], 
  progressType = 'technology' 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState(currentStage);

  // Default stages based on type
  const defaultStages = {
    technology: ['In Place', 'Proofing', 'Planned', 'Possible'],
    trend: ['Assess', 'Trial', 'Adopt', 'Hold']
  };

  const stageList = stages.length > 0 ? stages : defaultStages[progressType] || defaultStages.technology;

  const handleOpenModal = () => {
    if (!isAdmin) return;
    setSelectedStage(currentStage);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleStageUpdate = async () => {
    if (onStageUpdate) {
      await onStageUpdate(itemLabel, selectedStage);
    }
    setShowModal(false);
  };

  const handleStageClick = (stage) => {
    if (isAdmin && onStageUpdate) {
      onStageUpdate(itemLabel, stage);
    }
  };

  // Render different styles based on progressType
  if (progressType === 'trend') {
    return (
      <div className="progress-track trend-progress">
        <div className="progress-stages">
          {stageList.map((stage, index) => (
            <div
              key={stage}
              className={`stage ${currentStage === stage ? 'active' : ''} ${
                isAdmin ? 'clickable' : ''
              }`}
              onClick={() => handleStageClick(stage)}
            >
              <div className="stage-dot"></div>
              <div className="stage-label">{stage}</div>
              {index < stageList.length - 1 && <div className="stage-line"></div>}
            </div>
          ))}
        </div>
        
        {isAdmin && (
          <div className="admin-controls">
            <button className="update-stage-btn" onClick={handleOpenModal}>
              Update Stage
            </button>
          </div>
        )}

        {/* Modal for trend stage update */}
        {showModal && (
          <div className="modal-content-direct">
            <div className="modal-header">
              <h3>Update Trend Stage</h3>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            
            <div className="modal-body">
              <p>Select the new stage for this trend:</p>
              <div className="stage-options">
                {stageList.map((stage) => (
                  <label key={stage} className="stage-option">
                    <input
                      type="radio"
                      name="stage"
                      value={stage}
                      checked={selectedStage === stage}
                      onChange={(e) => setSelectedStage(e.target.value)}
                    />
                    <span className="stage-name">{stage}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleCloseModal}>
                Cancel
              </button>
              <button 
                className="save-btn" 
                onClick={handleStageUpdate}
                disabled={selectedStage === currentStage}
              >
                Update Stage
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Technology progress track with modal
  return (
    <div className="progress-track technology-progress">
      <div className="progress-points">
        {stageList.map((stage) => (
          <div className="progress-point" key={stage}>
            <div className={`point ${stage === currentStage ? 'active' : ''}`}></div>
            <span className={`label ${stage === currentStage ? 'active' : ''}`}>
              {stage}
            </span>
          </div>
        ))}
      </div>
      
      {isAdmin && (
        <div className="admin-controls">
          <button className="update-stage-btn" onClick={handleOpenModal}>
            Update Stage
          </button>
        </div>
      )}

      {/* Modal for stage update */}
      {showModal && (
        <div className="modal-content-direct">
          <div className="modal-header">
            <h3>Update Technology Stage</h3>
            <button className="close-btn" onClick={handleCloseModal}>×</button>
          </div>
          
          <div className="modal-body">
            <p>Select the new stage for this technology:</p>
            <div className="stage-options">
              {stageList.map((stage) => (
                <label key={stage} className="stage-option">
                  <input
                    type="radio"
                    name="stage"
                    value={stage}
                    checked={selectedStage === stage}
                    onChange={(e) => setSelectedStage(e.target.value)}
                  />
                  <span className="stage-name">{stage}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="modal-footer">
            <button className="cancel-btn" onClick={handleCloseModal}>
              Cancel
            </button>
            <button 
              className="save-btn" 
              onClick={handleStageUpdate}
              disabled={selectedStage === currentStage}
            >
              Update Stage
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTrack;
