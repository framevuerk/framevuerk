<template>
  <fvSidebar
    :visible.sync="$root.sidebar"
    style="width: 300px; min-width: 300px;"
  >
    <div css-color="sidebar">
      <div
        css-padding="md"
        autofocus
      >
        <fvInput
          css-display="block"
          css-full-width
          placeholder="Type to search..."
          css-color="sidebar"
          css-shadow="no"
          @input="search"
        />
      </div>
      <fvList v-if="typeof searchResult === 'undefined'">
        <fvListItem expanded>
          <i class="fa fa-code" /> Components
          <fvList slot="sub-list">
            <fvListItem expanded>
              Main
              <fvList slot="sub-list">
                <fvListItem
                  tag="router-link"
                  to="/components/theme-provider"
                  :class="{ selected: isSelected('component', 'theme-provider') }"
                >
                  Theme Provider
                </fvListItem>
              </fvList>
            </fvListItem>
            <fvListItem expanded>
              Layout
              <fvList slot="sub-list">
                <fvListItem
                  tag="router-link"
                  to="/components/layout"
                  :class="{ selected: isSelected('component', 'layout') }"
                >
                  Layout
                </fvListItem>
                <fvListItem
                  tag="router-link"
                  to="/components/header"
                  :class="{ selected: isSelected('component', 'header') }"
                >
                  Header
                </fvListItem>
                <fvListItem
                  tag="router-link"
                  to="/components/sidebar"
                  :class="{ selected: isSelected('component', 'sidebar') }"
                >
                  Sidebar
                </fvListItem>
                <fvListItem
                  tag="router-link"
                  to="/components/content"
                  :class="{ selected: isSelected('component', 'content') }"
                >
                  Content
                </fvListItem>
                <fvListItem
                  tag="router-link"
                  to="/components/footer"
                  :class="{ selected: isSelected('component', 'footer') }"
                >
                  Footer
                </fvListItem>
              </fvList>
            </fvListItem>
            <fvListItem expanded>
              Form
              <fvList slot="sub-list">
                <fvListItem
                  tag="router-link"
                  to="/components/form"
                  :class="{ selected: isSelected('component', 'form') }"
                >
                  Form
                </fvListItem>
                <fvListItem
                  tag="router-link"
                  to="/components/form-element"
                  :class="{ selected: isSelected('component', 'form-element') }"
                >
                  Form Element
                </fvListItem>
                <fvListItem
                  tag="router-link"
                  to="/components/input"
                  :class="{ selected: isSelected('component', 'input') }"
                >
                  Input
                </fvListItem>
                <fvListItem
                  tag="router-link"
                  to="/components/select"
                  :class="{ selected: isSelected('component', 'select') }"
                >
                  Dropdown Select
                </fvListItem>
                <fvListItem
                  tag="router-link"
                  to="/components/button"
                  :class="{ selected: isSelected('component', 'button') }"
                >
                  Button
                </fvListItem>
                <fvListItem
                  tag="router-link"
                  to="/components/input-group"
                  :class="{ selected: isSelected('component', 'input-group') }"
                >
                  Input Group
                </fvListItem>
              </fvList>
            </fvListItem>
            <fvListItem expanded>
              Other
              <fvList slot="sub-list">
                <fvListItem
                  tag="router-link"
                  to="/components/table"
                  :class="{ selected: isSelected('component', 'table') }"
                >
                  Table
                </fvListItem>
                <fvListItem
                  tag="router-link"
                  to="/components/loading"
                  :class="{ selected: isSelected('component', 'loading') }"
                >
                  Loading
                </fvListItem>
                <fvListItem
                  tag="router-link"
                  to="/components/input-box"
                  :class="{ selected: isSelected('component', 'input-box') }"
                >
                  Input Box
                </fvListItem>
              </fvList>
            </fvListItem>
          </fvList>
        </fvListItem>
      </fvList>
    </div>
  </fvSidebar>
</template>

<script>
import appLogo from './appLogo.vue';

export default {
  components: {
    appLogo,
  },
  data() {
    return {
      query: '',
      searchResult: undefined,
    };
  },
  methods: {
    isSelected(paramName, name) {
      return name === this.$route.params[paramName];
    },
    search(str = '') {
      if (!str || !str.length) {
        this.searchResult = undefined;
      } else {
        this.searchResult = sidebarItems.search(str);
      }
    },
  },
};
</script>
