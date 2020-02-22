from flask import Flask
from flask_socketio import SocketIO, send, emit
import datetime
import json
from . import db
from . import models

from .utils import snakeize_dict_keys, camelize_dict_keys, to_dict, Better_JSON_ENCODER
from .models import FramesQuery

from sqlalchemy import inspect
from sqlalchemy.ext.declarative import DeclarativeMeta
from sqlalchemy.orm import (joinedload)



# credit: https://github.com/miguelgrinberg/Flask-SocketIO/issues/274
class BetterJsonWrapper(object):
    @staticmethod
    def dumps(*args, **kwargs):
        if 'cls' not in kwargs:
            kwargs['cls'] = Better_JSON_ENCODER
        return json.dumps(*args, **kwargs)

    @staticmethod
    def loads(*args, **kwargs):
        return json.loads(*args, **kwargs)


app = Flask(__name__)
socketio = SocketIO(json=BetterJsonWrapper)
socketio.init_app(app, cors_allowed_origins="*")



def test():
    with db.session_scope() as session:
        tbegin = datetime.datetime(2019, 11, 1)
        tend = datetime.datetime(2019, 11, 15)

        # EXAMPLE: get subsample
        # return db.get_frames_subsample(session, tbegin, tend, 10)

        # EXAMPLE: get single frame
        # f = session.query(models.Frame).get(16597);

        # EXAMPLE: add collection
        # coll = models.Collection(name='test')
        # session.add(coll)

        # EXAMPLE: add subsample to collection
        # coll = models.Collection(name='test')
        # session.add(coll)
        # session.flush()
        # db.collection_add_frames_subsample(session, coll.id, tbegin, tend, 10)

        # EXAMPLE: get collection with frames
        # coll =  session.query(models.Collection).get(7);
        # frames = coll.frames
        # return [to_dict(f) for f in frames]

        # EXAMPLE: remove frame from collection
        # coll = session.query(models.Collection).get(7);
        # return to_dict(coll, rels=['frames'])

        # EXAMPLE: add an appearance
        # frame = session.query(models.Frame).first()
        # app = models.Appearance(frame=frame)
        # session.add(app)

        # EXAMPLE: update bbox
        # app = session.query(models.Appearance).first()
        # app.bbox_xmin = 42

        # EXAMPLE: get all labels
        # labels = session.query(models.Label).all()
        # return [to_dict(label) for label in labels]


def _get_all(model):
    with db.session_scope() as session:
        objs = session.query(model).all()
        objs = [to_dict(o) for o in objs]
    return objs


def _get_by_id(model, id, rels=[]):
    with db.session_scope() as session:
        obj = session.query(model).get(int(id))
        obj = to_dict(obj, rels=rels)
    return obj


def emit_one(action_name, payload):
    payload = camelize_dict_keys(payload)
    emit('action', {"type": action_name, **payload})


def load_collection(collection_id):
    with db.session_scope() as session:
        coll = session.query(models.Collection).get(collection_id)
        frames = coll.frames
        coll = {'id': coll.id, 'frames': [to_dict(f) for f in frames]}
    emit_one('COLLECTION_LOADED', {'collection': coll})


def delete_appearance_label(*, appearance_label_id, **_):
    with db.session_scope() as session:
        applabel = session.query(models.AppearanceLabel).get(appearance_label_id)
        app = applabel.appearance
        session.delete(applabel)
        session.commit()
        app_dicts = to_dict(app, rels=['appearance_labels'])
    emit_one('APPEARANCE_LABEL_DELETED', {'appearance': app_dicts})


def add_appearance_label(*, appearance_id, label_id, creator_id, **_):
    with db.session_scope() as session:
        creator = session.query(models.Creator).get(creator_id)
        label = session.query(models.Label).get(label_id)
        appearance = session.query(models.Appearance).get(appearance_id)
        app_label = models.AppearanceLabel(creator=creator, appearance=appearance, label=label)
        session.add(app_label)
        session.commit()
        app_dict = to_dict(appearance, rels=['appearance_labels'])
    emit_one('APPEARANCE_LABEL_ADDED', {'appearance': app_dict})


def delete_appearance(*, appearance_id, **_):
    with db.session_scope() as session:
        app = session.query(models.Appearance).get(appearance_id)
        frame = app.frame
        session.delete(app)
        session.commit()
        app_dicts = [to_dict(a, rels=['appearance_labels']) for a in frame.appearances]
        frame_dict = to_dict(frame)
    emit_one('APPEARANCES_FLUSH', {'frame': frame_dict, 'appearances': app_dicts})


def add_appearance(*, frame_id, appearance, label_ids, creator_id, **_):
    with db.session_scope() as session:
        frame = session.query(models.Frame).get(frame_id)
        creator = session.query(models.Creator).get(creator_id)
        labels = session.query(models.Label).filter(models.Label.id.in_(label_ids)).all()
        app = models.Appearance(frame=frame, creator=creator, **appearance)
        session.add(app)
        for label in labels:
            appLabel = models.AppearanceLabel(creator=creator, appearance=app, label=label)
            session.add(appLabel)
        session.commit()
        app_dict = to_dict(app, rels=['appearance_labels'])
    emit_one('APPEARANCE_ADDED', {'appearance': app_dict})


