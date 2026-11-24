export function countLeft(tasks = []) {
  const leftCount = tasks.filter((task) => !task.isDone).length
  return leftCount === 0 ? 'All done' : `${leftCount} left`
}
