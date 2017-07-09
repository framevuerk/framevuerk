
export default {
  isDescendant (parent, child) {
    if (child === null || parent === null) {
      return false
    }
    var node = child.parentNode
    while (node !== null) {
      if (node === parent) {
        return true
      }
      node = node.parentNode
    }
    return false
  },
  contains (text = '', search = '') {
    return text.toString().toUpperCase().indexOf(search.toString().toUpperCase()) !== -1
  },
  doIt (action) {
    setTimeout(action, 100)
  },
  capitalizeFirstLetter (str = '') {
    return str.charAt(0).toUpperCase() + str.slice(1)
  },
  vueEvents () {
    return [
      'click',
      'focus',
      'blur',
      'keyup',
      'keydown',
      'keypress',
      'invalid'
    ]
  },
  _dependencies: {
    moment: null
  }
}
