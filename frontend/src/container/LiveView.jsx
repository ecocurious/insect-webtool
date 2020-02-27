import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

const useStyles = makeStyles(theme => ({
  root: {},
  img: ({ size }) => ({ maxWidth: "100%", maxHeight: "100%" }),
  placeholder: ({ size }) => ({
    backgroundColor: "grey",
    maxWidth: "100%",
    maxHeight: "100%"
  }),
  card: { position: "relative" }
}));

const LiveImage = ({ size, image }) => {
  const classes = useStyles({ size });

  let utf8decoder = new TextDecoder();
  var s = "";
  try {
    s = utf8decoder.decode(image);
  } catch (err) {
    console.log("cought live image decode exception");
  }
  // console.log('s', s);

  return (
    <Grid container justify="space-between" spacing={3} alignItems="flex-start">
      <Grid container item xs={6} spacing={3}>
        <Card className={classes.card}>
          <CardHeader title={"Rasberry 1"} />
          <CardContent>
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
          </CardContent>
        </Card>
      </Grid>
      {/* <Grid container item xs={6} spacing={3}> */}
      {/*   <Card className={classes.card}> */}
      {/*     <CardHeader title={"Rasberry 2"} /> */}
      {/*     <CardContent> */}
      {/*       <div className={classes.placeholder} style={size}></div> */}
      {/*     </CardContent> */}
      {/*   </Card> */}
      {/* </Grid> */}
    </Grid>
  );
};

const LiveImageContainer = connect(
  (state, ownProps) => ({
    image: state.liveImage,
    size: { height: 1.5 * 480, width: 1.5 * 720 }
  }),
  (dispatch, ownProps) => ({})
)(LiveImage);

export default LiveImageContainer;
