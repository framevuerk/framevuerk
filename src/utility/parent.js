class Parent {
  constructor () {
    // too hacky
    if (typeof window !== 'object') {
      global.window = {
        document: {
          body: {}
        }
      }
    }

    this.lockRequests = {}
  }
  getSize () {
    const breakXs = 480
    const breakSm = 768
    const breakMd = 992
    const breakLg = 1200
    const size = window.document.body ? window.document.body.offsetWidth : 768
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
  }
  lock (by = 'x') {
    if (!window.document.body) {
      return
    }
    window.document.body.classList.add('fv-lock')
    this.lockRequests[by] = true
  }

  getViewport () {
    if (!window) {
      return
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }
  getScrollPosition () {
    if (!window.document.body || !window.document.scrollingElement || !window.documentElement) {
      return
    }
    return {
      top: window.document.body.scrollTop || window.documentElement.scrollTop || 0,
      height: window.document.scrollingElement.offsetHeight || 0
    }
  }

  unlock (by = 'x') {
    if (!window.document.body || !this.lockRequests[by]) {
      return
    }
    delete this.lockRequests[by]
    if (Object.keys(this.lockRequests).length === 0) {
      window.document.body.classList.remove('fv-lock')
    }
  }
  newEl (tag, classList = '') {
    if (!window.document || !window.document.body) {
      return
    }
    const el = window.document.createElement(tag)
    el.className = classList
    window.document.body.appendChild(el)
    return el
  }
  appendChild (tagName) {
    if (!window.document.body) {
      return
    }
    return window.document.body.appendChild(tagName)
  }

  on (name) {
    if (!window) {
      return
    }

    if (name === 'outsideclick') {
      const currentEl = arguments[1]
      const handler = arguments[2]
      // why we keep this? to allow us to disable it later
      currentEl.stopPropagationHandler = event => {
        event.stopPropagation()
      }

      currentEl.inlineClickHandler = event => {
        const target = event.target

        if (!currentEl.contains(target)) {
          handler()
        }
      }

      window.addEventListener('click', currentEl.inlineClickHandler)
      window.addEventListener('touchstart', currentEl.inlineClickHandler)
    } else if (name === 'sizechange') {
      window.addEventListener('resize', arguments[1])
    } else {
      window.addEventListener(name, arguments[1])
    }
  }
  off (name) {
    if (!window) {
      return
    }
    if (name === 'outsideclick') {
      const currentEl = arguments[1]
      window.removeEventListener('click', currentEl.inlineClickHandler)
      window.removeEventListener('touchstart', currentEl.inlineClickHandler)
    } else if (name === 'sizechange') {
      window.addEventListener('resize', arguments[1])
    } else {
      window.addEventListener(name, arguments[1])
    }
  }
}

export default new Parent()
