import style from './Search.module.css'

export default function Search (): JSX.Element {
  return (
    <div className={style.header}>

      <div className={style.searchArea}>

        <div className={style.searchHeader}>
          <div className={style.searchBar}>
            <input type='text' id={style.searchInput} placeholder='URL 혹은 스트리머 이름 검색...' />
            <div className={style.searchResult}>
              <div className={style.resultItem}>
                placeholder
              </div>
            </div>
          </div>
          <button id={style.searchButton}>검색</button>
        </div>

      </div>

    </div>
  )
}
