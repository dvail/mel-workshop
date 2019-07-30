import React, { useState, useReducer } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@blueprintjs/core/lib/css/blueprint.css'

import { Slider, Colors } from '@blueprintjs/core'

import RenderPane from './renderPane'
import Sidebar from './sidebar'
import Compass from './compass'
import mapDataReducer from './mapDataReducer'

const AppLayout = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  background-color: ${Colors.DARK_GRAY1};
`

let Workspace = styled.div`
  position: relative;
  flex: 1;
`

let ViewSlider = styled(Slider)`
  position: absolute;
  bottom: 20px;
  right: 20px;
`

function App() {
  const [mapData, mapDataDispatch] = useReducer(mapDataReducer, { tiles: {} });
  const [rotation, setRotation] = useState(0)
  const [viewAngle, setViewAngle] = useState(0.65)

  return (
    <AppLayout className="bp3-dark">
      <Sidebar mapData={mapData} mapDataDispatch={mapDataDispatch} />
      <Workspace>
        <RenderPane mapData={mapData} mapDataDispatch={mapDataDispatch} rotation={rotation} viewAngle={viewAngle} />
        <Compass rotation={rotation} onRotationChange={setRotation} />
        <ViewSlider
          min={0}
          max={1}
          stepSize={0.05}
          labelStepSize={0.25}
          onChange={setViewAngle}
          value={viewAngle}
          vertical
        />
      </Workspace>
    </AppLayout>
  )
}

const rootElement = document.getElementById('app')
ReactDOM.render(<App />, rootElement)

rootElement?.test

rootElement |> console.log
