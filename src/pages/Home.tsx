import './Home.css'

import HomeMenu from '../components/HomeMenu'
import MenuBar from '../components/MenuBar'

function Home (): JSX.Element {
  return (
    <>
      <MenuBar />
      <div className='content'>
        <HomeMenu />
      </div>
    </>
  )
}

export default Home
