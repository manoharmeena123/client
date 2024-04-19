import React, { useState } from 'react';

const Panel = ({ children }) => {
  return <div className="panel">{children}</div>;
};

const PanelResizeHandle = ({ direction, onResize }) => {
  const onMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e) => {
    onResize(e.movementX, e.movementY);
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      className={`panel-resize-handle ${direction}`}
      onMouseDown={onMouseDown}
    ></div>
  );
};

const PanelGroup = ({ direction, children }) => {
  const [sizes, setSizes] = useState(Array(children.length).fill(100));

  const onResize = (index, dx, dy) => {
    const newSizes = [...sizes];
    newSizes[index] += direction === 'horizontal' ? dx : dy;
    setSizes(newSizes);
  };

  return (
    <div className={`panel-group ${direction}`}>
      {React.Children.map(children, (child, index) => {
        return (
          <>
            {child}
            {index < children.length - 1 && (
              <PanelResizeHandle
                direction={direction === 'horizontal' ? 'horizontal' : 'vertical'}
                onResize={(dx, dy) => onResize(index, dx, dy)}
              />
            )}
          </>
        );
      })}
    </div>
  );
};

const ResizableLayout = () => {
  return (
    <PanelGroup direction="horizontal">
      <Panel>
        Left Panel
      </Panel>
      <PanelResizeHandle direction="horizontal" />
      <Panel>
        <PanelGroup direction="vertical">
          <Panel>Top Panel</Panel>
          <PanelResizeHandle direction="vertical" />
          <Panel>
            <PanelGroup direction="horizontal">
              <Panel>Left Panel</Panel>
              <PanelResizeHandle direction="horizontal" />
              <Panel>Right Panel</Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </Panel>
      <PanelResizeHandle direction="horizontal" />
      <Panel>Right Panel</Panel>
    </PanelGroup>
  );
};

export default ResizableLayout;
