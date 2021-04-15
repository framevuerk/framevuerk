<template>
  <component
    :is="tag"
    :class="[$style.listItem, disabled && 'disabled', selected && 'selected', isHighlighted && 'highlighted']"
    :to="$attrs.to"
    :data-list-item-focusable="isFocusable"
    :tabindex="isFocusable ? 0 : -1"
    @keydown.self="onKeydown"
  >
    <div
      class="content"
      @click="onClick"
    >
      <span
        v-for="i in $list.indent - 1"
        :key="'indent-' + i"
        class="indent"
      />
      <slot name="default" />
      <span
        v-if="hasSubList"
        class="expand"
      >
        {{ isExpanded ? '⏶' : '⏷' }}
      </span>
    </div>
    <div
      v-if="hasSubList"
      ref="subList"
      class="sub-list"
      :class="[isExpanded ? 'expand' : 'collapse']"
    >
      <slot name="sub-list" />
    </div>
  </component>
</template>

<doc>
@prop tag @type String @default 'ul' @description Default root element of component.
@prop disabled @type Boolean @default false @description Is element disabled?
@prop selected @type Boolean @default false @description Is element selected?
@prop expanded @type Boolean @default true @description Show sub-list (if founds any) by default?

@event click @params nativeEvent @description Triggres when user clicks on element. (with both keyboard enter key or tapping by cursor)
@event expand @description Triggres when sub-list expanded.
@event collapse Triggres when sub-list collapsed.

@slot default @description content of item.
@slot sub-list @description If the list-item has a sub list, put new fvList component inside with this slot name.
</doc>

<example>
@config title 'Default'
@config state false
@config example true

<fvList>
  <fvListItem> Item #1 </fvListItem>
  <fvListItem> Item #2 </fvListItem>
  <fvListItem> Item #3 </fvListItem>
</fvList>
</example>

<example>
@config title 'SubList'
@config state false
@config example true

<fvList>
  <fvListItem> Item #1 </fvListItem>
  <fvListItem> Item #2 </fvListItem>
  <fvListItem expanded>
    Item #3
    <fvList slot="sub-list">
      <fvListItem> Item #3-1 </fvListItem>
      <fvListItem> Item #3-2 </fvListItem>
      <fvListItem> Item #3-3 </fvListItem>
    </fvList>
  </fvListItem>
</fvList>
</example>

<script>
import size from '../mixins/size';
import { moveIndex } from '../utility/utils';
import { inject, props, provideAs } from '../utility/vue';

export default {
  mixins: [size],
  emits: ['click', 'collapse', 'expand'],
  ...inject('$theme', '$list', ['$listItem', null]),
  ...props({
    tag: props.str('li'),
    disabled: props.bool(false),
    selected: props.bool(false),
    expanded: props.bool(false),
  }),
  ...provideAs('$listItem'),
  data() {
    return {
      isHighlighted: false,
      isExpanded: this.hasSubList ? this.expanded : true,
    };
  },
  computed: {
    hasSubList() {
      return !!this.$slots['sub-list'];
    },
    isFocusable() {
      return this.$list.isFocusable && (!this.$listItem || this.$listItem.isExpanded);
    },
  },
  watch: {
    expanded(value) {
      this.isExpanded = value;
    },
    isExpanded(value) {
      if (!this.$refs.subList) return;
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
    onClick(e) {
      this.toggle();
      this.$emit('click', e);
    },
    onKeydown(e) {
      const k = e.which;
      if (this.$list.isFocusable && ((k > 36 && k < 41))) {
        e.preventDefault();
        const all = document.querySelectorAll('[data-list-item-focusable="true"]');
        if ([38, 40].includes(k)) {
          const myIndex = (() => {
            for (let i = 0; i < all.length; i += 1) {
              if (all[i] === this.$el) {
                return i;
              }
            }
            return -1;
          })();
          if (myIndex !== -1) {
            const nextFocusingEl = all[moveIndex(myIndex + (k === 38 ? -1 : 1), all.length)];
            nextFocusingEl.focus();
          }
        } else if ([37, 39].includes(k) && this.hasSubList) {
          if (k === this.$theme.direction.endKey) {
            this.expand();
          } else {
            this.collapse();
          }
        }
      }
    },
  },
  style({ className }) {
    const $colors = this.$theme.colors;
    const $sizes = this.$theme.sizes;
    const { $size } = this;
    const height = $sizes.height.factor($size);
    return [
      className('listItem', {
        display: 'block',
        borderTopWidth: $sizes.border.px,
        overflow: 'hidden',
        '& > .content': {
          opacity: this.disabled ? 0.5 : 1,
          fontSize: $sizes.font.factor($size),
          padding: `0 ${$sizes.space.factor($size)}`,
          height,
          lineHeight: height,
          '& > .indent': {
            marginLeft: $sizes.space.factor('lg'),
          },
          '& > .expand': {
            float: this.$theme.direction.end,
            cursor: 'pointer',
            padding: `0 ${$sizes.space.factor($size)}`,
          },
        },
        '& > .sub-list': {
          overflowY: 'visible',
          transitionDuration: this.$theme.speed.multiplyBy(0.75),
          transitionProperty: 'height',
          willChange: 'height',
          transitionTimingFunction: 'ease',
          borderTopWidth: $sizes.border.px,
          '&.collapse': {
            height: 0,
          },
          '&.expand': {
            height: 'auto',
          },
        },
        '&:focus > .content, & > .content:hover': {
          backgroundColor: '#00000020',
        },
        '&.selected > .content': {
          [`border-${this.$theme.direction.start}-width`]: '3px',
          [`border-${this.$theme.direction.start}-color`]: $colors.primary.bg,
        },
        // '&.disabled': {
        //   textDecoration: 'line-through',
        // }
      }),
    ];
  },
};
</script>
