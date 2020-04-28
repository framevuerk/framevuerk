<template>
  <div
    :class="$style.inputBox"
    :disabled="disabled"
    :invalid="!isValidate"
    :tabindex="containerTabIndex"
    :focus="isFocused"
    @focus="onFocus"
  >
    <div class="input-container">
      <div v-if="shouldRenderPlaceholder" class="placeholder" v-text="placeholder" />
      <div class="value" v-else>
        <slot name="input" />
      </div>
    </div>
    <input v-if="isFocused" class="input-container" ref="searchInput" @blur="onBlur" />
    <div v-if="isFocused" class="box-container">
      <slot name="box" />
    </div>
  </div>
</template>

<doc>
@prop value @type Any @default undefined @description Value of input.
@prop required @type Boolean or Function @default false @description If you use this element inside `form` component, the `form` component will reject until this element filled. by passing `false` this check will be skiped and by passing function, you can manualy get current value as an argument and return true/false to allow/reject form submits.
@prop disabled @type Boolean @default false @description Is disabled?
@prop multiLine @type Boolean @default false @description `false` for input mode and `true` for textarea mode.
@prop cssColor @type String @default 'background' @description Use any colors that already declared in themeProvider.
@prop cssSize @type oneOf('xs', 'sm', 'md', 'lg', 'xl') @default 'md' @description Size of element.

@event input @params newValue @description Triggers when value changes within component.
</doc>

<example>
@config title 'Input'
@config state true
@config example true

@data val = 'Normal'
<fvInputBox placeholder="salammmm">
  <div slot="input">
    salamAghaa
  </div>
  <div slot="box">
    Salam
  </div>
</fvInputBox>

</example>


<script>
import color from '../mixins/color';
import size from '../mixins/size';
import formElement from '../mixins/formElement';

export default {
  inject: ['$theme'],
  props: {
    placeholder: {
      type: String,
      default: '',
    },
  },
  mixins: [
    color,
    size,
    formElement((v) => !!v),
  ],
  computed: {
    // when box is opened, focus moves to input. so wee need to prevent browser to focus
    // container again by shift+tab
    containerTabIndex() {
      return this.isFocused ? '-1' : (this.$attrs.tabindex || '0');
    },
    shouldRenderPlaceholder() {
      return !this.$slots.input;
    },
  },
  data() {
    return {
      isFocused: false,
    };
  },
  methods: {
    onFocus(e) {
      this.isFocused = true;
      this.$nextTick(() => {
        this.$refs.searchInput.focus();
        this.onFocusDefault();
      });
    },
    onBlur(e) {
      this.$nextTick(() => {
        if (this.$el.contains(document.activeElement)) {
          return;
        }
        this.isFocused = false;
        this.onBlurDefault();
      });
    },
  },
  style({ className }) {
    const $color = this.$theme.colors[this.$color];
    return [
      className('inputBox', {
        display: 'inline-block',
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
        height: this.$theme.sizes.base.factor(this.$size, 'height'),
        fontSize: this.$theme.sizes.font.factor(this.$size, 'font'),
        padding: `0 ${this.$theme.sizes.base.normal}`,
        '&:hover, &:focus, &[focus]': {
          borderColor: $color.autoShade(-39),
        },
        '& > .input-container': {
          display: 'flex',
          flexDirection: 'row',
          position: 'absolute',
          height: '100%',
          alignItems: 'center',
        },
        '& > .box-container': {
          position: 'absolute',
          backgroundColor: 'red',
          top: this.$theme.sizes.base.factor(this.$size, 'height'),
          marginTop: '3px',
          minHeight: this.$theme.sizes.base.factor(this.$size, 'height'),
          width: '100%',
          left: '0',
          zIndex: 2,
        },
      }),
    ];
  },
};
</script>
