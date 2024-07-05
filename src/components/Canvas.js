import React, { useState } from 'react';
import { setRecommendations } from '../features/components/componentsSlice';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';



const gridSize = 20;

const calculateFontSize = (text, width) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    let fontSize = 16;
    context.font = `${fontSize}px Arial`;
  
    while (context.measureText(text).width > width) {
      fontSize -= 0.5; 
      context.font = `${fontSize}px Arial`;
      if (fontSize <= 5) { 
        break;
      }
    }
  
    return fontSize;
  };

  

const Canvas = () => {
    const [components, setComponents] = useState([]);
    let [nextCompId, setNextCompId] = useState(1);
    let [nextPinId, setNextPinId] = useState(1);

    const addComponentInstance = (templateId, x, y) => {
        const template = componentTemplates[templateId];
        if (!template) return; 
        console.log(nextCompId);
        console.log(nextPinId);
        const newPins = template.pins.map(pin => ({
          id: nextPinId++,
          relX: pin.relX,
          relY: pin.relY,
          orientation: pin.orientation,
          name: pin.name
        }));
        
        const newInstance = {
          id: nextCompId,
          name: template.name,
          x: x,
          y: y,
          width: 100,
          height: 50,
          pins: newPins
        };
      
        setComponents([...components, newInstance]);
        setNextCompId(nextCompId + 1);
        setNextPinId(nextPinId + 1);
      };
    
    const [componentTemplates, setComponentTemplates] = useState([
        { 
            id: 1, 
            name: "Resistor", 
            x: 50, 
            y: 50, 
            width: 100,
            height: 50, 
            pins: [
                { relX: 50, relY: 0, orientation: 'top', name: 'Pin A' },
                { relX: 100, relY: 50, orientation: 'right', name: 'Pin B' },
                { relX: 50, relY: 100, orientation: 'bottom', name: 'Pin B' },
            ]
        },
        { 
            id: 2, 
            name: "Capacitor", 
            x: 150, 
            y: 100, 
            width: 100, 
            height: 50, 
            pins: [
                { relX: 0, relY: 50, position: 50, orientation: 'left', name: 'Pin C' },
                { relX: 100, relY: 50, position: 50, orientation: 'right', name: 'Pin D' }
            ]
        }
    ])
    
    const [recommendations, setRecommendations] = useState([
        { 
            id: 1, 
            name: "Resistor", 
            x: 50, 
            y: 50, 
            width: 100, 
            height: 50, 
            pins: [
                { globalId: '1-a', position: 50, orientation: 'bottom', name: 'Pin A' },
                { globalId: '1-b', position: 50, orientation: 'left', name: 'Pin B' }
            ]
        },
        { 
            id: 2, 
            name: "Capacitor", 
            x: 150, 
            y: 100, 
            width: 100, 
            height: 50, 
            pins: [
                { globalId: 'a', position: 50, orientation: 'bottom', name: 'Pin C' },
                { globalId: 'b', position: 50, orientation: 'left', name: 'Pin D' }
            ]
        }
    ]);
    const [showMenu, setShowMenu] = useState(false);
    const [showRec, setShowRec] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [menuContent, setMenuContent] = useState([]);
    const [selectedPin, setSelectedPin] = useState(null);
    const [connections, setConnections] = useState([]);
    const [draggingState, setDraggingState] = useState({ comp: null, offsetX: 0, offsetY: 0 });
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        pins: '',
        x: 0,
        y: 0
    });

    const formWidth = 300;
    const formHeight = 200;

    function renderForm() {
        return (
            <form onSubmit={handleFormSubmit} style={{ position: 'absolute', top: formData.y, left: formData.x, background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <label>
                    Component Name:
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{ display: 'block', margin: '10px 0', width: '100%' }}
                        required
                    />
                </label>
                <label>
                    Pins (separated by $):
                    <input
                        type="text"
                        value={formData.pins}
                        onChange={(e) => setFormData({ ...formData, pins: e.target.value })}
                        style={{ display: 'block', margin: '10px 0', width: '100%' }}
                        required
                    />
                </label>
                <div style={{ textAlign: 'right' }}>
                    <Button variant="contained" color="secondary" onClick={() => setShowForm(false)} style={{ marginRight: '10px' }}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" type="submit">
                        Submit
                    </Button>
                </div>
            </form>
        );
    }
    
    

    const calculatePinPositions = (pins, componentWidth, componentHeight) => {
        const sideOrder = ['left', 'right', 'bottom', 'top'];
        const pinsPerSide = Math.ceil(pins.length / sideOrder.length);
    
        return pins.map((pin, index) => {
            const sideIndex = Math.floor(index / pinsPerSide);
            const positionIndex = index % pinsPerSide;
            const side = sideOrder[sideIndex % sideOrder.length];
    
            let relX, relY, position;
            switch(side) {
                case 'left':
                    relX = 0;
                    relY = 50;
                    position = 50;
                    break;
                case 'right':
                    relX = 100;
                    relY = 50;
                    position = 50;
                    break;
                case 'bottom':
                    relX = 50;
                    relY = 100;
                    position = 50;
                    break;
                case 'top':
                    relX = 50;
                    relY = 0;
                    position = 50;
                    break;
                default:
                    relX = 0;
                    relY = 0;
                    break;
            }
    
            return {
                ...pin,
                relX,
                relY,
                position,
                orientation: side,
            };
        });
    };
    

    function handleFormSubmit(e) {
        e.preventDefault();

        if (!formData.name.trim() || !formData.pins.trim()) {
            alert('Please fill in all fields.');
            return;
        }

        const standardWidth = 100;
        const standardHeight = 50;
    
        const pins = formData.pins.split('$').map((pinName, index) => ({
            name: pinName.trim(),
            // id: `${formData.name.toLowerCase()}-pin-${index}`
        }));
    
        const positionedPins = calculatePinPositions(pins, standardWidth, standardHeight);
        console.log(positionedPins);
        const newComponent = {
            name: formData.name,
            x: formData.x,
            y: formData.y,
            width: standardWidth,
            height: standardHeight,
            pins: positionedPins
        };
    
        setComponentTemplates(prevComponents => [...prevComponents, newComponent]);
        addComponentInstance(componentTemplates.length, formData.x, formData.y)
        setShowForm(false);
        setFormData({ name: '', pins: '', x: 0, y: 0 });
    }
    
    


    const handleDragStart = (e, comp) => {
        // const offsetX = e.clientX - e.target.getBoundingClientRect().left;
        // const offsetY = e.clientY - e.target.getBoundingClientRect().top;
        const rect = e.target.getBoundingClientRect();
        // const offsetX = e.clientX - rect.left;
        // const offsetY = e.clientY - rect.top;
        console.log(rect);
        const offsetX = e.clientX - rect.left + 18;
        const offsetY = e.clientY - rect.top + 98;

        setDraggingState({
            comp,
            offsetX,
            offsetY
        });
        console.log(`DragStart - ID: ${comp.id}, OffsetX: ${offsetX}, OffsetY: ${offsetY}`);
        console.log(`Drop - ID: ${comp.id}, OffsetX: ${offsetX}, OffsetY: ${offsetY}`);
        e.dataTransfer.setData("compId", comp.id.toString());
        e.dataTransfer.setData("offsetX", offsetX.toString());
        e.dataTransfer.setData("offsetY", offsetY.toString());
    };

    const handleDrag = (e) => {
        if (!draggingState.comp || !e.clientX || !e.clientY) return;
    
        const newX = e.clientX - draggingState.offsetX;
        const newY = e.clientY - draggingState.offsetY;
    
        setComponents(prevComps => 
            prevComps.map(c => 
                c.id === draggingState.comp.id ? { ...c, x: newX, y: newY } : c
            )
        );
    };
    
    
    const handleDragEnd = () => {
        setDraggingState({ comp: null, offsetX: 0, offsetY: 0 });
    };
    

    const handleDrop = (e) => {
        e.preventDefault();
        const compId = parseInt(e.dataTransfer.getData("compId") || "0");
        const offsetX = parseInt(e.dataTransfer.getData("offsetX") || "0");
        const offsetY = parseInt(e.dataTransfer.getData("offsetY") || "0");
        console.log(compId)
        const rect = e.currentTarget.getBoundingClientRect();
        let x = e.clientX - rect.left - 50;
        let y = e.clientY - rect.top + offsetY - 140;

        x = Math.round(x / gridSize) * gridSize;
        y = Math.round(y / gridSize) * gridSize;

        setComponents(prevComponents =>
            prevComponents.map(comp => {
                if (comp.id === compId) {
                    return { ...comp, x, y };
                }
                return comp;
            })
        );
    };

    const handlePinClick = (e, pinGlobalId) => {
        e.stopPropagation();
        console.log("Pin clicked")
        if (selectedPin) {
            if (selectedPin !== pinGlobalId) {
                setConnections([...connections, { from: selectedPin, to: pinGlobalId }]);
                setSelectedPin(null);
            } else {
                setSelectedPin(null);
            }
        } else {
            setSelectedPin(pinGlobalId);
        }
    };

    const findPinPosition = (pinGlobalId) => {
        for (let comp of components) {
            const pin = comp.pins.find(pin => pin.id === pinGlobalId);
            console.log("test,", comp.pins.map(pin => pin.id));
            if (pin) {
                const baseX = comp.x + (pin.relX / 100) * comp.width;
                const baseY = comp.y + (pin.relY / 100) * comp.height;
    
                let endX = baseX;
                let endY = baseY;
    
                switch (pin.orientation) {
                    case 'bottom':
                        endY += 20;
                        break;
                    case 'top':
                        endY -= 18;
                        break;
                    case 'left':
                        endX -= 18;
                        endY += 1;
                        break;
                    case 'right':
                        endX += 20;
                        endY += 1;
                        break;
                }
    
                return { x: endX, y: endY };
            }
        }
        return null;
    };
    

  const handleComponentClick = (e, compId) => {
    e.stopPropagation();
    setShowMenu(false);
    setShowRec(false);
    const component = components.find(comp => comp.id === compId);
    console.log('Component clicked:', component.name);
    };


  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleCanvasClick = (e) => {
    console.log(e);
    
    if (showForm) return;
    
    if (e.altKey) {
        setShowMenu(false);
        setShowRec(false);
        let posX = e.clientX - formWidth / 2 + 20;
        let posY = e.clientY - formHeight / 2 - 100;

        if (posX + formWidth > window.innerWidth) {
            posX = window.innerWidth - formWidth;
        }
        if (posX < 0) {
            posX = 0;
        }

        if (posY + formHeight > window.innerHeight) {
            posY = window.innerHeight - formHeight;
        }
        if (posY < 0) {
            posY = 0;
        }

        setShowForm(true);
        setFormData({
            ...formData,
            x: posX,
            y: posY
        });
        return
    }
    
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const clickedComponent = components.find(comp =>
      x >= comp.x && x <= comp.x + 100 && y >= comp.y && y <= comp.y + 50
    );

    if (!clickedComponent) {
        setShowMenu(true);
        setMenuContent(componentTemplates.map(comp => comp.name));
    
        const menuWidth = 150;
        const menuHeight = 200;
        const canvasRect = e.currentTarget.getBoundingClientRect();
    
        let posX = e.clientX;
        let posY = e.clientY;
    
        if (posX + menuWidth > window.innerWidth) {
            posX = window.innerWidth - menuWidth;
        }
        if (posY + menuHeight > window.innerHeight) {
            posY = window.innerHeight - menuHeight;
        }
    
        setMenuPosition({ x: posX - canvasRect.left, y: posY - canvasRect.top });
    } else {
        setShowMenu(false);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const clickedComponent = components.find(comp =>
      x >= comp.x && x <= comp.x + 100 && y >= comp.y && y <= comp.y + 50
    );

    if (!clickedComponent) {
        setShowRec(true);
        setMenuContent(recommendations.map(comp => comp.name));
        const menuWidth = 150;
        const menuHeight = 200; 
        const canvasRect = e.currentTarget.getBoundingClientRect();

        let posX = e.clientX;
        let posY = e.clientY;

        if (posX + menuWidth > window.innerWidth) {
            posX = window.innerWidth - menuWidth;
        }
        if (posY + menuHeight > window.innerHeight) {
            posY = window.innerHeight - menuHeight;
        }

        setMenuPosition({ x: posX - canvasRect.left, y: posY - canvasRect.top });
    }
    else {
        setShowRec(false);
        setShowMenu(false);
    }
  };

    const handleMenuItemClick = (e, componentIndex) => {
        e.stopPropagation();
        const newX = Math.round(menuPosition.x / gridSize) * gridSize;
        const newY = Math.round(menuPosition.y / gridSize) * gridSize;

        // const newComponent = {
        //     id: componentTemplates.length + 1,
        //     name: componentTemplates[componentIndex].name,
        //     x: newX,
        //     y: newY,
        //     pins: componentTemplates[componentIndex].pins.slice(0)
        // };
        addComponentInstance(componentIndex, newX, newY)
        // setComponents([...components, newComponent]);
        setShowMenu(false);
        setShowRec(false);
    };

    const handleRecItemClick = (e, componentIndex) => {
        e.stopPropagation();
        const newX = Math.round(menuPosition.x / gridSize) * gridSize;
        const newY = Math.round(menuPosition.y / gridSize) * gridSize;
        addComponentInstance(componentIndex, newX, newY)
        // const newComponent = {
        //     id: recommendations.length + 1,
        //     name: recommendations[componentIndex].name,
        //     x: newX,
        //     y: newY,
        //     pins: recommendations[componentIndex].pins.slice(0)
        // };

        // setComponents([...components, newComponent]);
        setShowRec(false);
        setShowMenu(false);
    };


  return (
    <div className="canvas" onClick={handleCanvasClick} onContextMenu={handleContextMenu} onDragOver={handleDragOver} onDrop={handleDrop} style={{ width: '100%', height: '100vh', position: 'relative', backgroundColor: '#f0f0f0' }}>
      {
        components.map((comp) => (
            <div key={comp.id} draggable onDragStart={(e) => handleDragStart(e, comp)} 
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            style={{
                position: 'absolute',
                left: `${comp.x}px`,
                top: `${comp.y}px`,
                width: '100px',
                height: '50px',
                border: '1px solid black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'grab'
            }}
            onClick={(e) => handleComponentClick(e, comp.id)}
            >
            <div style={{ fontSize: `${calculateFontSize(comp.name, 90)}px`, padding: '0 5px' }}>{comp.name}</div>
            {comp.pins.map((pin) => {
    let pinStyle = {};
    let labelStyle = {
        position: 'absolute',
        whiteSpace: 'nowrap',
        userSelect: 'none', 
        color: 'grey'
    };

    switch (pin.orientation) {
        case 'bottom':
            pinStyle = {
                position: 'absolute',
                left: `${(pin.position / 100) * comp.width}px`,
                top: '50px',
                width: '2px',
                height: '20px',
                backgroundColor: 'red'
            };
            labelStyle.left = `${(pin.position / 100) * comp.width + 5}px`;
            labelStyle.top = '20px'; 
            break;
        case 'left':
            pinStyle = {
                position: 'absolute',
                top: `${(pin.position / 100) * comp.height}px`,
                width: '20px',
                height: '2px',
                left: '-20px',
                backgroundColor: 'red'
            };
            labelStyle.left = '-20px';
            labelStyle.top = `${(pin.position / 100) * comp.height - 10}px`;
            break;
        case 'top':
            pinStyle = {
                position: 'absolute',
                left: `${(pin.position / 100) * comp.width}px`,
                top: '-20px',
                width: '2px',
                height: '20px',
                backgroundColor: 'red'
            };
            labelStyle.left = `${(pin.position / 100) * comp.width + 5}px`;
            labelStyle.top = '-20px';
            break;
        case 'right':
            pinStyle = {
                position: 'absolute',
                top: `${(pin.position / 100) * comp.height}px`,
                width: '20px',
                height: '2px',
                left: `100px`,
                backgroundColor: 'red'
            };
            labelStyle.left = `5px`;
            labelStyle.top = `${(pin.position / 100) * comp.height - 10}px`;
            break;
    }

    return (
        <React.Fragment key={pin.globalId}>
            <div style={pinStyle} onClick={(e) => handlePinClick(e, pin.id)}>
                <div style={labelStyle}>{pin.name}</div>
            </div>
        </React.Fragment>
    );
})}

        
            </div>
        ))
        }


    {showMenu && (
        <ul className="menu" style={{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }}>
            {menuContent.map((item, index) => (
                <li key={index} onClick={(e) => handleMenuItemClick(e, index)}>{item}</li>
            ))}
        </ul>
    )}
    {showRec && (
        <ul className="menu" style={{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }}>
            {menuContent.map((item, index) => (
                <li key={index} onClick={(e) => handleRecItemClick(e, index)}>{item}</li>
            ))}
        </ul>
    )}
  <div>
    {connections.map((conn, index) => {
        const startPos = findPinPosition(conn.from);
        const endPos = findPinPosition(conn.to);

        const midX = (startPos.x + endPos.x) / 2;
        const controlPoint1 = { x: midX, y: startPos.y };
        const controlPoint2 = { x: midX, y: endPos.y };

        const dPath = `M ${startPos.x},${startPos.y} C ${controlPoint1.x},${controlPoint1.y} ${controlPoint2.x},${controlPoint2.y} ${endPos.x},${endPos.y}`;

        return (
            <svg key={index} style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <path d={dPath} stroke="red" strokeWidth="2" fill="none" />
            </svg>
        );
    })}
    </div>
    <div onClick={handleCanvasClick} style={{ width: '100%', height: '100%', border: '0px solid black' }}>
        {showForm && renderForm()}
    </div>
    </div>
    
  );
};

export default Canvas;