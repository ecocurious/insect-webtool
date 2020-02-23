import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

const useStyles = makeStyles(theme => ({
  root: {},
  img: ({ size }) => ({ ...size }),
  placeholder: ({ size }) => ({ backgroundColor: "grey", ...size })
}));


const LiveImage = ({ size, image }) => {
  const classes = useStyles({ size });

  let utf8decoder = new TextDecoder();
  const s = utf8decoder.decode(image);
  // console.log('s', s);

  return (
    <div className={classes.root}>
      {image ? (
        <img
          src={`data:image/jpeg;base64,${s}`}
          className={classes.img}
          key={"image"}
        />
      ) : (
        <div className={classes.placeholder} style={size}></div>
      )}
    </div>
  );
};

const LiveImageContainer = connect(
  (state, ownProps) => ({
    image: state.liveImage,
    size: { height: 480, width: 720 }
  }),
  (dispatch, ownProps) => ({})
)(LiveImage);

export default LiveImageContainer;
