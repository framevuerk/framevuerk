<template>
  <component
    :is="tag"
    :tabindex="tabindex"
    @keydown.capture="onKeydown"
  >
    <slot />
  </component>
</template>

<script>
import { moveIndex } from '../utility/utils';

export default {
  inject: {
    $theme: {},
    $list: {
      default: null,
    },
  },
  props: {
    tag: {
      type: String,
      default: 'ul',
    },
  },
  data() {
    return {
      highlighted: null,
      indent: 1,
      blurTimeout: null,
    };
  },
  provide() {
    if (this.$list) {
      this.indent += this.$list.indent;
      return {
        $list: {
          ...this.$list,
          indent: this.indent,
        },
      };
    }
    return {
      $list: this,
    };
  },
  computed: {
    tabindex() {
      if (this.indent > 1) {
        return null;
      }
      if (typeof this.$attrs.tabindex !== 'undefined') {
        return this.$attrs.tabindex;
      }
      return 0;
    },
    recursiveChildren() {
      if (this.indent > 1) {
        return [];
      }
      const getChildren = (comp) => {
        let ret = [];
        const root = comp.$children.filter((component) => !component.disabled);
        root.forEach((child) => {
          ret.push(child);
          if (child.hasSubList && child.isExpanded) {
            ret = ret.concat(getChildren(child.$children[0]));
            // TODO do better way to find sublist comp
          }
        });
        return ret;
      };
      return getChildren(this);
    },
  },
  methods: {
    moveHighlight(action = 'reset', listItemComponent) {
      const items = this.recursiveChildren;
      // console.log(this.recursiveChildren, 'r');
      const highlightedIndex = items.findIndex((component) => component.isHighlighted);
      let newIndex = -1;
      if (action === 'set') {
        newIndex = items.findIndex((x) => x === listItemComponent);
      } else {
        newIndex = action === 'reset' ? -1 : moveIndex(highlightedIndex + (action === 'next' ? 1 : -1), items.length);
      }
      let highlightedItem = null;
      items.forEach((item, index) => {
        if (newIndex === index) {
          highlightedItem = item;
          // eslint-disable-next-line no-param-reassign
          item.isHighlighted = true;
          if (item.$el && item.$el.scrollIntoViewIfNeeded) {
            item.$el.scrollIntoViewIfNeeded();
          }
        } else {
          // eslint-disable-next-line no-param-reassign
          item.isHighlighted = false;
        }
      });
      this.highlighted = highlightedItem;
    },
    onKeydown(event) {
      if (this.indent > 1) {
        return;
      }
      if (event.which === 38) { // up
        event.preventDefault();
        this.moveHighlight('prev');
      } else if (event.which === 40) { // bottom
        event.preventDefault();
        this.moveHighlight('next');
      } else if (event.which === 13) { // enter
        event.preventDefault();
        if (this.highlighted) {
          this.highlighted.onClick(event);
        }
      }
    },
    focus() {
      if (this.indent > 1) {
        this.$list.focus();
      } else {
        this.$el.focus();
      }
    },
  },
};
</script>
