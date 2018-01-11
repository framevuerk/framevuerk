import locale from 'locale'
import template from './template.pug'
import fvButton from '../fvButton'

export default {
  components: {
    fvButton
  },
  props: {
    value: {
      default: undefined
    },
    required: {
      type: [Boolean, Function],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    buttonClass: {
      default: ''
    },
    defaultText: {
      default: locale.browse()
    },
    type: {
      type: String,
      validator: (value) => {
        return ['blob', 'file'].indexOf(value) > -1
      },
      default: 'blob'
    }
  },
  computed: {
    selected () {
      return !!this.value
    },
    displayValue () {
      if (!this.selected) {
        return this.defaultText
      } else {
        const count = this.value.constructor === Array ? this.value.length : 1
        if (count === 1 && this.value.name) {
          return this.value.name
        }
        return locale.nFileSelected(count)
      }
    },
    fvValidate () {
      if (this.required === true) {
        return this.selected
      } else if (typeof this.required === 'function') {
        return this.required()
      }
      return true
    }
  },
  methods: {
    choose (event) {
      if (event.detail) {
        this.$refs.input.click()
      }
    },
    focus () {
      this.$refs.button.$el.focus()
    },
    pick () {
      const loadAsBlob = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.addEventListener('load', () => {
            resolve(new Blob([reader.result], {
              type: file.type,
              endings: 'native'
            }))
          })
          reader.addEventListener('error', reject)
          reader.readAsArrayBuffer(file)
        })
      }
      let value = []
      let j = 0
      const filesCount = this.$refs.input.files.length
      if (filesCount === 0) {
        this.$emit('input', this.multiple ? [] : null)
      } else {
        switch (this.type) {
        case 'blob':
          for (let i = 0; i < filesCount; i++) {
            loadAsBlob(this.$refs.input.files[i]).then((result) => {
              value.push(result)
              if (++j === filesCount) {
                this.$emit('input', this.multiple ? value : value[0])
              }
            })
          }
          break
        case 'file':
          this.$emit('input', this.multiple ? this.$refs.input.files : this.$refs.input.files[0])
          break
        }
      }
    }
  },
  render: template.render
}
