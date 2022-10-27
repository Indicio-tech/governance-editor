export const getNextId = (array, idKey) => {
  let idList = []
  let nextId = null
  array.forEach((element) => {
    idList.push(element[idKey])
  })
  if (idList.length !== 0) {
    nextId = Math.max.apply(0, idList) // (eldersonar) Math.max is great for small arrays only (up to ~120000)
    console.log(idList)
    console.log(nextId)
  } else {
    nextId = 0
  }
  nextId++
  return nextId
}
