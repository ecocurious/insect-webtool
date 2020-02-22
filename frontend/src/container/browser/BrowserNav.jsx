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
    <Grid container justify="flex-start" spacing={1}>

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

      <Grid item xs>
        <DateRange
          startDate={search.startDate}
          setStartDate={startDate => onSearchUpdate({ ...search, startDate })}
          endDate={search.endDate}
          setEndDate={endDate => onSearchUpdate({ ...search, endDate })}
          frames={frames}
        />
      </Grid>
    </Grid>
  );
};

export default BrowserNav;
