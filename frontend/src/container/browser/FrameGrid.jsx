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

const FrameTile = ({
  id,
  timestamp,
  thumbnail,
  selected,
  onClickFrame,
  selectedFrames,
  onSelectedFramesUpdate
}) => {
  const classes = useStyles();
  return (
    <GridListTile>
      <img style={{cursor: "pointer"}} onClick={() => onClickFrame(id)} src={thumbnail} alt={timestamp} className={classes.img} />
      <GridListTileBar
        titlePosition="top"
        actionPosition="left"
        title={id}
        actionIcon={
          <IconButton
              aria-label={`select`}
              className={classes.icon}
              onClick={() => {
                  var sf = _.clone(selectedFrames);
                  if (selected) {
                      _.unset(sf, id);
                  } else {
                      _.set(sf, id, true);
                  }
                  onSelectedFramesUpdate(sf);
              }}
          >
            {(
              selected ? (
                <CheckBoxIcon />
              ) : (
                <CheckBoxOutlineBlankIcon />
              )
            )}
          </IconButton>
        }
      />
    </GridListTile>
  );
};


const FrameGrid = ({ frames, showSelect, onClickFrame, selectedFrames, onSelectedFramesUpdate }) => {
  const classes = useStyles();
  return (
    <GridList cellHeight={180} className={classes.gridList} cols={5}>
      {frames.map((frame, idx) => (
        <FrameTile
          key={"frame-" + idx}
          onClickFrame={onClickFrame}
          selectedFrames={selectedFrames}
          onSelectedFramesUpdate={onSelectedFramesUpdate}
          selected={_.has(selectedFrames, frame.id)}
          {...frame}
          //   selected={showSelect ? frames.selectedIds.includes(frame.id) : false}
          //   showSelect={showSelect}
        />
      ))}
    </GridList>
  );
};

export default FrameGrid;
