# Insects Client

The insects client is tiny library which allows simple interaction with the
insects backend out of any python environment.

For examples [detector/notebooks](detector/notebooks).

## Installation

Install the client with pip

```
pip install git+https://github.com/LBrinkmann/insects-client.git#egg=version_subpkg&subdirectory=client
```

## Import and Setup

Set the platform url as environment variable and i
mport the api module form the insetsclient.

```
import os
os.environ['INSECTS_PLATFORM_URL'] = 'http://195.201.97.57:5000'
from insectsclient import api
```

## Usage

### For training

Get all frame urls and all labels from a collection

```
labels, frame_urls = api.import_collection(36, '/content/data', with_appearances_only=False)
```

create train and test dataset in darknet format

```
data = api.create_train_obj(
    labels, frame_urls, train_fraction=0.8,
    data_dir='/content/meta', temp_dir='/content/temp')
```

### For applying the model

Download the images

```
from insectsclient import api

_, frame_paths = api.import_collection(45, '/content/data', with_appearances_only=False)
data = api.create_file_list(frame_paths, '/content/data/coll.txt')
```

currently one need to manual define all possible labels of the model

```
from insectsclient import darknet
d = {
    "classes": 1,
    "names": '/content/meta2/obj.names'
}
!mkdir '/content/meta2/'

labels = [{'scientificName':'acheta domesticus', 'id': 13}]

DATA = darknet.create_data(d, '/content/meta2/')
darknet.create_names(labels, '/content/meta2/')
```
