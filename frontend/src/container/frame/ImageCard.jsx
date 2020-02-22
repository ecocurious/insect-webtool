import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import IconButton from "@material-ui/core/IconButton";

import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

import ImageAnnotation from "./ImageAnnotation";

const useStyles = makeStyles({
  card: {}
});

const ImageCard = ({
  activelabels,
  activeAnnotation,
  onAddAppearance,
  appearances,
  collection,
  frame,
  onChangeFrame
}) => {
  const classes = useStyles();
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
        // subheader="September 14, 2016"
      />
      <CardContent>
        <ImageAnnotation
          {...{
            activelabels,
            activeAnnotation,
            onAddAppearance,
            appearances,
            frame
          }}
        />
      </CardContent>
    </Card>
  );
};

export default ImageCard;
