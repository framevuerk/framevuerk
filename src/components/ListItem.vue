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
      css-padding-x="md"
      @click="onClick"
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
import injector from '../utility/injector';

export default {
  mixins: [size],
  emits: ['click', 'collapse', 'expand'],
  ...injector('$theme', '$list', ['$listItem', null]),
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
      default: false,
    },
  },
  provide() {
    return {
      $listItem: this,
    };
  },
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
          '& .expand-btn': {
            fontWeight: 'bold',
            [`padding-${this.$theme.direction.end}`]: this.$theme.sizes.base.normal,
          },
        },
        '& > .sub-list': {
          overflowY: 'visible',
          transitionDuration: this.$theme.speed.multiplyBy(0.75),
          transitionProperty: 'height',
          willChange: 'height',
          transitionTimingFunction: 'ease',
          borderTopWidth: '1px',
          '&.collapse': {
            height: 0,
          },
          '&.expand': {
            height: 'auto',
          },
        },
        '&:focus > .content': {
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
