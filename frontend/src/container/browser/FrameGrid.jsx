// ViewerTodoList.js
import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';


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
  setLeftRight,
  onSelectedFramesUpdate
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (

    <GridListTile>
      <img style={{cursor: "pointer"}}
        onClick={() => onClickFrame(id)} src={thumbnail} alt={timestamp} className={classes.img} />

       <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
           <MenuItem onClick={() => {setLeftRight({timestamp: new Date(timestamp), side: "left"}); handleClose()}}>Set Leftmost</MenuItem>
           <MenuItem onClick={() => {setLeftRight({timestamp: new Date(timestamp), side: "right"}); handleClose()}}>Set Rightmost</MenuItem>
       </Menu>

      <GridListTileBar
        titlePosition="top"
        actionPosition="right"
          title={(<span style={{cursor: "pointer"}} onClick={handleClick}>{id}</span>)}
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


const FrameGrid = ({ frames, showSelect, onClickFrame, selectedFrames, onSelectedFramesUpdate, setLeftRight }) => {
  const classes = useStyles();
  return (
    <GridList cellHeight={180} className={classes.gridList} cols={5}>
      {frames.map((frame, idx) => (
        <FrameTile
          key={"frame-" + idx}
          onClickFrame={onClickFrame}
          selectedFrames={selectedFrames}
          onSelectedFramesUpdate={onSelectedFramesUpdate}
          setLeftRight={setLeftRight}
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
