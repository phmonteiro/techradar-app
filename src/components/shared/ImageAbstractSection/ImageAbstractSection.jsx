import React from 'react';
import ItemImage from '../ItemImage/ItemImage';
import ItemAbstract from '../ItemAbstract/ItemAbstract';
import './ImageAbstractSection.css';

const ImageAbstractSection = ({ item }) => {
  // Always show the section since we now have a default image
  // Only hide if there's no abstract and explicitly no image URL and no name
  if (!item.Abstract && !item.ImageUrl && !item.Name) return null;

  return (
    <div className="image-abstract-section">
      <ItemImage imageUrl={item.ImageUrl} itemName={item.Name} />
      <ItemAbstract abstract={item.Abstract} />
    </div>
  );
};

export default ImageAbstractSection;
