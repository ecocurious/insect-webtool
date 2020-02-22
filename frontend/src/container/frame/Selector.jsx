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

const Selector = ({ classes, imageSize, onSelect }) => {
  const [selection, setSelection] = React.useState({});

  const [drag, setDrag] = React.useState(false);

  const mouseDown = e => {
    setDrag(true);
    setSelection({
      ...selection,
      startX: e.pageX - imageSize.left,
      startY: e.pageY - imageSize.top
    });
  };
  const mouseUp = () => {
    setDrag(false);
    setSelection({});
    onSelect(annotationToAppearance(toBox(selection), imageSize));
  };

  const mouseMove = e => {
    if (drag) {
      setSelection({
        ...selection,
        endX: e.pageX - imageSize.left,
        endY: e.pageY - imageSize.top
      });
    }
  };

  return (
    <div
      style={{ width: imageSize.width, height: imageSize.height }}
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
