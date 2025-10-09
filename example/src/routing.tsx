export const routes = {
    break: '/example/break',
    dropdown: '/example/dropdown',
    grid: '/example/grid',
    gridMore: '/example/gridMore',
    header: '/example/header',
    imageButton: '/example/imageButton',
    imageGrid: '/example/imageGrid',
    input: '/example/input',
    label: '/example/label',
    modal: '/example/modal',
    overlay: '/example/overlay',
    rangeSlider: '/example/rangeSlider',
    tabs: '/example/tabs',
    tabsMore: '/example/tabsMore',
    textButton: '/example/textButton',
    text: '/example/text',
    toggle: '/example/toggle'
}

import BreakPage from './page/BreakPage'
import DropdownPage from './page/DropdownPage'
import GridPage from './page/GridPage'
import GridMorePage from './page/GridMorePage'
import HeaderPage from './page/HeaderPage'
import LabelPage from './page/LabelPage'
import ImageButtonPage from './page/ImageButtonPage'
import ImageGridPage from './page/ImageGridPage'
import InputPage from './page/InputPage'
import ModalPage from './page/ModalPage'
import OverlayPage from './page/OverlayPage'
import RangeSliderPage from './page/RangeSliderPage'
import TabsPage from './page/TabsPage'
import TabsMorePage from './page/TabsMorePage'
import TextButtonPage from './page/TextButtonPage'
import TextPage from './page/TextPage'
import TogglePage from './page/TogglePage'

export const pages = {
    [routes.break]: BreakPage,
    [routes.dropdown]: DropdownPage,
    [routes.grid]: GridPage,
    [routes.gridMore]: GridMorePage,
    [routes.header]: HeaderPage,
    [routes.imageButton]: ImageButtonPage,
    [routes.imageGrid]: ImageGridPage,
    [routes.input]: InputPage,
    [routes.label]: LabelPage,
    [routes.modal]: ModalPage,
    [routes.overlay]: OverlayPage,
    [routes.rangeSlider]: RangeSliderPage,
    [routes.tabs]: TabsPage,
    [routes.tabsMore]: TabsMorePage,
    [routes.textButton]: TextButtonPage,
    [routes.text]: TextPage,
    [routes.toggle]: TogglePage,
}

export default {
    routes,
    pages
}