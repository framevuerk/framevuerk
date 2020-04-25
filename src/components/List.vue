<template>
  <component
    :is="tag"
    :tabindex="controlerElement ? -1 : 1"
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
    controlerElement: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      highlighted: null,
      indent: 1,
    };
  },
  provide() {
    return {
      $list: this,
    };
  },
  computed: {
    eventListener() {
      return this.controlerElement || this.$el;
    },
  },
  created() {
    if (this.$list) {
      this.indent += this.$list.indent;
    }
  },
  mounted() {
    this.bindEvents();
  },
  beforeDestroy() {
    this.unbindEvents();
  },
  methods: {
    resetHighlight() {
      this.moveHighlight('reset');
    },
    setHighlight(el) {
      const allItems = [...this.$el.querySelectorAll('.fv-list-item')];
      allItems.forEach((li) => {
        if (li !== el) {
          li.classList.remove('highlighted');
        }
      });
      if (el) {
        el.classList.add('highlighted');
        el.__vue__.onHover();
      }
      this.highlighted = el;
    },
    moveHighlight(action = 'reset') {
      const items = this.$children.filter((component) => !component.disabled);
      const highlightedIndex = items.findIndex((component) => component.isHighlighted);
      const newIndex = action === 'reset' ? -1 : moveIndex(highlightedIndex + (action === 'next' ? 1 : -1), items.length);
      let highlightedItem = null;
      items.forEach((item, index) => {
        if (newIndex === index) {
          highlightedItem = item;
          item.isHighlighted = true;
          if (item.$el && item.$el.scrollIntoViewIfNeeded) {
            item.$el.scrollIntoViewIfNeeded();
          }
        } else {
          item.isHighlighted = false;
        }
      });
      this.highlighted = highlightedItem;
    },
    onKeydown(event) {
      if (event.target !== this.eventListener) {
        return;
      }
      switch (event.which) {
        case 38: // up
          event.preventDefault();
          this.moveHighlight('prev');
          break;
        case 40: // down
          event.preventDefault();
          this.moveHighlight('next');
          break;
        case this.$theme.direction.endKey:
          if (this.highlighted) {
            this.highlighted.expand();
          }
          break;
        case this.$theme.direction.startKey:
          if (this.highlighted) {
            this.highlighted.collapse();
          }
          break;
        // case 13: // enter
        //   event.preventDefault();
        //   if (this.highlighted && this.highlighted.__vue__) {
        //     this.highlighted.__vue__.onClick(event);
        //   }
        //   break;
      }
    },
    bindEvents() {
      this.eventListener.addEventListener('focus', this.resetHighlight);
      this.eventListener.addEventListener('blur', this.resetHighlight);
      this.eventListener.addEventListener('keydown', this.onKeydown);
    },
    unbindEvents() {
      this.eventListener.removeEventListener('focus', this.resetHighlight);
      this.eventListener.removeEventListener('blur', this.resetHighlight);
      this.eventListener.removeEventListener('keydown', this.onKeydown);
    },
  },
};
</script>
