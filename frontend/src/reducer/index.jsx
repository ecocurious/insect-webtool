import { combineReducers } from "redux";
import { createReducer, findNonSerializableValue } from "redux-starter-kit";
import _ from "lodash";

const view = createReducer("BROWSER", {
  VIEW_UPDATE: (state, action) => action.view
});

const ui = createReducer(
  { activeCollection: null, activeAppearance: null },
  {
    SERVER_INIT: (state, action) => ({
      ...state,
      activeCollection: action.collections[0].id
    }),
    SEARCH_UPDATED: (state, action) => ({
      ...state,
      activeCollection: action.search.collectionId
    }),
    AKTIVE_APPEARANCE_SET: (state, action) => ({
      ...state,
      activeAppearance: action.appearanceId
    }),
    APPEARANCE_ADDED: (state, action) => ({
      ...state,
      activeAppearance: action.appearance.id
    })
  }
);

const liveImage = createReducer(null, {
  LIVEIMAGE_NEW: (state, action) => action.liveImage
});

const key = list => ({
  byKey: _.keyBy(list, "id"),
  allIds: _.map(list, ({ id }) => id)
});

const keyFirstActive = list => {
  const keyed = key(list);
  return { ...keyed, active: keyed.allIds[0] };
};

const remove = ({ byKey, allIds }, id) => ({
  byKey: _.omit(byKey, [id]),
  allIds: _.without(allIds, id)
});

const upsert = ({ byKey, allIds }, newObj) => ({
  byKey: { ...byKey, [newObj.id]: newObj },
  allIds: allIds.includes(newObj.id) ? allIds : [...allIds, newObj.id]
});

const collections = createReducer(key([]), {
  SERVER_INIT: (state, action) => key(action.collections),
  COLLECTION_ADDED: (state, action) => upsert(state, action.collection),
  COLLECTION_DELETED: (state, action) => remove(state, action.collectionId)
});

// const collection = createReducer(
//   { currentFrameId: null },
//   {
//     COLLECTION_LOADED: (state, action) => ({
//       id: action.collection.id,
//       currentFrameId: action.collection.frames[0].id
//     })
//   }
// );

const frame = createReducer(null, {
  //   SERVER_INIT: (state, action) => ({ ...key(action.frames), selectedIds: [] }),
  APPEARANCES_FLUSH: (state, action) => action.frame
});

const appearances = createReducer(
  { frameId: null, ...key([]) },
  {
    APPEARANCE_ADDED: (state, action) => ({
      ...state,
      ...upsert(state, action.appearance)
    }),
    APPEARANCE_LABEL_DELETED: (state, action) => ({
      ...state,
      ...upsert(state, action.appearance)
    }),
    APPEARANCE_LABEL_ADDED: (state, action) => ({
      ...state,
      ...upsert(state, action.appearance)
    }),
    APPEARANCES_FLUSH: (state, action) => ({
      frameId: action.frame.id,
      ...key(action.appearances)
    })
  }
);

const creators = createReducer(keyFirstActive([]), {
  SERVER_INIT: (state, action) => keyFirstActive(action.creators),
  CREATOR_SELECT: (state, action) => ({ ...state, active: action.creatorId })
});

const labels = createReducer(key([]), {
  SERVER_INIT: (state, action) => key(action.labels)
});

const defaultSearch = {
  startDate: new Date("2019-11-15T00:00:00"),
  endDate: new Date("2020-01-31T00:00:00"),
  pagination: null,
  nFrames: 50,
  mode: "subsample",
  collectionId: null
};

const search = createReducer(defaultSearch, {
    SEARCH_UPDATE: (state, action) => ({ ...state, ...action.search })
});

const searchResults = createReducer(
  { frames: [], ntotal: 0, selectedFrames: {} },
  {
    SEARCH_UPDATED: (state, action) => ({
      ...action.searchResults,
      ...{ selectedFrames: {} }
    }),
    SELECTED_FRAMES_UPDATE: (state, action) => ({
      ...state,
      ...{ selectedFrames: action.selectedFrames }
    })
  }
);

const reducers = combineReducers({
  view,
  ui,
  search,
  searchResults,
  liveImage,
  frame,
  appearances,
  collections,
  labels,
  creators
});

export default reducers;
