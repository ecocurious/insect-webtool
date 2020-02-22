export const updateView = view => {
  return {
    type: "VIEW_UPDATE",
    view,
    server: true
  };
};

export const updateSearch = search => {
  return {
    type: "SEARCH_UPDATE",
    search,
    server: true
  };
};

export const deleteAppearance = appearanceId => {
  return {
    type: "APPEARANCE_DELETE",
    appearanceId,
    server: true
  };
};

export const addAppearance = ({ frameId, appearance, labelIds }) => {
  return {
    type: "APPEARANCE_ADD",
    frameId,
    appearance,
    labelIds,
    server: true
  };
};

export const changeFrame = (collectionId, frameId, shift) => {
  return {
    type: "FRAME_CHANGE",
    collectionId,
    frameId,
    shift,
    server: true
  };
};

export const deleteCollection = collectionId => {
  return {
    type: "COLLECTION_DELETE",
    collectionId,
    server: true
  };
};

export const addCollection = ({ name }) => {
  return {
    type: "COLLECTION_ADD",
    name,
    server: true
  };
};

export const addToCollection = ({ search, collectionId, sampleSize }) => {
  return {
    type: "COLLECTION_ADDTO",
    search,
    collectionId,
    sampleSize,
    server: true
  };
};

export const selectCreator = creatorId => {
  return {
    type: "CREATOR_SELECT",
    creatorId,
    server: true
  };
};

export const addCreator = name => {
  return {
    type: "CREATOR_ADD",
    name,
    server: true
  };
};

export const togglePagedMode = mode => {
  return {
    type: "TOGGLE_PAGED_MODE",
    mode,
    server: true
  };
};
