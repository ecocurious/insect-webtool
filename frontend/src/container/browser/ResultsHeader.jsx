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

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';



const useStyles = makeStyles({
  sampleSize: {}
});

const ResultsHeader = ({search, frames, ntotal, onSearchUpdate}) => {
    return (
        <Grid container>
            <Grid item xs>
                <ButtonGroup size="small" aria-label="small outlined button group">
                  <Button>Select All</Button>
                  <Button>Add 13 items...</Button>
                </ButtonGroup>
            </Grid>
            <Grid item xs>
                <Grid item xs>
                </Grid>
                <Grid item xs>
                    <Button onClick={() => {
                        if (frames) {
                            const after_id = frames[frames.length-1].id;
                            onSearchUpdate({...search, ...{after_id}});
                        }
                    } }>Next Page<NavigateNextIcon /></Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ResultsHeader;
