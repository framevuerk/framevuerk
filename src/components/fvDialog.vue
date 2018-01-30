<template lang="pug">
span
  transition(name="fv-fade")
    .fv-overlay(v-if="visible",
      @click="closeIf()")
  transition(:name="animationName")
    fv-main.fv-dialog(:class="animationName",
      v-if="visible",
      ref="dialog",
      @keydown.native="onKeydown($event); $emit('keydown', $event)",
      @click.native="$emit('click', $event)")
      fv-header(height="40px",
        v-if="title.length > 0")
        .title
          label.fv-control-label(v-html="title")
      fv-content(v-if="content",
        v-html="content")
      slot(v-else)
      fv-footer(v-if="buttons.length > 0")
        .fv-grow
        fv-button(v-for="(button, i) in buttons",
          :key="i",
          v-bind="button",
          @click="onButtonClick(button)")
</template>

<script>
import utility from '../utility'
import fvMain from './fvMain.vue'
import fvHeader from './fvHeader.vue'
import fvContent from './fvContent.vue'
import fvFooter from './fvFooter.vue'
import fvButton from './fvButton.vue'

export default {
  components: {
    fvMain,
    fvHeader,
    fvContent,
    fvFooter,
    fvButton
  },
  props: {
    title: {
      default: ''
    },
    content: {
      default: ''
    },
    position: {
      type: String,
      validator: (value) => {
        return ['bottom', 'top', 'center', 'fill', 'center-fill', 'center-bottom'].indexOf(value) > -1
      },
      default: 'center'
    },
    modal: {
      type: Boolean,
      default: false
    },
    autoClose: {
      type: Boolean,
      default: true
    },
    buttons: {
      type: Array,
      default: () => []
    },
    firstFocusOn: {
      type: [Number, Boolean],
      default: false // can be index or false (lastindex) or true (firstindex)
    }
  },
  data () {
    return {
      visible: false,
      param: null,
      focusBackElem: null,
      focusableItems: []
    }
  },
  computed: {
    animationName () {
      return `fv-dialog-${this.position}`
    }
  },
  methods: {
    toggle () {
      this[this.visible ? 'close' : 'open']()
    },
    open (param = null) {
      document.body.appendChild(this.$el)
      this.visible = true
      this.param = param
      this.focusBackElem = document.querySelector(':focus')
      this.$emit('open', this.param)
      utility.doIt(() => {
        this.focus(this.firstFocusOn)
      })
    },
    close () {
      this.visible = false
      if (this.focusBackElem) {
        this.focusBackElem.focus()
      }
      this.$emit('close', this.param)
    },
    closeIf () {
      if (this.modal === false) {
        this.close()
      }
    },
    focus (index = true) {
      this.focusableItems = this.$el.querySelectorAll('select, input, textarea, button, [tabindex]:not([tabindex=""])')
      let i
      if (typeof index === 'boolean') {
        i = index ? 0 : this.focusableItems.length - 1
      } else {
        i = index
      }
      this.focusableItems[i].focus()
    },
    onKeydown (event) {
      switch (event.which) {
        case 9: // tab
          if (event.target === this.focusableItems[0] && event.shiftKey) { // when first item is focused and user press shift + tab
            event.preventDefault()
            this.focus(false)
          } else if (event.target === this.focusableItems[this.focusableItems.length - 1] && !event.shiftKey) { // when last item is focused and user press tab
            event.preventDefault()
            this.focus(true)
          }
          break
        case 27: // esc
          this.closeIf()
      }
    },
    onButtonClick (button) {
      this.$emit('button-click', button, this.param)
      if (this.autoClose) {
        this.close()
      }
    }
  },
  beforeDestroy () {
    this.$el.remove()
  }
}

</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

@mixin fv-dialog-center($part) {
  @if ($part == 'style') {
    border-radius: $border-radius;
    left: 50%;
    max-height: 90%;
    max-width: 90%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
  }

  @else if ($part == 'animation-enter') {
    opacity: 1;
    transform: translate3d(-50%, -50%, 0);
    transition-duration: $transition-speed;
    transition-property: transform, opacity;
    transition-timing-function: ease;
    will-change: transform, opacity;
  }

  @else if($part == 'animation-leave') {
    opacity: 0;
    transform: translate3d(-50%, -42%, 0);
  }
}

