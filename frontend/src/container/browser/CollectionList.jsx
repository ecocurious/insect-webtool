import _ from "lodash";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Link from "@material-ui/core/Link";

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
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <ListItem
        alignItems="flex-start"
        button
        selected={active}
        onClick={() => onChangeActive(collection.id)}
      >
        <CollectionText collection={collection} classes={classes} />
        {collection.downloadUrl ? (
          open ? (
            <ExpandLess onClick={() => setOpen(false)} />
          ) : (
            <ExpandMore onClick={() => setOpen(true)} />
          )
        ) : null}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem className={classes.nested}>
            <ListItemText
              secondary={
                <Link href={collection.downloadUrl}>Download Dataset</Link>
              }
            />
            <ListItemIcon className={classes.voter}>
              <IconButton onClick={() => onDeleteCollection(collection.id)}>
                <DeleteForeverIcon />
              </IconButton>
            </ListItemIcon>
          </ListItem>
        </List>
      </Collapse>
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
  return (
    <List className={classes.root}>
      <Collection
        key={"collection-all"}
        active={activeCollection == null}
        collection={{ name: "All Frames", id: null, dateCreated: null }}
        onChangeActive={onChangeActive}
        classes={classes}
      />
      {collections.allIds.map(id => (
        <Collection
          key={"collection-" + id}
          active={activeCollection == id}
          collection={{
            ...collections.byKey[id],
            downloadUrl: "https://www.google.com"
          }}
          onChangeActive={onChangeActive}
          classes={classes}
          onDeleteCollection={onDeleteCollection}
        />
      ))}
    </List>
  );
};

export default CollectionList;
