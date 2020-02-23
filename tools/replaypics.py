import sys
import base64
import sqlite3
import socketio
import time
import threading
import psycopg2
import os
import time
from datetime import datetime, timedelta
import requests


def read_file(filename):
    with open(filename, "rb") as image_file:
        base64_bytes = base64.b64encode(image_file.read())
    return base64_bytes.decode('utf-8')


def poll_frame(cfg, state):
    cursor = state.conn.cursor()
    while True:
        # sql = "select '/home/stefan/repos/insects/backend/dummy/simon.jpg'"
        try:
            sql = 'select filename from security order by time_stamp desc limit 1'
            cursor.execute(sql)
            f = cursor.fetchone()[0]
            if f != state.file:
                cursor.close()
                return f
            time.sleep(cfg.poll_sleep_secs)
        except Exception as e:
            print('There was an exception: {}'.format(e))


def wait_next_frame(cfg, state):
    f = poll_frame(cfg, state)
    state.file = f


def gen_callback(server_received_image):
    def f():
        with server_received_image:
            server_received_image.notify()
    return f


# def main(cfg):
#     sio = socketio.Client()
#     sio.connect(cfg.host_url)

#     conn = sqlite3.connect(cfg.dbfilename)
#     state = State(conn)

#     server_received_image = threading.Condition()

#     while True:
#         wait_next_frame(cfg, state)

#         print('Found new picture!')
#         base64_string = read_file(state.file)

#         with server_received_image:
#             sio.emit('action', {"type": 'LIVEIMAGE_PUSH', "liveImage": base64_string}, callback=gen_callback(server_received_image))
#             server_received_image.wait()
#         print('Image pushed to server')


def fetch_frames(tbegin, n):
    conn = psycopg2.connect(os.environ['ECODB'])
    cursor = conn.cursor()
    q = '''
    select "timestamp", url
    from eco.frames
    where "timestamp" > %s
    order by "timestamp" asc
    limit %s
    '''
    cursor.execute(q, (tbegin, n))
    return cursor.fetchall()


def clamp(x, xmin, xmax):
    return min(max(x, xmin), xmax)


def sleep_until(t):
    now = datetime.now()
    delta = t - now
    secs = delta.total_seconds()
    if secs > 0:
        time.sleep(secs)
    else:
        print('not sleeping')


def get_frame(i, frames, t_last):
    if i + 1 == len(frames):
        time.sleep(1)
        return 0
    else:
        this_frame = frames[i]
        next_frame = frames[i + 1]
        delta_secs = (next_frame[0] - this_frame[0]).total_seconds()
        wait_secs = clamp(delta_secs, 1.0, 3.0)
        # wait_secs = clamp(delta_secs, 0.00, 0.2)
        sleep_until(t_last + timedelta(seconds=wait_secs))
        return i + 1


def main():
    tbegin = datetime(2020, 1, 15, 15, 0, 0)
    # tbegin = datetime(2020, 1, 15, 11, 0, 0)
    frames = fetch_frames(tbegin, 200)
    i = 0

    server_received_image = threading.Condition()

    sio = socketio.Client()
    sio.connect('http://0.0.0.0:5000')

    t_last = datetime.now()
    while True:
        i = get_frame(i, frames, t_last)
        t_last = datetime.now()
        _, url = frames[i]

        print(url)
        r = requests.get(url)
        # r.raw.decode_content = True
        base64_string = base64.b64encode(r.content)

        with server_received_image:
            sio.emit('action', {"type": 'LIVEIMAGE_PUSH', "liveImage": base64_string}, callback=gen_callback(server_received_image))
            server_received_image.wait()




usage = '''
Usage: ./lastpic URL DBFILE
'''

if __name__ == '__main__':
    # if len(sys.argv) != 3:
    #     print(usage)
    #     sys.exit(1)
    # cfg = Config(sys.argv[1], sys.argv[2])
    # main(cfg)

    main()
