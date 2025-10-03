// @ts-nocheck
export { SnowApp } from './snow-app'
import { SnowApp } from './snow-app'

export { useFocusContext } from './context/snow-focus-context'
import { useFocusContext } from './context/snow-focus-context'
export { useStyleContext } from './context/snow-style-context'
import { useStyleContext } from './context/snow-style-context'

export { SnowBreak } from './component/snow-break'
import { SnowBreak } from './component/snow-break'
export { SnowDropdown } from './component/wired/snow-dropdown'
import { SnowDropdown } from './component/wired/snow-dropdown'
export { SnowFillView } from './component/snow-fill-view'
import { SnowFillView } from './component/snow-fill-view'
export { SnowGrid } from './component/wired/snow-grid'
import { SnowGrid } from './component/wired/snow-grid'
export { SnowHeader } from './component/snow-header'
import { SnowHeader } from './component/snow-header'
export { SnowImageButton } from './component/wired/snow-image-button'
import { SnowImageButton } from './component/wired/snow-image-button'
export { SnowImageGrid } from './component/wired/snow-image-grid'
import { SnowImageGrid } from './component/wired/snow-image-grid'
export { SnowInput } from './component/wired/snow-input'
import { SnowInput } from './component/wired/snow-input'
export { SnowLabel } from './component/snow-label'
import { SnowLabel } from './component/snow-label'
export { SnowModal } from './component/wired/snow-modal'
import { SnowModal } from './component/wired/snow-modal'
export { SnowOverlay } from './component/wired/snow-overlay'
import { SnowOverlay } from './component/wired/snow-overlay'
export { SnowRangeSlider } from './component/wired/snow-range-slider'
import { SnowRangeSlider } from './component/wired/snow-range-slider'
export { SnowSafeArea } from './component/snow-safe-area'
import { SnowSafeArea } from './component/snow-safe-area'
export { SnowTabs } from './component/wired/snow-tabs'
import { SnowTabs } from './component/wired/snow-tabs'
export { SnowTextButton } from './component/wired/snow-text-button'
import { SnowTextButton } from './component/wired/snow-text-button'
export { SnowText } from './component/snow-text'
import { SnowText } from './component/snow-text'
export { SnowToggle } from './component/wired/snow-toggle'
import { SnowToggle } from './component/wired/snow-toggle'
export { SnowView } from './component/wired/snow-view'
import { SnowView } from './component/wired/snow-view'

const useFocusLayerFunc = (name: string, uncloned: boolean = false) => {
  return useFocusContext().useFocusLayer(name, uncloned)
}

export const useFocusLayer = useFocusLayerFunc

export default {
  useFocusContext,
  useFocusLayer,
  useStyleContext,
  App: SnowApp,
  Break: SnowBreak,
  Dropdown: SnowDropdown,
  FillView: SnowFillView,
  Grid: SnowGrid,
  Header: SnowHeader,
  ImageButton: SnowImageButton,
  ImageGrid: SnowImageGrid,
  Input: SnowInput,
  Label: SnowLabel,
  Modal: SnowModal,
  Overlay: SnowOverlay,
  RangeSlider: SnowRangeSlider,
  SafeArea: SnowSafeArea,
  Tabs: SnowTabs,
  TextButton: SnowTextButton,
  Text: SnowText,
  Toggle: SnowToggle,
  View: SnowView
}
