import React from "react";
import "date-fns";
import { makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";
import DateRange from "./DateRange";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';


import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import _ from "lodash";

const useStyles = makeStyles({
  datePicker: { width: 150, marginRight: 20 },
  timePicker: { width: 100 },
  collectionName: {
    width: 150,
    marginLeft: 10,
    marginRight: 10
  },
  sampleSize: { width: 150, marginLeft: 10, marginRight: 10 }
});

const DateTimePicker = ({ date, setDate, label, classes }) => (
  <>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        className={classes.datePicker}
        disableToolbar
        variant="inline"
        format="MM/dd/yyyy"
        margin="normal"
        label={`${label} Date`}
        value={date}
        onChange={setDate}
        KeyboardButtonProps={{
          "aria-label": "change date"
        }}
      />
      <KeyboardTimePicker
        className={classes.timePicker}
        disableToolbar
        variant="inline"
        margin="normal"
        label={`${label} Time`}
        value={date}
        onChange={setDate}
        KeyboardButtonProps={{
          "aria-label": "change time"
        }}
      />
    </MuiPickersUtilsProvider>
  </>
);

const BrowserNav = ({ search, onSearchUpdate, frames }) => {
  const classes = useStyles();
  console.log(search.startDate);
  return (
    <Grid container justify="flex-start" spacing={1} >

      {/* <Grid container item xs={4} spacing={3}> */}
      {/*   <DateTimePicker */}
      {/*     date={search.startDate} */}
      {/*     setDate={startDate => onSearchUpdate({ ...search, startDate })} */}
      {/*     label="Start" */}
      {/*     classes={classes} */}
      {/*   /> */}
      {/* </Grid> */}
      {/* <Grid container item xs={4} spacing={3}> */}
      {/*   <DateTimePicker */}
      {/*     date={search.endDate} */}
      {/*     setDate={endDate => onSearchUpdate({ ...search, endDate })} */}
      {/*     label="End" */}
      {/*     classes={classes} */}
      {/*   /> */}
      {/* </Grid> */}

      {/* <Grid container item xs={4} spacing={3}>
        <TextField
          className={classes.sampleSize}
          id="standard-basic"
          label="Number of Samples"
          value={search.sampleSize}
          onChange={event =>
            onSearchUpdate({
              ...search,
              sampleSize: parseInt(event.target.value)
            })
          }
        />
      </Grid> */}


      <Grid item>
          <ToggleButtonGroup
              size="small"
              value={search.mode}
              onChange={(e, mode) => {
                  var afterId = null;
                  if (frames && _.size(frames) > 0) {
                      afterId = frames[0].id
                  }
                  onSearchUpdate({...search, ...{mode, afterId}})
              }}
              exclusive>
            <ToggleButton key={1} value="subsample">Subsample</ToggleButton>
            <ToggleButton key={2} value="cont">Continuous</ToggleButton>
        </ToggleButtonGroup>
      </Grid>

       <Grid item>
               <Select value={search.nFrames} onChange={(e1, val) => {
                   const nFrames = val.props.value;
                   onSearchUpdate({...search, ...{nFrames}});
               }}>
                 <MenuItem value={10}>10</MenuItem>
                 <MenuItem value={20}>20</MenuItem>
                 <MenuItem value={50}>50</MenuItem>
                 <MenuItem value={100}>100</MenuItem>
               </Select>
       </Grid>

      <Grid item xs>
        <DateRange
          startDate={search.startDate}
          setStartDate={startDate => onSearchUpdate({ ...search, startDate })}
          endDate={search.endDate}
          setEndDate={endDate => onSearchUpdate({ ...search, endDate })}
          frames={frames}
          onZoomToFrames={() => {
              if (frames && _.size(frames) >= 2) {
                  const startDate = new Date(frames[0].timestamp);
                  const endDate = new Date(frames[frames.length - 1].timestamp);
                  onSearchUpdate({startDate, endDate});
              }
          }}
        />
      </Grid>
    </Grid>
  );
};

export default BrowserNav;
