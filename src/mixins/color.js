import config from '../utility/config.js'

// const colorValidator = v => !!config.get(['color', v])

export default function (colors = {
  color: 'background'
}) {
  const props = {}
  Object.keys(colors).forEach(color => {
    props[color] = {
      type: String,
      default: colors[color]
    }
  })

  // the only way that i found to put colorsProp to context
  // as you now using 'colors' variable inside functions inside context is not equal to real value
  // console.log('z', colors)
  console.log('v', Object.keys(colors).join('&'))
  props['colorProps'] = {
    type: String,
    default: Object.keys(colors).join('&')
  }

  return {
    props,
    inject: ['ThemeProvider'],
    computed: {
      colorsCssVars () {
        const ret = {}
        console.log('a', this.colorProps)
        this.colorProps.split('&').forEach(colorKey => {
          const colorName = this[colorKey]
          if (colorName === '') {
            return
          }
          const colorValue = this.ThemeProvider.colors[colorName || 'background']
          // console.log(colorName, colorValue)
          Object.keys(colorValue).forEach(state => {
            ret[`--${colorKey}-${state}`] = `var(--colors-${colorName}-${state})`
          })
        })
        return ret
      }
    }
  }
}