import React from "react";
import ReactDOM from "react-dom";
import { Provider, connect } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import { createEpicMiddleware } from "redux-observable";
import logger from "redux-logger";

import epics from "./epics";
import reducers from "./reducer";
import * as a from "./actions";

import createSocketIoMiddleware from "redux-socket.io";
import io from "socket.io-client";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import Browser from "./container/browser/Browser";
import Frame from "./container/frame/Frame";
import LiveView from "./container/LiveView";
import CreatorSelect from "./container/CreatorSelect";
// import Dataset from "./container/Dataset";

import EmojiNatureIcon from "@material-ui/icons/EmojiNature";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  stripe: {
    backgroundColor: "red"
  },
  toolbar: { ...theme.mixins.toolbar, width: "100%" },
  //   taps: theme.mixins.tabs,
  tabs: {
    backgroundColor: theme.palette.background.paper,
    color: "black",
    minHeight: "48px"
  },
  tabsPlaceholder: {
    minHeight: "48px"
  },
  creator: {
    position: "absolute",
    right: 20,
    borderRadius: theme.shape.borderRadius
  }
}));

const views = [
  { screenName: "Live", id: "LIVE" },
  { screenName: "Browser", id: "BROWSER" },
  //   { screenName: "Single Dataset", id: "DATASET" },
  { screenName: "Annotation", id: "FRAME" }
];

const Index = ({ view, updateView, creators, onSelectCreator }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" noWrap>
            Insects Monitoring Lab <EmojiNatureIcon />
          </Typography>
          <div className={classes.creator}>
            <CreatorSelect
              creators={creators}
              onSelectCreator={onSelectCreator}
            />
          </div>
        </Toolbar>
        <Tabs
          className={classes.tabs}
          value={view}
          onChange={(e, view) => updateView(view)}
        >
          {views.map((view, idx) => (
            <Tab
              label={view.screenName}
              value={view.id}
              key={"tab-" + idx}
              id={view.id}
            />
          ))}
        </Tabs>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className={classes.tabsPlaceholder} />
        {view == "BROWSER" ? <Browser /> : null}
        {view == "FRAME" ? <Frame /> : null}
        {view == "DATASET" ? <Dataset /> : null}
        {view == "LIVE" ? <LiveView /> : null}
      </main>
    </div>
  );
};

const epicMiddleware = createEpicMiddleware();

let socket = io(process.env.APP_HOST);
let socketIoMiddleware = createSocketIoMiddleware(
  socket,
  (type, action) => action.serverReady
);

const middlewares = [epicMiddleware, socketIoMiddleware, logger];

const enhancer = compose(applyMiddleware(...middlewares));

const initalState = {};

const store = createStore(reducers, initalState, enhancer);

epicMiddleware.run(epics);

const IndexContainer = connect(
  (state, ownProps) => ({ view: state.view, creators: state.creators }),
  (dispatch, ownProps) => ({
    // onMount: () => dispatch(a.initApp()),
    updateView: view => dispatch(a.updateView(view)),
    onSelectCreator: id => dispatch(a.selectCreator(id))
  })
)(Index);

ReactDOM.render(
  <Provider store={store}>
    <IndexContainer />
  </Provider>,
  document.getElementById("index")
);
