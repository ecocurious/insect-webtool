import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

import * as a from "../../actions";

import Grid from "@material-ui/core/Grid";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import ImageCard from "./ImageCard";
import LabelSelector from "./LabelSelector";
import Appearance from "./Appearance";

import _ from "lodash";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles({
  img: { height: "100%" },
  labelsControl: {},
  labelListTable: {}
});

const Frame = ({
  labels,
  frame,
  activeAppearance,
  appearances,
  collection,
  onChangeFrame,
  onAddAppearance,
  onDeleteAppearance,
  onUpdateBox,
  onDeleteAppearanceLabel,
  onAddAppearanceLabel,
  setActiveAppearance
}) => {
  if (!frame) {
    return null;
  }

  const classes = useStyles();
  const [activeLabel, setActiveLabel] = React.useState(labels.allIds[0]);
  //   const [activeAppearance, setActiveAppearance] = React.useState();

  return (
    <Grid container justify="space-between" spacing={1} alignItems="flex-start">
      <Grid container item xs={9} spacing={2}>
        <Grid container item xs={12} spacing={0}>
          <ImageCard
            collection={collection}
            setActiveAppearance={setActiveAppearance}
            activeAppearance={activeAppearance}
            onAddAppearance={appearance =>
              onAddAppearance(frame.id, appearance, [activeLabel])
            }
            appearances={appearances}
            frame={frame}
            onChangeFrame={shift =>
              onChangeFrame(collection.id, frame.id, shift)
            }
            onDeleteAppearance={onDeleteAppearance}
            onUpdateBox={onUpdateBox}
          />
        </Grid>
      </Grid>
      <Grid container item xs={3} spacing={2}>
        <Grid container item xs={12} spacing={0}>
          <LabelSelector
            setActiveLabel={setActiveLabel}
            labels={labels}
            activeLabel={activeLabel}
            onAddAppearanceLabel={() =>
              onAddAppearanceLabel(activeAppearance, activeLabel)
            }
          />
        </Grid>
        <Grid container item xs={12} spacing={0}>
          {(activeAppearance !== undefined) &
          (activeAppearance in appearances.byKey) ? (
            <>
              <Typography>Labels</Typography>
              <Appearance
                appearance={appearances.byKey[activeAppearance]}
                labels={labels}
                onDeleteAppearanceLabel={onDeleteAppearanceLabel}
              />
            </>
          ) : null}
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
    appearances: state.appearances,
    activeAppearance: state.ui.activeAppearance
  }),
  (dispatch, ownProps) => ({
    onChangeFrame: (collectionId, frameId, shift) =>
      dispatch(a.changeFrame(collectionId, frameId, shift)),
    onAddAppearance: (frameId, appearance, labelIds) =>
      dispatch(a.addAppearance({ frameId, appearance, labelIds })),
    onDeleteAppearance: id => dispatch(a.deleteAppearance(id)),
    onUpdateBox: (id, box) => dispatch(a.updateBox(id, box)),
    onAddAppearanceLabel: (appearanceId, labelId) =>
      dispatch(a.addAppearanceLabel({ appearanceId, labelId })),
    onDeleteAppearanceLabel: appearanceLabelId =>
      dispatch(a.deleteAppearanceLabel(appearanceLabelId)),
    setActiveAppearance: appearanceId =>
      dispatch(a.setActiveAppearance(appearanceId))
  })
)(Frame);
