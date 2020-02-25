#!/bin/sh

set -ex

cd frontend
yarn install
APP_HOST=http://195.201.97.57:5000 yarn build
yarn build
cp dist/* /var/www
