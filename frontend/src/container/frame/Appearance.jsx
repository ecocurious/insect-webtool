import _ from "lodash";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import BugReportOutlinedIcon from "@material-ui/icons/BugReportOutlined";
import Typography from "@material-ui/core/Typography";

import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import DeleteIcon from "@material-ui/icons/Delete";
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
  //   inline: {
  //     display: "inline"
  //   }
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
  //   const [open, setOpen] = React.useState(false);

  return (
    <>
      <ListItem alignItems="flex-start">
        {/* <ListItemIcon className={classes.voter}>
          <ThumbUpIcon />
        </ListItemIcon>
        <ListItemIcon className={classes.voter}>
          <ThumbDownIcon />
        </ListItemIcon> */}
        <AppearanceLabelText
          label={labels.byKey[appearanceLabel.labelId]}
          classes={classes}
        />
        <ListItemIcon>
          <IconButton onClick={onDelete}>
            <CloseIcon />
          </IconButton>
        </ListItemIcon>
        {/* {open ? (
          <ExpandLess onClick={() => setOpen(false)} />
        ) : (
          <ExpandMore onClick={() => setOpen(true)} />
        )} */}
      </ListItem>
      {/* <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {appearanceLabels.map((al, idx) => (
            <ListItem className={classes.nested} key={"sub-app-" + idx}>
              <AppearanceLabelText
                label={labels.byKey[al.labelId]}
                classes={classes}
              />

            </ListItem>
          ))}
        </List>
      </Collapse> */}
    </>
  );
};

const Appearance = ({ appearance, labels, onDeleteAppearanceLabel }) => {
  const classes = useStyles();
  console.log(appearance);
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
