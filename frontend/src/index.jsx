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

import Browser from "./container/browser";
import Frame from "./container/frame";
import LiveView from "./container/LiveView";
import CreatorSelect from "./container/CreatorSelect";

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
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  toolbar: { ...theme.mixins.toolbar, width: "100%" },
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

// sent all actions with property serverReady to socktIo backend
let socket = io(process.env.APP_HOST);
let socketIoMiddleware = createSocketIoMiddleware(
  socket,
  (type, action) => action.serverReady
);

const enhancer = compose(
  applyMiddleware(...[epicMiddleware, socketIoMiddleware, logger])
);

const store = createStore(reducers, {}, enhancer);

epicMiddleware.run(epics);

const IndexContainer = connect(
  (state, ownProps) => ({ view: state.view, creators: state.creators }),
  (dispatch, ownProps) => ({
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
