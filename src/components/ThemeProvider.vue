<template>
<div :dir="direction">
  <slot />
</div>
</template>

<script>
import { each, shadeColor, colorLightness, hexToRgb, rgbToText } from '@/utility/utils';
  
export default {
  props: {
    direction: {
      type: String,
      validator: v => ['ltr', 'rtl'].includes(v),
      default: 'ltr'
    },
    sizes: {
      type: Object,
      default: () => ({})
    },
    colors: {
      type: Object,
      default: () => ({})
    },
    speed: {
      type: Number,
      default: 250
    }
  },
  provide () {
    return {
      $theme: {
        direction: this._direction,
        sizes: this._sizes,
        colors: this._colors,
        speed: this._speed,
      }
    }
  },
  computed: {
    _direction () {
      const direction = this.direction;
      return {
        start: direction === 'ltr' ? 'left' : 'right',
        center: 'center',
        end: direction === 'ltr' ? 'right' : 'left',
        value: direction,
        leftFactor: direction === 'ltr' ? 1 : -1,
      }
    },
    _sizes () {
      const defaultSizes = {
        base: 8,
        radius: 6,
        shadow: 5,
      };
      const sizes = Object.assign(defaultSizes, this.sizes);
      const ret = {}
      each(sizes, (key, value) => {
        ret[key] = {
          normal: `${value}px`,
          multiplyBy: (number) => `${value * number}px`,
        }
      })
      return ret
    },
    _colors () {
      const defaultColors = {
        background: '#fff',
        primary: '#069bd0',
        secondary: '#35485d',
        info: '#14b0cf',
        warning: '#ffd400',
        danger: '#dd4b39',
      };
      const colors = Object.assign(defaultColors, this.colors);
      const ret = {}
      each(colors, (key, value) => {
        const rgb = hexToRgb(value);
        const lightness = colorLightness(rgb);
        ret[key] = {
          normal: rgbToText(rgb),
          text: rgbToText(shadeColor(rgb, lightness < 70 ? 90 : -90)),
          lightness,
          contrast: (percent, alpha = 1, breakLine = 30) => rgbToText(shadeColor(rgb, (lightness < breakLine ? 1 : -1) * Math.abs(percent)), alpha),
          shade: (percent, alpha = 1) => rgbToText(shadeColor(rgb, percent), alpha),
        }
      })
      return ret
    },
    _speed () {
      const speed = this.speed;
      return {
        normal: `${speed}ms`,
        multiplyBy: (number) => `${speed * number}ms`,
      }
    },
  }
}
</script>