<template>
  <fvSidebar :visible.sync="$root.sidebar" style="width: 300px;" position="start">
    <div css-color="sidebar">
      <router-link css-padding="md" css-display="block" to="/">
        <appLogo style="width: 35px;" white ready></appLogo>
        <b> Framevuerk </b>
      </router-link>
      <div css-padding="md" autofocus>
        <fvInput css-display="block" css-full-width placeholder="Type to search..." @input="search" css-color="sidebar" css-shadow="no"/>
      </div>
      <fvList v-if="typeof searchResult === 'undefined'">
        <fvListItem expanded class="unclickable">
            <i class="fa fa-code" /> Installation
            <fvList slot="sub-list">
              <fvListItem tag="router-link" :to="item.route" v-for="item in sidebarItems.installationItems" :key="item.text" :class="{ selected: $route.path === item.route }">
                  {{item.text}}
              </fvListItem>
            </fvList>
        </fvListItem>
        <fvListItem expanded class="unclickable">
            <i class="fa fa-cubes" /> Components
            <fvList slot="sub-list">
              <fvListItem expanded class="unclickable">
                  <i class="fa fa-pencil-square-o" /> Form
                  <fvList slot="sub-list">
                    <fvListItem v-for="item in sidebarItems.componentFormItems" :key="item.text" :class="{ selected: $route.path === item.route }">
                        <router-link class="fv-block" :to="item.route">{{item.text}}</router-link>
                    </fvListItem>
                  </fvList>
              </fvListItem>
              <fvListItem expanded class="unclickable">
                  <i class="fa fa-info-circle" /> Dialog
                  <fvList slot="sub-list">
                    <fvListItem v-for="item in sidebarItems.componentDialogItems" :key="item.text" :class="{ selected: $route.path === item.route }">
                        <router-link class="fv-block" :to="item.route">{{item.text}}</router-link>
                    </fvListItem>
                  </fvList>
              </fvListItem>
              <fvListItem expanded class="unclickable">
                  <i class="fa fa-th-large" /> Layout
                  <fvList slot="sub-list">
                    <fvListItem v-for="item in sidebarItems.componentLayoutItems" :key="item.text" :class="{ selected: $route.path === item.route }">
                        <router-link class="fv-block" :to="item.route">{{item.text}}</router-link>
                    </fvListItem>
                  </fvList>
              </fvListItem>
              <fvListItem expanded class="unclickable">
                  <i class="fa fa-ellipsis-h" /> Other
                  <fvList slot="sub-list">
                    <fvListItem v-for="item in sidebarItems.componentOtherItems" :key="item.text" :class="{ selected: $route.path === item.route }">
                        <router-link class="fv-block" :to="item.route">{{item.text}}</router-link>
                    </fvListItem>
                  </fvList>
              </fvListItem>
            </fvList>
        </fvListItem>
        <fvListItem expanded class="unclickable">
            <i class="fa fa-css3" /> Styles
            <fvList slot="sub-list">
              <fvListItem v-for="item in sidebarItems.styleItems" :key="item.text" :class="{ selected: $route.path === item.route }">
                  <router-link class="fv-block" :to="item.route">{{item.text}}</router-link>
              </fvListItem>
            </fvList>
        </fvListItem>
      </fvList>
      <fvList v-else>
        <fvListItem v-for="item in searchResult" :key="item.text" :class="{ selected: $route.path === item.route }">
            <router-link class="fv-block" :to="item.route">{{item.text}}</router-link>
        </fvListItem>
      </fvList>
    </div>
  </fvSidebar>
</template>

<script>
import sidebarItems from '../sidebar-items.js'
import appLogo from './appLogo.vue'

export default {
  components: {
    appLogo
  },
  data () {
    return {
      query: '',
      sidebarItems,
      searchResult: undefined
    }
  },
  computed: {
  },
  methods: {
    search(str = '') {
      if (!str || !str.length) {
        this.searchResult = undefined
      } else {
        this.searchResult = sidebarItems.search(str)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-sidebar {
  padding: 0;
  min-width: 250px;
}

// .unclickable /deep/ {
//   & > .content{
//     background: rgba(0, 0, 0, 0.14);
//     padding: 0.8em 0;
//     font-weight: bold;
//   }
// }
</style>
