from backend.db.utils import _get_all
from backend.db import models


def init():
    labels = _get_all(models.Label)
    collections = _get_all(models.Collection)
    creators = _get_all(models.Creator)
    return {'labels': labels, 'collections': collections, 'creators': creators}
