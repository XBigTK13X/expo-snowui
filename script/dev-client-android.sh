#! /bin/bash

cd example
export EXPO_TV=0
npx expo run:android
npx expo start --dev-client
cd ..