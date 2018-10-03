module.exports = {
  contains (text = '', search = '') {
    return text.toString().toUpperCase().indexOf(search.toString().toUpperCase()) !== -1
  },
  capitalizeFirstLetter (str = '') {
    return str.charAt(0).toUpperCase() + str.slice(1)
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
  fvParent (vueComponent, vueElName = 'fvMain') {
    let ret = vueComponent.$parent
    while (ret) {
      if (ret.$el !== vueComponent.$el && (typeof ret.parent !== 'undefined' ? !!ret.parent : true) && ret.$vnode && ret.$vnode.tag.indexOf(vueElName) > -1) {
        return ret
      }
      ret = ret.$parent
    }
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
  requestParent (vueComponent, request, data, parentComponent = 'fvMain', level = 999) {
    let parent = vueComponent.$parent
    while (parent) {
      if (level === 0) {
        parent = undefined
        break
      }
      if (parent.$el !== vueComponent.$el && (parent.parent === true || typeof parent.parent === 'undefined') && parent.$vnode.tag.indexOf(parentComponent) > -1) {
        break
      }
      parent = parent.$parent
      level--
    }
    if (parent) {
      return parent.onRequest(vueComponent, request, data)
    }
  },
  _dependencies: {}
}
