import React from "react";
import { Link } from "react-router-dom";

const StatCard = ({ icon, title, stat, buttons }) => {
  return (
    <div className="stat-card">
      <div className="stat-content">
        <div className="stat-header">
          <h3>
            <div className="stat-icon">{icon}</div>
            {title}: {stat}
          </h3>
        </div>
        <div className="stat-body">
          <div className="stat-buttons">
            {buttons.map((button, index) => (
              <button key={index}>
                <Link to={button.to} className="stat-link">
                  {button.text}
                </Link>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
