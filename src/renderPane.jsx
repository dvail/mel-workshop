import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import _ from 'lodash'

import useEffectWhenValue from './useEffectWhenValue'
import ColorUtils from './colorUtils'
import HexagonGrid from './hexagonGrid'
import sampleTileData from './sampleData'

// PIXI default canvas sizes
const paneWidth = 800
const paneHeight = 600

const StyledPane = styled.div`
  width: ${paneWidth}px;
  height: ${paneHeight}px;
`
const skeletonTileOpts = { strokeColor: 0xbbbbbb, fillColor: 0x111111, strokeAlpha: 0.1, fillAlpha: 0.01 }
const gridLayoutOps = { gridX: 0, gridY: 0, tileSize: 35, angle: 0.68 }

export default function RenderPane({ rotation }) {
  let paneElem = useRef(null)

  let [app, setApp] = useState(null)
  let [viewport, setViewport] = useState(null)
  let [dragging, setDragging] = useState(false)
  let [skeletonGrid, setSkeletonGrid] = useState(null)
  let [hexGrid, setHexGrid] = useState(null)

  let hexGridRef = useRef(hexGrid);
  let dragRef = useRef(dragging);

  // Used to get around stale closure references in callbacks based to children
  useEffect(() => {
    hexGridRef.current = hexGrid
    dragRef.current = dragging
  });

  function onTileClick(q, r) {
    if (dragRef.current) return

    let { current } = hexGridRef;
    let tile = current.getAt(q, r)
    let height = tile?.height + 1 || 0
    let opts = tile ?.opts || {
      fillColor: ColorUtils.shift(0xFF9933, 0, -q * 20, r * 20),
    }

    current.addTile(q, r, height, opts)
  }

  useEffect(() => {
    setApp(new PIXI.Application())
  }, [])

  useEffect(() => {
    hexGrid?.setRotation(rotation)
    skeletonGrid?.setRotation(rotation)
  }, [rotation])

  useEffectWhenValue(() => {
    paneElem.current.appendChild(app.view)

    setViewport(new Viewport({ interaction: app.renderer.plugins.interaction }))
    setSkeletonGrid(HexagonGrid.create({ ...gridLayoutOps, onTileClick }))
    setHexGrid(HexagonGrid.create({ ...gridLayoutOps, onTileClick }))
  }, [app])

  useEffectWhenValue(() => {
    app.stage.addChild(viewport)

    viewport.drag().wheel()
    viewport.on('drag-start', () => setDragging(true))
    viewport.on('drag-end', () => setDragging(false))
    viewport.moveCenter(275, 50) // TODO These are magic values...
  }, [viewport])

  useEffectWhenValue(() => {
    // TODO The performance of this probably sucks
    _.range(-10, 10).forEach(q => {
      _.range(-10, 10).forEach(r => {
        skeletonGrid.addTile(q, r, 0, skeletonTileOpts)
      })
    })

    viewport.addChild(skeletonGrid.container)
  }, [skeletonGrid])

  useEffectWhenValue(() => {
    sampleTileData.tiles.forEach(([q, r, height]) => {
      hexGrid.addTile(q, r, height, {
        fillColor: ColorUtils.shift(0xFF9933, 0, -q * 20, r * 20),
      })
    })

    viewport.addChild(hexGrid.container)
  }, [hexGrid])

  return <StyledPane ref={paneElem} />
}
