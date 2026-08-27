#! /bin/bash


cd example
npx expo-modules-autolinking resolve -p android | grep simple
cd ..