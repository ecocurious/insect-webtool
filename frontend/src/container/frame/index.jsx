import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

import * as a from "../../actions";

import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";

import FrameCard from "./FrameCard";
import LabelSelector from "./LabelSelector";
import AppearanceList from "./AppearanceList";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";

import _ from "lodash";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles(
  createStyles(theme => ({
    img: { height: "100%" },
    labelsControl: {},
    labelListTable: {},
    rightContainer: {
      backgroundColor: theme.palette.background.paper,
      margin: 10
    }
  }))
);

const enrichAppearances = ({ appearances, labels, creators }) => ({
  ...appearances,
  byKey: _.mapValues(appearances.byKey, app => ({
    ...app,
    creator: creators.byKey[app.creatorId],
    appearanceLabels: app.appearanceLabels.map(al => ({
      ...al,
      label: labels.byKey[al.labelId]
    }))
  }))
});

const Frame = ({
  labels,
  creators,
  frame,
  activeAppearanceId,
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
  const [colorBy, setColorBy] = React.useState("CREATOR");

  const enrichedAppearances = enrichAppearances({
    appearances,
    labels,
    creators
  });

  const activeAppearance = enrichedAppearances.byKey[activeAppearanceId];

  return (
    <Grid container justify="space-between" spacing={1} alignItems="flex-start">
      <Grid container item xs={9} spacing={2}>
        <Grid container item xs={12} spacing={0}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              color={colorBy == "CREATOR" ? "textPrimary" : "inherit"}
              onClick={() => setColorBy("CREATOR")}
            >
              Show Creators
            </Link>
            <Link
              color={colorBy == "LABEL" ? "textPrimary" : "inherit"}
              onClick={() => setColorBy("LABEL")}
            >
              Show Labels
            </Link>
          </Breadcrumbs>
        </Grid>
        <Grid container item xs={12} spacing={0}>
          <FrameCard
            colorBy={colorBy}
            collection={collection}
            setActiveAppearance={setActiveAppearance}
            activeAppearance={activeAppearanceId}
            onAddAppearance={appearance =>
              onAddAppearance(frame.id, appearance, [activeLabel])
            }
            appearances={enrichedAppearances}
            frame={frame}
            onChangeFrame={shift =>
              onChangeFrame(collection.id, frame.id, shift)
            }
            onDeleteAppearance={onDeleteAppearance}
            onUpdateBox={onUpdateBox}
          />
        </Grid>
      </Grid>
      <Grid
        item
        container
        direction="column"
        justify="space-evenly"
        alignItems="center"
        xs={3}
        spacing={5}
      >
        <Grid
          container
          item
          xs={12}
          spacing={0}
          className={classes.rightContainer}
        >
          <LabelSelector
            setActiveLabel={setActiveLabel}
            labels={labels}
            activeLabel={activeLabel}
            onAddAppearanceLabel={() =>
              onAddAppearanceLabel(activeAppearanceId, activeLabel)
            }
          />
        </Grid>

        {activeAppearance ? (
          <>
            <Grid
              className={classes.rightContainer}
              container
              item
              xs={12}
              spacing={0}
              direction="row"
            >
              <Grid xs={12}>
                <Typography gutterBottom variant="overline">
                  Appearance
                </Typography>
              </Grid>
              <Grid xs={4} direction="column">
                <Typography gutterBottom variant="subtitle1">
                  Creator
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {activeAppearance.creator
                    ? activeAppearance.creator.name
                    : null}
                </Typography>
              </Grid>
              <Grid xs={4} direction="column">
                <Typography variant="body2" color="textSecondary">
                  {activeAppearance.dateCreated}
                </Typography>
                <Typography gutterBottom variant="subtitle1">
                  ID
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {activeAppearance.id}
                </Typography>
              </Grid>
              <Grid xs={4} direction="column" alignItems="center">
                <IconButton
                  onClick={() => onDeleteAppearance(activeAppearance.id)}
                >
                  <DeleteIcon />
                </IconButton>
                <Typography gutterBottom variant="caption">
                  Delete
                </Typography>
              </Grid>
            </Grid>
            <Grid
              className={classes.rightContainer}
              container
              item
              xs={12}
              spacing={0}
            >
              <Typography gutterBottom variant="overline">
                Labels
              </Typography>
              <AppearanceList
                appearance={activeAppearance}
                labels={labels}
                onDeleteAppearanceLabel={onDeleteAppearanceLabel}
              />
            </Grid>
          </>
        ) : null}
      </Grid>
    </Grid>
  );
};

export default connect(
  (state, ownProps) => ({
    collection: state.collections.byKey[state.ui.activeCollection],
    frame: state.frame,
    creators: state.creators,
    labels: state.labels,
    appearances: state.appearances,
    activeAppearanceId: state.ui.activeAppearance
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
