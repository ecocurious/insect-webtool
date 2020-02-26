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

export const deleteAppearanceLabel = appearanceLabelId => {
  return {
    type: "APPEARANCE_LABEL_DELETE",
    appearanceLabelId,
    server: true
  };
};

export const addAppearanceLabel = ({ appearanceId, labelId }) => {
  return {
    type: "APPEARANCE_LABEL_ADD",
    appearanceId,
    labelId,
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

export const updateBox = (appearanceId, box) => {
  return {
    type: "BOX_UPDATE",
    appearanceId,
    box,
    server: true
  };
};

export const updateSelectedFrames = selectedFrames => {
  return {
    type: "SELECTED_FRAMES_UPDATE",
    selectedFrames,
    server: false
  };
};

export const setActiveAppearance = appearanceId => {
  return {
    type: "AKTIVE_APPEARANCE_SET",
    appearanceId
  };
};

export const collectionAddFrames = ({collectionId, frameIds, search, full}) => {
  return {
      type: "COLLECTION_ADD_FRAMES",
      collectionId,
      frameIds,
      search,
      full,
      server: true
  };
}

export const collectionRemoveFrames = ({collectionId, frameIds}) => {
  return {
      type: "COLLECTION_REMOVE_FRAMES",
      collectionId,
      frameIds,
      server: true
  };
}

export const setActiveCollection = ({collectionId}) => {
  return {
      type: "ACTIVE_COLLECTION_SET",
      collectionId,
      server: true
  };
}
