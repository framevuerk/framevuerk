<template>
  <div
    :class="$style.check"
    :checked="isChecked"
    :multiple="multiple"
    :disabled="disabled"
    :invalid="!isValidate"
    :tabindex="tabindex"
    @click="onClick"
    @keydown.space.prevent="onClick"
    @focus="onFocusDefault"
    @blur="onBlurDefault"
  >
    <div
      class="box"
      :class="{square: multiple, circle: !multiple}"
    />
    <span
      class="label"
      css-padding-start="md"
    >
      <slot />
    </span>
  </div>
</template>

<doc>
@prop value @type oneOf(Any /* for non-multiple */, Array /* for multiple */) @default undefined @description Value of input.
@prop content @type Any @default undefined @description The data of current item that you want to inject to value.

@prop disabled @type Boolean @default false @description Is disabled?
@prop required @type Boolean @default false @description Is required to fill?
@prop validation @type Function @default () => true @description If you use this element inside `form` component, the `form` component will reject until this function pass `true` or empty array. You can return Array of errors or even Boolean value at the end of function.
@prop formatter @type Function @default (value) => value @description If you use this element inside `form` component, will format `value` of component by this function.
@prop name @type String @default () => Math.random() @description If you use this element inside `form` component, you will access the value and triggered errors of this component by this key.
@prop placeholder @type String @default '' @description Showes when value is empty.
@prop cssColor @type String @default 'background' @description Use any colors that already declared in themeProvider.
@prop cssSize @type oneOf('xs', 'sm', 'md', 'lg', 'xl') @default 'md' @description Size of element.

@event input @params newValue @description Triggers when value changes within component.
</doc>

<example>
@config title 'Radio Button'
@config state true
@config example true

@data val = 'md'
<fvCheck content="ss" v-model="val"> Super-Small </fvCheck>
<fvCheck content="xs" v-model="val"> X-Small </fvCheck>
<fvCheck content="sm" v-model="val"> Small </fvCheck>
<fvCheck content="md" v-model="val"> Medium </fvCheck>
<fvCheck content="lg" v-model="val"> Large </fvCheck>
<fvCheck content="xl" v-model="val"> X-Large </fvCheck>
<fvCheck content="sl" v-model="val"> Super-Large </fvCheck>
</example>

<example>
@config title 'Checkbox'
@config state true
@config example true

@data val = ['md']
<fvCheck content="ss" v-model="val" multiple> Super-Small </fvCheck>
<fvCheck content="xs" v-model="val" multiple> X-Small </fvCheck>
<fvCheck content="sm" v-model="val" multiple> Small </fvCheck>
<fvCheck content="md" v-model="val" multiple> Medium </fvCheck>
<fvCheck content="lg" v-model="val" multiple> Large </fvCheck>
<fvCheck content="xl" v-model="val" multiple> X-Large </fvCheck>
<fvCheck content="sl" v-model="val" multiple> Super-Large </fvCheck>
</example>

<script>
import color from '../mixins/color';
import formElement from '../mixins/formElement';

const toStatic = JSON.stringify;

