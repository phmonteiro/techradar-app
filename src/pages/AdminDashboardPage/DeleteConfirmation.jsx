import React from 'react';
import './AdminModal.css';

const DeleteConfirmation = ({ data, onCancel, onConfirm }) => {
  if (!data) return null;
console.log("DeleteConfirmation data:", data);
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Confirm Deletion</h3>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete the following comment?</p>
          <p>Author: {data.Author}</p>
          <p>Text: {data.Text}</p>
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

export default DeleteConfirmation;