import React from "react";
import { makeStyles, fade } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles(theme => ({
  select: {
    width: 150
  },
  creator: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.5),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 1)
    },
    marginLeft: 0,
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
          <InputLabel id="demo-simple-select-label">User</InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select"
            value={creators.active}
            onChange={handleChange}
            className={classes.select}
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
