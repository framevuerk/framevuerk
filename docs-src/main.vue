<template lang="pug">
fv-main#app
  fv-header
    fv-button(@click="$refs.sidebar.toggle()", icon="fa fa-bars")
    .space
    .title
      h2.fv-no-wrap {{$route.name}}
    .space
    a.fv-link(v-if="$route.path.indexOf('/components') !== -1 && $route.path.indexOf('-') === -1", :href="$root.githubRepo + '/tree/master/src/components/' + $route.name",
      target="_blank") View Source
  router-view.fv-row
  fv-sidebar.sidebar(:pin="isSidebarPinned", ref="sidebar", width="300px")
    fv-content.fv-no-padding
      fv-list.fv-no-border(parent)
        fv-list-item.framevuerk
          router-link.fv-block(to="/")
            img.fvlogo(src="./assets/logo.svg")
            h3.fvtext
              b Framevuerk
        fv-list-item(v-for="item in sidebarItems",
          :key="item.text",
          :selected="$route.name === item.text",
          expanded)
          router-link.fv-padding.fv-block(:to="item.route || ''") {{item.text}}
          fv-list(v-if="item.items",
            slot="sub-list")
            fv-list-item(v-for="subItem in item.items",
              :key="subItem.text",
              :selected="$route.name === subItem.text",
              expanded)
              router-link.fv-padding.fv-block(:to="subItem.route || ''") {{subItem.text}}
              fv-list(v-if="subItem.items",
                slot="sub-list",
                expanded)
                fv-list-item(v-for="subItemItem in subItem.items",
                  :key="subItemItem.text",
                  :selected="$route.name === subItemItem.text")
                  router-link.fv-padding.fv-block(:to="subItemItem.route || ''") {{subItemItem.text}}
</template>

<script>
export default {
  data () {
    return {
      isSidebarPinned: this.$route.name === 'Home' ? false : null
    }
  },
  computed: {
    sidebarItems () {
      return [
        {
          text: 'Installation',
          items: [
            this.sidebarItem('Setup', '/Installation=setup'),
            this.sidebarItem('.framevuerkrc', '/Installation=.framevuerkrc')
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
                this.sidebarItem('fvList-fvListItem', '/components=fvList-fvListItem')
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
                this.sidebarItem('fvImg'),
                this.sidebarItem('fvToast')
              ]
            }
          ]
        },
        {
          text: 'Styles',
          items: [
            this.sidebarItem('fvRow-fvCol', '/styles=fvRow-fvCol')
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
        route: route || `/components=${name}`
      }
    },
    routeChange () {
      this.isSidebarPinned = this.$route.name === 'Home' ? false : null
      if (this.$route.name === 'Home') {
        this.$refs.sidebar.close()
      }
      setTimeout(() => {
        if (this.$refs.sidebar.isPinned === true) {
          this.$refs.sidebar.open()
        } else {
          this.$refs.sidebar.close()
        }
      })
    }
  },
  mounted () {
    this.routeChange()
  }
}
</script>

<style lang="scss">
body .sidebar {
  & .fvlogo,
  & .fvtext {
    display: inline-block;
    vertical-align: middle;
  }

  & .fvlogo {
    height: 27px;
  }

  & .fv-tabs {
    height: auto;
  }

  & .fv-list {
    & .fv-list-item a,
    & .fv-list-item a:visited,
    & .fv-list-item a:hover {
      color: inherit;
    }
  }
}
</style>
