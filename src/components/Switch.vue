<template>
  <span
    :class="[$style.switch, isOn && 'on']"
    :disabled="disabled"
    :invalid="!isValidate"
    :tabindex="tabindex"
    @click="onClick"
    @keydown.space.prevent="onClick"
    @focus="onFocusDefault"
    @blur="onBlurDefault"
  >
    <div class="container">
      <span class="handler" />
    </div>
  </span>
</template>

<doc>
@prop value* @type oneOf(onValue /* described in props */, offValue /* described in props */) @description Value of input.
@prop onValue @type Any @default false @description Selected value when switch is on.
@prop offValue @type Any @default false @description Selected value when switch is off.
@prop disabled @type Boolean @default false @description Is disabled?
@prop required @type Boolean @default false @description Is required to fill?
@prop validation @type Function @default () => true @description If you use this element inside `form` component, the `form` component will reject until this function pass `true` or empty array. You can return Array of errors or even Boolean value at the end of function.
@prop formatter @type Function @default (value) => value @description If you use this element inside `form` component, will format `value` of component by this function.
@prop name @type String @default () => Math.random() @description If you use this element inside `form` component, you will access the value and triggered errors of this component by this key.

@prop cssColor @type String @default 'background' @description Use any colors that already declared in themeProvider.

@event input @params newValue @description Triggers when value changes within component.
</doc>

<example>
@config title 'default'
@config state true
@config example true

@data val = false
<fvSwitch v-model="val" />
</example>

<script>
import color from '../mixins/color';
import formElement from '../mixins/formElement';

export default {
  inject: ['$theme'],
  mixins: [
    color,
    formElement,
  ],
  props: {
    // eslint-disable-next-line vue/require-prop-types
    value: {
      default: false,
    },
    // eslint-disable-next-line vue/require-prop-types
    onValue: {
      default: true,
    },
    // eslint-disable-next-line vue/require-prop-types
    offValue: {
      default: false,
    },
  },
  computed: {
    isOn() {
      return this.value === this.onValue;
    },
    tabindex() {
      return this.disabled ? null : (this.$attrs.tabindex || 0);
    },
  },
  methods: {
    onClick() {
      if (this.disabled) return;
      this.$emit('input', this.isOn ? this.offValue : this.onValue);
    },
  },
  style({ className }) {
    const $color = this.$theme.colors[this.$color];
    const $primaryColor = this.$theme.colors.primary;
    const height = this.$theme.sizes.base.factor('sm', 'height');
    const width = this.$theme.sizes.base.factor('lg', 'height', { sum: -12 });

    return [
      className('switch', {
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        verticalAlign: 'middle',
        height,
        width,
        cursor: 'pointer',
        '& > .container': {
          backgroundColor: $color.shade(5),
          borderWidth: '1px',
          borderColor: $color.shade(-13),
          width: '100%',
          height: '10px',
          borderRadius: this.$theme.sizes.radius.factor('md', 'radius'),
          '& > .handler': {
            position: 'absolute',
            display: 'inline-block',
            height,
            width: height,
            borderRadius: height,
            top: 0,
            left: 0,
            boxShadow: this.$theme.sizes.shadow.factor('sm', 'shadow', { dir: 'bottom' }),
            backgroundColor: $color.shade(-8),
            borderWidth: '1px',
            borderColor: $color.shade(-22),
            transition: 'transform 160ms ease',
          },
        },
        '&.on': {
          '& > .container': {
            '& > .handler': {
              top: 0,
              transform: `translateX(calc(${width} - 100%))`,
              backgroundColor: $primaryColor.shade(10),
              borderColor: $primaryColor.shade(1),
            },
          },
        },
        '&[disabled]': {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
        '&:not([disabled])': {
          '&:hover > .container, &:focus > .container': {
            borderColor: $color.autoShade(-39),
          },
        },
      }),
    ];
  },
};

</script>
