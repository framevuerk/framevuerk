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
        return ['name', 'type', 'default', 'description']
      case 'event':
        return ['name', 'params', 'description']
      case 'method':
        return ['name', 'params', 'description']
      }
    }
  },
  style,
  render: template.render
}
