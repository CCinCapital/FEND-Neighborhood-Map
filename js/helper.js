function jsSet(array) {
  let _hash = {}
  let result = []

  for (let i = 0; i < array.length; i++) {
    if(!_hash[array[i]]) {
      _hash[array[i]] = true
      result.push(array[i])
    }  
  }
  return result
}
