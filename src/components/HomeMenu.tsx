import Search from './Search'
import CurrentStatus from './CurrentStatus'

import './HomeMenu.css'

function HomeMenu (): JSX.Element {
  return (
    <div className='container'>
      <Search />
      <CurrentStatus />
    </div>

  )
}

export default HomeMenu
