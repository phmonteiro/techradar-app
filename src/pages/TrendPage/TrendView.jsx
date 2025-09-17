import React from 'react';
import ItemView from '../../components/shared/ItemView/ItemView.jsx';

const TrendView = () => {
  return (
    <ItemView
      itemType="trend"
      apiEndpoint="/api/trends"
      stageUpdateEndpoint="/api/trends"
      progressStages={['Assess', 'Trial', 'Adopt', 'Hold']}
      progressType="trend"
    />
  );
};

export default TrendView;
