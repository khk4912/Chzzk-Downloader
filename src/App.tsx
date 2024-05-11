import { HashRouter, Route, Routes } from 'react-router-dom'

import Home from './pages/Home'

function App (): JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </HashRouter>
  )
}

export default App
