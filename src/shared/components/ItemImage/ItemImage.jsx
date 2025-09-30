import React from 'react';
import './ItemImage.css';
import defaultImage from '../../../assets/default.jpg';

const ItemImage = ({ imageUrl, itemName }) => {
  // Always show an image - either the provided one or the default
  const imageSrc = imageUrl || defaultImage;

  return (
    <div className="item-image-container">
      <img 
        src={imageSrc} 
        alt={itemName}
        className="item-image"
        onError={(e) => {
          // If the provided image fails to load, fallback to default image
          if (e.target.src !== defaultImage) {
            e.target.src = defaultImage;
          }
        }}
      />
    </div>
  );
};

export default ItemImage;
