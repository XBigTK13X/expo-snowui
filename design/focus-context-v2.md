# v1 Flaws

Elements needing to reference others is quite brittle.
It works well for simples cases but fails quickly with multiple nested containers.
It can also be very slow for a surprisingly small number of elements.

# v2 Goals

For the focus context, keep focus state in the URL.
    - What element should be highlighted?
For the components, keep current progress in the URL.
    - What tab is open?
    - What page of the grid am I on?
Make components less aware of each other
Make the context faster at handling movement between components

# High Level Architecture

Every unique navigation route in the app maps to a single page.
Every page can have 1 to P components at the top level.
Every component can have 0 to C focusable child components.
A parent component only has two responsibilities
    - Scope focus keys for focusable children
    - Manage progress state
A parent is not something that can be focused, i.e. will not be highlighted by TV remote movement
A child without any focusable children can be focused
A child should only ever need to be responsible for knowing whether or not it is focused
The context is responsible for
    - Maintaining a registry of components that are either parents or can be focused
    - Handling requests to move focus in a specified direction
    - Stepping into the first focusable child of a parent when moving into it
    - Stepping into the first focusable child of a neighboring parent when moving out of it
    - Locking focus to one specific parent (for modals)
    - Providing helper methods to ease registration, removal, and handling user interaction such as button presses

Use coordinates instead of directions.
That allows for easier handling of components that were removed while navigating a page.
You don't need to register something else as to the right of a component, just that it is still farther in the given direction.

Keep registry state as a tree instead of a flat map
This way the context can walk the tree to leaf nodes to decide where focus should land.

Making an element have current focus should still scroll the viewport accordingly.

Components will need unique tree style path keys to uniquely handle things like current tab or page of grid.