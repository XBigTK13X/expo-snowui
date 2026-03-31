import React from 'react'

import pkg from "../package.json";
import Snow from 'expo-snowui';
import { routes, pages } from './routing'

function AppPage() {
  const { CurrentPage, navPush, currentRoute } = Snow.useSnowContext()

  const [pressCount, setPressCount] = React.useState(0)
  const [presser, setPresser] = React.useState('')

  const [longPressCount, setLongPressCount] = React.useState(0)

  let components = [
    ['Break', routes.break],
    ['Modal', routes.modal],
    ['Dropdown', routes.dropdown],
    ['Range Slider', routes.rangeSlider],
    ['Grid', routes.grid],
    ['Grid More', routes.gridMore],
    ['Header', routes.header],
    ['ImageButton', routes.imageButton],
    ['ImageGrid', routes.imageGrid],
    ['Input', routes.input],
    ['Label', routes.label],
    ['Overlay', routes.overlay],
    ['Tabs', routes.tabs],
    ['TabsMore', routes.tabsMore],
    ['TextButton', routes.textButton],
    ['Text', routes.text],
    ['Toggle', routes.toggle]
  ]

  let focusTitle = ``
  if (pressCount) {
    focusTitle += ` (${pressCount})`
    focusTitle += ` [${presser}]`
  }
  else if (longPressCount) {
    focusTitle += ` (${longPressCount})`
    focusTitle += ` [${presser}]`
  }
  else {
    focusTitle = 'Focus Test'
  }


  return (
    <Snow.View focusKey="app" style={{ flexDirection: 'row', flex: 1 }}>
      <Snow.View focusKey="nav" xx={0} yy={0} style={{ width: "25%" }}>
        <Snow.TextButton
          yy={0}
          title={focusTitle}
        />
        <Snow.Label center>Components</Snow.Label>
        <Snow.Grid
          yy={1}
          itemsPerRow={2}
          items={components}
          renderItem={(item: any, itemIndex: any) => {
            return <Snow.TextButton
              title={item[0]}
              focusStart={itemIndex === 3}
              onPress={() => {
                setPressCount(pressCount + 1)
                setPresser(item[0])
                navPush({ path: item[1], func: false })
              }}
              onLongPress={() => {
                setLongPressCount(longPressCount + 1)
                setPresser(item[0])
                navPush({ path: item[1], func: false })
              }}
            />
          }} />
        <Snow.Label center>App Level entities</Snow.Label>
        <Snow.Text center>App, FillView, SafeArea, useSnowContext.</Snow.Text>
      </Snow.View>
      <Snow.Break style={{ width: "5%" }} vertical />
      <Snow.View focusKey="page" xx={1} yy={0} style={{ width: "70%" }}>
        <CurrentPage />
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
      DEBUG_FOCUS={true}
      DEBUG_FOCUS_TREE={true}
      snowStyle={styleOverrides}
      routePaths={routes}
      routePages={pages}
      initialRoutePath={routes.break}
    >
      <AppPage />
    </SnowApp>
  );
}

