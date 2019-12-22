<template>
<div :dir="direction" :class="$style.themeProvider">
  <slot />
</div>
</template>

<script>
import {
  each, shadeColor, colorLightness, hexToRgb, rgbToText, cx,
} from '@/utility/utils';

export default {
  props: {
    direction: {
      type: String,
      validator: (v) => ['ltr', 'rtl'].includes(v),
      default: 'ltr',
    },
    sizes: {
      type: Object,
      default: () => ({}),
    },
    colors: {
      type: Object,
      default: () => ({}),
    },
    speed: {
      type: Number,
      default: 250,
    },
  },
  provide() {
    return {
      $theme: {
        direction: this._direction,
        sizes: this._sizes,
        colors: this._colors,
        speed: this._speed,
      },
    };
  },
  computed: {
    _direction() {
      const { direction } = this;
      return {
        start: direction === 'ltr' ? 'left' : 'right',
        center: 'center',
        end: direction === 'ltr' ? 'right' : 'left',
        value: direction,
        leftFactor: direction === 'ltr' ? 1 : -1,
        rightFactor: direction === 'ltr' ? -1 : 1,
      };
    },
    _sizes() {
      const defaultSizes = {
        base: 8,
        radius: 6,
        shadow: 2,
      };
      const sizes = Object.assign(defaultSizes, this.sizes);
      const ret = {};
      each(sizes, (key, value) => {
        ret[key] = {
          normal: `${value}px`,
          multiplyBy: (number) => `${value * number}px`,
        };
      });
      return ret;
    },
    _colors() {
      const defaultColors = {
        background: '#fff',
        primary: '#069bd0',
        secondary: '#35485d',
        info: '#14b0cf',
        warning: '#ffd400',
        danger: '#dd4b39',
        header: '#0B62EA',
        sidebar: '#101823',
        footer: '#006CFF',
      };
      const colors = Object.assign(defaultColors, this.colors);
      const ret = {};
      each(colors, (key, value) => {
        const rgb = hexToRgb(value);
        const lightness = colorLightness(rgb);
        ret[key] = {
          normal: rgbToText(rgb),
          text: rgbToText(shadeColor(rgb, lightness < 70 ? 90 : -90)),
          lightness,
          contrast: (percent, alpha = 1, breakLine = 30) => rgbToText(shadeColor(rgb, (lightness < breakLine ? 1 : -1) * Math.abs(percent)), alpha),
          shade: (percent, alpha = 1) => rgbToText(shadeColor(rgb, percent), alpha),
        };
      });
      return ret;
    },
    _speed() {
      const { speed } = this;
      return {
        normal: `${speed}ms`,
        multiplyBy: (number) => `${speed * number}ms`,
      };
    },
  },
  style({ className, mediaQuery }) {
    console.time('Theme Provided in');
    const base = (content) => className('themeProvider', {
      '& ': {
        ...content,
      },
    });
    const queryBase = (size, content) => mediaQuery(size, [content]);
    const attrName = (name, value = null) => value ? `[${name}="${value}"]` : `[${name}]`;

    const helperClasses = () => {
      const ret = {};
      ['', 'no'].forEach((is) => {
        ['padding', 'margin', 'border'].forEach((property) => {
          ['', 'top', 'bottom', 'start', 'end', 'right', 'left'].forEach((dir, dirIndex) => {
            ['', 'sm', 'lg'].forEach((size, sizeIndex) => {
              if (is && size) {
                return;
              }
              const staticDir = dir.replace('start', this._direction.start).replace('end', this._direction.end);
              const factorMap = [1, 0.5, 2];
              const name = attrName(cx('-', is, property, dir, size));
              const prop = cx('-', property, staticDir);
              if (property === 'border') {
                const sizeValue = !is ? `${factorMap[sizeIndex]}px` : 0;
                ret[name] = {
                  [cx('-', prop, 'width')]: sizeValue,
                  [cx('-', prop, 'style')]: 'solid',
                };
              } else {
                const value = !is ? this._sizes.base.multiplyBy(factorMap[sizeIndex]) : 0;
                ret[name] = {
                  [prop]: `${value} !important`,
                };
              }
            });
          });
        });
      });
      // Radius, Shadow
      ['radius', 'shadow'].forEach((property, propertyIndex) => {
        ['', 'no'].forEach((is) => {
          ['', 'sm', 'lg'].forEach((size, sizeIndex) => {
            if (is && size) {
              return;
            }
            const propertyMap = ['border-radius', 'box-shadow'];
            const factorMap = [1, 0.5, 2];
            const name = attrName(cx('-', is, property, size));
            if (property === 'shadow') {
              const value = !is ? `0 ${this._sizes.shadow.multiplyBy(factorMap[sizeIndex])} ${this._sizes.shadow.multiplyBy(factorMap[sizeIndex])} ${this._colors.background.shade(-50, 0.2)}` : 'none';
              ret[name] = {
                boxShadow: `${value} !important`,
              };
            } else {
              const value = !is ? this._sizes.radius.multiplyBy(factorMap[sizeIndex]) : 0;
              ret[name] = {
                borderRadius: `${value} !important`,
              };
            }
          });
        });
      });
      ret[attrName('round')] = {
        borderRadius: '50% !important',
      };
      // Displays
      ['none', 'block', 'inline-block', 'inline', 'flex'].forEach((display) => {
        ret[attrName('display', display)] = {
          display,
        };
      });
      ret[attrName('flex-grow')] = {
        flexGrow: 1,
      };
      ret[attrName('flex-row')] = {
        flexDirection: 'row',
      };
      ret[attrName('flex-col')] = {
        flexDirection: 'column',
      };
      ret[attrName('full-width')] = {
        width: '100%',
      };
      // Directions
      ['text', 'dir', 'pull'].forEach((name, nameIndex) => {
        ['start', 'end', 'right', 'left'].forEach((dir) => {
          const propertyMap = ['text-align', 'direction', 'float'];
          const staticDir = dir.replace('start', this._direction.start).replace('end', this._direction.end);
          ret[attrName(`${name}-${dir}`)] = {
            [propertyMap[nameIndex]]: staticDir,
          };
        });
      });
      ret[attrName('clear-both')] = {
        clear: 'both',
      };
      ret[attrName('text-justify')] = {
        textAlign: 'justify',
      };
      // Colors
      each(this._colors, (name, color) => {
        ret[attrName('color', name)] = {
          color: color.text,
          background: color.normal,
          borderColor: color.shade(-15),
        };
        ret[attrName('text-color', name)] = {
          color: color.normal,
        };
        ret[attrName('background-color', name)] = {
          background: color.normal,
        };
      });
      // Sizes
      ['xs', 'sm', 'md', 'lg', 'xl'].forEach((sizeName, sizeIndex) => {
        const sizeMap = [1, 3, 5, 7, 9];
        const value = `${this._sizes.base.multiplyBy(sizeMap[sizeIndex])} !important`;
        ret[attrName(`size-${sizeName}`)] = {
          height: value,
          minHeight: value,
        };
      });


      return base(ret);
    };
    const gridClasses = (section = 'base', prefix = '') => {
      const width1 = 8.33;
      if (section === 'base') {
        const ret = {};
        if (!prefix) {
          ret[attrName('row')] = {
            display: 'flex',
            flexWrap: 'wrap',
            padding: this._sizes.base.multiplyBy(0.5),
            width: '100%',
            '& > *': {
              display: 'block',
              flexGrow: 1,
              width: 'auto',
              maxWidth: '100%',
              minHeight: '1px',
              padding: this._sizes.base.multiplyBy(0.5),
            },
          };
        }
        for (let i = 0; i < 12; i += 1) {
          const size = `${width1 * i}%`;
          const name = i.toString();
          ret[attrName(cx('-', 'col', prefix), name)] = i === 0 ? {
            display: 'none',
          } : {
            flex: `0 0 ${size}`,
            width: size,
            maxWidth: size,
          };
          ret[attrName(cx('-', 'col-offset', prefix), name)] = {
            [cx('-', 'margin', this._direction.start)]: size,
          };
        }
        ret[attrName(cx('-', 'hidden', prefix))] = {
          display: 'none',
        };
        return base(ret);
      } if (section === 'mediaQuery') { // real queries
        const ret = [];
        const sizeCover = (s) => `${s}px`;

        const mediaNames = ['xs', 'sm', 'md', 'lg', 'xl'];
        const mediaStarts = [0, 480, 768, 992, 1200];
        ['', 'lower', 'only'].forEach((type) => {
          each(mediaNames, (mediaName) => {
            const mediaIndex = mediaNames.indexOf(mediaName);
            const media = {};
            if (type === '' || type === 'only') { // or same or higher >=
              media.minWidth = sizeCover(mediaStarts[mediaIndex]);
            } else if (type === 'lower') { // or <
              // when lg, not lg but all lowers
              media.maxWidth = sizeCover(mediaStarts[mediaIndex] - 1);
            } else if (type === 'only' && media !== 'xl') { // or =
              media.maxWidth = sizeCover(mediaStarts[mediaIndex + 1] - 1);
            }
            const prefixName = cx('-', type, mediaName);
            ret.push(queryBase(media, gridClasses('base', prefixName)));
          });
        });
        return ret;
      }
    };


    const style = [
      helperClasses(),
      gridClasses('base'),
      ...gridClasses('mediaQuery'),
    ];
    console.timeEnd('Theme Provided in');
    return style;
  },
};
</script>
