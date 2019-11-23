import parent from './parent.js'

class Config {
  constructor () {
    this.defaultConfig = [
      {
        name: 'default',
        type: 'direction',
        value: 'left'
      },
      {
        name: 'padding',
        type: 'size',
        value: '1em'
      },
      {
        name: 'border-radius',
        type: 'size',
        value: '4px'
      },
      {
        name: 'shadow',
        type: 'size',
        value: '4px'
      },
      {
        name: 'transition',
        type: 'speed',
        value: '0.25s'
      },
      {
        name: 'background',
        type: 'color',
        value: '#ffffff'
      },
      {
        name: 'primary',
        type: 'color',
        value: '#41b883'
      },
      {
        name: 'secondary',
        type: 'color',
        value: '#35485d'
      },
      {
        name: 'info',
        type: 'color',
        value: '#14b0cf'
      },
      {
        name: 'warning',
        type: 'color',
        value: '#ef8f00'
      },
      {
        name: 'danger',
        type: 'color',
        value: '#dd4b39'
      },
      {
        name: 'header',
        type: 'color',
        value: '#35485d'
      },
      {
        name: 'sidebar',
        type: 'color',
        value: '#3a3a3a'
      },
      {
        name: 'footer',
        type: 'color',
        value: '#3a3a3a'
      },
    ]
    this.value = []

  }
  _toHsl (hexString) {
    // https://gist.github.com/mjackson/5311256
    let hex = hexString.replace('#', '')
    if (hex.length === 3) {
      hex = hex[0].repeat(2) + hex[1].repeat(2) + hex[2].repeat(2)
    }
    if (hex.length !== 6) {
      return [0, 0, 100]
    }
    hex = hex.match(/.{1,2}/g)
    let [red, green, blue] = hex.map(part => parseInt(part, 16) / 255)
    const min = Math.min(red, green, blue)
    const max = Math.max(red, green, blue)
    const offset = max - min
    const sum = max + min
    let hue = 0
    let saturation = 0
    let luminace = Math.floor((sum / 2) * 100)
    if (min !== max) {
      saturation = Math.floor(luminace > 50 ? ((offset / (2 - offset)) * 100) : ((offset / sum) * 100))
      switch (max) {
        case red:
          hue = (green - blue) / offset + (green < blue ? 6 : 0)
          break
        case green:
          hue = (blue - red) / offset + 2
          break
        case blue:
          hue = (red - green) / offset + 4
          break
      }
      hue = Math.floor(hue * 60)
    }
    return [hue, saturation, luminace]
  }
  _lighten (color, percetange) {
    return [
      color[0],
      color[1],
      Math.max(0, Math.min(color[2] + percetange, 100))
    ]
  }
  _isDark (color) {
    return color[2] < 50
  }
  calcUserConfig (item) {
    let ret
    if (item.type === 'color') {
      const value = this._toHsl(item.value)
      const isTooLight = value[2] > 80
      const isTooDark = value[2] < 20
      ret = {
        name: item.name,
        type: 'color',
        value: {
          hover: this._lighten(value, isTooLight ? -6 : 6),
          active: this._lighten(value, isTooDark ? 8 : -8),
          border: this._lighten(value, isTooDark ? 10 : -10),
          borderhover: this._lighten(value, isTooDark ? 35 : -35),
          light: this._lighten(value, 8),
          dark: this._lighten(value, -8),
          placeholder: this._lighten(value, value[2] < 60 ? 40 : -40),
          text: this._lighten(value, value[2] < 70 ? 90 : -90),
          normal: value
        }
      }
      ret.cssVars = Object.keys(ret.value).map(key => {
        return `--${item.type}-${item.name}-${key}:hsl(${ret.value[key][0]},${ret.value[key][1]}%,${ret.value[key][2]}%);`
      }).join('')
    } else if (item.type === 'size' || item.type === 'speed') {
      const value = parseFloat(item.value)
      const unit = item.value.toString().replace(/\d+/g, '').replace('.', '') || 'em'
      ret = {
        name: item.name,
        type: item.type,
        unit,
        value: {
          [item.type === 'size' ? 'small' : 'fast']: value / 2,
          normal: value,
          [item.type === 'size' ? 'large' : 'slow']: value * 1.5
        }
      }
      ret.cssVars = Object.keys(ret.value).map(key => {
        return `--${item.type}-${item.name}-${key}:${ret.value[key]}${ret.unit};`
      }).join('')
    } else if (item.type === 'direction') {
      ret = {
        name: item.name,
        type: 'direction',
        value: {
          dir: item.value === 'left' ? 'ltr' : 'rtl',
          start: item.value === 'left' ? 'left' : 'right',
          end: item.value === 'left' ? 'right' : 'left'
        }
      }
      ret.cssVars = Object.keys(ret.value).map(key => {
        return `--${item.type}-${ret.name}-${key}:${ret.value[key]};`
      }).join('')
    }
    return ret
  }
  set (userConfigItem, autoSync = true) {
    const item = this.calcUserConfig(userConfigItem)
    const index = this.value.findIndex(v => v.name === item.name && v.type === item.type)
    if (index > -1) {
      this.value[index] = item
    } else {
      this.value.push(item)
    }
    autoSync && this.sync()
  }
  get (type, name) {
    return this.value.find(item => item.type === type && item.name === name)
  }
  del (type, name, autoSync = false) {
    const index = this.value.findIndex(v => v.name === name && v.type === type)
    if (index > -1) {
      this.value.slice(index, 1)
      autoSync && this.sync()
    }
  }
  sync () {
    let cssContent = ':root{'
    this.value.forEach(item => {
      cssContent += item.cssVars
    })
    cssContent += '}'
    return new Promise(resolve => {
      const tryInject = () => {
        if (!parent.$head) {
          parent.calcWindow()
          setTimeout(tryInject, 100)
        }
        const oldStyleElem = parent.$document.getElementById('fv-config')
        if (oldStyleElem) {
          oldStyleElem.innerHTML = cssContent
        } else {
          const styleElem = parent.$document.createElement('STYLE')
          styleElem.type = 'text/css'
          styleElem.innerHTML = cssContent
          styleElem.id = 'fv-config'
          parent.$head.appendChild(styleElem)
        }

        resolve()
      }
      tryInject()
    })
  }
  init (userConfig = []) {
    this.defaultConfig.concat(userConfig).forEach(item => this.set(item, false))
    return this.sync()
  }
}

export default new Config()
