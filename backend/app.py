from flask import Flask
from flask_socketio import SocketIO, send, emit
import datetime
import json
import numpy as np
from . import db
from . import models

from .utils import snakeize_dict_keys, camelize_dict_keys, to_dict
from .models import FramesQuery

from sqlalchemy import inspect
from sqlalchemy.ext.declarative import DeclarativeMeta


# credit: https://stackoverflow.com/questions/44146087/pass-user-built-json-encoder-into-flasks-jsonify
class Better_JSON_ENCODER(json.JSONEncoder):
    '''
    Used to help jsonify numpy arrays or lists that contain numpy data types.
    '''
    def default(self, obj):
        print(obj)
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, (datetime.datetime, datetime.date)):
            print('datetime', obj)
            return obj.isoformat()
        else:
            return super(Better_JSON_ENCODER, self).default(obj)


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


def delete_appearance(*, appearance_id, **_):
    with db.session_scope() as session:
        app = session.query(models.Appearance).get(appearance_id)
        frame = app.frame
        frame_id = frame.id
        session.delete(app)
        session.commit()
        app_dicts = [to_dict(a, rels=['appearance_labels']) for a in frame.appearances]
    emit_one('APPEARANCES_FLUSH', {'appearances': app_dicts, 'frameId': frame_id})


def add_appearance(*, frame_id, appearance, label_ids, **_):
    with db.session_scope() as session:
        frame = session.query(models.Frame).get(frame_id)
        labels = session.query(models.Label).filter(models.Label.id.in_(label_ids)).all()
        print('appearance', appearance)
        app = models.Appearance(frame=frame, **appearance)
        session.add(app)
        for label in labels:
            appLabel = models.AppearanceLabel(appearance=app, label=label)
            session.add(appLabel)
        session.commit()
        app_dict = to_dict(app, rels=['appearance_labels'])
    emit_one('APPEARANCE_ADDED', {'appearance': app_dict})


def add_collection(*, name, **_):
    with db.session_scope() as session:
        coll = models.Collection(name=name)
        session.add(coll)
        session.commit()
        coll = to_dict(coll)
    emit_one('COLLECTION_ADDED', {'collection': coll})


def delete_collection(*, collection_id, **_):
    with db.session_scope() as session:
        app = session.query(models.Appearance).get(collection_id)
        session.delete(app)
        session.commit()
    emit_one('COLLECTION_DELETED', {'collectionId': collection_id})


def get_frame_appearances(*, frame_id, **_):
    with db.session_scope() as session:
        frame = session.query(models.Frame).get(frame_id)
        apps = frame.appearances
        app_dicts = [to_dict(a, rels=['appearance_labels']) for a in apps]
    emit_one('APPEARANCES_FLUSH', {'appearances': app_dicts, 'frameId': frame_id})


@socketio.on('connect')
def handle_connection():
    labels = _get_all(models.Label)
    collections = _get_all(models.Collection)
    # frames = [_get_by_id(models.Frame, 123124, rels=['appearances', 'appearance_labels', 'appearance'])]
    frames = [_get_by_id(models.Frame, 96339)]
    # emit_one('SERVER_INIT', {'labels': [to_dict(l) for l in labels], 'collections': [to_dict(c) for c in collections], 'frames': [to_dict(f) for f in frames]})
    # frames_result = [to_dict(f) for f in frames]
    # import pdb; pdb.set_trace()
    # emit_one('SERVER_INIT', {'labels': [], 'collections': [], 'frames': [to_dict(f) for f in frames]})

    # import pdb; pdb.set_trace()
    emit_one('SERVER_INIT', {'labels': labels, 'collections': collections, 'frames': frames})
    # get_frame_appearances(frame_id=123124)
    # load_collection(7)


def update_search(*, search, **_):
    with db.session_scope() as session:
        query = models.FramesQuery(
            tbegin=search['start_date'], tend=search['end_date'],
            collection_id=search.get('collection_id'))
        ntotal, frames = db.get_frames_subsample(session, query, nframes=50)
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
    print(action)
    s_action = snakeize_dict_keys(action)
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
