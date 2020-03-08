from backend.db.utils import to_dict
from backend.db import models
from backend.db import db


def add_creator(*, name, **_):
    with db.session_scope() as session:
        creator = models.Creator(name=name)
        session.add(creator)
        session.commit()
        creator_dict = to_dict(creator)
    return {'creator': creator_dict}
