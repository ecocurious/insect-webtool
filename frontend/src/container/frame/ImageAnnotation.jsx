import React from "react";
import { Rnd } from "react-rnd";

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#f0f0f0"
};

const annotationToAppearance = ({ x, y, width, height }, imageSize) => {
  return {
    bboxXmin: x / imageSize.width,
    bboxXmax: (x + width) / imageSize.width,
    bboxYmin: y / imageSize.height,
    bboxYmax: (y + height) / imageSize.height
  };
};

const appearanceToAnnotation = (
  { bboxXmin, bboxXmax, bboxYmin, bboxYmax },
  imageSize
) => ({
  x: bboxXmin * imageSize.width,
  y: bboxYmin * imageSize.height,
  width: (bboxXmax - bboxXmin) * imageSize.width,
  height: (bboxYmax - bboxYmin) * imageSize.height
});

const ImageAnnotation = ({ appearance, imageSize, onBoxUpdate }) => {
  if (!imageSize) {
    return null;
  }

  const [tempPos, setTempPos] = React.useState({
    width: 200,
    height: 200,
    x: 10,
    y: 10
  });

  const { bboxXmin, bboxXmax, bboxYmin, bboxYmax } = appearance;

  React.useEffect(() => {
    setTempPos(appearanceToAnnotation(appearance, imageSize));
  }, [bboxXmin, bboxXmax, bboxYmin, bboxYmax, imageSize]);

  const updateBox = ({ x, y, height, width }) => {
    onBoxUpdate(
      annotationToAppearance(
        {
          x,
          y,
          height: parseInt(height, 10),
          width: parseInt(width, 10)
        },
        imageSize
      )
    );
    setTempPos({ x, y, height, width });
  };

  return (
    <Rnd
      style={style}
      size={{ width: tempPos.width, height: tempPos.height }}
      position={{ x: tempPos.x, y: tempPos.y }}
      onDragStop={(e, d) => {
        updateBox({ ...tempPos, x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        updateBox({
          width: ref.style.width,
          height: ref.style.height,
          ...position
        });
      }}
    >
      Rnd
    </Rnd>
  );
};

export default ImageAnnotation;
