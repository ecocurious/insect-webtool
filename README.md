## 2019-10-10

motion project
https://motion-project.github.io/

Auflösung der cam:
https://picamera.readthedocs.io/en/release-1.12/fov.html

Als user `motion` die sqlite3 database erzeugen und tabelle anlegen

```
CREATE TABLE security (camera int, filename char(80) not null, frame int, file_type int, time_stamp timestamp without time zone, event_time_stamp timestamp without time zone);
```

Zu motion:

- Motion hat das konzept von einem "(motion) event".
- Ein event kann mehrere frames beinhalten
- Wenn eine weitere motion innerhalb von `event_gap` sekunden erkannt wird, werden die frames zu dem gleichen event gezählt.
- Events werden in der Datenbank über `event_time_stamp` identifiziert.
- Mit `post_capture` kann man die anzahl der frames nach einer bewegung einstellen. wahrscheinlich wichtig für uns wegen motion blur
- Wichtig `threshold` ist wahrscheinlich zu groß um bewegung auf einer kleinen bildflaeche zu erkennen

bei gleicher belichtung - maessiges zimmerlicht, nachmittags

```
3280x2464 -> ungefaehr 1fps
1920x1080 -> 3fps
```

Google Drive Folder für Daten
https://drive.google.com/drive/folders/1CwqrDiGBhyMPjHcpFzJEgv0bM2oV608s?usp=sharing

`rclone` auf raspi pi konfiguriert.

Gelernt wie man cron jobs in systemd konfiguriert:

`/home/pi/.local/share/systemd/user/foobar.service`:

```
[Unit]
Description = some quux

[Service]
Type = oneshot
ExecStart = /home/pi/insects/bin/bla.sh
StandardOutput = journal

[Install]
WantedBy = default.target
```

`/home/pi/.local/share/systemd/user/foobar.timer`:

```
[Timer]
OnCalendar=*-*-* *:*:*

[Install]
WantedBy=default.target
```

## OpenCV on raspberry

Install libaries

sudo apt-get install libatlas-base-dev
sudo apt-get install libjasper-dev
sudo apt-get install libqtgui4
sudo apt-get install python3-pyqt5
sudo apt-get install libqt4-test
sudo apt-get install libilmbase-dev libopenexr-dev libgstreamer1.0-dev

## 2019-10-18

Reconfigure wifi:

1. edit `/etc/wpa_supplicant/wpa_supplicant.conf`
2. Reload with `wpa_cli -i wlan0 reconfigure`. (`systemctl netorking` doesnt seem to work)

You can also copy to `/boot/wpa_supplicant.conf` and restart if you have access to SD card.

76cm Breite, 42cm bei 61cm Abstand

Länge: 80cm-100cm
Breite: 80cm
Höhe: 50cm

open source ecology germany

-> 100x60x60

Get live picture via:

```
python3 ./tools/lastpic.py http://195.201.97.57:5000/ /media/usb/cam1/frames.db
```

# Mount Server

## Unmount

diskutil unmount force /Users/levin/volumens/eco1

## Mount

sshfs -o IdentityFile=~/.ssh/id_eco_tunnel tunneldigger@195.201.97.57: /Users/levin/volumens/eco1

# how to sync

gsutil copy -r /media/usb/cam1/frames gs://eco1/cam1/frames

# Django Backend

## Setup Database

python manage.py migrate

## Load test data

python manage.py test

## Start server

python ./manage.py runserver

## Export Schema

./manage.py graphql_schema --out frontend/schema.json

## Example Query

query {
allFrames(url: "test1") {
edges {
node {
id,
url
}
}
}
}

query {
allCollections {
edges {
node {
frames {
edges {
node {
id
url
}
}
}
}
}
}
}

# Verbleibende Workpackages

- Data Browser
  - Daten-Modell
  - React View - Browsing
  - React View - Browsing verkabeln (Backend schreiben)
  - React View - Warenkorb
  - React View - Warenkorb verkabeln (Backend schreiben)
