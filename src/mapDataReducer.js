import produce from 'immer'

const UpdateTile = 'UpdateTile'
const RemoveTile = 'RemoveTile'
const LoadMap = 'LoadMap'
const actions = {};

const defaultActionFn = state => {
  console.warn('default action - this should not be called!')
  return state
}

export const MapDataAction = {
  UpdateTile,
  RemoveTile,
  LoadMap,
}

export const tileKey = (q, r) => [q, r].toString()

export default function mapDataReducer(state, action) {
  const { type, data } = action
  const actionFn = actions[type] || defaultActionFn

  return actionFn(state, data)
}

actions.UpdateTile = (state, data) => produce(state, draftState => {
  let key = tileKey(data.q, data.r)
  draftState.tiles[key] = data
})

actions.RemoveTile = (state, data) => produce(state, draftState => {
  let key = tileKey(data.q, data.r)
  delete draftState.tiles[key]
})

actions.LoadMap = (state, data) => produce(state, draftState => {
  draftState.tiles = data.tiles
})