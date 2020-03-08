from backend.db.utils import to_dict
from backend.db import models
from backend.db import db


def get_frame_appearances(*, frame_id, **_):
    with db.session_scope() as session:
        frame = session.query(models.Frame).get(frame_id)
        apps = frame.appearances
        app_dicts = [to_dict(a, rels=['appearance_labels']) for a in apps]
        frame_dict = to_dict(frame)
    return {'frame': frame_dict, 'appearances': app_dicts}


def change_frame(*, frame_id, collection_id, shift, **_):
    with db.session_scope() as session:
        if shift != 0:
            assert collection_id, 'Collection need to be defined when useing shift.'
            frame_id = db.navigate_frame(session, collection_id, frame_id, shift)
        frame = session.query(models.Frame).get(frame_id)
        apps = frame.appearances
        app_dicts = [to_dict(a, rels=['appearance_labels']) for a in apps]
        frame_dict = to_dict(frame)
    return {'frame': frame_dict, 'appearances': app_dicts}
