#! /bin/bash

rm yarn.lock
rm -rf node_modules
rm -rf lib

cd example
rm yarn.lock
rm -rf node_modules
rm -rf .expo

cd android
rm -rf .gradle
rm -rf build

cd ../..

npx yarn install
cd example
npx yarn install
cd ..