export default {
  inject: ['$theme'],
  mixins: [
    color,
    formElement,
  ],
  props: {
    // eslint-disable-next-line vue/require-prop-types
    value: {
      default: undefined,
      valudator(v) {
        return this.multiple ? Array.isArray(v) : true;
      },
    },
    // eslint-disable-next-line vue/require-prop-types
    content: {
      default: undefined,
      required: true,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    tabindex() {
      return this.disabled ? null : (this.$attrs.tabindex || 0);
    },
    forceArrayValue() {
      // eslint-disable-next-line no-nested-ternary
      return this.multiple ? this.value : (this.value ? [this.value] : []);
    },
    isChecked() {
      return this.forceArrayValue
        .findIndex((v) => toStatic(v) === toStatic(this.content)) > -1;
    },
  },
  methods: {
    onClick() {
      if (this.disabled) {
        return;
      }
      const item = this.content;
      const index = this.forceArrayValue.findIndex((x) => toStatic(x) === toStatic(item));
      if (this.multiple) {
        if (index > -1) {
          this.$emit('input', [
            ...this.value.slice(0, index),
            ...this.value.slice(index + 1),
          ]);
        } else {
          this.$emit('input', [
            ...this.value,
            item,
          ]);
        }
      } else if (index > -1) {
        this.$emit('input', this.required ? item : undefined);
      } else {
        this.$emit('input', item);
      }
    },
  },
  style({ className }) {
    const $color = this.$theme.colors[this.$color];
    const boxSize = this.$theme.sizes.base.factor('sm', 'height', { sum: -3 });
    return [
      className('check', {
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        cursor: 'pointer',
        minHeight: this.$theme.sizes.base.factor('md', 'height'),
        '& > .box': {
          width: boxSize,
          height: boxSize,
          backgroundColor: $color.shade(5),
          borderWidth: '1px',
          borderColor: $color.shade(-13),
          position: 'relative',
          boxShadow: this.$theme.sizes.shadow.factor('sm', 'shadow', { dir: 'bottom' }),
          '&.squere': {
            borderRadius: '0',
          },
          '&.circle': {
            borderRadius: boxSize,
          },
        },
        '& > .label': {
          display: 'inline-block',
        },
        '&[disabled]': {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
        '&:not([disabled])': {
          '&:hover > .box, &:focus > .box': {
            borderColor: $color.shade(-39),
          },
        },
        '&[checked]': {
          '& > .box::before': {
            content: "''",
            height: '50%',
            width: '50%',
            borderRadius: '100%',
            border: 'none',
            backgroundColor: this.$theme.colors.primary.normal,
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            left: '50%',
            top: '50%',
          },
          '&[multiple] > .box::before': {
            backgroundColor: 'transparent',
            height: '30%',
            width: '70%',
            borderRadius: '0',
            // borderBottomLeftRadius: '0.1em',
            border: `solid 0.2em ${this.$theme.colors.primary.normal}`,
            borderTop: 'none',
            borderRight: 'none',
            position: 'absolute',
            transform: 'rotateZ(-45deg)',
            left: '5%',
            top: '21%',
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

// .fv-check {
//   display: inline-flex;
//   flex-direction: row;
//   justify-content: space-between;
//   align-items: center;
//   margin: 0;
//   margin-#{$block-end}: #{$padding};
//   min-height: heightSize(md);
//   cursor: pointer;

//   & > .box {
//     @include shadow(bottom);

//     height: 1.5em;
//     width: 1.5em;
//     background: contrast($bg-color, 1, force-light);
//     border: solid 1px contrast($bg-color, 2, hard-dark);
//     display: inline-block;
//     position: relative;
//     vertical-align: middle;
//     margin-#{$block-end}: #{$padding / 2};

//     &.square {
//       border-radius: 2px;
//     }

//     &.circle {
//       border-radius: 50%;
//     }
//   }

//   & > .label {
//     display: inline-block;
//   }

//   &[checked] {
//     & > .box::before {
//       @include shadow(bottom);

//       content: '';
//       height: 50%;
//       width: 50%;
//       border-radius: 100%;
//       border: none;
//       background: $primary-color;
//       position: absolute;
//       transform: translate(-50%, -50%);
//       left: 50%;
//       top: 50%;
//     }

//     &[multiple] > .box::before {
//       background: transparent;
//       height: 30%;
//       width: 70%;
//       border-radius: 0;
//       border-bottom-left-radius: 0.1em;
//       border: solid 0.2em $primary-color;
//       border-top: none;
//       border-right: none;
//       position: absolute;
//       transform: rotateZ(-45deg);
//       left: 5%;
//       top: 21%;
//     }
//   }

//   &:not([disabled]) {
//     &:hover {
//       & > .box {
//         border: solid 1px contrast($bg-color, 3, hard-dark);
//       }
//     }

//     &:focus,
//     &[focus] {
//       & > .box {
//         @include outline;
//       }

//       &:invalid,
//       &[invalid] {
//         & > .box {
//           @include outline($danger-color);
//         }
//       }
//     }
//   }

//   &[disabled] {
//     @include disabled;
//   }
// }
</style>
