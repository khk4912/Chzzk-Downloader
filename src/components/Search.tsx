import style from './Search.module.css'

export default function Search (): JSX.Element {
  return (
    <div className={style.header}>

      <div className={style.searchArea}>
        <input type='text' id={style.searchInput} placeholder='URL 혹은 스트리머 이름 검색...' />
        <button id={style.searchButton}>검색</button>

        <div className={style.searchResult}>
          <div className={style.resultItem}>
            placeholder
          </div>
        </div>
      </div>

    </div>
  )
}
