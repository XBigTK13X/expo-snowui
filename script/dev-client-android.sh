#! /bin/bash

cd example
export EXPO_TV=0
if [ ! -z "$1" ]; then
    npx expo run:android
fi
npx expo start --dev-client
cd ..