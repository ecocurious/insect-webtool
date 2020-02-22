import React from "react";
import { Rnd } from "react-rnd";
import { makeStyles } from "@material-ui/core/styles";

import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles(theme => ({
  box: {
    border: "solid 1px black",
    backgroundColor: "rgba(0, 0, 0, 0.1)"
    // background: "#f0f0f0"
  },
  delete: {
    top: 0,
    right: 0,
    position: "absolute"
  }
}));

const annotationToAppearance = ({ x, y, width, height }, imageSize) => {
  return {
    bboxXmin: x / imageSize.width + 0.5,
    bboxXmax: (x + width) / imageSize.width + 0.5,
    bboxYmin: y / imageSize.height + 0.5,
    bboxYmax: (y + height) / imageSize.height + 0.5
  };
};

const appearanceToAnnotation = (
  { bboxXmin, bboxXmax, bboxYmin, bboxYmax },
  imageSize
) => ({
  x: (bboxXmin - 0.5) * imageSize.width,
  y: (bboxYmin - 0.5) * imageSize.height,
  width: (bboxXmax - bboxXmin) * imageSize.width,
  height: (bboxYmax - bboxYmin) * imageSize.height
});

const ImageAnnotation = ({
  appearance,
  imageSize,
  onBoxUpdate,
  onClick,
  active,
  onRemove,
  editable
}) => {
  if (!imageSize) {
    return null;
  }

  const classes = useStyles();

  const [tempPos, setTempPos] = React.useState({
    x: 0,
    y: 0
  });

  const { bboxXmin, bboxXmax, bboxYmin, bboxYmax } = appearance;

  React.useEffect(() => {
    setTempPos(appearanceToAnnotation(appearance, imageSize));
  }, [bboxXmin, bboxXmax, bboxYmin, bboxYmax, imageSize]);

  const updateBox = ({ x, y, height, width }) => {
    if (height & width) {
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
    }
    setTempPos({ x, y, height, width });
  };

  return editable ? (
    <Rnd
      style={active ? { background: "rgba(255, 0, 0, 0.2)" } : {}}
      className={classes.box}
      size={{ width: tempPos.width, height: tempPos.height }}
      position={{ x: tempPos.x, y: tempPos.y }}
      onClick={onClick}
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
      <CloseIcon onClick={onRemove} size="small" className={classes.delete} />
    </Rnd>
  ) : (
    <div
      style={{
        width: tempPos.width,
        height: tempPos.height,
        left: tempPos.x,
        top: tempPos.y,
        position: "absolute"
      }}
      className={classes.box}
    ></div>
  );
};

export default ImageAnnotation;
