import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import IconButton from "@material-ui/core/IconButton";

import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

import Image from "./Image";
import ImageAnnotation from "./ImageAnnotation";
import Selector from "./Selector";

const useStyles = makeStyles({
  card: { position: "relative" },
  outer: {
    display: "grid",
    gridTemplate: "1fr / 1fr",
    placeItems: "center"
  },
  img: {
    height: 500,
    width: "auto",
    // position: "relative",
    gridColumn: "1 / 1",
    gridRow: "1 / 1",
    zIndex: 1
  },
  annotations: {
    // display: "flex",
    position: "relative",
    gridColumn: "1 / 1",
    gridRow: "1 / 1"
  },
  selectorContainer: {
    zIndex: 2,
    position: "absolute",
    gridColumn: "1 / 1",
    gridRow: "1 / 1"
  },
  selector: {
    position: "relative",
    border: "dashed 1px black",
    boxSizing: "border-box",
    transition: "box-shadow 0.21s ease-in-out"
    // background: "red"
  }
});

const ImageCard = ({
  activeAppearance,
  setActiveAppearance,
  onAddAppearance,
  appearances,
  collection,
  frame,
  onChangeFrame,
  onUpdateBox,
  onDeleteAppearance,
  colorBy
}) => {
  const classes = useStyles();
  const [imageSize, setImageSize] = React.useState(null);
  const [addMode, setAddMode] = React.useState(false);

  return (
    <Card className={classes.card}>
      <CardHeader
        title={frame.timestamp + (collection ? " - " + collection.name : "")}
        action={
          collection ? (
            <>
              <IconButton aria-label="before" onClick={() => onChangeFrame(-1)}>
                <NavigateBeforeIcon />
              </IconButton>
              <IconButton aria-label="next" onClick={() => onChangeFrame(1)}>
                <NavigateNextIcon />
              </IconButton>
            </>
          ) : null
        }
      />
      <CardContent>
        <div className={classes.outer}>
          {imageSize ? (
            <Selector
              style={{ zIndex: addMode ? 5 : 3 }}
              classes={classes}
              imageSize={imageSize}
              onSelect={onAddAppearance}
              drag={addMode}
              setDrag={setAddMode}
            />
          ) : null}
          <Image url={frame.url} classes={classes} setSize={setImageSize} />
          <div
            className={classes.annotations}
            style={{ zIndex: addMode ? 2 : 2 }}
          >
            {appearances.allIds.map((id, idx) => (
              <ImageAnnotation
                key={"annotation-" + idx}
                colorBy={colorBy}
                appearance={appearances.byKey[id]}
                imageSize={imageSize}
                editable={!addMode}
                active={id == activeAppearance}
                onBoxUpdate={box => onUpdateBox(id, box)}
                onClick={() => setActiveAppearance(id)}
                onRemove={() => onDeleteAppearance(id)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageCard;
