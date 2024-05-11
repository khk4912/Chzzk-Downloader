import style from './MenuBar.module.css'
import homeIcon from '../assets/home.svg'
import logo from '../assets/logo.png'
import optionIcon from '../assets/option.svg'

export default function MenuBar (): JSX.Element {
  return (
    <nav className={style.sideMenu}>
      <div className={style.logoItem}>
        <img src={logo} alt='로고' />
      </div>

      <div className={style.menuItem}>
        <img src={homeIcon} alt='홈' />
        <a id={style.itemDesc} href='#'>홈</a>
      </div>
      <div className={style.menuItem}>
        <img src={optionIcon} alt='설정' />
        <a id={style.itemDesc} href='#'>설정</a>
      </div>
    </nav>
  )
}
