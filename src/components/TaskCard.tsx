import style from './TaskCard.module.css'

interface TaskCardProps {
  title: string
  info: string
  image: string
}

export default function TaskCard ({ title, info, image }: TaskCardProps): JSX.Element {
  return (
    <>
      <div className={style.card}>
        <img className={style.taskImage} src='' alt='' />
        <div className={style.taskContent}>
          <span className={style.taskTitle}>{title}</span>
          <span className={style.taskInfo}>{info}</span>

        </div>
      </div>
    </>
  )
}

export function SkeletonTaskCard (): JSX.Element {
  return (
    <>
      <div className={style.card}>
        <div className={style.skeletonTaskImage} />
        <div className={style.taskContent}>
          <div className={style.skeletonTaskTitle} />
          <div className={style.skeletonTaskInfo} />
        </div>
      </div>
    </>
  )
}
