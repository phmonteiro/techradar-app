import React from 'react';
import './ProgressTrack.css';

const ProgressTrack = ({ currentStage, isAdmin, trendLabel, onStageUpdate }) => {
  const stages = ['Assess', 'Trial', 'Adopt', 'Hold'];

  const handleStageClick = (stage) => {
    if (isAdmin && onStageUpdate) {
      onStageUpdate(trendLabel, stage);
    }
  };

  return (
    <div className="progress-track">
      <div className="progress-stages">
        {stages.map((stage, index) => (
          <div
            key={stage}
            className={`stage ${currentStage === stage ? 'active' : ''} ${
              isAdmin ? 'clickable' : ''
            }`}
            onClick={() => handleStageClick(stage)}
          >
            <div className="stage-dot"></div>
            <div className="stage-label">{stage}</div>
            {index < stages.length - 1 && <div className="stage-line"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTrack;