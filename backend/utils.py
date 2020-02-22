import re
from sqlalchemy.ext.declarative import DeclarativeMeta
import json
import numpy as np


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


def camelize(snake_str):
    components = snake_str.split('_')
    return components[0] + ''.join(x.capitalize() for x in components[1:])


def snakeize(camel_str):
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', camel_str)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()


def transform_dict_keys(d, keyer):
    if isinstance(d, dict):
        nd = {}
        for key, value in d.items():
            transformed_key = keyer(key)
            nd[transformed_key] = transform_dict_keys(value, keyer)
    elif isinstance(d, list):
        nd = [transform_dict_keys(el, keyer) for el in d]
    else:
        nd = d
    return nd


def camelize_dict_keys(d):
    return transform_dict_keys(d, keyer=camelize)


def snakeize_dict_keys(d):
    return transform_dict_keys(d, keyer=snakeize)


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
