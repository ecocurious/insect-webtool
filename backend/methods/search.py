from backend.db import models
from backend.db import db
import datetime


def update_search(*, search, **_):
    with db.session_scope() as session:
        frames_query = models.FramesQuery(
            tbegin=search['start_date'], tend=search['end_date'],
            collection_id=search.get('collection_id'))

        ntotal, frames = db.get_frames(session,
                                       frames_query=frames_query,
                                       n_frames=search.get('n_frames', 1),
                                       mode=search.get('mode'),
                                       after_id=search.get('after_id'))

    search_results = {'ntotal': ntotal, 'frames': frames}
    return {'searchResults': search_results, 'search': search}


def set_active_collection(*, collection_id, **_):
    with db.session_scope() as session:
        start_date, end_date = db.collection_get_bounds(session, collection_id=collection_id)
        if start_date is not None and end_date is not None:
            end_date = end_date + datetime.timedelta(seconds=1)
            frames_query = models.FramesQuery(
                tbegin=start_date, tend=end_date,
                collection_id=collection_id)
            n_frames = 20
            mode = 'subsample'

            ntotal, frames = db.get_frames(session, frames_query, mode, n_frames, after_id=None)
            search_results = {'ntotal': ntotal, 'frames': frames}

            search = {'startDate': start_date,
                      'endDate': end_date,
                      'mode': mode,
                      'nFrames': n_frames,
                      'afterId': None,
                      'collectionId': collection_id}

    return {'searchResults': search_results, 'search': search}
