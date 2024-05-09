import React from 'react';

export default () => {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside>
            <div className="description">You can drag these nodes to the pane on the right.</div>
            <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'inputNode')} draggable>
                Input
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'additionInit')} draggable>
                Addition
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'multiplyInit')} draggable>
                Multiplication
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'subtractInit')} draggable>
                Subtraction
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'divideInit')} draggable>
                Division
            </div>
            <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'outputInit')} draggable>
                Output
            </div>
        </aside>
    );
};
