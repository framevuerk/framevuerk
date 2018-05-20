<template lang="pug">
fv-main#app
  fv-header
    fv-button(@click="$refs.sidebar.toggle()", icon="fa fa-bars", v-show="isSidebarPinned !== false")
    .space(v-show="isSidebarPinned !== false")
    .title
      h2.fv-no-wrap {{$route.name}}
    .space
    a.fv-link(v-if="$route.path.indexOf('/components') !== -1 && $route.path.indexOf('-') === -1", :href="$root.githubRepo + '/tree/master/src/components/' + $route.name + '.vue'",
      target="_blank") View Source
  fv-content
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
              router-link.fv-padding.fv-block(:to="subItem.route || ''")
                i.p-icon(:class="subItem.icon")
                |  {{subItem.text}}
              fv-list(v-if="subItem.items",
                slot="sub-list",
                expanded)
                fv-list-item(v-for="subItemItem in subItem.items",
                  :key="subItemItem.text",
                  :selected="$route.name === subItemItem.text")
                  router-link.fv-padding.fv-block(:to="subItemItem.route || ''")
                    i.p-icon(:class="subItemItem.icon")
                    |  {{subItemItem.text}}
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
                this.sidebarItem('fvAutocomplete', null, 'fa fa-tags'),
                this.sidebarItem('fvForm', null, 'fa fa-wpforms'),
                this.sidebarItem('fvSteps', null, 'fa fa-list-ol'),
                this.sidebarItem('fvRange', null, 'fa fa-arrows-h')
              ]
            }, {
              text: 'Other',
              items: [
                this.sidebarItem('fvTable', null, 'fa fa-th-large'),
                this.sidebarItem('fvTable2', null, 'fa fa-th-large'),
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

  & .fv-list-item {
    & .p-icon {
      color: rgba(0, 0, 0, 0.7);
      font-size: 1.4em;
      min-width: 1.4em;
    }

    &.selected {
      & .p-icon {
        color: white;
      }
    }
  }
}
</style>
