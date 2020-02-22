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
    position: "absolute",
    zIndex: 3,
    gridColumn: "1 / 1",
    gridRow: "1 / 1"
  },
  selectorContainer: {
    position: "absolute",
    zIndex: 2,
    gridColumn: "1 / 1",
    gridRow: "1 / 1"
  },
  selector: {
    position: "absolute",
    zIndex: 4,
    border: "dashed 2px black",
    boxSizing: "border-box",
    transition: "box-shadow 0.21s ease-in-out",
    background: "red"
  }
});

const ImageCard = ({
  activelabels,
  activeAppearance,
  setActiveAppearance,
  onAddAppearance,
  appearances,
  collection,
  frame,
  onChangeFrame,
  onUpdateBox
}) => {
  const classes = useStyles();
  const [imageSize, setImageSize] = React.useState(null);

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
              classes={classes}
              imageSize={imageSize}
              onSelect={onAddAppearance}
            />
          ) : null}
          <Image url={frame.url} classes={classes} setSize={setImageSize} />
          <div className={classes.annotations}>
            {appearances.allIds.map((id, idx) => (
              <ImageAnnotation
                key={"annotation-" + idx}
                appearance={appearances.byKey[id]}
                imageSize={imageSize}
                active={id == activeAppearance}
                onBoxUpdate={box => onUpdateBox(id, box)}
                onClick={() => setActiveAppearance(id)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageCard;
