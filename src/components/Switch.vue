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
@prop required @type Boolean or Function @default false @description If you use this element inside `form` component, the `form` component will reject until this element filled. by passing `false` this check will be skiped and by passing function, you can manualy get current value as an argument and return true/false to allow/reject form submits.
@prop disabled @type Boolean @default false @description Is disabled?
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

<style lang="scss">
// @import '../styles/variables';
// @import '../styles/mixins';

// .fv-switch {
//   display: inline-block;
//   min-height: heightSize(md);
//   width: 4.2em;
//   position: relative;
//   vertical-align: middle;

//   & .container {
//     @include shadow(bottom);

//     background: contrast($bg-color, 1, force-dark);
//     border: solid 1px contrast($bg-color, 2, hard-dark);
//     cursor: pointer;
//     direction: $direction;
//     padding: 0.2em;
//     top: 0.2em;
//     height: 2.2em;
//     width: 4.2em;
//     border-radius: 2em;
//     position: absolute;
//     text-align: $block-start;
//     display: flex;
//     align-items: center;
//   }

//   & .handler {
//     @include shadow(bottom);

//     background: contrast($bg-color, 2, force-light);
//     border: solid 1px contrast($bg-color, 2);
//     border-radius: 2em;
//     display: block;
//     height: 1.8em;
//     width: 1.8em;
//     transition-duration: $transition-speed-fast;
//     transition-property: margin;
//     transition-timing-function: ease;
//     will-change: margin;
//   }

//   &.on {
//     & .container {
//       background: contrast($primary-color, 2, hard-light);
//     }

//     & .handler {
//       margin-#{$block-start}: 1.9em;
//     }
//   }

//   &[disabled] .container {
//     @include disabled;
//   }

//   &:focus .handler {
//     @include outline;
//   }

//   &:focus:invalid .handler,
//   &:focus[invalid] .handler {
//     @include outline($danger-color);
//   }

//   &:hover:not(:focus):not([disabled]) .handler {
//     border: solid 1px contrast($bg-color, 3, hard-dark);
//   }
// }
</style>
