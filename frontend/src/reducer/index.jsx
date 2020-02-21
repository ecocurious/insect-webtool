import { combineReducers } from "redux";
import { createReducer, findNonSerializableValue } from "redux-starter-kit";
import _ from "lodash";

const view = createReducer("BROWSER", {
  VIEW_UPDATE: (state, action) => action.view
});

const ui = createReducer(
  { activeFrame: null, activeCollection: null },
  {
    SERVER_INIT: (state, action) => ({
      activeFrame: action.frames[0].id,
      activeCollection: action.collections[0].id
    }),
    SEARCH_UPDATED: (state, action) => ({
      activeFrame: null,
      activeCollection: action.search.collectionId
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

const append = ({ byKey, allIds }, newObj) => ({
  byKey: { ...byKey, [newObj.id]: newObj },
  allIds: [...allIds, newObj.id]
});

const collections = createReducer(key([]), {
  SERVER_INIT: (state, action) => key(action.collections),
  COLLECTION_ADDED: (state, action) => append(state, action.collection)
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

const frames = createReducer(key([]), {
  SERVER_INIT: (state, action) => ({ ...key(action.frames), selectedIds: [] })
});

const appearances = createReducer(
  { frameId: null, ...key([]) },
  {
    APPEARANCE_ADDED: (state, action) => ({
      ...state,
      byKey: { ...state.byKey, [action.appearance.id]: action.appearance },
      allIds: [...state.allIds, action.appearance.id]
    }),
    APPEARANCES_FLUSH: (state, action) => ({
      frameId: action.frameId,
      ...key(action.appearances)
    })
  }
);

const labels = createReducer(key([]), {
  SERVER_INIT: (state, action) => key(action.labels)
});

const defaultSearch = {
  startDate: new Date("2019-11-15T00:00:00"),
  endDate: new Date("2020-01-31T00:00:00"),
  //   sampleSize: 500,
  collectionId: null
};

const search = createReducer(defaultSearch, {
  SEARCH_UPDATE: (state, action) => ({ ...state, ...action.search })
});

const searchResults = createReducer(
  { frames: [], ntotal: 0 },
  {
    SEARCH_UPDATED: (state, action) => action.searchResults
  }
);

const reducers = combineReducers({
  view,
  ui,
  search,
  searchResults,
  liveImage,
  frames,
  appearances,
  collections,
  labels
});

export default reducers;
