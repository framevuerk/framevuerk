import parent from './parent.js'

class Config {
  constructor () {
    this.value = []
  }
  toHsl (hexString) {
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
  lighten (color, percetange) {
    return [
      color[0],
      color[1],
      Math.max(0, Math.min(color[2] + percetange, 100))
    ]
  }
  isDark (color) {
    return color[2] < 50
  }
  yiq (color, percetange) {
    return this.lighten(color, color[2] < 60 ? percetange : -1 * percetange)
  }
  nearColors (color) {
    const isTooLight = color[2] > 80
    const isTooDark = color[2] < 20
    // const hsl = this.toHsl(color)
    return {
      hover: this.lighten(color, isTooLight ? -6 : 6),
      active: this.lighten(color, isTooDark ? 12 : -12),
      border: this.lighten(color, isTooDark ? 10 : -10),
      borderhover: this.lighten(color, isTooDark ? 30 : -30),
      light: this.lighten(color, 8),
      dark: this.lighten(color, -8),
      placeholder: this.yiq(color, 30),
      text: this.yiq(color, 90),
      normal: color
    }
  }
  applyConfig (config) {
    this.value = config
    let cssContent = ':root{'
    this.value.forEach(data => {
      if (data.type === 'color') {
        Object.keys(data.value).forEach(amt => {
          cssContent += `--${data.type}-${data.name}-${amt}: hsl(${data.value[amt][0]},${data.value[amt][1]}%,${data.value[amt][2]}%);`
        })
      } else if (data.type === 'size' || data.type === 'speed') {
        Object.keys(data.value).forEach(amt => {
          cssContent += `--${data.type}-${data.name}-${amt}: ${data.value[amt]}${data.unit};`
        })
      } else if (data.type === 'direction') {
        cssContent += `--direction: ${data.value.direction};`
        cssContent += `--block-start: ${data.value.blockStart};`
        cssContent += `--block-end: ${data.value.blockEnd};`
      }
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
          console.warn(styleElem)
          parent.$head.appendChild(styleElem)
        }

        resolve()
      }
      tryInject()
    })
  }
  setConfig (userConfig = []) {
    const defaultConfig = [
      {
        name: 'main',
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
        value: '0.35s'
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
    const config = JSON.parse(JSON.stringify(userConfig))
    const ret = []
    defaultConfig.concat(config).forEach(item => {
      if (item.type === 'color') {
        const value = this.toHsl(item.value)
        console.log(item.name, item.value, value, this.nearColors(value))
        ret.push({
          name: item.name,
          type: 'color',
          value: this.nearColors(value)
        })
      } else if (item.type === 'size') {
        const value = parseFloat(item.value)
        ret.push({
          name: item.name,
          type: 'size',
          unit: item.value.toString().replace(/\d+/g, '').replace('.', '') || 'em',
          value: {
            small: value / 2,
            normal: value,
            large: value * 1.5
          }
        })
      } else if (item.type === 'direction') {
        ret.push({
          type: 'direction',
          value: {
            direction: item.value === 'left' ? 'ltr' : 'rtl',
            blockStart: item.value === 'left' ? 'left' : 'right',
            blockEnd: item.value === 'left' ? 'right' : 'left'
          }
        })
      } else if (item.type === 'speed') {
        const value = parseFloat(item.value)
        ret.push({
          name: item.name,
          type: 'speed',
          unit: item.value.toString().replace(/\d+/g, '').replace('.', '') || 'em',
          value: {
            fast: value / 2,
            normal: value,
            slow: value * 2
          }
        })
      }
    })
    this.applyConfig(ret)
  }
}

export default new Config()
