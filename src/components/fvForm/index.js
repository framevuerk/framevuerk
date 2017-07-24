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
      function handleChilds (parent) {
        let succeed = 0
        parent.$children.every(child => {
          if (fvValidate(child)) {
            succeed++
          } else {
            focus(child)
            return false
          }
          if (parent.$children.length) {
            return handleChilds(child)
          }
        })

        if (succeed === parent.$children.length) {
          return true
        }
        return false
      }
      if (handleChilds(this)) {
        this.$emit('submit')
      } else {
        this.$emit('reject')
      }
    }
  },
  render: template.render
}
