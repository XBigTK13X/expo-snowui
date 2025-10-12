# Contexts

## FocusContext

Mainly used for TV. Show what element on the screen will be the target for interaction.

Has a web implementation mainly to ease debugging and development.

## NavigationContext

Handle page rendering and arguments available to pages.

Allow a page to request the load of a different page via linking.

Handles refresh and back in the browser.

## StyleContext

Component colors and sizes

## LayerContext

Allow a component deep in the component tree to request the rendering of a fullscreen modal or overlay.

## InputContext

This handles things like a web browser's back history action.

TV remote button presses.

Android home and back.

SnowInput is a similarly named, but completely separate thing that manages text inputs inside the app.

This context deals with external inputs that React isn't directly wired to handle.