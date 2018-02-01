
module.exports = {
  contains (text = '', search = '') {
    return text.toString().toUpperCase().indexOf(search.toString().toUpperCase()) !== -1
  },
  doIt (action) {
    setTimeout(action, 100)
  },
  capitalizeFirstLetter (str = '') {
    return str.charAt(0).toUpperCase() + str.slice(1)
  },
  isSmallViewport (el = document.body) {
    return el.offsetWidth < 992
  },
  _dependencies: {}
}
