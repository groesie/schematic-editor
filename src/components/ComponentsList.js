import React from 'react';
import { useSelector } from 'react-redux';
import Canvas from './Canvas';

function ComponentsList({ components }) {
    return (
        <div class="components-list">
        <ul>
            {/* {components.map((comp, index) => (
                <li key={index}>{comp.name}</li>
            ))} */}
        </ul>
        </div>
    );
}

export default ComponentsList;
