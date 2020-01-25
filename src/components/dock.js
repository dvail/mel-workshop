import { html } from '../util'
import FaIcon from './faIcon'
import AtlasRegion from './atlasRegion'
import completePng from '../../res/hexagonTerrain_sheet.png'
import completeJson from '../../res/hexagonTerrain_sheet.json'

export default function Dock() {
  let image = completePng
  let atlas = completeJson
  // TODO Remove hard coded
  let regionsNames = ["dirt_02.png", "dirt_03.png", "dirt_04.png"]

  function view({ attrs: { states, actions } }) {
    return html`
      <div className='
        h-12 w-2/3
        mb-1 m-auto
        p-2
        absolute
        left-0 right-0 bottom-0
        rounded-sm
        bg-gray-900
        flex flex-row justify-between items-center
      '>
        <div class='flex flex-row items-left'>
          ${regionsNames.map(region => html`
              <div class='cursor-pointer m-1'>
                <${AtlasRegion} states=${states} actions=${actions} region=${region} image=${image} atlas=${atlas} scale=0.3 />
              </div>
            `)}
          <${FaIcon} type='fa-bars' />
        </div>
      </div>
    `
  }

  return {
    view,
  }
}
