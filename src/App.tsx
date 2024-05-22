import { HashRouter, Route, Routes } from 'react-router-dom'

import SceneHandler from './pages/SceneHandler'
import HomeMenu from './components/HomeMenu'

function App (): JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<SceneHandler MainView={<HomeMenu />} />} />
      </Routes>
    </HashRouter>
  )
}

export default App
