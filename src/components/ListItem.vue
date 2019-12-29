<ztemplate>
li.fv-list-item(:disabled="disabled")
  .content(@click="onClick")
    .text
      slot(name="default")
    .expand(v-if="hasSubList",
      @click="toggle",
      tabindex="-1",
      v-html="icon",
      :class="{rotate: isExpanded}")
  transition(name="sub-list")
    .sub-list(v-if="hasSubList",
      v-show="isExpanded",
      ref="subList")
      slot(name="sub-list")
</ztemplate>

<template>
<component :is="tag" :class="[$style.listItem, isHighlighted && 'highlighted', disabled && 'disabled']">
  <div class="content" css-padding-x="md">
    <span css-space-x="lg" v-for="i in $list.indent - 1" :key="'indent-' + i"/>
    <fvButton v-if="hasSubList" class="expand-btn" fab css-radius="no" css-shadow="no" @click="toggle" tabindex="0">
      {{ isExpanded ? '-' : '+' }}
    </fvButton>
    <slot name="default" />
  </div>
  <div class="sub-list" :class="[isExpanded ? 'expand' : 'collapse']" ref="subList">
    <slot name="sub-list" />
  </div>
</component>
</template>

<script>
import icon from '../icons/ARR.svg';
import parent from '../utility/parent.js';
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
      isHighlighted: false, //
      isExpanded: true, // this.expanded,

      icon,
    };
  },
  computed: {
    hasSubList() {
      return this.$slots.hasOwnProperty('sub-list');
    },
  },
  methods: {
    expand() {
      this.isExpanded = true;
    },
    collapse() {
      this.isExpanded = false;
    },
    toggle(event) {
      this.isExpanded = !this.isExpanded;
    },
    onClick(event) {
      if (!this.disabled) {
        this.$emit('click', event);
      }
    },
    onHover() { // called by parent
      this.$emit('hover');
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
    }
  },
  style({ className }) {
    return [
      className('listItem', {
        display: 'block',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        overflow: 'hidden',
        '& > .content': {
          opacity: this.disabled ? 0.5 : 1,
          fontSize: this.$theme.sizes.font.factor(this.$size, 'font'),
          height: this.$theme.sizes.base.factor(this.$size, 'height'),
          lineHeight: this.$theme.sizes.base.factor(this.$size, 'height'),
          [`border-${this.$theme.direction.start}-width`]: this.$theme.sizes.base.normal,
          [`border-${this.$theme.direction.start}-style`]: 'solid',
          [`border-${this.$theme.direction.start}-color`]: this.selected ? this.$theme.colors.primary.normal : 'transparent',
          // position: 'relative',
          '& > .expand-btn': {
            // [this.$theme.direction.end]: '0px',
            marginTop: '5px',
            minHeight: this.$theme.sizes.base.factor(this.$size, 'font', { sum: 5 }),
            height: this.$theme.sizes.base.factor(this.$size, 'font', { sum: 5 }),
            width: this.$theme.sizes.base.factor(this.$size, 'font', { sum: 5 }),
            lineHeight: this.$theme.sizes.base.factor(this.$size, 'font', { sum: 5 }),
            // position: 'absolute',
            '& > .icon': {
              display: 'inline-block',
              height: this.$theme.sizes.base.factor(this.$size, 'size'),
              width: this.$theme.sizes.base.factor(this.$size, 'size'),
              borderStyle: 'solid',
              borderWidth: '2px',
              borderTopStyle: 'dotted',
              borderLeftStyle: 'dotted',
              // borderRightWidth: '2px',
              // borderBottomWidth: '2px',
              transitionProperty: 'transform',
              transitionDuration: this.$theme.speed.multiplyBy(0.75),
              willChange: 'transform',
              transformOrigin: 'center',
            },
            '&.collapse > .icon': {
              transform: 'rotate(45deg)',
              marginTop: '-5px',
            },
            '&.expand > .icon': {
              transform: 'rotate(-135deg)',
            },
          }
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
          }
        },
        '&.highlighted': {
          backgroundColor: 'rgba(0, 0, 0, 0.06)',
        },
        // '&.disabled': {
        //   textDecoration: 'line-through',
        // }
      }),
    ]
  }
};
</script>

<zstyle lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-list-item {
  clear: both;
  overflow: hidden;
  border: 0;
  min-height: heightSize(md);

  & .content {
    align-items: center;
    display: flex;
    position: relative;
    flex-direction: row;
    justify-content: space-between;
    min-height: inherit;
    cursor: default;

    & > .text {
      @include nowrap;

      flex-grow: 1;
      padding: 0 var(--sizes-space-md);
    }

    & .expand {
      padding: 0 var(--sizes-space-sm);
      cursor: pointer;

      & > svg {
        vertical-align: middle;
        width: 1.4em;
        height: auto;
        transition: transform var(--speed-normal);
      }

      &.rotate {
        & > svg {
          transform: rotateX(180deg);
        }
      }
    }
  }

  & > .content,
  & > .sub-list {
    border-top: solid 1px var(--color-border);
  }

  &[disabled] {
    & > .content {
      @include disabled(true);
    }
  }

  &.highlighted > .content {
    background: var(--color-hover);
    color: var(--color-text);
  }

  &.selected {
    border-#{$block-start}: solid 4px var(--activeColor-normal);
  }

  & .sub-list {
    & > .fv-list {
      border: 0;
      padding-#{$block-start}: 2em;
      & > .fv-list-item > .content{
        // margin-#{$block-start}: 10%;
        // padding-#{$block-start}: 2.5em;

      }
    }

    &.sub-list-enter-active,
    &.sub-list-leave-active {
      transition-duration: var(--speed-normal);
      transition-property: opacity, max-height, transform;
      will-change: opacity, max-height, transform;
      // max-height: 100vh;
      backface-visibility: hidden;
    }

    &.sub-list-enter,
    &.sub-list-leave-to {
      opacity: 0;
      max-height: 0 !important;
      // opacity: 0;
    }
  }
}
</zstyle>
