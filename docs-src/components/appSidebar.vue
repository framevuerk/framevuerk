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
            <i class="fa fa-code" /> Components
            <fvList slot="sub-list">
              <fvListItem tag="router-link" to="/components/footer" :class="{ selected: $route.params.component === 'footer' }"> Footer </fvListItem>
              <fvListItem tag="router-link" to="/components/header" :class="{ selected: $route.params.component === 'header' }"> Header </fvListItem>
              <fvListItem tag="router-link" to="/components/table" :class="{ selected: $route.params.component === 'table' }"> Table </fvListItem>
            </fvList>
        </fvListItem>
      </fvList>
    </div>
  </fvSidebar>
</template>

<script>
import appLogo from './appLogo.vue'

export default {
  components: {
    appLogo
  },
  data () {
    return {
      query: '',
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
