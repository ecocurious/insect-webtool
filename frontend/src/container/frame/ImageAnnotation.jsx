import React from "react";
import { Rnd } from "react-rnd";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  box: {
    backgroundColor: "rgba(0, 0, 0, 0.05)"
    // background: "#f0f0f0"
  },
  label: {
    top: -20,
    left: 0,
    width: 300,
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
  editable,
  colorBy
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

  console.log(appearance);
  const color =
    colorBy == "CREATOR"
      ? appearance.creator
        ? appearance.creator.color
        : "black"
      : appearance.appearanceLabels.length
      ? appearance.appearanceLabels[0].label.color
      : "black";

  const label =
    colorBy == "CREATOR"
      ? appearance.creator
        ? appearance.creator.name
        : ""
      : appearance.appearanceLabels.length
      ? appearance.appearanceLabels[0].label.scientificName
      : "";

  return editable ? (
    <Rnd
      style={
        active
          ? {
              border: `dashed 3px #${color}`
              //   borderColor: ``
            }
          : { border: `solid 3px #${color}` }
      }
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
      <div style={{ color: `#${color}` }} className={classes.label}>
        {label}
      </div>
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
