<template>
  <div :class="$style.loading">
    <div class="spinner" />
  </div>
</template>

<doc>
@prop cssColor @type String @default 'background' @description Use any colors that already declared in themeProvider.
@prop cssSize @type oneOf('xs', 'sm', 'md', 'lg', 'xl') @default 'md' @description Size of element.

@event input @params newValue @description Triggers when value changes within component.
</doc>

<example>
@config title 'Default'
@config state false
@config example true

<fvLoading css-color="primary" css-size="md" />

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
  style({ className, keyFrames }) {
    const $color = this.$theme.colors[this.$color];
    const $size = this.$theme.sizes.base.factor(this.$size, 'height');
    const $borderSize = this.$theme.sizes.base.factor(this.$size, 'borderHeight');
    const $animationSpeed = this.$theme.speed.multiplyBy(2.2);
    console.info(`${keyFrames('loading')} ${$animationSpeed} infinite linear`);
    return [
      className('loading', {
        display: 'inline-block',
        verticalAlign: 'middle',
        width: $size,
        height: $size,
        '& > .spinner': {
          display: 'inline-block',
          height: $size,
          width: $size,
          clear: 'both',
          verticalAlign: 'middle',
          border: `${$borderSize} solid`,
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderTopColor: $color.normal,
          borderRadius: $size,
          animation: `${keyFrames('loadingAnimation')} ${$animationSpeed} infinite linear`,
        },
      }),
      keyFrames('loadingAnimation', {
        from: {
          transform: 'rotate(0deg)',
        },
        to: {
          transform: 'rotate(359deg)',
        },
      }),
      // keyFrames('loading', {
      //   from: {
      //     transform: 'rotate(0deg)',
      //   },
      //   to: {
      //     transform: 'rotate(359deg)',
      //   },
      // }),
    ];
  },
};
</script>
