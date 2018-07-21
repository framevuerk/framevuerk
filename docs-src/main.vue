<template lang="pug">
fv-main#app
  fv-header
    fv-button.fv-hide-on-lg(@click="$refs.sidebar.toggle()")
      .icon(v-html="require('../src/icons/feather/menu.svg')")
    .space.fv-hide-on-lg
    .title
      h2.fv-no-wrap {{$route.name}}
    .space
    a.fv-link(v-if="$route.path.indexOf('/components') !== -1 && $route.path.indexOf('-') === -1", :href="$root.githubRepo + '/tree/master/src/components/' + $route.name + '.vue'",
      target="_blank") View Source
  fv-content.fv-no-padding
    router-view.fv-row
  fv-sidebar.sidebar(:pin="isSidebarPinned", ref="sidebar", width="300px")
    .fv-padding
      fv-input.fv-block(placeholder="Type to search...", @input="searchSidebar")
    fv-content.fv-no-padding
      fv-list.fv-no-border(v-if="!searching", parent)
        fv-list-item.framevuerk
          router-link.fv-block(to="/")
            .fvlogo(v-html="require('./assets/logo.svg')")
            h3.fvtext
              b Framevuerk
        fv-list-item(v-for="item in sidebarItems",
          :key="item.text",
          :selected="$route.name === item.text",
          expanded)
          router-link.fv-padding-small.fv-block(:to="item.route || ''") {{item.text}}
          fv-list(v-if="item.items",
            slot="sub-list")
            fv-list-item(v-for="subItem in item.items",
              :key="subItem.text",
              :selected="$route.name === subItem.text",
              expanded)
              router-link.fv-padding-small.fv-block(:to="subItem.route || ''")
                |  {{subItem.text}}
              fv-list(v-if="subItem.items",
                slot="sub-list",
                expanded)
                fv-list-item(v-for="subItemItem in subItem.items",
                  :key="subItemItem.text",
                  :selected="$route.name === subItemItem.text")
                  router-link.fv-padding-small.fv-block(:to="subItemItem.route || ''")
                    |  {{subItemItem.text}}
      fv-list.fv-no-border(v-else, parent)
        fv-list-item(v-for="item in searchResult",
          :key="item.text",
          :selected="$route.name === item.text")
          router-link.fv-padding-small.fv-block(:to="item.route || ''")
            |  {{item.text}}

</template>

<script>
export default {
  data () {
    return {
      isSidebarPinned: this.$route.name === 'Home' ? false : null,
      searching: false,
      searchResult: []
    }
  },
  computed: {
    sidebarItems () {
      return [
        {
          text: 'Installation',
          items: [
            this.sidebarItem('Setup', '/installation=setup', 'fa fa-cogs'),
            this.sidebarItem('Customize', '/installation=customize', 'fa fa-cogs')
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
                this.sidebarItem('fvList-fvListItem', '/components=fvList-fvListItem', 'fa fa-list-ol')
              ]
            },
            {
              text: 'Dialog',
              items: [
                this.sidebarItem('fvDialog', null, 'fa fa-window-maximize'),
                this.sidebarItem('fvMenu', null, 'fa fa-ellipsis-h')
              ]
            }, {
              text: 'Form',
              items: [
                this.sidebarItem('fvButton'),
                this.sidebarItem('fvInput', null, 'fa fa-keyboard-o'),
                this.sidebarItem('fvTextarea', null, 'fa fa-keyboard-o'),
                this.sidebarItem('fvSelect', null, 'fa fa-bars'),
                this.sidebarItem('fvDatepicker', null, 'fa fa-calendar-o'),
                this.sidebarItem('fvSwitch', null, 'fa fa-toggle-on'),
                this.sidebarItem('fvCheck', null, 'fa fa-check-circle'),
                this.sidebarItem('fvFilepicker', null, 'fa fa-file'),
                this.sidebarItem('fvForm', null, 'fa fa-wpforms'),
                this.sidebarItem('fvSteps', null, 'fa fa-list-ol'),
                this.sidebarItem('fvRange', null, 'fa fa-arrows-h')
              ]
            }, {
              text: 'Other',
              items: [
                this.sidebarItem('fvTable', null, 'fa fa-th-large'),
                this.sidebarItem('fvSlider'),
                this.sidebarItem('fvImg', null, 'fa fa-image'),
                this.sidebarItem('fvToast', null, 'fa fa-info'),
                this.sidebarItem('fvAvatar', null, 'fa fa-user')
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
    searchSidebar (text) {
      this.searching = !!text
      this.searchResult = []
      const search = (list) => {
        list.forEach(item => {
          if (item.route && item.text.indexOf(text) !== -1) {
            this.searchResult.push(item)
          }
          if (item.items && item.items.length) {
            search(item.items)
          }
        })
      }
      search(this.sidebarItems)
    },
    sidebarItem (name, route, icon) {
      return {
        text: name,
        route: route || `/components=${name}`,
        icon: icon || 'fa fa-cube'
      }
    },
    routeChange () {
      this.isSidebarPinned = this.$route.name === 'Home' ? false : null
      if (this.$route.name === 'Home') {
        this.$refs.sidebar.close()
      }
      setTimeout(() => {
        if (this.$refs.sidebar.isPinned === true && this.$refs.sidebar.visible === false) {
          this.$refs.sidebar.open()
        } else if (!this.$refs.sidebar.isPinned) {
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
    & svg {
      margin-right: 5px;
      height: 25px;
      width: auto;
      vertical-align: middle;

      & > * {
        fill: #fff;
      }
    }
  }

  & .fv-tabs {
    height: auto;
  }
}
</style>
