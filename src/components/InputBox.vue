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
      <component
        :is="focusElemenTag"
        v-if="isFocused"
        ref="focusElement"
        class="focus-element"
        tabindex="-1"
        :value="searchInputValue"
        css-width="auto"
        css-margin-start="md"
        :size="searchInputValue.length"
        @input="onFocusElementInput"
        @keydown="onFocusElementKeydown"
      />
    </div>
    <transition :name="$style.boxAnimation">
      <div
        v-if="isFocused"
        :class="boxPosition"
        class="box-container"
      >
        <slot name="box" />
      </div>
    </transition>
  </div>
</template>

<doc>
@prop searchInput @type Boolean @default false @description Allow users to temporary typing inside value slot? (content accessable via `search` event)
@prop disabled @type Boolean @default false @description Is disabled?
@prop isValidate @type Boolean @default true @description Is validated?
@prop placeholder @type String @default '' @description String shows instead of `input` slot.
@prop cssColor @type String @default 'background' @description Use any colors that already declared in themeProvider.
@prop cssSize @type oneOf('xs', 'sm', 'md', 'lg', 'xl') @default 'md' @description Size of element.

@event search @params content @description Triggers when user types into search input.
@event keydown @params nativeEvent @description Triggers when user start pressing a button while 'box' slot is open.
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
  },
  data() {
    return {
      isFocused: false,
      boxPosition: 'down',
      searchInputValue: '',
    };
  },
  computed: {
    // when box is opened, focus moves to input. so wee need to prevent browser to focus
    // container again by shift+tab
    containerTabIndex() {
      return this.isFocused ? '-1' : (this.$attrs.tabindex || '0');
    },
    shouldRenderPlaceholder() {
      return this.placeholder && !this.searchInputValue;
    },
    focusElemenTag() {
      return this.searchInput ? 'input' : 'div';
    },
  },
  methods: {
    onFocus() {
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
      this.$nextTick(() => {
        this.$refs.focusElement.focus();
      });
    },
    onBlur() {
      this.searchInputValue = '';
      setTimeout(() => {
        if (this.$el.contains(document.activeElement)) {
          return;
        }
        this.isFocused = false;
      });
    },
    onFocusElementInput(event) {
      const val = event.target.value;
      this.searchInputValue = val;
      this.$emit('search', val);
    },
    onFocusElementKeydown(event) {
      this.$emit('keydown', event);
    },
  },
  style({ className }) {
    const $color = this.$theme.colors[this.$color];
    return [
      className('inputBox', {
        // display: 'inline-block',
        position: 'relative',
        // overflow: 'visible',
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
        '&:hover, &:focus, &[focus]': {
          borderColor: $color.autoShade(-39),
        },
        '& > .input-container': {

          // position: 'absolute',
          minHeight: '100%',
          height: 'auto',
          width: '100%',
          // padding: `0 ${this.$theme.sizes.base.factor('sm', 'size')}`,
          overflow: 'hidden',
          '& > .placeholder': {
            color: this.$theme.colors.gray.normal,
            whiteSpace: 'nowrap',
            // padding: `0 ${this.$theme.sizes.base.factor('sm', 'size')}`,
          },
        },
        '& > .focus-element': {
          width: 'auto',
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
          width: '100%',
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
