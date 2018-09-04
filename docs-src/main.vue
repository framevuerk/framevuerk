<template lang="pug">
fv-main#app
  fv-header
    fv-button.fv-hide-on-lg(@click="sidebarVisible = !sidebarVisible")
      .icon(v-html="require('../src/icons/feather/menu.svg')")
    .space.fv-hide-on-lg
    .title
      h2.fv-no-wrap {{$route.name}} pin:{{sidebarPin}} visible:{{sidebarVisible}}
    .space
    a.fv-link(v-if="$route.path.indexOf('/components') !== -1 && $route.path.indexOf('-') === -1", :href="$root.githubRepo + '/tree/master/src/components/' + $route.name + '.vue'",
      target="_blank") View Source
  fv-content.fv-no-padding
    router-view
  fv-sidebar.sidebar.fv-col-xs-10.fv-col-sm-6.fv-col-md-4.fv-col-lg-2(:pin="sidebarPin", @update:pin="sidebarPin = $event;", v-model="sidebarVisible")
    .fv-padding
      fv-input.fv-block(placeholder="Type to search...", @input="searchSidebar", autofocus)
    fv-content.fv-no-padding
      fv-list.fv-no-border(v-show="!searching", parent)
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
      fv-list.fv-no-border(v-show="searching", parent)
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
      // isSidebarPinned: this.$route.name === 'Home' ? false : undefined,
      searching: false,
      searchResult: [],
      sidebarVisible: false,
      sidebarPin: false
    }
  },
  computed: {
    sidebarItems () {
      return [
        {
          text: 'Installation',
          items: [
            this.sidebarItem('Setup', '/installation=setup', ['setup']),
            this.sidebarItem('Customize', '/installation=customize', ['customize'])
          ]
        },
        {
          text: 'Components',
          items: [
            {
              text: 'Main',
              items: [
                this.sidebarItem('fvMain', null, ['main', 'fv-main', 'fvmain', 'layout']),
                this.sidebarItem('fvHeader', null, ['header', 'fv-header', 'fvheader', 'layout']),
                this.sidebarItem('fvContent', null, ['content', 'fv-content', 'fvcontent', 'layout']),
                this.sidebarItem('fvFooter', null, ['footer', 'fv-footer', 'fvfooter', 'layout']),
                this.sidebarItem('fvSidebar', null, ['sidebar', 'fv-sidebar', 'fvsidebar', 'layout']),
                this.sidebarItem('fvList-fvListItem', '/components=fvList-fvListItem', ['list', 'list-item', 'item', 'fvlist', 'fv-list', 'fvlistitem', 'fv-list-item'])
              ]
            },
            {
              text: 'Dialog',
              items: [
                this.sidebarItem('fvDialog', null, ['dialog', 'modal', 'alert', 'message', 'box', 'fv-dialog', 'fvdialog']),
                this.sidebarItem('fvMenu', null, ['menu', 'sheet', 'fv-menu', 'fvmenu', 'dialog'])
              ]
            }, {
              text: 'Form',
              items: [
                this.sidebarItem('fvButton', null, ['button', 'fv-button', 'fvbutton', 'form']),
                this.sidebarItem('fvInput', null, ['input', 'text-box', 'textbox', 'form', 'fv-input', 'fvinput']),
                this.sidebarItem('fvTextarea', null, ['input', 'text-box', 'textbox', 'form', 'fv-textarea', 'fvtextarea', 'textarea']),
                this.sidebarItem('fvSelect', null, ['input', 'select', 'option', 'form', 'dropdown', 'fv-select', 'fvselect']),
                this.sidebarItem('fvDatepicker', null, ['input', 'date-picker', 'datepicker', 'form', 'fv-datepicker', 'fvdatepicker']),
                this.sidebarItem('fvSwitch', null, ['switch', 'toggle', 'handle', 'check', 'form', 'fv-switch', 'fvswitch']),
                this.sidebarItem('fvCheck', null, ['checkbox', 'check-box', 'check', 'radio', 'radiobutton', 'radio-button', 'form', 'fv-check', 'fvcheck']),
                this.sidebarItem('fvFilepicker', null, ['filepicker', 'file-picker', 'file-select', 'form', 'browse', 'fv-filepicker', 'fvfilepicker']),
                this.sidebarItem('fvForm', null, ['submit', 'form', 'fv-form', 'fvform']),
                this.sidebarItem('fvSteps', null, ['steps', 'step', 'form', 'fv-steps', 'fvsteps']),
                this.sidebarItem('fvRange', null, ['range', 'slider', 'from', 'to', 'form', 'fv-range', 'fvrange'])
              ]
            }, {
              text: 'Other',
              items: [
                this.sidebarItem('fvTable', null, ['table', 'list', 'fv-table', 'fvtable']),
                this.sidebarItem('fvSlider', null, ['slider', 'fv-slider', 'fvslider']),
                this.sidebarItem('fvImg', null, ['image', 'picture', 'img', 'pic', 'fv-img', 'fvimg']),
                this.sidebarItem('fvToast', null, ['toast', 'alert', 'msg', 'message', 'fv-toast', 'fvtoast']),
                this.sidebarItem('fvAvatar', null, ['avatar', 'profile-picture', 'profile', 'display-image', 'fv-avatar', 'fvavatar']),
                this.sidebarItem('fvLoading', null, ['loading', 'spinner', 'waiting', 'fv-loading', 'fvloading']),
                this.sidebarItem('fvPagination', null, ['pagination', 'paginate', 'page', 'fv-pagination', 'fvpagination'])
              ]
            }
          ]
        },
        {
          text: 'Styles',
          items: [
            this.sidebarItem('fvRow-fvCol', '/styles=fvRow-fvCol', ['css', 'style', 'grid', 'row', 'col', 'column', 'fv-row', 'fvrow', 'fv-col', 'fvcol'])
          ]
        }
      ]
    }
  },
  watch: {
    '$route.name' () {
      this.routeChange()
    },
    sidebarPin (value, oldValue) {
      console.log('sidebarPin changes from', oldValue, 'to', value)
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
      text = text.toLowerCase()
      const search = (list) => {
        list.forEach(item => {
          if (item.items && item.items.length) {
            return search(item.items)
          }
          if (item.tags) {
            let pushed = false
            item.tags.forEach(tag => {
              if (pushed) {
                return false
              }
              if (tag.indexOf(text) !== -1 || text.indexOf(tag) !== -1) {
                this.searchResult.push(item)
                pushed = true
              }
            })
          }
        })
      }
      search(this.sidebarItems)
    },
    sidebarItem (name, route = null, tags = null) {
      return {
        text: name,
        route: route || `/components=${name}`,
        tags: tags || []
      }
    },
    routeChange () {
      // this.isSidebarPinned = this.$route.name === 'Home' ? false : null
      // if (this.$route.name === 'Home') {
      //   this.$refs.sidebar.close()
      // }
      // setTimeout(() => {
      //   if (this.$refs.sidebar.isPinned === true && this.$refs.sidebar.visible === false) {
      //     this.$refs.sidebar.open()
      //   } else if (!this.$refs.sidebar.isPinned) {
      //     this.$refs.sidebar.close()
      //   }
      // })
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
