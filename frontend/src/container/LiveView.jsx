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
  var s = "";
  try {
  s = utf8decoder.decode(image);
  } catch(err) {
      console.log("cought live image decode exception");
  }
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
    size: { height: 1.5*480, width: 1.5*720 }
  }),
  (dispatch, ownProps) => ({})
)(LiveImage);

export default LiveImageContainer;
