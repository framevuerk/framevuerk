import template from './template.pug'
import style from './style.scss'
import '../../assets/logo-white.svg'

export default {
  data () {
    return {

    }
  },
  computed: {
    sidebarItems () {
      return [{
        text: 'Main',
        items: [
          this.sidebarItem('fvMain'),
          this.sidebarItem('fvHeader'),
          this.sidebarItem('fvContent'),
          this.sidebarItem('fvFooter'),
          this.sidebarItem('fvSidebar')
        ]
      }, {
        text: 'Dialog',
        items: [
          this.sidebarItem('fvDialog'),
          this.sidebarItem('fvMenu')
        ]
      }, {
        text: 'Form',
        items: [
          this.sidebarItem('fvForm'),
          this.sidebarItem('fvInput'),
          this.sidebarItem('fvTextarea'),
          this.sidebarItem('fvSelect'),
          this.sidebarItem('fvDatepicker'),
          this.sidebarItem('fvSwitch'),
          this.sidebarItem('fvCheck')
        ]
      }]
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
    sidebarItem (name) {
      return {
        text: name,
        icon: 'fa fa fa-puzzle-piece',
        selected: this.$route.name === name,
        action: () => {
          this.$router.push(`/components/${name}`)
        }
      }
    },
    routeChange () {
      if (!this.$refs.sidebar.pPin) {
        this.$refs.sidebar.close()
      }
      if (this.$route.name === 'notfound') {
        this.$router.push(`/components/fvMain`)
      }
    }
  },
  mounted () {
    this.routeChange()
  },
  style,
  render: template.render
}
