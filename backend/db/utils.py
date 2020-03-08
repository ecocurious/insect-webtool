from sqlalchemy.ext.declarative import DeclarativeMeta
from . import db


def to_dict(obj, rels=[], backref=None):
    '''
    Turn sqlalchemy models to dicts. Nested relationships listed in `rels` are turned to dicts too,
    otherwise they are missing. Hacky, barely tested.

    From https://mmas.github.io/sqlalchemy-serialize-json
    '''
    relationship_keys = obj.__mapper__.relationships.keys()

    res = {}
    for key in dir(obj):
        if key.startswith('_') or key in ['metadata']:
            continue
        else:
            # if key == '


            if key in relationship_keys:
                continue
            else:
                # TODO: Test if key is at path
                res[key] = getattr(obj, key)

    # res = {column.key: getattr(obj, attr)
    #        for attr, column in obj.__mapper__.c.items()}

    if len(rels) > 0:
        items = obj.__mapper__.relationships.items()

        for attr, relation in obj.__mapper__.relationships.items():
            if attr not in rels:
                continue

            if hasattr(relation, 'table'):
                if backref == relation.table:
                    continue

            value = getattr(obj, attr)
            if value is None:
                res[relation.key] = None
            elif isinstance(value.__class__, DeclarativeMeta):
                res[relation.key] = to_dict(value, backref=obj.__table__, rels=rels)
            else:
                res[relation.key] = [to_dict(i, backref=obj.__table__, rels=rels)
                                     for i in value]
    return res


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
