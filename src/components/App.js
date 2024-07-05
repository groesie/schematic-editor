import React from 'react';
import ComponentsList from './ComponentsList';
import Canvas from './Canvas';
import Recommendations from './Recommendations';
import '../App.css';

const App = () => {
  return (
    <div className="app-container">
      <h1>Schematic Editor</h1>
      <div className="main-layout">
        {/* <ComponentsList /> */}
        <Canvas />
        {/* <Recommendations /> */}
      </div>
    </div>
  );
};

export default App;
