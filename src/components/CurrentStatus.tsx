import style from './CurrentStatus.module.css'
import TaskCard, { SkeletonTaskCard } from './TaskCard'

export default function CurrentStatus (): JSX.Element {
  return (
    <div className={style.current}>
      <h2>현재 작업 리스트 </h2>

      <div className={style.task}>
        {/* <TaskCard title='test' image='' info='asdf' /> */}
        <SkeletonTaskCard />
        <SkeletonTaskCard />
        <SkeletonTaskCard />
        <SkeletonTaskCard />
      </div>
    </div>
  )
}
