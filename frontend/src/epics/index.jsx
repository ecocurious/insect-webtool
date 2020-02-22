import { ajax } from "rxjs/ajax";
import { combineEpics, ofType } from "redux-observable";
import { of } from "rxjs";
import {
  map,
  catchError,
  concatMap,
  tap,
  withLatestFrom,
  filter,
  debounceTime,
  delay,
  mapTo
} from "rxjs/operators";
import * as a from "../actions";

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
