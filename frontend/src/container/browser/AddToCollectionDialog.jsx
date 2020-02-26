import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";

import TextField from "@material-ui/core/TextField";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles({
  sampleSize: {}
});

const DialogListItem = ({ id, name, handleListItemClick, selected }) => (
  <ListItem button onClick={() => handleListItemClick(id)} selected={selected}>
    <ListItemText primary={name} />
  </ListItem>
);

const AddToCollectionDialog = ({ onAdd, onClose, open, collections, selectedFrames, ntotal }) => {
  const classes = useStyles();

  const [selectedCollection, setSelectedCollection] = React.useState();
  const [sampleSize, setSampleSize] = React.useState(100);
  const [fullSelect, setFullSelect] = React.useState(false);

  const handleClose = () => {
    onClose();
  };

  const handleAdd = () => {
    if (selectedCollection) {
      onAdd({collectionId: selectedCollection, full: fullSelect});
    } else {
      onClose();
    }
  };

  const handleListItemClick = value => {
    setSelectedCollection(value);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">
          {`Add ${_.size(selectedFrames)} frames to dataset:`}
      </DialogTitle>
      <DialogContent>

        <FormGroup row>
          <FormControlLabel
            control={
                <Checkbox checked={fullSelect} onChange={() => setFullSelect(!fullSelect)} />
            }
            label={`Choose all ${Number(ntotal).toLocaleString()} frames`}
          />
        </FormGroup>

        <List>
          {collections.allIds.map(id => (
            <DialogListItem
              {...collections.byKey[id]}
              key={"dialog-list-item-" + id}
              handleListItemClick={handleListItemClick}
              selected={id == selectedCollection}
            />
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button disabled={_.isNil(selectedCollection)} onClick={handleAdd} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddToCollectionDialog;
