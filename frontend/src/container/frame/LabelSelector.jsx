import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  labelSelect: { width: 250, margin: theme.spacing(1), float: "left" },
  button: { margin: theme.spacing(1) }
}));

const LabelSelector = ({
  labels,
  activeLabel,
  setActiveLabel,
  onAddAppearanceLabel
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Autocomplete
        id="combo-box"
        disableClearable={true}
        className={classes.labelSelect}
        options={labels.allIds.map(id => labels.byKey[id])}
        value={labels.byKey[activeLabel]}
        onChange={(e, label) => setActiveLabel(label.id)}
        getOptionLabel={option =>
          `${option.name} — ${option.scientificName} (${option.systematicLevel})`
        }
        renderInput={params => (
          <TextField
            {...params}
            label="Select New Label"
            variant="outlined"
            fullWidth
          />
        )}
      />
      {/* <Button
        size="small"
        variant="outlined"
        className={classes.margin}
        onClick={onAddAppearanceLabel}
      >
        Add
      </Button> */}
      <IconButton
        aria-label="delete"
        className={classes.button}
        size="medium"
        onClick={onAddAppearanceLabel}
      >
        <ArrowDownwardIcon fontSize="inherit" />
      </IconButton>
    </div>
  );
};

export default LabelSelector;
