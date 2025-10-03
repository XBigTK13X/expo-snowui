#! /bin/bash

cd example
export EXPO_TV=1
npx expo run:android
npx expo start --dev-client
cd ..