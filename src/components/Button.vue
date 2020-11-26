<template>
  <component
    :is="tag"
    :class="[$style.button, loading && 'loading']"
    :disabled="disabled || null"
    :to="$attrs.to || null"
    @click="onClick"
  >
    <div class="content">
      <slot />
    </div>
    <fvLoading
      v-if="loading"
      :css-color="cssColor"
      :css-size="$size"
      class="loading"
    />
  </component>
</template>

<docs src="./‌Button.html" />

<doc>
@prop tag @type String @default 'button' @description Rendering html tag.
@prop fab @type Boolean @default false @description Is Fab mode?
@prop invert @type Boolean @default false @description Does colors inverted?
@prop disabled @type Boolean @default false @description Is disabled?
@prop cssColor @type String @default 'background' @description Use any colors that already declared in themeProvider.
@prop cssSize @type oneOf('xs', 'sm', 'md', 'lg', 'xl') @default 'md' @description Size of element.

@slot default

@event click @params event @description Triggers when users clicks on component.
</doc>

<example>
@config title 'Colors'
@config state false
@config example true

<fvButton css-color="primary"> Primary </fvButton>
<fvButton css-color="danger"> Danger </fvButton>
<fvButton css-color="background"> Background </fvButton>
<fvButton css-color="primary" invert> Inverted Primary </fvButton>
<fvButton css-color="danger" invert> Inverted Danger </fvButton>
</example>

<example>
@config title 'Sizes'
@config state false
@config example true

<fvButton css-color="primary" css-size="sm"> Button </fvButton>
<fvButton css-color="primary" css-size="md"> Button </fvButton>
<fvButton css-color="primary" css-size="lg"> Button </fvButton>
<fvButton css-color="primary" css-size="xl"> Button </fvButton>
</example>

<example>
@config title 'Fab'
@config state false
@config example true

<fvButton css-color="primary" fab> :D </fvButton>
<fvButton css-color="danger" fab> :( </fvButton>
<fvButton css-color="primary" css-size="lg" fab> :) </fvButton>
<fvButton css-color="danger" css-size="lg" fab> :S </fvButton>
</example>

<script>
import color from '../mixins/color';
import size from '../mixins/size';

export default {
  mixins: [color, size],
  emits: ['click'],
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
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClick(event) {
      if (!this.loading && !this.disabled) {
        this.$emit('click', event);
      } else {
        event.preventDefault();
        event.stopPropagation();
      }
    },
  },
  style({ className }) {
    const $color = this.$theme.colors[this.$color];
    return [
      className('button', {
        font: 'inherit',
        display: 'inline-block',
        position: 'relative',
        backgroundColor: this.invert ? 'transparent' : $color.normal,
        color: $color[this.invert ? 'normal' : 'text'],
        boxShadow: this.$theme.sizes.shadow.factor(this.$size, 'shadow', { dir: 'bottom' }),
        borderWidth: '1px',
        fontWeight: 'bold',
        textAlign: 'center',
        borderColor: $color.shade(-13),
        borderRadius: this.$theme.sizes.radius.factor(this.fab ? 'round' : 'md', 'radius'),
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
        whiteSpace: 'nowrap',
        userSelect: 'none',
        '&[disabled]': {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
        '&.loading > .content': {
          opacity: 0,
        },
        '&.loading > .loading': {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(0.7)',
          color: $color.text,
        },
        '&:not([disabled])': {
          '&:hover, &:focus': {
            backgroundColor: $color.autoShade(10, this.invert ? 0.1 : 1),
          },
          '&:active': {
            backgroundColor: $color.autoShade(-15, this.invert ? 0.2 : 1),
          },
        },
      }),
    ];
  },
  inject: ['$theme'],
};
</script>
