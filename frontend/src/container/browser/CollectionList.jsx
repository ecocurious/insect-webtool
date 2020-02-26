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

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";

import Box from "@material-ui/core/Box";

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


const ShowDownloadDialog = ({open, onClose, collection}) => {
    console.log('collection', collection);
    const downloadUrl = process.env.APP_HOST + "/dataset/" + collection.id ;
    return (
        <Dialog
          aria-labelledby="show-download-dialog-title"
          open={open}
        >

          <DialogTitle id="show-download-dialog-title">
              How to Download Dataset
          </DialogTitle>

          <DialogContent>
                <Box>
                    This link includes urls to the frame pictures and all the labels of the dataset "{collection.name}":
                </Box>
                <Box m={2}>
                    <Link href={downloadUrl}>{downloadUrl}</Link>
                </Box>
                <Box>
                    To use this dataset with the darknet <Link href="https://github.com/AlexeyAB/darknet">Yolo-Implementation</Link> you can
                    use this python snippet to download in the compatible format:
                </Box>
                    {/* import ecolab;{"\n"} */}
                    {/* d = ecolab.download_dataset("{downloadUrl}", "dataset/") */}
                <Box fontFamily="Monospace" m={2}>
                    <pre>
                        # !pip install git+https://github.com/LBrinkmann/insects-client.git{"\n"}
                        from insectsclient import api{"\n"}
                        import os{"\n"}
                        os.environ['INSECTS_PLATFORM_URL'] = '{process.env.APP_HOST}'{"\n"}
                        _, frame_paths = api.import_collection({collection.id}, '/content/data', with_appearances_only=False){"\n"}
                        data = api.create_file_list(frame_paths, '/content/data/coll{collection.id}.txt'){"\n"}
                    </pre>
                </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => {onClose()}} color="primary">
              Close
            </Button>
          </DialogActions>

        </Dialog>
    )
}

const CollectionText = ({ collection, classes }) => (
  <ListItemText primary={collection.name} secondary={`${collection.id} (${collection.dateCreated})`} />
);

const Collection = ({
  collection,
  classes,
  active,
  onChangeActive,
  onDeleteCollection
}) => {
  const [open, setOpen] = React.useState(false);

  const [downloadOpen, setDownloadOpen] = React.useState(false);

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
                  /*<Link href={collection.downloadUrl}>Download Dataset</Link> */
                  <Button onClick={() => setDownloadOpen(true)}>Download Dataset</Button>
              }
            />
            <ListItemIcon className={classes.voter}>
              <IconButton onClick={() => onDeleteCollection(collection.id)}>
                <DeleteForeverIcon />
              </IconButton>
            </ListItemIcon>
          </ListItem>
        </List>
        <ShowDownloadDialog
            open={downloadOpen}
            collection={collection}
            onClose={() => setDownloadOpen(false)}
            />

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
