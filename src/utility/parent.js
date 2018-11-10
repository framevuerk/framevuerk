class Parent {
  constructor () {
    this.$el = window.document.body
    this.lockRequests = {}
  }
  getSize () {
    const breakXs = 480
    const breakSm = 768
    const breakMd = 992
    const breakLg = 1200
    const size = this.$el.offsetWidth
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
    this.$el.classList.add('fv-lock')
    this.lockRequests[by] = true
  }

  getViewport () {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }
  getScrollPosition () {
    return {
      top: window.document.body.scrollTop || window.document.documentElement.scrollTop || 0
    }
  }

  unlock (by = 'x') {
    if (!this.lockRequests[by]) {
      return
    }
    delete this.lockRequests[by]
    if (Object.keys(this.lockRequests).length === 0) {
      this.$el.classList.remove('fv-lock')
    }
  }
  newEl (tag, classList = '') {
    const el = window.document.createElement(tag)
    el.className = classList
    this.$el.appendChild(el)
    return el
  }
  offOutsideClick (currentEl, handler) {
    this.$el.removeEventListener('click', handler)
    this.$el.removeEventListener('touchstart', handler)
    currentEl.removeEventListener('click', currentEl.stopPropagationHandler || (() => 1))
    currentEl.removeEventListener('touchstart', currentEl.stopPropagationHandler || (() => 1))
  }

  on (name) {
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

      this.$el.addEventListener('click', currentEl.inlineClickHandler)
      this.$el.addEventListener('touchstart', currentEl.inlineClickHandler)
    } else if (name === 'sizechange') {
      window.addEventListener('resize', arguments[1])
    } else {
      this.$el.addEventListener(name, arguments[1])
    }
  }
  off (name) {
    if (name === 'outsideclick') {
      const currentEl = arguments[1]
      this.$el.removeEventListener('click', currentEl.inlineClickHandler)
      this.$el.removeEventListener('touchstart', currentEl.inlineClickHandler)
    } else if (name === 'sizechange') {
      window.removeEventListener('resize', arguments[1])
    } else {
      this.$el.addEventListener(name, arguments[1])
    }
  }
}

export default new Parent()
