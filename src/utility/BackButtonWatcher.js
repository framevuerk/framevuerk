export default class BackButtonWatcher {
  constructor () {
    this.hash = parseInt(Date.now() / 100).toString().substr(8)
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
  }
  start (onFire) {
    this.onFire = onFire
    this.addHash()
    setTimeout(() => {
      this.isListening = true
      window.addEventListener('hashchange', this.onHashChange)
    })
  }
  addHash () {
    if (window.location.hash.indexOf(this.hash) === -1) {
      const seperator = window.location.hash.indexOf('?') !== -1 ? '&' : '?'
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
    // if (this.isListening) {
    this.isListening = false
    window.removeEventListener('hashchange', this.onHashChange)
    // }
  }
}
