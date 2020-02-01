import create from 'zustand'
import stream from 'mithril/stream'
import produce from 'immer'

// TODO Maybe move this stuff out of here?
export const RotationIncrement = 360 / 12
export const AngleIncrement = 0.05
export const tileKey = (q, r) => [q, r].toString()

export function initMeiosis(initialState = {}) {
  let update = stream()
  let stateUpdate = (appState, fn) => fn(appState)

  let InitialState = {
    rotation: 0,
    viewAngle: 0.65,
    mapData: { tiles: {} },
    shiftKey: false,
    tileBuilderOpen: false,
    dockDrawerOpen: false,
    selectedTileImage: null,
    ...initialState,
  }

  let states = stream.scan(stateUpdate, InitialState, update)

  // Uses Immer to imperitively create a next state and update the main stream
  function produceUpdate(producer) {
    return payload => {
      update(prev => produce(prev, next => producer(prev, next, payload)))
    }
  }

  let actions = {
    RotateClock: produceUpdate((prev, next) => {
      next.rotation += RotationIncrement
      next.rotation %= 360
    }),
    RotateCounter: produceUpdate((prev, next) => {
      next.rotation -= RotationIncrement
      next.rotation += 360 // Don't rotate below 0 degrees
      next.rotation %= 360
    }),
    IncreaseAngle: produceUpdate((prev, next) => {
      next.viewAngle = Math.min(next.viewAngle + 0.05, 1.0)
    }),
    DecreaseAngle: produceUpdate((prev, next) => {
      next.viewAngle = Math.max(next.viewAngle - 0.05, 0.0)
    }),
    RemoveTile: produceUpdate((prev, next, payload) => {
      let key = tileKey(payload.q, payload.r)
      delete next.mapData.tiles[key]
    }),
    UpdateTile: produceUpdate((prev, next, payload) => {
      let key = tileKey(payload.q, payload.r)

      next.mapData.tiles[key] = {
        ...prev.mapData.tiles[key],
        ...payload,
      }
    }),
    ToggleDockDrawer: produceUpdate((prev, next) => {
      next.dockDrawerOpen = !prev.dockDrawerOpen
    }),
    OpenDockDrawer: produceUpdate((prev, next, isOpen) => {
      next.dockDrawerOpen = isOpen
    }),
  }

  return {
    states,
    actions,
  }
}

export const { states, actions } = initMeiosis()

export const [useStore] = create((set, get) => ({
  getAll: get,
  rotation: 0,
  viewAngle: 0.65,
  mapData: { tiles: {} },
  shiftKey: false,
  tileBuilderOpen: false,
  dockDrawerOpen: false,
  selectedTileImage: null,
  setShift: e => {
    set({ shiftKey: e.shiftKey })
  },
  toggleTileBuilder: () => {
    set({ tileBuilderOpen: !get().tileBuilderOpen })
  },
  setTileBuilderOpen: isOpen => {
    set({ tileBuilderOpen: isOpen })
  },
  mapLoad: payload => {
    let mapData = produce(get().mapData, next => {
      next.tiles = payload.tiles
    })

    set({ mapData })
  },
  setSelectedTileImage: imageName => {
    set({ selectedTileImage: imageName })
  },
  setRotation: rotation => {
    set({ rotation })
  },
}))
