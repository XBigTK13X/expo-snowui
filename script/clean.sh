#! /bin/bash

rm -f yarn.lock
rm -rf node_modules
rm -rf lib

cd example
rm -f yarn.lock
rm -rf node_modules
rm -rf .expo

cd android
rm -rf .gradle
rm -rf build

cd ../..

# 1. Install dependencies at the workspace root ONLY
npx yarn install

# 2. Compile the TypeScript library code
npx yarn prepare

# 3. Prebuild inside the example app
cd example
npx expo prebuild --clean
cd ..