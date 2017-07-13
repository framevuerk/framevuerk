import template from './template.pug'
import style from './style.scss'

export default {
  props: {
    rows: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      tabs: [
        {
          title: 'Prop\'s',
          slot: 'prop'
        },
        {
          title: 'Event\'s',
          slot: 'event'
        },
        {
          title: 'Method\'s',
          slot: 'method'}
      ]
    }
  },
  methods: {
    fields (type) {
      switch (type) {
      case 'prop':
        return ['name', 'type', {value: 'default', class: 'fv-hide-on-only-xs'}, {value: 'description', class: 'fv-hide-on-only-xs'}]
      case 'event':
        return ['name', 'params', {value: 'description', class: 'fv-hide-on-only-xs'}]
      case 'method':
        return ['name', 'params', {value: 'description', class: 'fv-hide-on-only-xs'}]
      }
    }
  },
  style,
  render: template.render
}
