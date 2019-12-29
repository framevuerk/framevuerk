<template>
<component :is="tag" :class="$style.list" :tabindex="controlerElement ? -1 : 1">
  <slot />
</component>
</template>

<script>
import color from '../mixins/color';
import { moveIndex } from '../utility/utils';

export default {
  mixins: [color],
  inject: {
    $theme: {},
    $list: {
      default: null
    }
  },
  data() {
    return {
      highlighted: null,
      indent: 1,
    }
  },
  provide() {
    return {
      $list: this,
    };
  },
  created() {
    if (this.$list) {
      this.indent += this.$list.indent;
    }
  },
  props: {
    tag: {
      type: String,
      default: 'ul',
    },
    controlerElement: {
      type: Object,
      default: undefined,
    }
  },
  computed: {
    eventListener() {
      return this.controlerElement || this.$el;
    }
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
  mounted() {
    this.bindEvents();
  },
  beforeDestroy() {
    this.unbindEvents();
  },
  style({ className }) {
    return [
      className('list', {
        listStyle: 'none',
        borderStyle: 'solid',
        borderWidth: '0px',
      })
    ]
  }
};
</script>

<zstyle lang="scss">
@import '../styles/variables';

.fv-list {
  clear: both;

  & > .fv-list-item:first-child > .content {
    border-top: none;
  }
}
</zstyle>