@mixin fv-dialog-bottom($part) {
  @if ($part == 'style') {
    bottom: 0.1px;
    left: 0;
    max-height: 90%;
    max-width: 100%;
    top: auto;
    width: 100%;
  }

  @else if($part == 'animation-enter') {
    transform: translate3d(0, 0, 0);
    transition-duration: $transition-speed;
    transition-property: transform;
    transition-timing-function: ease;
    will-change: transform;
  }

  @else if($part == 'animation-leave') {
    transform: translate3d(0, 100%, 0);
  }
}

@mixin fv-dialog-top($part) {
  @if ($part == 'style') {
    bottom: auto;
    left: 0;
    max-height: 90%;
    max-width: 100%;
    top: 0.1px;
    width: 100%;
  }

  @else if($part == 'animation-enter') {
    transform: translate3d(0, 0, 0);
    transition-duration: $transition-speed;
    transition-property: transform;
    transition-timing-function: ease;
    will-change: transform;
  }

  @else if($part == 'animation-leave') {
    transform: translate3d(0, -100%, 0);
  }
}

@mixin fv-dialog-fill($part) {
  @if ($part == 'style') {
    border-radius: 0;
    height: 100%;
    left: 0;
    max-height: 100%;
    max-width: 100%;
    top: 0;
    width: 100%;
  }

  @else if($part == 'animation-enter') {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    transition-duration: $transition-speed;
    transition-property: transform, opacity;
    transition-timing-function: ease;
    will-change: transform, opacity;
  }

  @else if($part == 'animation-leave') {
    opacity: 0;
    transform: translate3d(0, 8%, 0);
  }
}

.fv-dialog {
  @include yiq($bg-color);
  @include shadow(bottom);

  backface-visibility: hidden;
  height: auto;
  min-width: 300px;
  overflow: auto;
  position: fixed;
  transform: translate3d(0, 0, 0);
  width: auto;
  z-index: 2;

  &.fv-dialog-center {
    @include fv-dialog-center(style);
  }

  &.fv-dialog-bottom {
    @include fv-dialog-bottom(style);
  }

  &.fv-dialog-top {
    @include fv-dialog-top(style);
  }

  &.fv-dialog-fill {
    @include fv-dialog-fill(style);
  }

  &.fv-dialog-center-bottom {
    @include respond-to(sm) {
      @include fv-dialog-center(style);
    }

    @include respond-to(only-xs) {
      @include fv-dialog-bottom(style);
    }
  }

  &.fv-dialog-center-fill {
    @include respond-to(sm) {
      @include fv-dialog-center(style);
    }

    @include respond-to(only-xs) {
      @include fv-dialog-fill(style);
    }
  }

  @include vue-animation(fv-dialog-center, enter) {
    @include fv-dialog-center(animation-enter);
  }

  @include vue-animation(fv-dialog-center, leave) {
    @include fv-dialog-center(animation-leave);
  }

  @include vue-animation(fv-dialog-bottom, enter) {
    @include fv-dialog-bottom(animation-enter);
  }

  @include vue-animation(fv-dialog-bottom, leave) {
    @include fv-dialog-bottom(animation-leave);
  }

  @include vue-animation(fv-dialog-top, enter) {
    @include fv-dialog-top(animation-enter);
  }

  @include vue-animation(fv-dialog-top, leave) {
    @include fv-dialog-top(animation-leave);
  }

  @include vue-animation(fv-dialog-fill, enter) {
    @include fv-dialog-fill(animation-enter);
  }

  @include vue-animation(fv-dialog-fill, leave) {
    @include fv-dialog-fill(animation-leave);
  }

  @include vue-animation(fv-dialog-center-bottom, enter) {
    @include respond-to(sm) {
      @include fv-dialog-center(animation-enter);
    }

    @include respond-to(only-xs) {
      @include fv-dialog-bottom(animation-enter);
    }
  }

  @include vue-animation(fv-dialog-center-bottom, leave) {
    @include respond-to(sm) {
      @include fv-dialog-center(animation-leave);
    }

    @include respond-to(only-xs) {
      @include fv-dialog-bottom(animation-leave);
    }
  }

  @include vue-animation(fv-dialog-center-fill, enter) {
    @include respond-to(sm) {
      @include fv-dialog-center(animation-enter);
    }

    @include respond-to(only-xs) {
      @include fv-dialog-fill(animation-enter);
    }
  }

  @include vue-animation(fv-dialog-center-fill, leave) {
    @include respond-to(sm) {
      @include fv-dialog-center(animation-leave);
    }

    @include respond-to(only-xs) {
      @include fv-dialog-fill(animation-leave);
    }
  }
}
</style>
