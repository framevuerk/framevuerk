module.exports = {
  contains (text = '', search = '') {
    return text.toString().toUpperCase().indexOf(search.toString().toUpperCase()) !== -1
  },
  viewportSize (el = document.body) {
    const breakXs = 480
    const breakSm = 768
    const breakMd = 992
    const breakLg = 1200
    const size = el.offsetWidth
    const ret = []
    if (size < breakXs) {
      ret.push('xs')
    }
    if (size >= breakXs) {
      ret.push('sm')
    }
    if (size >= breakSm) {
      ret.push('md')
    }
    if (size >= breakMd) {
      ret.push('lg')
    }
    if (size >= breakLg) {
      ret.push('xl')
    }
    return ret
  },
  isChildOf (el, parent) {
    let eli = el
    while (eli && eli !== parent) {
      if (eli.parentElement === parent) {
        return true
      }
      eli = eli.parentElement
    }
    return false
  },
  offsetTo (el, parent) {
    let eli = el
    const ret = {
      left: 0,
      top: 0
    }
    while (eli && eli !== parent) {
      ret.left += eli.offsetLeft
      ret.top += eli.offsetTop
      eli = eli.offsetParent
    }
    eli = el
    while (eli && eli !== parent) {
      ret.left -= eli.scrollLeft
      ret.top -= eli.scrollTop
      eli = eli.parentElement
    }
    return ret
  },
  error (code) {
    if (code === 'no_fvmain_parent') {
      return `you should put your component under a fvMain component with parent prop seted.`
    }
  }
}
