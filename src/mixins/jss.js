
// const colorValidator = v => !!config.get(['color', v])

// export default {
//   inject: ['ThemeProvider'],
//   computed: {
//     style () {
//       return jss({
//         button: {
//           color: 'red',
//           backgroundColor: 'green',
//           '&:hover': {
//             backgroundColor: 'red'
//           }
//         },
//       })
//     }
//   }
// }

function dashCase (c) {
  let ret = ''
  for (let i = 0; i < c.length; i++) {
    if (i > 0 && /[A-Z]/.test(c[i])) {
      ret += '-'
    }
    ret += c[i].toLowerCase()
  }
  return ret
}

function objToArr (obj, cb) {
  const ret = []
  Object.keys(obj).forEach(key => {
    ret.push(cb(key, obj[key]))
  })
  return ret
}

function cssToText (selector, style) {
  let ret = ''
  const nexts = []
  ret += `${selector} {`
  objToArr(style, (key, value) => {
    const prop = dashCase(key)
    if (prop.includes('&')) {
      // nested
      const arrProp = Array.isArray(prop) ? prop : [prop]
      const newSelector = arrProp.map(x => x.split('&').join(selector)).join(',')
      nexts.push(
        cssToText(newSelector, value)
      )
    } else {
      ret += `${prop}: ${value};`
    }
  })
  ret += '} '
  nexts.forEach(nextRet => {
    ret += nextRet
  })
  return ret
}


const globalStyle = []

const cache = []
const casheSet = new Set()

function cachedClassName (content) {
  return (cashe.find(x => x.content === content) || {className: false}).className
}

function getFreeClassName (name) {
  let i = 1
  while (casheSet.has([name, i])) {
    i++
  }
  return `${name}-${i}`
}

function registerStyle (name, content, number, cssText) {
  cashe.push({
    className: `${name}-${number}`,
    content
  })
  casheSet.add({
    name,
    number
  })
  globalStyle.push(cssText)
}


function jss (classes) {
  let ret = {}
  objToArr(classes, (name, content) => {
    const contentHash = JSON.stringify(content)
    let cached = cachedClassName(contentHash)
    if (cached) {
      ret[name] = cached.className
    } else {
      ret[name] = getFreeClassName(name)
      const cssText = cssToText(`.${ret[name]}`, content)
      registerStyle(name, contentHash, i, cssText)
    }
  })

  return ret
}



console.log(jss({
  box: {
    color: 'red',
    backgroundColor: 'blue',
    '&:hover': {
      color: 'blue',
      '&:active': {
        boxShadow: '0 0 0 5px green'
      }
    },
    '& > .gooz, &:before': {
      boxShadow: '0 0 0 2px'
    }
  }
}))
