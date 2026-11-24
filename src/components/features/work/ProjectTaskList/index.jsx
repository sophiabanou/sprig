import { memo, useMemo } from 'react'
import { useListEntrance } from '../../../../hooks/useListEntrance'
import TaskRow from '../../tasks/TaskRow'
import styles from './ProjectTaskList.module.css'

/* A plain card of task rows. Rows added in place slide in; opening another project does not animate. */
function ProjectTaskList({ tasks = [], projectId = '', onEdit, onDelete } = {}) {
  const keys = useMemo(() => tasks.map((task) => task.id), [tasks])
  const listRef = useListEntrance(keys, projectId)

  if (tasks.length === 0) return <p className={`${styles.empty} textBody`}>No tasks yet.</p>

  return (
    <ul ref={listRef} className={styles.list}>
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  )
}

export default memo(ProjectTaskList)
