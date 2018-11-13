import parent from './parent.js'

export default class CancelDetector {
  constructor () {
    this.onFire = () => 1
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
    setTimeout(() => {
      parent.on('keydown', this.onEsc)
    })
  }
  // can manualy called by user or called on popstate
  stop () {
    parent.off('keydown', this.onEsc)
  }
}
