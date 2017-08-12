import template from './template.pug'

export default {
  methods: {
    submit () {
      function fvValidate (child) {
        if (typeof child.fvValidate !== 'undefined' && !child.fvValidate) {
          return false
        }
        return true
      }
      function focus (child) {
        if (typeof child.focus === 'function') {
          child.focus()
        } else if (typeof child.$el.focus === 'function') {
          child.$el.focus()
        }
      }
      function getChilds (parent, force = false) {
        let ret = []
        if (parent.$el.classList.contains('fv-form') && !force) {
          return []
        }
        parent.$children.forEach(child => {
          ret.push(child)
          if (child.$children.length) {
            ret = ret.concat(getChilds(child, false))
          }
        })
        return ret
      }

      const childs = getChilds(this, true)
      let firstInvalidChild
      childs.every(child => {
        if (fvValidate(child)) {
          return true
        } else {
          focus(child)
          firstInvalidChild = child
          return false
        }
      })
      if (!firstInvalidChild) {
        this.$emit('submit')
      } else {
        this.$emit('reject', firstInvalidChild)
      }
    }
  },
  render: template.render
}
