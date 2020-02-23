import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';


import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import _ from "lodash";

import AddToCollectionDialog from "./AddToCollectionDialog";

import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";

const useStyles = makeStyles({
  sampleSize: {}
});

const ConfirmRemoveDialog = ({open, onCancelRemove, selectedFrames, activeCollection, collections, confirmRemove}) => {
    const datasetName = _.get(collections, ['byKey', activeCollection, 'name']);
    return (
        <Dialog
          aria-labelledby="confirm-remove-dialog-title"
          open={open}
        >

          <DialogTitle id="confirm-remove-dialog-title">
              {`Remove frames from ${datasetName}`}
          </DialogTitle>

          <DialogContent>
              {`Remove the ${_.size(selectedFrames)} selected Frames from dataset "${datasetName}"?`}
          </DialogContent>

          <DialogActions>
            <Button onClick={() => {onCancelRemove()}} color="primary">
              Cancel
            </Button>
              <Button onClick={() => confirmRemove()} color="primary">
              Remove frames
            </Button>
          </DialogActions>

        </Dialog>
    )
}


const ResultsHeader = ({
        search, frames, ntotal, onSearchUpdate,
        selectedFrames,
        onSelectedFramesUpdate,
        onCollectionAddFrames,
        onCollectionRemoveFrames,
        activeCollection,
        collections
    }) => {

    const [addDialogIsOpen, setDialogIsOpen] = React.useState(false);
    const [confirmRemoveDialogOpen, setConfirmRemoveDialogOpen] = React.useState(false);

    const handleAdd = ({collectionId}) => {
        const frameIds = _.keys(selectedFrames);
        onCollectionAddFrames({collectionId, frameIds})
        onSelectedFramesUpdate({});
        onSearchUpdate(search);
        setDialogIsOpen(false)
    }

    const handleRemove = () => {
        const frameIds = _.keys(selectedFrames);
        if (activeCollection && _.size(frameIds) > 0) {
            onCollectionRemoveFrames({collectionId: activeCollection, frameIds: frameIds});
        }
        onSelectedFramesUpdate({});
        onSearchUpdate(search);
        setConfirmRemoveDialogOpen(false);
    }

    return (
        <Grid container justify="flex-start" spacing={2}>
            <Grid item >
                <ButtonGroup aria-label="button group">
                 <Button onClick={() => {
                     const selectedFrames = _.fromPairs(_.map(frames, (frame) => [frame.id, true]));
                     onSelectedFramesUpdate(selectedFrames);
                 }}>Select All</Button>
                < Button disabled={_.size(selectedFrames) == 0} onClick={() => {
                    const selectedFrames = {};
                    onSelectedFramesUpdate(selectedFrames);
                }}>
                    Clear Selection
                </Button>
                </ButtonGroup>
            </Grid>

            {_.size(selectedFrames) > 0 ? (
                <Grid item >
                    <b>{_.size(selectedFrames) + " selected"}</b>
                </Grid>
            ) : null
            }

            {_.size(selectedFrames) > 0 ? (
                <Grid item >
                    <ButtonGroup aria-label="button group">
                        <Button onClick={() => {
                                setDialogIsOpen(true);
                            }}
                        >
                            <AddCircleOutlineIcon />Add To Dataset
                        </Button>
                        <AddToCollectionDialog
                          open={addDialogIsOpen}
                          onClose={() => setDialogIsOpen(false)}
                          onAdd={handleAdd}
                          collections={collections}
                          selectedFrames={selectedFrames}
                        />
                    </ButtonGroup>
                    {
                        activeCollection ?
                        (
                            <ButtonGroup aria-label="button group">
                                <Button onClick={() => setConfirmRemoveDialogOpen(true)}>
                                    <RemoveCircleOutlineIcon/>Remove from Dataset
                                </Button>
                                    <ConfirmRemoveDialog
                                        open={confirmRemoveDialogOpen}
                                        selectedFrames={selectedFrames}
                                        activeCollection={activeCollection}
                                        collections={collections}
                                        onCancelRemove={() => setConfirmRemoveDialogOpen(false)}
                                        confirmRemove={() => handleRemove()}
                                    >
                                    </ConfirmRemoveDialog>
                            </ButtonGroup>

                         ) : null
                    }
                </Grid>
            ) : null
            }
        </Grid>
    );
};

export default ResultsHeader;
