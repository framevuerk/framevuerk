<template lang="pug">
.fv-inputbox.fv-input(ref="inputEl",
  :tabindex="disabled? '': 0",
  :disabled="disabled",
  @click="onEnter",
  @keydown.enter="onEnter")
  .placeholder(v-html="placeholder")
  .value-container
    span.item(v-if="typeof value !== 'undefined'",
      v-for="(val, i) in value",
      :key="i")
        slot(v-if="$scopedSlots.value",
          name="value",
          :value="val")
        span(v-else) {{val}}
        .button.fa.fa-times(v-if="deleteButton",
          data-cancel-enter="true",
          @click="onValueDelete(val)")
    .item.transparent(v-if="$slots.in")
      slot(name="in")
  i.caret-icon(v-if="caretIcon",
    :class="caretIcon")
  transition(name="fv-input-box")
    fv-main.out-container(v-if="$slots.out && showOut", :class="{top: !outOnBottom, bottom: outOnBottom}", :style="{maxHeight: outMaxHeight}")
      fv-content.fv-no-padding
        slot(name="out")
</template>

<script>
import utility from '../utility'
import fvMain from './fvMain.vue'
import fvContent from './fvContent.vue'

export default {
  components: {
    fvMain,
    fvContent
  },
  props: {
    value: {
      type: Array
    },
    deleteButton: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    caretIcon: {
      default: ''
    },
    showOut: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      outOnBottom: true,
      outMaxHeight: 'auto'
    }
  },
  methods: {
    calcOutPosition () {
      const parentHeight = utility.fvParent(this, 'fv-main').$el.offsetHeight
      const elHeight = this.$el.offsetHeight
      const top = utility.offsetTo(this.$el, utility.fvParent(this, 'fv-main').$el).top
      this.outOnBottom = !(top > (parentHeight / 2))
      const bottom = parentHeight - top - elHeight
      const padding = parseInt(process.env.padding)
      this.outMaxHeight = `${(parentHeight - (this.outOnBottom ? top : bottom) - elHeight) - (padding * 2)}px`
    },
    onEnter (event) {
      if (!this.disabled && !event.target.getAttribute('data-cancel-enter')) {
        this.calcOutPosition()
        this.$emit('enter', event)
      }
    },
    onValueDelete (value) {
      this.$emit('value-delete', value)
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/functions';
@import '../styles/mixins';

.fv-inputbox {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  & > .value-container {
    & > .item {
      @include shadow(bottom);

      float: $block-start;
      margin: $padding / 3;
      margin-#{$block-start}: 0;
      border: 1px solid darken($bg-color-light, $shadow-percent);
      padding: 0 $padding-small;
      border-radius: $border-radius;

      &.transparent {
        background: transparent;
        padding: 0;
        border: 0;
        box-shadow: none;
      }

      & .button {
        margin-#{$block-start}: $padding;
        cursor: pointer;

        &:hover {
          background-color: yiq($bg-color, 2%);
        }

        &:active {
          background-color: yiq($bg-color, 10%);
        }
      }
    }
  }

  & > .caret-icon {
    float: $block-end;
    padding: $padding-small;
    padding-#{$block-start}: $padding;
  }

  & > .out-container {
    @include yiq($bg-color);

    position: absolute;
    #{$block-start}: 0;
    overflow: auto;
    width: 100%;
    border: solid 1px $shadow-color;
    margin: $padding 0;
    border-radius: $border-radius;
    z-index: 2;

    &.bottom {
      @include shadow(bottom);

      top: 100%;
    }

    &.top {
      @include shadow(top);

      bottom: 100%;
    }

    @include vue-animation(fv-input-box, enter) {
      opacity: 1;
      transition-duration: $transition-speed;
      transition-property: transform, opacity;
      transition-timing-function: ease;
      will-change: transform, opacity;
    }

    @include vue-animation(fv-input-box, leave) {
      opacity: 0;

      &:not(.center) {
        transform: translate3d(0, -10%, 0);
      }

      &.center {
        transform: translate3d(-50%, -60%, 0);
      }
    }
  }

  & > .placeholder {
    color: $gray-color-dark;
    position: absolute;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 75%;
  }
}
</style>
