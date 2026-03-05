import pkg from "../package.json";
import Snow from 'expo-snowui';
import { routes, pages } from './routing'

function AppPage() {
  const { CurrentPage, navPush, currentRoute } = Snow.useSnowContext()

  const renderKey = Snow.stringifySafe(currentRoute.routeParams)

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
    <Snow.View focusKey="app" style={{ flexDirection: 'row', flex: 1 }}>
      <Snow.View focusKey="nav" xx={0} yy={0} style={{ width: "25%" }}>
        <Snow.TextButton
          yy={0}
          title="Focus Test"
        />
        <Snow.Label center>Components</Snow.Label>
        <Snow.Grid
          focusStart
          yy={1}
          itemsPerRow={2}
          items={components}
          renderItem={(item: any) => {
            return <Snow.TextButton title={item[0]} onPress={navPush({ path: item[1] })} />
          }} />
        <Snow.Label center>App Level entities</Snow.Label>
        <Snow.Text center>App, FillView, SafeArea, useSnowContext.</Snow.Text>
      </Snow.View>
      <Snow.Break style={{ width: "5%" }} vertical />
      <Snow.View focusKey="page" xx={1} yy={0} style={{ width: "70%" }}>
        <CurrentPage key={renderKey} />
      </Snow.View>
    </Snow.View>
  )
}

export const styleOverrides = {
  color: {
    hover: 'rgba(44, 219, 175, 1)',
    hoverDark: 'rgba(23, 116, 92, 1)',
    core: 'rgba(91, 34, 184, 1)',
    coreDark: 'rgba(62, 32, 110, 1)',
  }
}

const SnowApp = Snow.createSnowApp({
  enableSentry: true,
  sentryUrl: "https://0ffd8d6684624aa69608f167ff478bdc@bugsink.9914.us/4",
  appName: 'snowui-example',
  appVersion: pkg.version
})

export default function App() {
  return (
    <SnowApp
      DEBUG_SNOW={false}
      ENABLE_FOCUS={true}
      snowStyle={styleOverrides}
      routePaths={routes}
      routePages={pages}
      initialRoutePath={routes.break}
    >
      <AppPage />
    </SnowApp>
  );
}

