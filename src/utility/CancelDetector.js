export default class CancelDetector {
  constructor () {
    this.hash = Math.random().toString(36).substr(2, 9)
    this.onFire = () => 1
    this.isListening = false
    this.onHashChange = () => {
      if (window.location.hash.indexOf(this.hash) === -1) {
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
      window.addEventListener('hashchange', this.onHashChange)
      window.addEventListener('keydown', this.onEsc)
    })
  }
  addHash () {
    if (window.location.hash.indexOf(this.hash) === -1) {
      // why '!'? read this https://stackoverflow.com/a/17108603
      const seperator = window.location.hash.length ? '?' : '!'
      window.location.hash += seperator + this.hash
    }
  }
  // can manualy called by user or called on hashchange
  stop (removeHashManually = true) {
    if (removeHashManually) {
      let hash = window.location.hash
      hash = hash.replace(this.hash, '')
      if (hash.lastIndexOf('&') === hash.length - 1 || hash.lastIndexOf('?') === hash.length - 1) {
        hash = hash.slice(0, hash.length - 1)
      }
      window.location.hash = hash
    }
    this.isListening = false
    window.removeEventListener('hashchange', this.onHashChange)
    window.removeEventListener('keydown', this.onEsc)
  }
}
