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

def test():
    model = models.Frame
    id = 123124
    with db.session_scope() as session:
        obj = session.query(model).get(int(id))
        rels = ['appearances']
        return to_dict(obj, rels=rels)


def test_add():
    collection_id = 32
    frame_ids = [123124]
    with db.session_scope() as session:
        collection = session.query(models.Collection).get(collection_id)
        for frame_id in frame_ids:
            frame = session.query(models.Frame).get(frame_id)
            collection.frames.append(frame)
        session.flush()
