import MenuBar from '../components/MenuBar'
import { type SceneHandlerProp } from '..//types/SceneHandler'

import './SceneHandler.css'

export default function SceneHandler ({ MainView }: SceneHandlerProp): JSX.Element {
  return (
    <>
      <MenuBar />
      <div className='content'>
        {MainView}
      </div>
    </>
  )
}
