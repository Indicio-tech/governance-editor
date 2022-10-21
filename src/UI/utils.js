export const getNextId = (array, idKey) => {
  let idList = []
  array.forEach((element) => {
    idList.push(element[idKey])
  })
  let nextId = Math.max.apply(0, idList) // (eldersonar) Math.max is great for small arrays only (up to ~120000)
  console.log(idList)
  console.log(nextId)
  nextId++
  return nextId
}
