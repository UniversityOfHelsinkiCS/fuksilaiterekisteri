const withZero = (num) => {
  if (num < 10) return `0${num}`
  return num
}

export default (time) => {
  if (!time) return null
  const date = new Date(time)
  return `${withZero(date.getDate())}.${withZero(date.getMonth() + 1)}.${withZero(date.getFullYear())} ${withZero(date.getHours())}:${withZero(date.getMinutes())}`
}
