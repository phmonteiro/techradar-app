import React from 'react';
import ItemView from '../../components/shared/ItemView/ItemView.jsx';

const TechnologyView = () => {
  return (
    <ItemView
      itemType="technology"
      apiEndpoint="/api/technologies"
      stageUpdateEndpoint="/api/technologies"
      progressStages={['In Place', 'Proofing', 'Planned', 'Possible']}
      progressType="technology"
    />
  );
};

export default TechnologyView;