- Annotation / Model Vizualazier
  - React View
  - React View verkabeln
- Live View
- Dataset-View
  - verkabeln
- Daten labelling
  - Micrsoft- React component einbauen
  - verkabeln
- Data Scientist Toolkit
  - Backend für read/write
  - Python Library schreiben
- Graph View von labelling über Zeit
  - view
  - verkabeln (backend schreiben)

```graphql
Query Bla {
    frames(begin: DateTime!, end: DateTime!, nSample: Int) {
        id
        timestamp
        url
        thumbnailUrl
    }

    collections() {
    }

    collection(collectionId: String) {
        frames(begin: DateTime!, end: DateTime!) {
            labels: {
                processId
            }
        },
        labelProcesses : {
            id
            name
            dateCreated
        }

    }


}
```

# 2020-01-15

heimchen: acheta domesticus

Wed Jan 15 11:09:11 CET 2020
wanderheuschrecken (locasta migratoria)

Wed Jan 15 12:32:08 CET 2020
wuestenheuschrecken (schistocerca gregaria)

To start an ipython shell inside the django project:

```
APPENV=prod python3 manage.py shell
```

get a equidistant subsample

```graphql
{
  frames(
    tbegin: "2019-11-01T00:00:00"
    tend: "2019-11-14T00:00:00"
    nframes: 10
  ) {
    id
    url
    timestamp
    thumbnail
  }
}
```

get a continuous page

```graphql
{
  frames(
    tbegin: "2019-11-01T00:00:00"
    tend: "2019-11-15T00:00:00"
    after: "RnJhbWU6Nzk5NzU="
    nframes: 10
  ) {
    id
    url
    timestamp
    thumbnail
  }
}
```

stack of: [b, e]
set from outside: clear stack
zoom in button: - if zoomable (select and domain not equal): - add domain to stack - set domain to [b, e] & selection to [b, e]
zoom out button: - if stack not empty: - pop domain of stack - (adapt domain and selction so that selection is conatined in domain) - if stack is empty: - widen domain by x% in both directions

https://codesandbox.io/s/rw97j317p
https://observablehq.com/@d3/d3-scaletime
https://observablehq.com/@d3/scale-ticks

2019-11-15 Heimchen
2020-01-15 Wanderheuschrecken
2020-01-16 Wuestenheuschrecken

# 2020-02-15

# Data Browser

## right side bar (toggleable): datasets

- bottom: create new data set (empty)
- delete dataset / rename dataset
- download link
- "all" oder collection auswählen -> bestimmt kontext in dem man sucht

## search

- continuous / subsample view
- tag filter

## search results

- zoom by ratio
- evenly spaced
- show results in view
- add to collection -> to which one?, subsample / continuous?

# Frame

- multiple labels
- a label has a "level" in the taxonomy (species, family, etc.)
- bounding boxes editable
- prev / next buttons only when context is collection

# User oben rechts

# Usability

## Browser

- show samples on slider (done)
- continuous view with slider
  - within collection as well as general
  - paginagion (in some way)
- browser ui: better describtion of what is shown
- browser ui: move add frame to the left
- browser ui: slim range selection
- pop up: xy frames have been added to collection xy

- add to collection: ensure only each frame ones in samples
- collection: show number of frames in collection
- add frames: add all button
- adjust slider on collection change
- add frames: calculate support

## Annotation

- resize boxes
- select onClick
- no list of all appearances, just all labels of current appearance
- change multiselect into more slim verison / remove

# How to deploy app

$ ssh eco1
$ tmux attach

build frontend:
$ cd frontend
$ yarn install && APP_HOST=http://195.201.97.57:5000 yarn build && cp dist/* /var/www

run backend:
$ nix-shell --command "./start_backend.py"

app runs at
http://195.201.97.57/
