import React, { useState } from 'react';
import axios from 'axios';
import './TechnologyImageUpload.css';

const TechnologyImageUpload = ({ technologyId, onImageUploaded, currentImageUrl }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    
    // Create preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);
    
    setUploading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/technologies/${technologyId}/image`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (onImageUploaded) {
        onImageUploaded(response.data.imageUrl);
      }
      
      setPreviewUrl(response.data.imageUrl);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="technology-image-upload">
      {previewUrl && (
        <div className="image-preview">
          <img src={previewUrl} alt="Preview" />
        </div>
      )}
      
      <div className="upload-controls">
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept="image/*" 
          id="image-upload"
          className="file-input" 
        />
        <label htmlFor="image-upload" className="file-label">
          Choose Image
        </label>
        
        <button 
          onClick={handleUpload} 
          disabled={!selectedFile || uploading}
          className="upload-button"
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </div>
    </div>
  );
};

export default TechnologyImageUpload;