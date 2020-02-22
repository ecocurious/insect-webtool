import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

import * as a from "../../actions";

import Grid from "@material-ui/core/Grid";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import ImageCard from "./ImageCard";
import LabelList from "./LabelList";
import AppearanceList from "./AppearanceList";

import _ from "lodash";

const useStyles = makeStyles({
  img: { height: "100%" },
  labelsControl: {},
  labelListTable: {}
});

const Frame = ({
  labels,
  frame,
  appearances,
  collection,
  onChangeFrame,
  onAddAppearance,
  onDeleteAppearance
}) => {
  console.log(labels);
  if (!frame) {
    return null;
  }

  console.log(collection);

  const classes = useStyles();
  const [activelabels, setActivelabels] = React.useState([labels.allIds[0]]);
  const [activeAppearance, setActiveAppearance] = React.useState();
  const [editMode, setEditMode] = React.useState(false);

  //   const onChangeActive = id => {
  //     setActiveAnnotation(id);
  //   };

  const handleToggleLabels = value => () => {
    const currentIndex = activelabels.indexOf(value);
    const newActivelabels = [...activelabels];

    if (currentIndex === -1) {
      newActivelabels.push(value);
    } else {
      newActivelabels.splice(currentIndex, 1);
    }

    setActivelabels(newActivelabels);
  };

  //   const onlabelsChange = (e, id) => {
  //     setActivelabels(id);
  //   };

  return (
    <Grid container justify="space-between" spacing={1} alignItems="flex-start">
      <Grid container item xs={9} spacing={2}>
        <Grid container item xs={12} spacing={0}>
          <ImageCard
            {...{
              collection,
              activelabels,
              activeAnnotation: activeAppearance,
              onAddAppearance: appearance =>
                onAddAppearance(frame.id, appearance, activelabels),
              appearances,
              frame,
              onChangeFrame: shift =>
                onChangeFrame(collection.id, frame.id, shift)
            }}
          />
        </Grid>
      </Grid>
      <Grid container item xs={3} spacing={2}>
        <Grid container item xs={12} spacing={0}>
          <LabelList
            handleToggle={handleToggleLabels}
            labels={labels}
            activelabels={activelabels}
          />
        </Grid>
        {/* <Grid container item xs={12} spacing={1}>
          <FormControlLabel
            control={
              <Switch
                checked={editMode}
                onChange={() => setEditMode(!editMode)}
              />
            }
            label="Edit Mode"
          />
        </Grid> */}
        <Grid container item xs={12} spacing={0}>
          <AppearanceList
            appearances={appearances}
            labels={labels}
            activeAppearance={activeAppearance}
            onChangeActive={id => setActiveAppearance(id)}
            onDeleteAppearance={onDeleteAppearance}
            // activeId={activeAnnotation}
            // onDelete={onDeleteAppearance}
            // onActive={onActive}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default connect(
  (state, ownProps) => ({
    collection: state.collections.byKey[state.ui.activeCollection],
    frame: state.frame,
    labels: state.labels,
    appearances: state.appearances
  }),
  (dispatch, ownProps) => ({
    onChangeFrame: (collectionId, frameId, shift) =>
      dispatch(a.changeFrame(collectionId, frameId, shift)),
    onAddAppearance: (frameId, appearance, labelIds) =>
      dispatch(a.addAppearance({ frameId, appearance, labelIds })),
    onDeleteAppearance: id => dispatch(a.deleteAppearance(id))
  })
)(Frame);
