<template lang="pug">
.framevuerk(:style="style", :dir="direction")
  slot
</template>

<script>
function objToArr(obj, cb) {
  const ret = []
  Object.keys(obj).forEach(key => {
    ret.push(cb(key, obj[key]))
  })
  return ret
}

function hexToHsl (hexString) {
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

function contrast (color, percetange) {
  return [
    color[0],
    color[1],
    Math.max(0, Math.min(color[2] + percetange, 100))
  ]
}
  
export default {
  props: {
    direction: {
      type: String,
      validator: v => ['ltr', 'rtl'].includes(v),
      default: 'ltr'
    },
    sizes: {
      type: Object,
      default: () => ({})
    },
    colors: {
      type: Object,
      default: () => ({})
    },
    speed: {
      type: Number,
      default: 250
    }
  },
  provide () {
    // css variables automaticly provided by style computed prop
    return {
      ThemeProvider: {
        sizes: this._sizes,
        colors: this._colors,
        speed: this._speed,
        direction: this._direction,
        register: this.register
      }
    }
  },
  computed: {
    // prop sizes merged to default values
    __sizes () {
      return Object.assign({
        shadow: '3px',
        space: '1em',
        radius: '4px'
      }, this.sizes)
    },
    // prop colors merged to default values
    __colors () {
        return Object.assign({
          background: '#fff',
          primary: '#41b883',
          secondary: '#35485d',
          info: '#14b0cf',
          warning: '#ffd400',
          danger: '#dd4b39',
        }, this.colors)
    },
    _sizes () {
      const ret = {}
      objToArr(this.__sizes, (key, _value) => {
        const value = parseFloat(_value)
        const unit = _value.toString().replace(/\d+/g, '').replace('.', '') || 'em'
        const cover = v => `${v}${unit}`
        ret[key] = {
          sm: cover(value * 0.5),
          md: cover(value),
          lg: cover(value * 1.5)
        }
      })
      return ret
    },
    _colors () {
      const ret = {}
      objToArr(this.__colors, (key, _value) => {
        const value = hexToHsl(_value)
        const isLight = value[2] > 80
        const isDark = value[2] < 20

        const cover = v => `hsl(${v[0]}, ${v[1]}%, ${v[2]}%)`
        const coverA = (v, a) => `hsla(${v[0]}, ${v[1]}%, ${v[2]}%, ${a})`
        ret[key] = {
          normal:       cover(value),
          shallow:      coverA(contrast(value, value[2] > 80 ? -20 : 10), 0.7),
          light:        cover(contrast(value, 8)),
          dark:         cover(contrast(value, -8)),
          text:         cover(contrast(value, value[2] < 70 ? 90 : -90)),
          placeholder:  cover(contrast(value, value[2] < 60 ? 40 : -40)),
          hover:        cover(contrast(value, value[2] > 80 ? -6 : 6)),
          active:       cover(contrast(value, value[2] < 20 ? 9 : -9)),
          border:       cover(contrast(value, value[2] < 20 ? 15 : -15)),
          borderhover:  cover(contrast(value, value[2] < 20 ? 35 : -35)),
        }
      })
      return ret
    },
    _speed () {
      const cover = v => `${v}ms`
      return {
        fast:   cover(this.speed * 0.4),
        normal: cover(this.speed),
        slow:   cover(this.speed * 1.7)
      }
    },
    _direction () {
      return {
        start: this.direction === 'ltr' ? 'left' : 'right',
        end: this.direction === 'ltr' ? 'right' : 'left',
        value: this.direction
      }
    },
    style () {
      const ret = {};
      ['colors', 'sizes'].forEach(type => {
        objToArr(this[`_${type}`], (name, _value) => {
          objToArr(_value, (state, value) => {
            ret[`--${type}-${name}-${state}`] = value
          })
        })
      });
      ['speed', 'direction'].forEach(type => {
        objToArr(this[`_${type}`], (state, value) => {
          ret[`--${type}-${state}`] = value
        })
      })
      return ret
    }
  },
  methods: {
    register (values, to = false) {
      // keys = [
      //  'speed' // global register
      //  'colors.primary', // global register
      //  'x:colors.primary, // local register as x
      // ]
      const ret = {}
      for (let i = 0; i < values.length; keys++) {
        const localRet = {}
        const [ name, type, key ] = (x => {
          const ret = [x, false, false]
          [':', '.'].forEach((s, i) => {
            const splited = ret[i].split(s)
            if (splited.length > 1) {
              ret[i] = splited[0]
              ret[i+1] = splited[1]
            }
          })
          if (!ret[1]) {
            ret[1] = ret[0]
            ret[0] = ''
          }
          return ret
        })(values[i])

        if (!key) {
          objToArr(this[`_${type}`], (state, value) => {
            localRet[`--${name || type}-${state}`] = value
          })
        } else {
          objToArr(this[`_${type}`][key], (state, value) => {
            localRet[`--${name || `${type}-${key}`}-${state}`] = value
          })
        }
        if (name) {
          ret = Object.assign(ret, localRet)
        } else {
          this.style = Object.assign(this.style, localRet)
        }
      }
      if (to) {
        to.style = ret
      }
      return ret
    }
  }
}
</script>

<style lang="scss">
// style packages that affect to output
@import '../styles/reset';
@import '../styles/global';
@import '../styles/grid';
@import '../styles/sizes';
@import '../styles/helper';

.framevuerk {
  background: var(--colors-background-normal);
  color: var(--colors-background-text);
}
</style>
