# Insect detector

The goal of this sub-project is to write an insect dector that takes an image as input and returns a bounding box for every insect in the image.

## Colab notebook

A colab notebook contains the code to train and evaluate the model. It can be found in the shared gdrive folder `insects/insectdetector`. One version contains additional explanations, the other is for faster working with less explanatory clutter.

## Data location

Since the data cannot be stored in GitLab, it can be found on gdrive under https://drive.google.com/drive/folders/1y2kLKmVjlW9kHQI78P0vhC4fZ7fVLFPr?usp=sharing. The notebooks can connect to this folder.

## Data

We require large amount of positive samples. That means images with insects and an associated bounding box. We can try to find as many as possible for free, but might have to resort to some bounding box tagging nevertheless.

See under [dataprepration/](datapreparation/) for more details.

The final version of the different prepared datasets can be found under [dataprepared/](dataprepared/).

## Training

Training is done with a Colab notebook on the complete trainset (aka 18360 train and 4590 test images, all from the coift, stonefly9, and IP120 datasets):

- Version with instructions: https://colab.research.google.com/drive/1n0HssTLwVXVq1saFMZC5YeciQXxgmInI
- Slim version: https://colab.research.google.com/drive/1vq2p71N3RiM18lEEYBFmJ3mVrUZRa_We

To use any of these notebooks, you will have to add https://drive.google.com/open?id=1y2kLKmVjlW9kHQI78P0vhC4fZ7fVLFPr to your gdrive and follow the instructions.

## Validation

Using Tiny YOLO (aka a slimmed down, very fast version of the network), we achieve the best evaluation results on our validation set at 4.000 batch iterations, afterwards they seem to fluctuate lightly. The perfect number of batch iterations depends on target metric. The weights of the presumably bet model can be found as [models/insects_yolov3-tiny_final_fulldataset.weights](models/insects_yolov3-tiny_final_fulldataset.weights) under [models/](models/).

```
tiny yolo, full training data, batch iteration 4000

for thresh = 0.25, precision = 0.93, recall = 0.80, F1-score = 0.86 for thresh = 0.25, TP = 3597, FP = 278, FN = 890, average IoU = 69.85 %
IoU threshold = 50 %, used Area-Under-Curve for each unique Recall mean average precision (mAP@0.50) = 0.914455, or 91.45 %
```

Using the Full Yolo network, the results are better than for tiny yolo and seem to have reached their peak around 5.000 to 6.000 iterations. The weights of the presumably best model is kept on gdrive due to its size and can be accessed [here](https://drive.google.com/open?id=1weblXETOhB6EoC8ruKRYH0g9sL2h_0a)

```
full yolo, full training data, batch iteration 6000

for thresh = 0.25, precision = 0.94, recall = 0.93, F1-score = 0.93 for thresh = 0.25, TP = 4153, FP = 282, FN = 334, average IoU = 74.00 %
IoU threshold = 50 %, used Area-Under-Curve for each unique Recall mean average precision (mAP@0.50) = 0.946355, or 94.64 %
```

## Evaluation

Evaluate using the images captured from the terrarium.

## Idea

- Using the YoLo net might work. Use Oskar's tushiseeder notes as base.
- Tensorflow / Google also offer a network: https://github.com/tensorflow/models/tree/master/research/object_detection

## Notebooks

We also keep the notebooks for training and applying the model here in the repository - [notebooks](notebooks/)
