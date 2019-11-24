import config from '../utility/config.js'

const colorValidator = v => !!config.get(['color', v])

export default function (colors = {
  color: 'background'
}) {
  const props = {}
  Object.keys(colors).forEach(color => {
    props[color] = {
      type: String,
      default: colors[color],
      validate: colorValidator
    }
  })

  return {
    props,
    inject: ['ThemeProvider'],
    computed: {
      colorsCssVars () {
        const ret = {}
        Object.keys(colors).forEach(colorKey => {
          const colorName = this[colorKey]
          if (colorName === '') {
            return
          }
          const colorValue = this.ThemeProvider.colors[colorName]
          Object.keys(colorValue).forEach(state => {
            ret[`--${colorKey}-${state}`] = `var(--colors-${colorName}-${state})`
          })
        })
        return ret
      }
    }
  }
}