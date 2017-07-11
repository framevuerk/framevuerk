import template from './template.pug'

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
          title: 'Event`s',
          slot: 'event'
        },
        {
          title: 'Prop`s',
          slot: 'prop'
        },
        {
          title: 'Method`s',
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
        return ['name', 'params']
      case 'method':
        return ['name', 'params']
      }
    }
  },
  render: template.render
}
