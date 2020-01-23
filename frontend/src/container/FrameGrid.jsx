// ViewerTodoList.js
import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

const useStyles = makeStyles({
  gridList: {
    width: "100%"
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)"
  },
  img: {
    width: "auto",
    height: "200px"
  }
});

const FrameTile = ({ url, timestamp, thumbnail, selected, showSelect }) => {
  const classes = useStyles();
  return (
    <GridListTile>
      <img src={thumbnail} alt={timestamp} className={classes.img} />
      <GridListTileBar
        titlePosition="top"
        actionPosition="left"
        title={timestamp}
        actionIcon={
          <IconButton aria-label={`select`} className={classes.icon}>
            {showSelect ? (
              selected ? (
                <CheckBoxIcon />
              ) : (
                <CheckBoxOutlineBlankIcon />
              )
            ) : null}
          </IconButton>
        }
      />
    </GridListTile>
  );
};

const FrameGrid = ({ frames, showSelect }) => {
  const classes = useStyles();
  return (
    <GridList cellHeight={180} className={classes.gridList} cols={5}>
      {frames.map((frame, idx) => (
        <FrameTile key={"frame-" + idx} {...frame} showSelect={showSelect} />
      ))}
    </GridList>
  );
};

export default FrameGrid;
