from backend.db.utils import to_dict
from backend.db import models
from backend.db import db
from sqlalchemy.orm import joinedload


def add_collection(*, name, **_):
    with db.session_scope() as session:
        coll = models.Collection(name=name)
        session.add(coll)
        session.commit()
        coll = to_dict(coll)
    return {'collection': coll}


def delete_collection(*, collection_id, **_):
    with db.session_scope() as session:
        coll = session.query(models.Collection).get(collection_id)
        session.delete(coll)
        session.commit()
    return {'collectionId': collection_id}


def collection_add_frames(*, collection_id, frame_ids, search, full, **_):
    with db.session_scope() as session:
        if full:
            frames_query = models.FramesQuery(
                tbegin=search['start_date'], tend=search['end_date'],
                collection_id=search.get('collection_id'))
            n = db.collection_add_frames_via_query(
                session, collection_id, frames_query, nframes=None)
            return {'collectionId': collection_id, 'countDelta': n}
        else:
            n = db.collection_add_frames(session, collection_id, frame_ids)
            return {'collectionId': collection_id, 'countDelta': n}


def collection_remove_frames(*, collection_id, frame_ids, **_):
    with db.session_scope() as session:
        n = db.collection_remove_frames(session, collection_id, frame_ids)
    return {'collectionId': collection_id, 'countDelta': -n}


def download_collection(*, collection_id=28, appearance_needed=True):
    with db.session_scope() as session:
        xs = []
        f = session.query(models.Frame).options(
                joinedload('appearances')
                .joinedload('appearance_labels')
                .joinedload('label')
            ).filter(models.Frame.collections.any(id=collection_id)) \
            .all()

        for frame in f:
            d = to_dict(frame, rels=['appearances', 'appearance_labels', 'label'])

            if appearance_needed:
                include = len(d['appearances']) > 0
            else:
                include = True

            if include:
                xs.append(d)

        return {"collection": xs}
