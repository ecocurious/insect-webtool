import datetime
import re
import math
import os
import json
import datetime
import psycopg2
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from contextlib import contextmanager
from psycopg2.extras import execute_values
from sqlalchemy.ext.hybrid import hybrid_property, hybrid_method
import logging
from collections import namedtuple

from . import models
from . models import Base, FramesQuery
from . utils import to_dict

ECODB = os.environ['ECODB']
# engine = create_engine(ECODB, echo=True)
engine = create_engine(ECODB, echo=False)
# session class
Session = sessionmaker(bind=engine)


def load_json(file):
    with open(file, 'r') as f:
        return json.load(f)


@contextmanager
def session_scope():
    """Provide a transactional scope around a series of operations."""
    session = Session()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def get_cursor(session):
    return session.connection().connection.cursor()


def repop_model(filename, model):
    objs = load_json(filename)
    with session_scope() as session:
        session.query(model).delete()
        for o in objs:
            session.add(model(**o))


def manage_recreate():
    del_models = [
        models.Label,
        models.AppearanceLabel,
        models.Creator,
        models.Collection
    ]
    with session_scope() as session:
        try:
            for model in del_models:
                session.query(model).delete()
        except:
            pass
    manage_create_all()
    manage_repop()


def manage_create_all():
    Base.metadata.create_all(engine)


def manage_repop():
    repop_model('backend/data/labels.json', models.Label)
    repop_model('backend/data/creators.json', models.Creator)


SqlExpr = namedtuple('SqlExpr', ['from_expr', 'where_clauses'])


def sql_expr(frames_query):
    if frames_query.collection_id is not None:
        from_expr = '''
        eco.frames f
        inner join eco.collection_frame cf
            on cf.frame_id = f.id
            and cf.collection_id = %(collection_id)s
        '''
    else:
        from_expr = '''
        eco.frames f
        '''

    if frames_query.tbegin is not None and frames_query.tend is not None:
        where_clauses = [
            '%(tbegin)s <= "timestamp"',
            '"timestamp" < %(tend)s'
        ]
    else:
        where_clauses = []
    return SqlExpr(from_expr, where_clauses)


def sqlify_where(where_clauses):
    if len(where_clauses) == 0:
        return ''
    else:
        s = ' and '.join(f'({wc})' for wc in where_clauses)
        return f'where {s}'


def sqlify_sql_expr(sql_expr):
    where_sql = sqlify_where(sql_expr.where_clauses)
    s = f'{sql_expr.from_expr} {where_sql}'
    return s


def frames_query_dict(frames_query):
    '''
    Arguments for the query returned by sqlify_sql_expr()
    '''
    d = {}
    if frames_query.tbegin is not None:
        d['tbegin'] = frames_query.tbegin

    if frames_query.tend is not None:
        d['tend'] = frames_query.tend

    if frames_query.collection_id is not None:
        d['collection_id'] = frames_query.collection_id

    return d


def fetch_frame_ids_continuous(session, frames_query, after_id=None, n_frames=None):
    cursor = get_cursor(session)

    limit_expr = 'limit %(n_frames)s' if n_frames is not None else ''

    d = frames_query_dict(frames_query)
    if n_frames is not None:
        d['n_frames'] = n_frames

    if after_id is None:
        q_unpaged = f'''
        select
            f.id
        from
        {sqlify_sql_expr(sql_expr(frames_query))}
        order by f."timestamp" asc
        {limit_expr}
        '''
        cursor.execute(q_unpaged, d)
    else:
        expr = sql_expr(frames_query)
        if after_id is not None:
                expr = SqlExpr(expr.from_expr,
                               expr.where_clauses +\
                               ['f."timestamp" > (select "timestamp" from eco.frames ff where ff.id = %(after_id)s limit 1)'])

                d['after_id'] = after_id
        q_paged = f'''
        select
            f.id
        from
        {sqlify_sql_expr(expr)}
        order by f."timestamp" asc
        {limit_expr}
        '''
        cursor.execute(q_paged, d)

    rows = cursor.fetchall()
    ids_ = [r[0] for r in rows]
    return ids_


def fetch_frame_ids_subsample(session, frames_query, nframes):

    '''
    Args:
        frames_query (FramesQuery):
    '''

    q = f'''
    with

    bounds as (
        select
            min(f."timestamp"),
            max(f."timestamp")
        from
        {sqlify_sql_expr(sql_expr(frames_query))}
    ),

    ages as (
        select
            id,
            timestamp,
            extract(epoch from age("timestamp", (select "min" from bounds limit 1))) age
        from
        {sqlify_sql_expr(sql_expr(frames_query))}
        order by "timestamp" asc
    ),

    cmps as (
        select
            id,
            timestamp,
            floor(%(n)s * age / (select max(age) + 00000.1 from ages))::int as n,
            lag(floor(%(n)s * age / (select max(age) + 00000.1 from ages))::int) over () as n_lag
        from
            ages
    )

    select
        *
    from cmps
    where n != n_lag
        or n_lag is null
    order by timestamp asc
    '''
    d = frames_query_dict(frames_query)
    d['n'] = nframes
    cursor = get_cursor(session)
    print(cursor.mogrify(q, d).decode('utf8'))
    cursor.execute(q, d)

    rows = cursor.fetchall()
    ids_ = [r[0] for r in rows]

    q2 = f'''
        select
            count(*)
        from
        {sqlify_sql_expr(sql_expr(frames_query))}
    '''
    cursor.execute(q2, frames_query_dict(frames_query))
    count = cursor.fetchall()[0][0]

    return count, ids_


