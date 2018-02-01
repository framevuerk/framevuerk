<template lang="pug">
fv-main#app
  fv-header
    fv-button(@click="$refs.sidebar.toggle()", icon="fa fa-bars")
    .space
    .title
      h2.fv-no-wrap(v-if="$route.name !== 'welcome'") {{$route.name}}
      h2.fv-no-wrap(v-else) Framevuerk
    .space
    a.fv-link(v-if="$route.path.indexOf('/components') !== -1 && $route.path.indexOf('+') === -1", :href="$root.githubRepo + '/tree/master/src/components/' + $route.name",
      target="_blank") View Source
  router-view.fv-row
  fv-sidebar.sidebar(:pin="null", ref="sidebar", width="300px")
    fv-content.fv-no-padding
      fv-list.fv-no-border(parent)
        fv-list-item.framevuerk
          a.fv-link(href="index.html")
            img.fvlogo(src="../assets/logo.svg")
            h3.fvtext
              b Framevuerk
        fv-list-item(v-for="item in sidebarItems",
          :key="item.text",
          :selected="$route.name === item.text",
          @click="clickItem(item)",
          expanded)
          | {{item.text}}
          fv-list(v-if="item.items",
            slot="sub-list")
            fv-list-item(v-for="subItem in item.items",
              :key="subItem.text",
              :selected="$route.name === subItem.text",
              @click="clickItem(subItem)",
              expanded)
              | {{subItem.text}}
              fv-list(v-if="subItem.items",
                slot="sub-list",
                expanded)
                fv-list-item(v-for="subItemItem in subItem.items",
                  :key="subItemItem.text",
                  :selected="$route.name === subItemItem.text",
                  @click="clickItem(subItemItem)")
                  | {{subItemItem.text}}
</template>

<script>
// import '../assets/logo.svg'

export default {
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
                this.sidebarItem('fvList + fvListItem', '/components/fvList + fvListItem')
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
            this.sidebarItem('fvRow + fvCol', '/styles/fvRow + fvCol')
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
    & .fa {
      font-size: 1.3em;
      margin-right: 5px;
    }

    & .fv-item.selected {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
