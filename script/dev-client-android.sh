#! /bin/bash

cd example
export EXPO_TV=0
if [ ! -z "$1" ]; then
    EXPO_NO_GIT_STATUS=1 EXPO_TV=0 npx expo prebuild --clean
fi
npx expo run:android
cd ..