import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles({
  collectionName: {
    width: 150,
    marginLeft: 10,
    marginRight: 10
  }
});

const AddCollection = ({ onAddCollection }) => {
  const classes = useStyles();
  const [name, setName] = React.useState(null);
  return (
    <>
      <form noValidate autoComplete="off">
        <TextField
          className={classes.collectionName}
          id="standard-basic"
          label="Dataset name"
          onChange={event => setName(event.target.value)}
        />
      </form>
      <Fab color="secondary" aria-label="add">
        <AddIcon onClick={() => onAddCollection(name)} />
      </Fab>
    </>
  );
};

export default AddCollection;
