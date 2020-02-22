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



import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import _ from "lodash";


const useStyles = makeStyles({
  sampleSize: {}
});


const ResultsHeader = ({search, frames, ntotal, onSearchUpdate, selectedFrames, onSelectedFramesUpdate}) => {
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
                        <Button>
                            <AddCircleOutlineIcon/>Add To Dataset
                        </Button>
                    </ButtonGroup>
                </Grid>
            ) : null
            }

        </Grid>
    );
};

export default ResultsHeader;
