import parent from './parent.js'

export default class CancelDetector {
  constructor () {
    this.hash = Math.random().toString(36).substr(2, 9)
    this.onFire = () => 1
    this.isListening = false
    this.onHashChange = () => {
      if (parent.$window.location.hash.indexOf(this.hash) === -1) {
        if (this.onFire() !== false) {
          this.stop(false)
        } else {
          // hash deleted, but we add it again and wait for changes again
          this.addHash()
        }
      }
    }
    this.onEsc = (event) => {
      if (event.which === 27) {
        // if esc button clicked
        if (this.onFire() !== false) {
          this.stop(true)
        }
      }
    }
  }
  start (onFire) {
    this.onFire = onFire
    this.addHash()
    setTimeout(() => {
      this.isListening = true
      parent.on('hashchange', this.onHashChange)
      parent.on('keydown', this.onEsc)
    })
  }
  addHash () {
    if (parent.$window.location.hash.indexOf(this.hash) === -1) {
      // why '!'? read this https://stackoverflow.com/a/17108603
      const seperator = window.location.hash.length ? '?' : '!'
      parent.$window.location.hash += seperator + this.hash
    }
  }
  // can manualy called by user or called on hashchange
  stop (removeHashManually = true) {
    if (removeHashManually) {
      parent.$window.history.go(-1)
    }
    this.isListening = false
    parent.off('hashchange', this.onHashChange)
    parent.off('keydown', this.onEsc)
  }
}
