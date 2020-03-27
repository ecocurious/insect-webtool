from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
import json
from methods import search, appearance, collection, creator, frame, init, search
from utils import (
    snakeize_dict_keys, camelize_dict_keys, Better_JSON_ENCODER, BetterJsonWrapper)


app = Flask(__name__)
app.json_encoder = Better_JSON_ENCODER
socketio = SocketIO(json=BetterJsonWrapper)
socketio.init_app(app, cors_allowed_origins="*")


def emit_one(action_name, payload):
    payload = camelize_dict_keys(payload)
    emit('action', {"type": action_name, **payload})


@socketio.on('connect')
def handle_connection():
    data = init.init()
    emit_one('SERVER_INIT', data)
    data = frame.get_frame_appearances(frame_id=96339)
    emit_one('APPEARANCES_FLUSH', data)


@app.route('/dataset/<collection_id>')
def get_dataset(collection_id):
    appearance_needed = request.args.get('with_appearances_only', 'false') == 'true'
    data = collection.download_collection(
        collection_id=int(collection_id), appearance_needed=appearance_needed)
    return jsonify(data)


@app.route('/label_appearances/', methods=['POST'])
def put_label_appearances():
    req = request.get_json(silent=True)
    appearance.insert_label_appearances(req['label_appearances'], req['creator_id'])
    return json.dumps({"success": True}, cls=Better_JSON_ENCODER)


@socketio.on('action')
def handle_actions(action):
    if action['type'] == 'LIVEIMAGE_PUSH':
        emit('action', {"type": 'LIVEIMAGE_NEW', "liveImage": action['liveImage']}, broadcast=True)
    else:
        s_action = snakeize_dict_keys(action)
        if action['type'] == "SEARCH_UPDATE":
            data = search.update_search(**s_action)
            emit_one('SEARCH_UPDATED', data)
        if action['type'] == 'ACTIVE_COLLECTION_SET':
            data = search.set_active_collection(**s_action)
            emit_one('SEARCH_UPDATED', data)

        if action['type'] == "COLLECTION_ADD":
            data = collection.add_collection(**s_action)
            emit_one('COLLECTION_ADDED', data)
        if action['type'] == "COLLECTION_DELETE":
            data = collection.delete_collection(**s_action)
            emit_one('COLLECTION_DELETED', data)
        if action['type'] == "COLLECTION_ADD_FRAMES":
            data = collection.collection_add_frames(**s_action)
            emit_one('COLLECTION_FRAMES_UPDATED', data)
        if action['type'] == "COLLECTION_REMOVE_FRAMES":
            data = collection.collection_remove_frames(**s_action)
            emit_one('COLLECTION_FRAMES_UPDATED', data)

        if action['type'] == "FRAME_CHANGE":
            data = frame.change_frame(**s_action)
            emit_one('APPEARANCES_FLUSH', data)

        if action['type'] == "BOX_UPDATE":
            data = appearance.update_box(**s_action)
            emit_one('BOX_UPDATED', data)
        if action['type'] == "APPEARANCE_LABEL_DELETE":
            data = appearance.delete_appearance_label(**s_action)
            emit_one('APPEARANCE_LABEL_DELETED', data)
        if action['type'] == "APPEARANCE_LABEL_ADD":
            data = appearance.add_appearance_label(**s_action)
            emit_one('APPEARANCE_LABEL_ADDED', data)
        if action['type'] == "APPEARANCE_ADD":
            data = appearance.add_appearance(**s_action)
            emit_one('APPEARANCE_ADDED', data)
        if action['type'] == "APPEARANCE_DELETE":
            data = appearance.delete_appearance(**s_action)
            emit_one('APPEARANCES_FLUSH', data)

        if action['type'] == "CREATOR_ADD":
            data = creator.add_creator(**s_action)
            emit_one('CREATOR_ADDED', data)


def debug():
    socketio.run(app, host='0.0.0.0', debug=True, port=5000)
