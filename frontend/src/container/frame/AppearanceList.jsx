import _ from "lodash";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";

import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  nested: {
    paddingLeft: theme.spacing(4)
  },
  voter: {
    width: "30px",
    minWidth: "30px"
  }
}));

const AppearanceLabelText = ({ label, classes }) => (
  <ListItemText
    primary={label.name}
    secondary={
      <React.Fragment>
        <Typography
          component="span"
          variant="body2"
          className={classes.inline}
          color="textPrimary"
        >
          {label.scientificName}
        </Typography>
        {` — ${label.systematicLevel}`}
      </React.Fragment>
    }
  />
);

const AppearanceLabel = ({ appearanceLabel, labels, classes, onDelete }) => {
  return (
    <>
      <ListItem alignItems="flex-start">
        <AppearanceLabelText
          label={labels.byKey[appearanceLabel.labelId]}
          classes={classes}
        />
        <ListItemIcon>
          <IconButton onClick={onDelete}>
            <CloseIcon />
          </IconButton>
        </ListItemIcon>
      </ListItem>
    </>
  );
};

const Appearance = ({ appearance, labels, onDeleteAppearanceLabel }) => {
  const classes = useStyles();
  return (
    <List className={classes.root}>
      {appearance.appearanceLabels.map((appearanceLabel, idx) => (
        <AppearanceLabel
          key={"appearance-" + idx}
          appearanceLabel={appearanceLabel}
          labels={labels}
          classes={classes}
          onDelete={() => onDeleteAppearanceLabel(appearanceLabel.id)}
        />
      ))}
    </List>
  );
};

export default Appearance;
