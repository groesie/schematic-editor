import React from 'react';
import { useSelector } from 'react-redux';

const Recommendations = () => {
  const recommendations = useSelector(state => state.editor.recommendations);

  return (
    <div className="recommendations">
      <h2>Recommendations</h2>
      <ul>
        {recommendations.map((rec, index) => (
          <li key={index}>{rec}</li>
        ))}
      </ul>
    </div>
  );
};

export default Recommendations;
