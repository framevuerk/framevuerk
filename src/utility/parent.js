class Parent {
  constructor () {
    this.calcWindow()
    this.config = {}
    // this.$el = window.document.body
    this.lockRequests = {}
  }
  calcWindow () {
    this.$window = typeof window === 'object' ? window : null
    this.$document = this.$window ? this.$window.document : null
    this.$body = this.$window ? this.$window.document.body : null
    this.$head = this.$window ? this.$window.document.head : null
    this.$documentElement = this.$window ? this.$window.document.documentElement : null
    this.$scrollingElement = this.$window ? this.$window.document.scrollingElement : null
  }

  getSize () {
    this.calcWindow()
    const breakXs = 480
    const breakSm = 768
    const breakMd = 992
    const breakLg = 1200
    const size = this.$body ? this.$body.offsetWidth : 768
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
    this.calcWindow()
    if (!this.$body) {
      return
    }
    this.$body.classList.add('fv-lock')
    this.lockRequests[by] = true
  }

  getViewport () {
    this.calcWindow()
    if (!this.$window) {
      return
    }
    return {
      width: this.$window.innerWidth,
      height: this.$window.innerHeight
    }
  }
  getScrollPosition () {
    this.calcWindow()
    if (!this.$body || !this.$scrollingElement || !this.$documentElement) {
      return
    }
    return {
      top: this.$body.scrollTop || this.$documentElement.scrollTop || 0,
      height: this.$scrollingElement.offsetHeight || 0
    }
  }

  unlock (by = 'x') {
    this.calcWindow()
    if (!this.$body || !this.lockRequests[by]) {
      return
    }
    delete this.lockRequests[by]
    if (Object.keys(this.lockRequests).length === 0) {
      this.$body.classList.remove('fv-lock')
    }
  }
  newEl (tag, classList = '') {
    this.calcWindow()
    if (!this.$document || !this.$body) {
      return
    }
    const el = this.$document.createElement(tag)
    el.className = classList
    this.$body.appendChild(el)
    return el
  }
  appendChild (tagName) {
    this.calcWindow()
    if (!this.$body) {
      return
    }
    return this.$body.appendChild(tagName)
  }

  on (name) {
    this.calcWindow()
    if (!this.$window) {
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

      this.$window.addEventListener('click', currentEl.inlineClickHandler)
      this.$window.addEventListener('touchstart', currentEl.inlineClickHandler)
    } else if (name === 'sizechange') {
      this.$window.addEventListener('resize', arguments[1])
    } else {
      const obj = arguments[2] ? this.$body : this.$window
      obj.addEventListener(name, arguments[1])
    }
  }
  off (name) {
    this.calcWindow()
    if (!this.$window) {
      return
    }
    if (name === 'outsideclick') {
      const currentEl = arguments[1]
      this.$window.removeEventListener('click', currentEl.inlineClickHandler)
      this.$window.removeEventListener('touchstart', currentEl.inlineClickHandler)
    } else if (name === 'sizechange') {
      this.$window.removeEventListener('resize', arguments[1])
    } else {
      const obj = arguments[2] ? this.$body : this.$window
      obj.removeEventListener(name, arguments[1])
    }
  }
}

export default new Parent()
