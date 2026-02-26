# Focus Context

The native level of focus management is error prone and unreliable.
From one release of react-native to another, oftentimes the way focus behaves in Android changes.
This is made even more problematic by adding the additional layer of react-native-tvos providing their own native handlers around focus.

The goal for the expo-snowui focus context is to hoist all of that state management up to the react layer.
That way, there aren't a bunch of round trip timing issues around focus.

## Previous Approach

expo-snowui's founding apps leveraged the TVFocusGuideView from react-native-tvos.
Oftentimes when navigating from say, a FlatList into a different collection of components, focus would seemingly disappear from a user's perspective.
After attempting to leverage a dozen or so approaches, even going so far as patching react-native at build time, nothing worked properly.

react-native-tvos and Android under the hood, attempt to make focus management work out of the box automagically.
Although both systems provides means of manually tweaking the focus, these are often treated more like suggestions versus a hard rule for the focus manager to follow.

## Suggested New Approach

Instead of relying on error prone automagically managed focus, expo-snowui will provide a context to manually specify focus intentions.

This requires a bit of upfront work when developing a page, but intends to make the focus much easier to reason about, troubleshoot, and define.

## High Level Architecture

focus-context will replace the react-native-tvos view with a registry.

First, when a page renders it will register a set of keys for the components on the page.
Second, the page is responsible for mapping the relative directions of these keys.
Third, the page defines what element should first receive focus.

Fourth, there needs to be a stacking mechanism where a modal can add new focus rules that supercede the page's rules.
A second modal will be able to override the first, and so on. Closing the modals will peel back these layers of focus management.

When a new layer is active, then the previous layers are ignored.
Another example is the range slider. When moving it left and right with a tv remote, the only item that should be focused is the thumb.

## Implementation details

`snow-focus-context`

Needs a way to reset the focus map on a new page load.
A global handler for remote button presses.
The remote handler will be responsible for
  - telling a component that it has focus
  - performing the actions of said component when a user presses or long presses while it is focused
This context will provide methods to components
  - register a focus map
  - clear the focus maps
  - pop a focus map from the stack

`FocusMap`

This is a data class with two parts.
First, a map of string keys to element refs.
Second, a map of string keys to other string keys. This is a shallow tree structure.

Maps will have layers. Adding a single map merges the provided data into the current state of the current top (end of list) layer.
Components can clear all layers, remove the current layer, or add a new layer to the top.

## Pitfalls

1. Need to handle scrolling pages that are larger than the viewport
2. Need to handle virtual lists