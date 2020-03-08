from backend.db.utils import to_dict
from backend.db import models
from backend.db import db


def insert_label_appearances(*, label_appearances, creator_id):
    with db.session_scope() as session:
        creator = session.query(models.Creator).get(creator_id)
        for la in label_appearances:
            frame = session.query(models.Frame).get(la['frame_id'])
            label = session.query(models.Label).get(la['label_id'])

            app = models.Appearance(
                frame=frame, creator=creator, bbox_xmax=la['bbox_xmax'],
                bbox_xmin=la['bbox_xmin'], bbox_ymax=la['bbox_ymax'],
                bbox_ymin=la['bbox_ymin'])
            session.add(app)
            appLabel = models.AppearanceLabel(creator=creator, appearance=app, label=label)
            session.add(appLabel)
            session.commit()


def update_box(*, appearance_id, box, **_):
    with db.session_scope() as session:
        app = session.query(models.Appearance).get(appearance_id)
        for k, v in box.items():
            setattr(app, k, v)
        session.commit()
        app_dict = to_dict(app)
    return {'appearance': app_dict}


def delete_appearance_label(*, appearance_label_id, **_):
    with db.session_scope() as session:
        applabel = session.query(models.AppearanceLabel).get(appearance_label_id)
        app = applabel.appearance
        session.delete(applabel)
        session.commit()
        app_dicts = to_dict(app, rels=['appearance_labels'])
    return {'appearance': app_dicts}


def add_appearance_label(*, appearance_id, label_id, creator_id, **_):
    with db.session_scope() as session:
        creator = session.query(models.Creator).get(creator_id)
        label = session.query(models.Label).get(label_id)
        appearance = session.query(models.Appearance).get(appearance_id)
        app_label = models.AppearanceLabel(creator=creator, appearance=appearance, label=label)
        session.add(app_label)
        session.commit()
        app_dict = to_dict(appearance, rels=['appearance_labels'])
    return {'appearance': app_dict}


def delete_appearance(*, appearance_id, **_):
    with db.session_scope() as session:
        app = session.query(models.Appearance).get(appearance_id)
        frame = app.frame
        session.delete(app)
        session.commit()
        app_dicts = [to_dict(a, rels=['appearance_labels']) for a in frame.appearances]
        frame_dict = to_dict(frame)
    return {'frame': frame_dict, 'appearances': app_dicts}


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
    return {'appearance': app_dict}
