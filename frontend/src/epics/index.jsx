import { combineEpics } from "redux-observable";
import { map, withLatestFrom, filter } from "rxjs/operators";

// add creator (and serverReady) to each action with server property

const serverEnriched = (action$, state$) =>
  action$.pipe(
    filter(action => action.server & !action.serverReady),
    withLatestFrom(state$),
    map(([action, state]) => ({
      ...action,
      creatorId: state.creators.active,
      serverReady: true
    }))
  );

const epics = combineEpics(serverEnriched);

export default epics;
