import React from "react";
import { makeStyles, fade } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles(theme => ({
  //   formControl: {
  //     // margin: theme.spacing(1),
  //     minWidth: 120,
  //     marginRight: 0
  //   },
  creator: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto"
    }
  }
}));

const CreatorSelect = ({ creators, onSelectCreator }) => {
  const classes = useStyles();

  const handleChange = event => {
    onSelectCreator(event.target.value);
  };

  return (
    <FormControl variant="filled" className={classes.creator}>
      {creators.allIds.length ? (
        <>
          <InputLabel id="demo-simple-select-label">Creator</InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select"
            value={creators.active}
            onChange={handleChange}
          >
            {creators.allIds.map(id => (
              <MenuItem value={id} key={"creator-" + id}>
                {creators.byKey[id].name}
              </MenuItem>
            ))}
          </Select>
        </>
      ) : null}
    </FormControl>
  );
};

export default CreatorSelect;
