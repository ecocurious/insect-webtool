import React from "react";

import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import * as a from "../../actions";
import FrameGrid from "./FrameGrid";
import BrowserNav from "./BrowserNav";
import CollectionList from "./CollectionList";
import AddCollection from "./AddCollection";
import ResultsHeader from "./ResultsHeader";

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';


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
  onClickFrame,
  selectedFrames,
  onSelectedFramesUpdate,
  onCollectionAddFrames,
  onCollectionRemoveFrames,
  onSetActiveCollection
}) => {
  // There is probably a better way for this
  React.useEffect(() => {
    onSearchUpdate(search);
  }, []);

  const setLeftRight = ({timestamp, side}) => {
      if (side == "left") {
          onSearchUpdate({...search, ...{activeId: null}, ...{startDate: timestamp}});
      } else {
          onSearchUpdate({...search, ...{activeId: null}, ...{endDate: timestamp}});
      }
  };

  return (
    <Grid container justify="space-between" spacing={1} alignItems="flex-start">
      <Grid container item direction="column" xs={9} spacing={2}>
        <Grid container item xs={12} spacing={0}>
          <BrowserNav search={search} onSearchUpdate={onSearchUpdate} frames={frames}/>
        </Grid>
        <Grid item>
            <b>{search.mode == 'subsample' ?
                 (frames ? frames.length + " shown (out of " + ntotal + ")" : null) :
                 (frames ? frames.length + " in page" : null) }
            </b>
        </Grid>
        <Grid item>
          <ResultsHeader
            search={search}
            ntotal={ntotal}
            frames={frames}
            onSearchUpdate={onSearchUpdate}
            selectedFrames={selectedFrames}
            onSelectedFramesUpdate={onSelectedFramesUpdate}
            onCollectionAddFrames={onCollectionAddFrames}
            onCollectionRemoveFrames={onCollectionRemoveFrames}
            collections={collections}
            activeCollection={activeCollection}
          />
        </Grid>

        <Grid container item justify="flex-end">
            <Grid item>
                <ButtonGroup aria-label="button group">
                    <Button onClick={() => {
                        if (frames) {
                            const afterId = frames[frames.length-1].id;
                            onSearchUpdate({...search, ...{afterId}});
                        }
                    } }>Next Page<NavigateNextIcon /></Button>
                </ButtonGroup>
            </Grid>
        </Grid>

        <Grid item>
            <FrameGrid
              frames={frames}
              showSelect={true}
              onClickFrame={frameId => onClickFrame(activeCollection, frameId)}
              selectedFrames={selectedFrames}
              setLeftRight={setLeftRight}
              onSelectedFramesUpdate={onSelectedFramesUpdate}
            />
        </Grid>
      </Grid>
      <Grid container item xs={3} spacing={2}>
        <Grid container item xs={12} spacing={0}>
          <CollectionList
            collections={collections}
            activeCollection={activeCollection}
            onChangeActive={id => {
                /* onSearchUpdate({ ...search, collectionId: id }); */
                onSetActiveCollection({collectionId: id});
            }}
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
      activeCollection: state.ui.activeCollection,
      selectedFrames: state.searchResults.selectedFrames
    }),
    (dispatch, ownProps) => ({
      onSearchUpdate: search => dispatch(a.updateSearch(search)),
      onDeleteCollection: id => dispatch(a.deleteCollection(id)),
      onAddCollection: collection => dispatch(a.addCollection(collection)),
      onAddToCollection: data => dispatch(a.addToCollection(data)),
      onClickFrame: (collectionId, frameId) => {
        dispatch(a.changeFrame(collectionId, frameId, 0));
        dispatch(a.updateView("FRAME"));
      },
      onSelectedFramesUpdate: selectedFrames => dispatch(a.updateSelectedFrames(selectedFrames)),
      onCollectionAddFrames: data => dispatch(a.collectionAddFrames(data)),
      onCollectionRemoveFrames: data => dispatch(a.collectionRemoveFrames(data)),
      onSetActiveCollection: ({collectionId}) => dispatch(a.setActiveCollection({collectionId}))
    })
  )(Browser)
);
