import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="unauthorized-container">
      <h1>Access Denied</h1>
      <p>You don't have permission to access this page.</p>
      <p>This area requires administrator privileges.</p>
      <div className="action-buttons">
        <Link to="/" className="action-button">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
