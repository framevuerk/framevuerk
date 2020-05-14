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
                <fvListItem expanded>
                  Dropdown Select
                  <fvList slot="sub-list">
                    <fvListItem
                      tag="router-link"
                      to="/components/select"
                      :class="{ selected: isSelected('component', 'select') }"
                    >
                      Select
                    </fvListItem>
                    <fvListItem
                      tag="router-link"
                      to="/components/select-option"
                      :class="{ selected: isSelected('component', 'select-option') }"
                    >
                      Option
                    </fvListItem>
                  </fvList>
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
                <fvListItem expanded>
                  Table
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
                      to="/components/table-row"
                      :class="{ selected: isSelected('component', 'table-row') }"
                    >
                      Table Row
                    </fvListItem>
                    <fvListItem
                      tag="router-link"
                      to="/components/table-field"
                      :class="{ selected: isSelected('component', 'table-field') }"
                    >
                      Table Field
                    </fvListItem>
                  </fvList>
                </fvListItem>
                <fvListItem expanded>
                  List
                  <fvList slot="sub-list">
                    <fvListItem
                      tag="router-link"
                      to="/components/list"
                      :class="{ selected: isSelected('component', 'list') }"
                    >
                      List
                    </fvListItem>
                    <fvListItem
                      tag="router-link"
                      to="/components/list-item"
                      :class="{ selected: isSelected('component', 'list-item') }"
                    >
                      List Item
                    </fvListItem>
                  </fvList>
                </fvListItem>
                <fvListItem expanded>
                  Slider/Tab
                  <fvList slot="sub-list">
                    <fvListItem
                      tag="router-link"
                      to="/components/slider"
                      :class="{ selected: isSelected('component', 'slider') }"
                    >
                      Slider
                    </fvListItem>
                    <fvListItem
                      tag="router-link"
                      to="/components/slide-label"
                      :class="{ selected: isSelected('component', 'slide-label') }"
                    >
                      Slide Label
                    </fvListItem>
                    <fvListItem
                      tag="router-link"
                      to="/components/slide-content"
                      :class="{ selected: isSelected('component', 'slide-content') }"
                    >
                      Slide Content
                    </fvListItem>
                  </fvList>
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
                <fvListItem
                  tag="router-link"
                  to="/components/pagination"
                  :class="{ selected: isSelected('component', 'pagination') }"
                >
                  Pagination
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
