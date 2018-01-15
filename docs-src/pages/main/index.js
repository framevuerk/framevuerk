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
      return [
        {
          text: 'Installation',
          items: [
            this.sidebarItem('Include', '/Installation/include'),
            this.sidebarItem('Usage', '/Installation/usage')
          ]
        },
        {
          text: 'Components',
          items: [
            {
              text: 'Main',
              items: [
                this.sidebarItem('fvMain'),
                this.sidebarItem('fvHeader'),
                this.sidebarItem('fvContent'),
                this.sidebarItem('fvFooter'),
                this.sidebarItem('fvSidebar'),
                this.sidebarItem('fvList + fvListItem', '/components/fvList+fvListItem')
              ]
            },
            {
              text: 'Dialog',
              items: [
                this.sidebarItem('fvDialog'),
                this.sidebarItem('fvMenu')
              ]
            }, {
              text: 'Form',
              items: [
                this.sidebarItem('fvButton'),
                this.sidebarItem('fvInput'),
                this.sidebarItem('fvTextarea'),
                this.sidebarItem('fvSelect'),
                this.sidebarItem('fvDatepicker'),
                this.sidebarItem('fvSwitch'),
                this.sidebarItem('fvCheck'),
                this.sidebarItem('fvFilepicker'),
                this.sidebarItem('fvForm')
              ]
            }, {
              text: 'Other',
              items: [
                this.sidebarItem('fvTable'),
                this.sidebarItem('fvSlider'),
                this.sidebarItem('fvImg')
              ]
            }
          ]
        }
      ]
    }
  },
  watch: {
    $route () {
      this.routeChange()
    }
  },
  methods: {
    clickItem (item) {
      if (item.route) {
        this.$router.push(item.route)
      }
    },
    sidebarItem (name, route) {
      return {
        text: name,
        route: route || `/components/${name}`
      }
    },
    routeChange () {
      if (!this.$refs.sidebar.isPinned) {
        this.$refs.sidebar.close()
      }
      if (this.$route.name === 'notfound') {
        this.$router.push('/Installation/include')
      }
    }
  },
  mounted () {
    this.routeChange()
  },
  style,
  render: template.render
}
