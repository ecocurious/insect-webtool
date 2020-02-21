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

const CollectionText = ({ collection, classes }) => (
  <ListItemText primary={collection.name} secondary={collection.dateCreated} />
);

const Collection = ({
  collection,
  classes,
  active,
  onChangeActive,
  onDeleteCollection
}) => {
  //   const [open, setOpen] = React.useState(false);

  return (
    <>
      <ListItem
        alignItems="flex-start"
        button
        selected={active}
        onClick={() => onChangeActive(collection.id)}
      >
        {onDeleteCollection ? (
          <ListItemIcon>
            <IconButton onClick={() => onDeleteCollection(collection.id)}>
              <CloseIcon />
            </IconButton>
          </ListItemIcon>
        ) : null}
        <CollectionText collection={collection} classes={classes} />
        {/* {open ? (
          <ExpandLess onClick={() => setOpen(false)} />
        ) : (
          <ExpandMore onClick={() => setOpen(true)} />
        )} */}
      </ListItem>
      {/* <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {collectionLabels.map((al, idx) => (
            <ListItem className={classes.nested} key={"sub-app-" + idx}>
              <CollectionLabelText
                label={labels.byKey[al.labelId]}
                classes={classes}
              />
              <ListItemIcon className={classes.voter}>
                <ThumbUpIcon />
              </ListItemIcon>
              <ListItemIcon className={classes.voter}>
                <ThumbDownIcon />
              </ListItemIcon>
            </ListItem>
          ))}
        </List>
      </Collapse> */}
    </>
  );
};

const intersperse = (elements, makeInter, makeElement) =>
  _.flatMap(elements, (a, i) =>
    i ? [makeInter(i), makeElement(a, i)] : [makeElement(a)]
  );

const CollectionList = ({
  collections,
  activeCollection,
  onChangeActive,
  onDeleteCollection
}) => {
  const classes = useStyles();
  console.log(activeCollection);
  return (
    <List className={classes.root}>
      <Collection
        key={"collection-all"}
        active={activeCollection == null}
        collection={{ name: "All Frames", id: null, dateCreated: null }}
        onChangeActive={onChangeActive}
        classes={classes}
      />
      {intersperse(
        collections.allIds.map(id => collections.byKey[id]),
        i => null,
        //   <Divider key={"divider-" + i} variant="inset" component="li" />
        (a, i) => (
          <Collection
            key={"collection-" + i}
            active={activeCollection == a.id}
            collection={a}
            onChangeActive={onChangeActive}
            classes={classes}
            onDeleteCollection={onDeleteCollection}
          />
        )
      )}
    </List>
  );
};

export default CollectionList;