def fetch_frame_ids(session, frames_query, mode, n_frames=None, after_id=None):
    if mode == 'subsample':
        count, ids_ = fetch_frame_ids_subsample(session, frames_query=frames_query, nframes=n_frames)
    elif mode == 'cont':
        ids_ = fetch_frame_ids_continuous(session, frames_query=frames_query, after_id=after_id, n_frames=n_frames)
        count = len(ids_)
    else:
        return 0, []
    return count, ids_


def get_frames(session, frames_query, mode, n_frames, after_id):
    count, ids = fetch_frame_ids(session, frames_query=frames_query, mode=mode, n_frames=n_frames, after_id=after_id)

    fobs = session.query(models.Frame).filter(models.Frame.id.in_(ids)).all()
    d = {fob.id: fob for fob in fobs}
    frames = [d[id_] for id_ in ids]

    return count, frames


def collection_add_frames_via_query(session, collection_id, frames_query, nframes=None):
    if nframes is None:
        ids_ = fetch_frame_ids_continuous(session, frames_query)
    else:
        _, ids_ = fetch_frame_ids_subsample(session, frames_query, nframes)

    data = [(collection_id, id_) for id_ in ids_]
    q = 'insert into eco.collection_frame (collection_id, frame_id) values %s on conflict do nothing'
    cursor = get_cursor(session)
    execute_values(cursor, q, data, page_size=1000)


def collection_remove_frames_via_query(session, collection_id, frames_query):
    ids_ = fetch_frame_ids_continuous(session, frames_query)
    q = 'delete from eco.collection_frame where collection_id = %s and frame_id in %s'
    cursor = get_cursor(session)
    cursor.execute(q, (collection_id, tuple(ids_)))


def navigate_frame(session, collection_id, frame_id, offset):
    '''
    Look for the frame at the offset of another frame.
    If nothing is at the position return the frame that is closest.

    Returns: frame_id
    '''
    q = '''
    with

    ordered_frames as (
        select
            row_number() over (order by timestamp asc) as pos,
            f.id as frame_id
        from
        collection_frame cf
        left join frames f
            on f.id = cf.frame_id
        where collection_id = %(collection_id)s
    ),

    ranges as (
        select frame_id, 'first'::text as ind from ordered_frames where pos = (select min(pos) from ordered_frames)
        union all
        select frame_id, 'last'::text as ind from ordered_frames where pos = (select max(pos) from ordered_frames)
    ),

    fallback as (
        select
            case
                when (%(offset)s) >= 0 then (select frame_id from ranges where ind = 'last')
                else (select frame_id from ranges where ind = 'first')
            end frame_id
    )

    select
        coalesce(x.frame_id, fallback.frame_id)
    from
        (
            select
                frame_id
            from
                ordered_frames orf
            where
                orf.pos = (select pos from ordered_frames where frame_id = %(frame_id)s limit 1) + (%(offset)s)
        ) x
        full outer join fallback on 1=1
    '''
    cursor = get_cursor(session)
    cursor.execute(q, {'collection_id': collection_id, 'frame_id': frame_id, 'offset': offset})
    row = cursor.fetchone()
    return row[0]


def collection_add_frames(session, collection_id, frame_ids):
    data = [(collection_id, frame_id) for frame_id in frame_ids]
    cursor = get_cursor(session)
    q = 'insert into eco.collection_frame (collection_id, frame_id) values %s on conflict do nothing'
    execute_values(cursor, q, data, page_size=1000)
    return cursor.rowcount


def collection_remove_frames(session, collection_id, frame_ids):
    data = [(collection_id, frame_id) for frame_id in frame_ids]
    cursor = get_cursor(session)
    q = 'delete from eco.collection_frame where (collection_id, frame_id) in (%s)'
    execute_values(cursor, q, data, page_size=1000)
    return cursor.rowcount


def collection_get_bounds(session, collection_id):
    cursor = get_cursor(session)
    q = '''
    select
        min(f.timestamp) as timestamp_min,
        max(f.timestamp) as timestamp_max
    from eco.collection_frame cf
    inner join eco.frames f
        on f.id = cf.frame_id
    where collection_id = %s
    '''
    cursor.execute(q, (collection_id,))
    r = cursor.fetchone()
    return r


def test():
    with session_scope() as session:
        tbegin = datetime.datetime(2019, 11, 1)
        tend = datetime.datetime(2019, 11, 16)
        frames_query = FramesQuery(tbegin, tend, None)

        return fetch_frame_ids(session, frames_query, mode='cont', n_frames=10, after_id=83688)

        # coll = models.Collection(name='foo')
        # session.add(coll)
        # session.flush()

        # # collection_add_frames_via_query(session, coll.id, frames_query, nframes=100)
        # collection_add_frames_via_query(session, coll.id, frames_query)
        # print(f'collection id: {coll.id}')


def test2():
    with session_scope() as session:
        tbegin = datetime.datetime(2019, 11, 1)
        tend = datetime.datetime(2019, 11, 16)
        frames_query = FramesQuery(tbegin, tend, None)
        return frames_query
        collection_remove_frames_via_query(session, 23, frames_query)


def test3():
    with session_scope() as session:
        frames_query = FramesQuery(None, None, 28)
        # pagination = None
        # pagination = Pagination(after_id=78063, pagesize=6)
        # ids = fetch_frame_ids(session, frames_query, pagination)
        # print(f'n={len(ids)}: {ids[:10]}')
        return navigate_frame(session=session, collection_id=28, frame_id=78064, offset=-9)


def test4():
    collection_id = 291
    frame_ids = [95330, 95330]
    with session_scope() as session:
        # return collection_add_frames(session, collection_id=collection_id, frame_ids=frame_ids)
        return collection_get_bounds(session, collection_id=collection_id)
