import template from './template.pug'
import style from './style.scss'
import '../../assets/logo-white.svg'

export default {
  computed: {
    sidebarItems () {
      const ret = []
      const components = [
        'fvMain',
        'fvHeader',
        'fvSidebar',
        'fvFooter'
      ]
      components.forEach(component => {
        ret.push({
          key: component,
          icon: 'fa fa-puzzle-piece',
          text: ` ${component}`,
          selected: this.$route.name === component,
          action: () => {
            this.$router.push(`/components/${component}`)
          }
        })
      })
      return ret
    },
    sidebarTabs () {
      return [
        {title: 'Components', slot: 'components'},
        {title: 'Directives', slot: 'directives'},
        {title: 'Styles', slot: 'styles'}
      ]
    }
  },
  watch: {
    $route () {
      this.routeChange()
    }
  },
  methods: {
    routeChange () {
      if (!this.$refs.sidebar.pPin) {
        this.$refs.sidebar.close()
      }
    }
  },
  mounted () {
    this.routeChange()
  },
  style,
  render: template.render
}
