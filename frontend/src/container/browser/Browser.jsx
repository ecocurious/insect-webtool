import React from "react";

import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import * as a from "../../actions";
import FrameGrid from "./FrameGrid";
import BrowserNav from "./BrowserNav";
import CollectionList from "./CollectionList";
import AddCollection from "./AddCollection";
import AddToCollection from "./AddToCollection";
import ResultsHeader from "./ResultsHeader";

import Grid from "@material-ui/core/Grid";

const styles = theme => ({});

const Browser = ({
  search,
  ntotal,
  frames,
  onSearchUpdate,
  collections,
  activeCollection,
  onDeleteCollection,
  onAddCollection,
  onAddToCollection,
  onClickFrame
}) => {
  // There is probably a better way for this
  React.useEffect(() => {
    onSearchUpdate(search);
  }, []);

  return (
    <Grid container justify="space-between" spacing={1} alignItems="flex-start">
      <Grid container item direction="column" xs={9} spacing={2}>
        <Grid container item xs={12} spacing={0}>
          <BrowserNav search={search} onSearchUpdate={onSearchUpdate} frames={frames}/>
        </Grid>
        <Grid>
          <ResultsHeader search={search} ntotal={ntotal} frames={frames} onSearchUpdate={onSearchUpdate} />
        </Grid>
        <FrameGrid
          frames={frames}
          showSelect={true}
          onClickFrame={frameId => onClickFrame(activeCollection, frameId)}
        />
      </Grid>
      <Grid container item xs={3} spacing={2}>
        <Grid container item xs={12} spacing={0}>
          <AddToCollection
            onAddToCollection={(collectionId, sampleSize) =>
              onAddToCollection({ collectionId, sampleSize, search })
            }
            collections={collections}
          />
        </Grid>
        <Grid container item xs={12} spacing={0}>
          <CollectionList
            collections={collections}
            activeCollection={activeCollection}
            onChangeActive={id =>
              onSearchUpdate({ ...search, collectionId: id })
            }
            onDeleteCollection={onDeleteCollection}
          />
        </Grid>
        <Grid container item xs={12} spacing={0}>
          <AddCollection onAddCollection={name => onAddCollection({ name })} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(
  connect(
    (state, ownProps) => ({
      search: state.search,
      frames: state.searchResults.frames,
      ntotal: state.searchResults.ntotal,
      collections: state.collections,
      activeCollection: state.ui.activeCollection
    }),
    (dispatch, ownProps) => ({
      onSearchUpdate: search => dispatch(a.updateSearch(search)),
      onDeleteCollection: id => dispatch(a.deleteCollection(id)),
      onAddCollection: collection => dispatch(a.addCollection(collection)),
      onAddToCollection: data => dispatch(a.addToCollection(data)),
      onClickFrame: (collectionId, frameId) => {
        dispatch(a.changeFrame(collectionId, frameId, 0));
        dispatch(a.updateView("FRAME"));
      }
    })
  )(Browser)
);
