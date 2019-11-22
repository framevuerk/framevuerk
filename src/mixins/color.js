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
    computed: {
      colorsCssVars () {
        const ret = {}
        Object.keys(colors).forEach(color => {
          const cnf = config.get(['color', this[color]])
          Object.keys(cnf.value).forEach(key => {
            ret[`--${color}-${key}`] = `var(--${cnf.type}-${cnf.name}-${key})`
          })
        })
        return ret
      }
    }
  }
}