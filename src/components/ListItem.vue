<template>
  <component
    :is="tag"
    :class="[$style.listItem, disabled && 'disabled', selected && 'selected', isHighlighted && 'highlighted']"
    :to="$attrs.to"
    tabindex="-1"
    @focus.capture="onFocus"
  >
    <div
      class="content"
      css-padding-x="md"
      @mouseenter.stop="onMouseEnter"
      @click.stop="onClick"
    >
      <span
        v-for="i in $list.indent - 1"
        :key="'indent-' + i"
        css-space-x="lg"
      />
      <span
        v-if="hasSubList"
        class="expand-btn"
        css-radius="no"
        css-shadow="no"
        css-cursor="pointer"
        css-text-size="lg"
      >
        {{ isExpanded ? '-' : '+' }}
      </span>
      <slot name="default" />
    </div>
    <div
      ref="subList"
      class="sub-list"
      :class="[isExpanded ? 'expand' : 'collapse']"
    >
      <slot name="sub-list" />
    </div>
  </component>
</template>

<script>
import { hasSlot } from '../utility/utils';
import size from '../mixins/size';

export default {
  mixins: [size],
  inject: ['$theme', '$list'],
  props: {
    tag: {
      type: String,
      default: 'li',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    expanded: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isHighlighted: false,
      isExpanded: true,
    };
  },
  computed: {
    hasSubList() {
      return hasSlot(this, 'sub-list');
    },
  },
  watch: {
    isExpanded(value) {
      if (value) {
        this.$refs.subList.style.display = 'block';
        this.$refs.subList.style.height = `${this.$refs.subList.children[0].offsetHeight}px`;
        setTimeout(() => {
          this.$refs.subList.style.height = null;
          this.$emit('expand');
        }, 250);
      } else {
        this.$refs.subList.style.height = `${this.$refs.subList.children[0].offsetHeight}px`;
        setTimeout(() => {
          this.$refs.subList.style.height = null;
          setTimeout(() => {
            this.$refs.subList.style.display = 'none';
          }, 250);
          this.$emit('collapse');
        }, 20);
      }
    },
  },
  methods: {
    expand() {
      this.isExpanded = true;
    },
    collapse() {
      this.isExpanded = false;
    },
    toggle() {
      this.isExpanded = !this.isExpanded;
    },
    onClick(event) {
      if (!this.disabled) {
        this.$list.focus();
        try {
          this.$el.click(); // click on root element manually (links, etc)
        } catch (_e) {
          //
        }
        if (this.hasSubList) {
          this.toggle();
        }
        this.$emit('click', event);
      }
    },
    onMouseEnter() {
      if (!this.disabled) {
        this.$list.moveHighlight('set', this);
      }
    },
    onFocus(event) {
      event.preventDefault();
    },
  },
  style({ className }) {
    return [
      className('listItem', {
        display: 'block',
        borderTopWidth: '1px',
        overflow: 'hidden',
        '& > .content': {
          opacity: this.disabled ? 0.5 : 1,
          fontSize: this.$theme.sizes.font.factor(this.$size, 'font'),
          height: this.$theme.sizes.base.factor(this.$size, 'height'),
          lineHeight: this.$theme.sizes.base.factor(this.$size, 'height'),
          [`border-${this.$theme.direction.start}-width`]: this.$theme.sizes.base.normal,
          [`border-${this.$theme.direction.start}-color`]: 'transparent',
        },
        '& > .sub-list': {
          overflowY: 'visible',
          transitionDuration: this.$theme.speed.multiplyBy(0.75),
          transitionProperty: 'height',
          willChange: 'height',
          transitionTimingFunction: 'ease',
          '&.collapse': {
            height: 0,
          },
          '&.expand': {
            height: 'auto',
          },
        },
        '&.highlighted > .content': {
          backgroundColor: 'rgba(0, 0, 0, 0.06)',
        },
        '&.selected > .content': {
          [`border-${this.$theme.direction.start}-color`]: this.$theme.colors.primary.normal,
        },
        // '&.disabled': {
        //   textDecoration: 'line-through',
        // }
      }),
    ];
  },
};
</script>
