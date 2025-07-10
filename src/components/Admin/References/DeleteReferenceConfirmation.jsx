import React from 'react';
import '../AdminStyles.css';

const DeleteReferenceConfirmation = ({ reference, onCancel, onConfirm }) => {
  if (!reference) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Confirm Deletion</h3>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete the following reference?</p>
          <p><strong>{reference.Title}</strong> (Technology: {reference.TechnologyLabel})</p>
          <p className="warning-text">This action cannot be undone.</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteReferenceConfirmation;