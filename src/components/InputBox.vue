<template>
  <div
    :class="$style.inputBox"
    :disabled="disabled"
    :invalid="!isValidate"
    :tabindex="containerTabIndex"
    :focus="isFocused"
    @focus="onFocus"
    @blur.capture="onBlur"
  >
    <div
      class="input-container"
      css-padding-x="md"
      css-padding-y="sm"
    >
      <div
        v-if="shouldRenderPlaceholder"
        class="placeholder"
        v-text="placeholder"
      />
      <div
        v-else
        class="value"
      >
        <slot name="input" />
      </div>
      <input
        v-if="isFocused && searchInput"
        ref="focusElement"
        class="focus-element"
        tabindex="-1"
        :value="query"
        css-margin-start="md"
        :size="query.length || 1"
        @input="onFocusElementInput"
        @keydown="onFocusElementKeydown"
      >
      <span
        v-else-if="isFocused"
        ref="focusElement"
        class="focus-element"
        tabindex="-1"
        @keydown="onFocusElementKeydown"
      />
    </div>
    <transition :name="$style.boxAnimation">
      <div
        v-show="isFocused && isOpened"
        ref="box"
        :class="boxPosition"
        class="box-container"
        @click="onBoxClick"
      >
        <slot name="box" />
      </div>
    </transition>
  </div>
</template>

<doc>
@prop searchInput @type Boolean @default false @description Allow users to temporary typing inside value slot? (content accessable via `search` event)
@prop query @type String @default '' @description User searching string. use .sync modifier to works.
@prop disabled @type Boolean @default false @description Is disabled?
@prop isValidate @type Boolean @default true @description Is validated?
@prop placeholder @type String @default '' @description String shows instead of `input` slot.
@prop autoClose @type Boolean @defeault true auto close outer box when user clicks on it.
@prop cssColor @type String @default 'background' @description Use any colors that already declared in themeProvider.
@prop cssSize @type oneOf('xs', 'sm', 'md', 'lg', 'xl') @default 'md' @description Size of element.

@event update:query @params content @description Triggers when user types into search input.
@event keydown @params nativeEvent @description Triggers when user start pressing a button while 'box' slot is open.
@event focus @params nativeEvent @description Triggers when user focus on element.
@event blur @params nativeEvent @description Triggers when user blur from element.
</doc>

<example>
@config title 'Input'
@config state true
@config example true

@data val = '123'

<fvInputBox :searchInput="false" placeholder="Placeholder">
  <div slot="input" v-if="val">
    <span css-padding-x="sm" css-color="background" css-border="md" css-radius="md"> Input Content </span>
  </div>
  <div slot="box" css-text-align="center">
    Box Content:
    <fvButton @click="val = val ? null : '123'"> Toggle Value </fvButton>
  </div>
</fvInputBox>

</example>


<script>
import color from '../mixins/color';
import size from '../mixins/size';

export default {
  inject: ['$theme'],
  mixins: [
    color,
    size,
  ],
  props: {
    placeholder: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isValidate: {
      type: Boolean,
      default: true,
    },
    searchInput: {
      type: Boolean,
      default: false,
    },
    query: {
      type: String,
      default: '',
    },
    autoClose: {
      type: Boolean,
      default: true,
    },
    autoWidthBox: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      isFocused: false,
      isOpened: false,
      boxPosition: 'down',
    };
  },
  computed: {
    // when box is opened, focus moves to input. so wee need to prevent browser to focus
    // container again by shift+tab
    containerTabIndex() {
      if (this.disabled) {
        return undefined;
      }
      return this.isFocused ? '-1' : (this.$attrs.tabindex || '0');
    },
    shouldRenderPlaceholder() {
      return this.placeholder && !this.query;
    },
    focusElemenTag() {
      return this.searchInput ? 'input' : 'div';
    },
  },
  methods: {
    onFocus(event) {
      if (this.disabled) {
        return;
      }
      try {
        const offset = this.$el.getBoundingClientRect();
        this.boxPosition = offset.top / window.innerHeight > 0.6 ? 'up' : 'down';
      } catch (_e) {
        this.boxPosition = 'down';
      }

      this.isFocused = true;
      this.isOpened = true;
      this.$emit('focus', event);
      this.$nextTick(() => {
        this.$refs.focusElement.focus();
      });
    },
    onBlur(event) {
      setTimeout(() => {
        if (this.$el.contains(document.activeElement)) {
          return;
        }
        this.$emit('update:query', '');
        this.isFocused = false;
        this.isOpened = false;
        this.$emit('blur', event);
      });
    },
    onBoxClick(e) {
      this.$nextTick(() => {
        if (this.autoClose && e.target !== this.$refs.box) {
          this.$refs.focusElement.focus();
          this.isFocused = true;
          this.isOpened = false;
        }
      });
    },
    onFocusElementInput(event) {
      const val = event.target.value;
      this.$emit('update:query', val);
    },
    onFocusElementKeydown(event) {
      this.$emit('keydown', event);
      this.isFocused = true;
      this.isOpened = true;
    },
  },
  style({ className }) {
    const $color = this.$theme.colors[this.$color];
    return [
      className('inputBox', {
        position: 'relative',
        backgroundColor: $color.shade(5),
        color: $color.text,
        boxShadow: this.$theme.sizes.shadow.factor(this.$size, 'shadow', { dir: 'bottom' }),
        borderWidth: '1px',
        borderColor: $color.shade(-13),
        borderRadius: this.$theme.sizes.radius.factor('md', 'radius'),
        minHeight: this.$theme.sizes.base.factor(this.$size, 'height'),
        minWidth: '180px',
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: this.$theme.sizes.font.factor(this.$size, 'font'),
        '&[disabled]': {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
        '&:not([disabled])': {
          '&:hover, &:focus, &[focus]': {
            borderColor: $color.autoShade(-39),
          },
          '&[invalid]': {
            borderColor: this.$theme.colors.danger.normal,
          },
        },
        '& > .input-container': {
          display: 'inline-flex',
          minHeight: '100%',
          height: 'auto',
          width: '100%',
          overflow: 'hidden',
          '& > .placeholder': {
            color: this.$theme.colors.gray.normal,
            whiteSpace: 'nowrap',
          },
          '& > .focus-element': {
            width: 'auto',
            display: 'inline',
          },
        },
        '& > .box-container': {
          position: 'absolute',
          backgroundColor: this.$theme.colors.background.normal,
          boxShadow: this.$theme.sizes.shadow.factor(this.$size, 'shadow', { dir: 'bottom' }),
          borderWidth: '1px',
          borderColor: $color.shade(-13),
          borderRadius: this.$theme.sizes.radius.factor('md', 'radius'),
          minHeight: this.$theme.sizes.base.factor(this.$size, 'height'),
          height: 'auto',
          maxHeight: '30vh',
          overflow: 'auto',
          width: this.autoWidthBox ? 'auto' : '100%',
          left: '0',
          zIndex: 999,
          '&.down': {
            marginTop: '5px',
            top: this.$theme.sizes.base.factor(this.$size, 'height'),
          },
          '&.up': {
            marginBottom: '5px',
            bottom: this.$theme.sizes.base.factor(this.$size, 'height'),
          },
        },
      }),
      className('boxAnimation', {
        '&-enter-active, &-leave-active': {
          transitionDuration: '300ms',
          transitionProperty: 'opacity',
        },
        '&-enter, &-leave-to': {
          opacity: 0,
        },
      }),
    ];
  },
};
</script>
