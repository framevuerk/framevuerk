import parent from './parent.js'

class Config {
  constructor () {
    this.config = {}
  }
  hexToRgb (hex) {
    // https://stackoverflow.com/a/11508164
    const bigint = (() => {
      let pHex = hex
      if (pHex.indexOf('#') === 0) {
        pHex = pHex.substr(1)
      }
      if (pHex.length === 3) {
        pHex = pHex[0] + pHex[0] + pHex[1] + pHex[1] + pHex[2] + pHex[2]
      }
      if (pHex.length !== 6) {
        pHex = 'ffffff'
      }
      return parseInt(pHex, 16)
    })()
    return [
      (bigint >> 16) & 255,
      (bigint >> 8) & 255,
      bigint & 255
    ]
  }
  pushColor (color, amount) {
    return color.map(p => {
      return parseInt(p * (100 + amount) / 100)
    })
  }
  luma (color) {
    return 0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2]
  }
  yiq (color, percetange = 90, threshold = 180) {
    let amount = percetange
    if (this.luma(color) > threshold) {
      amount *= -1
    }
    return this.pushColor(color, amount)
  }
  injectOrReplaceStyleTag (content, id = 'fv-config') {
    return new Promise(resolve => {
      const tryInject = () => {
        if (!parent.$head) {
          parent.calcWindow()
          setTimeout(tryInject, 100)
        }
        const oldStyleElem = parent.$document.getElementById(id)
        if (oldStyleElem) {
          oldStyleElem.innerHTML = content
        } else {
          const styleElem = parent.$document.createElement('STYLE')
          styleElem.type = 'text/css'
          styleElem.innerHTML = content
          styleElem.id = id
          console.warn(styleElem)
          parent.$head.appendChild(styleElem)
        }

        resolve()
      }
      tryInject()
    })
  }
  applyConfig (value = {}) {
    const config = {
      colors: {},
      sizes: {}
    }
    let styleContent = ''
    Object.keys(value.colors || {}).forEach(color => {
      const rgb = this.hexToRgb(value.colors[color])
      console.log(rgb, value.colors[color])
      const amountNames = ['darker', 'dark', 'normal', 'light', 'lighter'];
      [-20, -10, 0, 10, 20].forEach((amount, index) => {
        const amountName = amountNames[index]
        const value = this.pushColor(rgb, amount)
        const yiqValue = this.yiq(rgb)
        config.colors[`${color}-${amountName}`] = value
        config.colors[`${color}-${amountName}-yiq`] = yiqValue
        styleContent += `--colors-${color}-${amountName}: rgb(${value.join(',')});`
        styleContent += `--colors-${color}-${amountName}-yiq: rgb(${yiqValue.join(',')});`
      // config.colors[`${color}-${amountName}`] = this.pushColor(rgb, amount)
      // config.colors[`${color}-${amountName}`] = `rgb(${this.pushColor(rgb, amount).join(',')})`
      // config.colors[`${color}-${amountName}-yiq`] = `rgb(${this.yiq(rgb).join(',')})`
      // ret += `--color-${color}-${amountName}: rgb(${this.pushColor(rgb, amount).join(',')});`
      // ret += `--color-${color}-${amountName}-yiq: rgb(${this.yiq(rgb).join(',')});`
      })
    })
    Object.keys(value.sizes || {}).forEach(size => {
      const num = Number(value.sizes[size])
      const ext = size.toString().replace(/\d+/g, '') || 'em'
      const amountNames = ['sm', 'md', 'lg'];
      [0.5, 0, 1.5].forEach((amount, index) => {
        const amountName = amountNames[index]
        const value = num * amount
        config.sizes[`${size}-${amountName}`] = [value, ext]
        styleContent += `--sizes-${size}-${amountName}: ${value}${ext};`
      })
      // const smValue = [num / 2, ext]
      // const mdValue = [num, ext]
      // const lgValue = [num * 1.5, ext]
      // config.sizes[`${size}-sm`] = smValue
      // ret += `--size-${size}-small: ${num / 2}${ext};`
      // ret += `--size-${size}-normal: ${num}${ext};`
      // ret += `--size-${size}-large: ${num * 1.5}${ext};`
    })
    if (JSON.stringify(config) !== JSON.stringify(this.config)) {
      this.config = config
      this.injectOrReplaceStyleTag(`:root{${styleContent}--direction: border-left;}`)
    }
  }
}

export default new Config()
