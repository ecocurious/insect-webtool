## Insect Counter Webtool

This project contains the source code for the `Insect Counter Webtool`. There are four main components.

1. We created suite of [tools](tools/) to regularly capture images with a raspberry pi.
2. We created a webtool to collect, organise and annotate recorded images ([backend](backend/), [frontend](frontend/)).
3. This webtool and platform connects to any python environment with a ([client](client/) libary.
4. We trained and evaluated a neural network to detect and count insects in images [detector](detector/README.md).
