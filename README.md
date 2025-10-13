# expo-snowui

GUI components and contexts shared by the snowsuite apps

## Installation


```sh
npm install expo-snowui
```

Note that your app needs to use `react-native-tvos` as a dep, not `react-native`.

Also `expo-secure-store` needs to be installed and listed as an expo plugin.


## Usage
See the example app for how the components work.

At a high level, there are a bunch of components that are purely UI.

Then there are wired components. These tie into an app-wide focus system.

A SnowApp automatically provides the various contexts used to support common app functionality, like modal navigation.

Counter to the common style of focus management, all focus in snowui is manually wired up.

No guessing about component directions, no accidentally selecting boxes of text on Android.

The contexts manage things like hardware buttons on Android, selecting items on TV, and moving between pages.

Lastly there are random helper functions in `util` that I find useful in multiple apps.