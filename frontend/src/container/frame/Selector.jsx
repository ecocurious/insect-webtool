import React from "react";

const Reactangle = ({ classes, x, y, height, width }) => (
  <div
    style={{ left: x, top: y, height, width }}
    className={classes.selector}
  />
);

const toBox = ({ startX, endX, startY, endY }) => ({
  x: Math.min(startX, endX),
  y: Math.min(startY, endY),
  width: Math.abs(startX - endX),
  height: Math.abs(startY - endY)
});

const annotationToAppearance = ({ x, y, width, height }, imageSize) => {
  return {
    bboxXmin: x / imageSize.width,
    bboxXmax: (x + width) / imageSize.width,
    bboxYmin: y / imageSize.height,
    bboxYmax: (y + height) / imageSize.height
  };
};

const Selector = ({ classes, imageSize, onSelect, drag, setDrag }) => {
  const [selection, setSelection] = React.useState({});

  const container = React.createRef();

  const mouseDown = e => {
    setDrag(true);
    const rect = container.current.getBoundingClientRect();
    setSelection({
      ...selection,
      startX: e.pageX - rect.left,
      startY: e.pageY - rect.top
    });
  };
  const mouseUp = () => {
    setDrag(false);
    setSelection({});
    const box = toBox(selection);
    if (box.height > 0.01) {
      onSelect(annotationToAppearance(box, imageSize));
    }
  };

  const mouseMove = e => {
    if (drag) {
      const rect = container.current.getBoundingClientRect();
      setSelection({
        ...selection,
        endX: e.pageX - rect.left,
        endY: e.pageY - rect.top
      });
    }
  };

  return (
    <div
      style={{
        width: imageSize.width,
        height: imageSize.height,
        zIndex: drag ? 3 : 2
      }}
      ref={container}
      className={classes.selectorContainer}
      onMouseDown={mouseDown}
      onMouseMove={mouseMove}
      onMouseUp={mouseUp}
    >
      {selection.endX ? (
        <Reactangle classes={classes} {...toBox(selection)} />
      ) : null}
    </div>
  );
};

export default Selector;
