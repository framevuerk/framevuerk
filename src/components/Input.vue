<template>
  <input
    v-if="!multiLine"
    v-model="theValue"
    v-bind="commonAttrs"
    @focus="onFocus"
    @blur="onBlurDefault"
  >
  <textarea
    v-else
    v-model="theValue"
    v-bind="commonAttrs"
    @focus="onFocus"
    @blur="onBlurDefault"
  />
</template>

<doc>
@prop value @type String @default '' @description Value of input.
@prop required @type Boolean or Function @default false @description If you use this element inside `form` component, the `form` component will reject until this element filled. by passing `false` this check will be skiped and by passing function, you can manualy get current value as an argument and return true/false to allow/reject form submits.
@prop disabled @type Boolean @default false @description Is disabled?
@prop placeholder @type String @default '' @description Showes when value is empty.
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
<fvInput placeholder="Type something" v-model="val" /> {{val}}

</example>

<example>
@config title 'Multi Line (Textarea)'
@config state true
@config example true

@data val = 'Multi\nLine'
<fvInput placeholder="Type something" multiLine v-model="val" />

</example>

<example>
@config title 'Sizes'
@config state false
@config example true

@data val = 'Sizes'
<fvInput placeholder="Type something" css-size="sm" v-model="val" />
<fvInput placeholder="Type something" css-size="md" v-model="val" />
<fvInput placeholder="Type something" css-size="lg" v-model="val" />
<fvInput placeholder="Type something" css-size="xl" v-model="val" />

</example>

<example>
@config title 'Colors'
@config state false
@config example true

@data val = 'Colors'
<fvInput css-color="background" v-model="val" />
<fvInput css-color="header" v-model="val" />
<fvInput css-color="sidebar" v-model="val" />
</example>

<script>
import color from '../mixins/color';
import size from '../mixins/size';
import formElement from '../mixins/formElement';

export default {
  inject: ['$theme'],
  mixins: [
    color,
    size,
    formElement,
  ],
  props: {
    value: {
      type: String,
      default: '',
    },
    multiLine: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    theValue: {
      get() {
        return this.value || '';
      },
      set(x) {
        this.$emit('input', x);
      },
    },
    commonAttrs() {
      return {
        class: this.$style.input,
        placeholder: this.placeholder,
        disabled: this.disabled,
        invalid: !this.isValidate,
      };
    },
    tag() {
      return this.multiLine ? 'textarea' : 'input';
    },
  },
  methods: {
    onFocus() {
      this.$el.select();
      this.onFocusDefault();
    },
    onInput(event) {
      this.$emit('input', event.target.value);
    },
  },
  style({ className }) {
    const $color = this.$theme.colors[this.$color];
    return [
      className('input', {
        font: 'inherit',
        display: 'inline-block',
        backgroundColor: $color.shade(5),
        color: $color.text,
        boxShadow: this.$theme.sizes.shadow.factor(this.$size, 'shadow', { dir: 'bottom' }),
        borderWidth: '1px',
        borderColor: $color.shade(-13),
        borderRadius: this.$theme.sizes.radius.factor('md', 'radius'),
        minHeight: this.$theme.sizes.base.factor(this.$size, 'height'),
        height: this.multiLine ? this.$theme.sizes.base.factor('xl', 'height') : this.$theme.sizes.base.factor(this.$size, 'height'),
        fontSize: this.$theme.sizes.font.factor(this.$size, 'font'),
        padding: `${this.$theme.sizes.base.normal}`,
        resize: 'vertical',
        '&::placeholder': {
          color: this.$theme.colors.gray.normal,
        },
        '&[disabled]': {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
        '&:not([disabled])': {
          '&:hover, &:focus': {
            borderColor: $color.autoShade(-39),
          },
        },
      }),
    ];
  },
};
</script>
