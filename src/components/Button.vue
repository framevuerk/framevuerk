<template>
  <component
    :is="tag"
    :class="$style.button"
    :disabled="disabled"
    :to="$attrs.to"
    @click="onClick"
  >
    <template>
      <slot />
    </template>
  </component>
</template>


<doc>
@prop tag @type String @default 'button' @description Rendering html tag.
@prop fab @type Boolean @default false @description Is Fab mode?
@prop invert @type Boolean @default false @description Does colors inverted?
@prop disabled @type Boolean @default false @description Is disabled?

@slot default


@event click @params event @description Triggers when users clicks on component.
</doc>

<example>
@config state false
@config example true

<fvButton css-color="primary"> Button </fvButton>
<fvButton css-color="danger"> Button </fvButton>
<fvButton css-color="background"> Button </fvButton>

</example>

<script>
import color from '../mixins/color';
import size from '../mixins/size';

export default {
  mixins: [color, size],
  props: {
    tag: {
      type: String,
      default: 'button',
    },
    fab: {
      type: Boolean,
      default: false,
    },
    invert: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClick(event) {
      if (!this.loading && !this.disabled) {
        this.$emit('click', event);
      }
    },
  },
  style({ className }) {
    const $color = this.$theme.colors[this.$color];
    return [
      className('button', {
        display: 'inline-block',
        backgroundColor: this.invert ? 'transparent' : $color.normal,
        color: $color[this.invert ? 'normal' : 'text'],
        boxShadow: this.$theme.sizes.shadow.factor(this.$size, 'shadow', { dir: 'bottom' }),
        borderWidth: '1px',
        fontWeight: 'bold',
        textAlign: 'center',
        borderColor: $color.shade(-13),
        borderRadius: this.$theme.sizes.radius.factor(this.fab ? 'round' : this.$size, 'radius'),
        lineHeight: this.$theme.sizes.base.factor(this.$size, 'height'),
        minHeight: this.$theme.sizes.base.factor(this.$size, 'height'),
        height: this.$theme.sizes.base.factor(this.$size, 'height'),
        fontSize: this.$theme.sizes.font.factor(this.$size, 'font'),
        width: this.fab ? this.$theme.sizes.base.factor(this.$size, 'height') : 'auto',
        padding: this.fab ? '0' : `0 ${this.$theme.sizes.base.multiplyBy(2)}`,
        transition: `all ${this.$theme.speed.normal}`,
        cursor: 'pointer',
        overflow: 'hidden',
        textDecoration: 'blink',
        userSelect: 'none',
        '&:hover, &:focus': {
          backgroundColor: $color.autoShade(10, this.invert ? 0.1 : 1),
        },
        '&:active': {
          backgroundColor: $color.autoShade(-15, this.invert ? 0.2 : 1),
        },
      }),
    ];
  },
  inject: ['$theme'],
};
</script>
