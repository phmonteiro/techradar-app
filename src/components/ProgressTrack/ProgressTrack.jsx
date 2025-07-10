import React, { useState } from 'react';
import './ProgressTrack.css';  // Assuming you have a CSS file

const ProgressTrack = ({type, currentStage, isAdmin = false, label, onStageUpdate }) => {

  const stageConfig = {
    technology: ['In Place', 'Proofing', 'Planned', 'Possible'],
    trend: ['No Action', 'Explore', 'Validate', 'Adopt', 'Act Now']
  };
  
  const stages = stageConfig[type] || [];
  const [showModal, setShowModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState(currentStage);

  const handleOpenModal = () => {
    setSelectedStage(currentStage);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleStageUpdate = async () => {
    if (onStageUpdate) {
      await onStageUpdate(label, selectedStage);
    }
    setShowModal(false);
  };

  return (
    <div className="progress-track">
      <div className="progress-points">
        {stages.map((stage) => (
          <div className="progress-point" key={stage}>
            <div className={`point ${stage === currentStage ? 'active' : ''}`}></div>
            <span className={stage === currentStage ? 'active' : ''}>{stage}</span>
          </div>
        ))}
      </div>
      <div className="progress-line"></div>
      
      {isAdmin && (
        <button className="edit-stage-btn" onClick={handleOpenModal}>
          Update Stage
        </button>
      )}

      {showModal && (
        <div className="stage-modal-overlay">
          <div className="stage-modal">
            <h3>Update Technology Stage</h3>
            <div className="stage-options">
              {stages.map((stage) => (
                <div className="stage-option" key={stage}>
                  <input
                    type="radio"
                    id={stage}
                    name="stage"
                    value={stage}
                    checked={selectedStage === stage}
                    onChange={() => setSelectedStage(stage)}
                  />
                  <label htmlFor={stage}>{stage}</label>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={handleCloseModal}>Cancel</button>
              <button onClick={handleStageUpdate} className="update-btn">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTrack;