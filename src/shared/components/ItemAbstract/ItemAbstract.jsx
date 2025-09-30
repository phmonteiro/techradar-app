import React from 'react';
import './ItemAbstract.css';

const ItemAbstract = ({ abstract }) => {
  if (!abstract) return null;

  return (
    <div className="item-abstract-container">
      <h2 className="abstract-title">Abstract</h2>
      <p className="abstract-text">{abstract}</p>
    </div>
  );
};

export default ItemAbstract;
