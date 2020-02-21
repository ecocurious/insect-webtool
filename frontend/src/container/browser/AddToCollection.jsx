import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import AddToCollectionDialog from "./AddToCollectionDialog";

const useStyles = makeStyles({ buttonGroup: { width: "100%" } });

const AddToCollection = ({ collections, onAddToCollection }) => {
  const classes = useStyles();
  const [openAddDialog, setOpenAddDialog] = React.useState(false);

  const handleOpen = () => {
    setOpenAddDialog(true);
  };

  const handleClose = () => {
    setOpenAddDialog(false);
  };

  const handleAdd = (collectionId, sampleSize) => {
    setOpenAddDialog(false);
    console.log("handleAdd", collectionId, sampleSize);
    onAddToCollection(collectionId, sampleSize);
  };

  return (
    <ButtonGroup
      className={classes.buttonGroup}
      color="primary"
      fullWidth={true}
      aria-label="outlined primary button group"
    >
      <Button onClick={handleOpen}>Add Frames</Button>
      <AddToCollectionDialog
        open={openAddDialog}
        onClose={handleClose}
        onAdd={handleAdd}
        collections={collections}
      />
      <Button disabled>Remove Frames</Button>
    </ButtonGroup>
  );
};

export default AddToCollection;