def update_box(*, appearance_id, box, **_):
    with db.session_scope() as session:
        app = session.query(models.Appearance).get(appearance_id)
        for k, v in box.items():
            setattr(app, k, v)
        session.commit()
        app_dict = to_dict(app)
    emit_one('BOX_UPDATED', {'appearance': app_dict})


def add_collection(*, name, **_):
    with db.session_scope() as session:
        coll = models.Collection(name=name)
        session.add(coll)
        session.commit()
        coll = to_dict(coll)
    emit_one('COLLECTION_ADDED', {'collection': coll})


def delete_collection(*, collection_id, **_):
    with db.session_scope() as session:
        coll = session.query(models.Collection).get(collection_id)
        session.delete(coll)
        session.commit()
    emit_one('COLLECTION_DELETED', {'collectionId': collection_id})


def get_frame_appearances(*, frame_id, **_):
    with db.session_scope() as session:
        frame = session.query(models.Frame).get(frame_id)
        apps = frame.appearances
        app_dicts = [to_dict(a, rels=['appearance_labels']) for a in apps]
        frame_dict = to_dict(frame)
    emit_one('APPEARANCES_FLUSH', {'frame': frame_dict, 'appearances': app_dicts})


def change_frame(*, frame_id, collection_id, shift, **_):
    with db.session_scope() as session:
        if shift != 0:
            assert collection_id, 'Collection need to be defined when useing shift.'
            frame_id = db.navigate_frame(session, collection_id, frame_id, shift)
        frame = session.query(models.Frame).get(frame_id)
        apps = frame.appearances
        app_dicts = [to_dict(a, rels=['appearance_labels']) for a in apps]
        frame_dict = to_dict(frame)
    emit_one('APPEARANCES_FLUSH', {'frame': frame_dict, 'appearances': app_dicts})

@socketio.on('connect')
def handle_connection():
    labels = _get_all(models.Label)
    collections = _get_all(models.Collection)
    creators = _get_all(models.Creator)
    emit_one('SERVER_INIT', {'labels': labels, 'collections': collections, 'creators': creators})
    get_frame_appearances(frame_id=96339)


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
        frames = [to_dict(frame) for frame in frames]

    search_results = {'ntotal': ntotal, 'frames': frames}
    emit_one('SEARCH_UPDATED', {'searchResults': search_results, 'search': search})


def addto_collection(*, search, collection_id, sample_size, **_):
    with db.session_scope() as session:
        query = models.FramesQuery(
            tbegin=search['start_date'], tend=search['end_date'],
            collection_id=search.get('collection_id'))
        db.collection_add_frames_via_query(
            session, collection_id, query, nframes=sample_size)


@socketio.on('action')
def handle_actions(action):
    s_action = snakeize_dict_keys(action)
    # print(s_action)
    if action['type'] == "SEARCH_UPDATE":
        update_search(**s_action)
    if action['type'] == "APPEARANCE_ADD":
        add_appearance(**s_action)
    if action['type'] == "APPEARANCE_DELETE":
        delete_appearance(**s_action)
    if action['type'] == "COLLECTION_ADD":
        add_collection(**s_action)
    if action['type'] == "COLLECTION_DELETE":
        delete_collection(**s_action)
    if action['type'] == "COLLECTION_ADDTO":
        addto_collection(**s_action)
    if action['type'] == "FRAME_CHANGE":
        change_frame(**s_action)
    if action['type'] == "BOX_UPDATE":
        update_box(**s_action)
    if action['type'] == "APPEARANCE_LABEL_DELETE":
        delete_appearance_label(**s_action)
    if action['type'] == "APPEARANCE_LABEL_ADD":
        add_appearance_label(**s_action)


def download_collection(collection_id=28, appearance_needed=True):
    with db.session_scope() as session:
        xs = []
        f = session.query(models.Frame).\
            options(joinedload('appearances').joinedload('appearance_labels').joinedload('label')).\
            filter(models.Frame.collections.any(id=collection_id)).all()

        for i, frame in enumerate(f):
            d = to_dict(frame, rels=['appearances', 'appearance_labels', 'label'])

            if appearance_needed:
                include = len(d['appearances']) > 0
            else:
                include = True

            if include:
                xs.append(d)

        return xs


def debug():
    socketio.run(app, host='0.0.0.0', debug=True, port=5000)


def test():
    model = models.Frame
    id = 123124
    with db.session_scope() as session:
        obj = session.query(model).get(int(id))
        rels = ['appearances']
        return to_dict(obj, rels=rels)

#     return obj
#     _get_by_id(, , rels=[, 'appearance_labels', 'appearance'])

def test_add():
    collection_id = 32
    frame_ids = [123124]
    with db.session_scope() as session:
        collection = session.query(models.Collection).get(collection_id)
        for frame_id in frame_ids:
            frame = session.query(models.Frame).get(frame_id)
            collection.frames.append(frame)
        session.flush()
