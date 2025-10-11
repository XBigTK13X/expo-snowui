import Snow from 'expo-snowui';
import { routes, pages } from './routing'

function AppPage() {
  const { CurrentPage, navPush } = Snow.useSnowContext()

  let components = [
    ['Break', routes.break],
    ['Dropdown', routes.dropdown],
    ['Grid', routes.grid],
    ['Grid More', routes.gridMore],
    ['Header', routes.header],
    ['ImageButton', routes.imageButton],
    ['ImageGrid', routes.imageGrid],
    ['Input', routes.input],
    ['Label', routes.label],
    ['Modal', routes.modal],
    ['Overlay', routes.overlay],
    ['Range Slider', routes.rangeSlider],
    ['Tabs', routes.tabs],
    ['TabsMore', routes.tabsMore],
    ['TextButton', routes.textButton],
    ['Text', routes.text],
    ['Toggle', routes.toggle]
  ]

  return (
    <Snow.View style={{ flexDirection: 'row', flex: 1 }}>
      <Snow.View style={{ width: "25%" }}>
        <Snow.TextButton focusKey="test-higher-focus" focusDown="component-picker" title="Focus Test" />
        <Snow.Label>Components</Snow.Label>
        <Snow.Grid
          focusStart
          focusKey={"component-picker"}
          focusRight={`tab-entry`}
          itemsPerRow={1}
          items={components}
          renderItem={(item: any) => {
            return <Snow.TextButton title={item[0]} onPress={navPush(item[1], true)} />
          }} />
        <Snow.Label>App Level entities</Snow.Label>
        <Snow.Text>App, FillView, SafeArea, useSnowContext.</Snow.Text>
      </Snow.View>
      <Snow.Break style={{ width: "5%" }} vertical />
      <Snow.View style={{ width: "70%" }}>
        <CurrentPage />
      </Snow.View>
    </Snow.View>
  )
}

const styleOverrides = {
  color: {
    hover: 'rgba(44, 219, 175, 1)',
    hoverDark: 'rgba(23, 116, 92, 1)',
    core: 'rgba(91, 34, 184, 1)',
    coreDark: 'rgba(62, 32, 110, 1)',
  }
}

export default function App() {
  return (
    <Snow.App
      DEBUG_FOCUS={true}
      DEBUG_NAVIGATION={true}
      snowStyle={styleOverrides}
      routePaths={routes}
      routePages={pages}
      initialRoutePath={routes.break}
    >
      <AppPage />
    </Snow.App>
  );
}

