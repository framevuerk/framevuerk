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
        font: 14,
        radius: 6,
        shadow: 2,
      };
      const sizes = Object.assign(defaultSizes, this.sizes);
      const heightFactor = [0, 1, 3, 5, 7, 9];
      const sizeFactor = [0, 0.25, 0.5, 1, 2, 4];
      const shadowFactor = [0, 0.25, 0.5, 1, 2, 4];
      const shadowBlurFactor = [0, 0.5, 0.75, 1, 1.25, 1.5];
      const fontFactor = [0, 0.7, 0.85, 1, 1.45, 1.8];
      const borderFactor = [0, 0.0625, 0.125, 0.125, 0.1875, 0.25];
      const factors = ['no', 'xs', 'sm', 'md', 'lg', 'xl', 'round'];
      const ret = {};
      each(sizes, (key, value) => {
        ret[key] = {
          normal: `${value}px`,
          multiplyBy: (number) => `${value * number}px`,
          factor: (size, factorType = 'size', arg = null) => {
            if (factorType === 'size') {
              return `${value * [sizeFactor[factors.indexOf(size)]]}px`;
            }
            
            if (factorType === 'radius') {
              if (size === 'round') {
                return '50%';
              }
              return `${value * [sizeFactor[factors.indexOf(size)]]}px`;
            }

            if (factorType === 'border') {
              return `${value * [borderFactor[factors.indexOf(size)]]}px`;
            }

            if (factorType === 'font') {
              return `${value * [fontFactor[factors.indexOf(size)]]}px`;
            }

            if (factorType === 'height') {
              return `${value * [heightFactor[factors.indexOf(size)]]}px`;
            }
            // shadow
            if (size === 'no') {
              return 'none';
            }
            const shadowSize = `${value * [shadowFactor[factors.indexOf(size)]]}px`;
            const shadowBlur = `${value * [shadowBlurFactor[factors.indexOf(size)]]}px`;
            return `0 ${shadowSize} ${shadowBlur} ${this._colors[arg || 'background'].shade(-50, 0.2)}`;
          },
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
    const forceValue = (value) => `${value} !important`;
    const staticDir = (dir) => (dir || '').replace('start', this._direction.start).replace('end', this._direction.end) || null;
    const queryBase = (size, content) => mediaQuery(size, [content]);
    const attrName = (name, value = null) => value ? `[css-${name}="${value}"]` : `[css-${name}]`;

    const helperClasses = () => {
      const ret = {};
      // Border
      [null, 'top', 'bottom', 'start', 'end', 'right', 'left'].forEach((dynamicDir) => {
        ['no', 'xs', 'sm', 'md', 'lg', 'xl'].forEach((size, sizeIndex) => {
          const rule = attrName(cx('-', 'border', dynamicDir), size);
          const dir = staticDir(dynamicDir);
          const prop = cx('-', 'border', dir);
          ret[rule] = {
            [cx('-', prop, 'style')]: forceValue('solid'),
            [cx('-', prop, 'width')]: forceValue(this._sizes.base.factor(size, 'border')),
          };
        });
      });

      // Spaces and Positions
      [null, 'padding', 'margin'].forEach((property) => {
        [null, 'top', 'bottom', 'start', 'end', 'right', 'left'].forEach((dynamicDir) => {
          ['no', 'xs', 'sm', 'md', 'lg', 'xl'].forEach((size) => {
            if (!property && !dynamicDir) {
              return;
            }
            const dir = staticDir(dynamicDir);
            const rule = attrName(cx('-', property, dynamicDir), size);
            const prop = cx('-', property, dir);
            ret[rule] = {
              [prop]: forceValue(this._sizes.base.factor(size, 'size')),
            };
          });
        });
      });

      // Radius
      ['no', 'xs', 'sm', 'md', 'lg', 'xl', 'round'].forEach((size) => {
        ret[attrName(cx('-', 'radius'), size)] = {
          borderRadius: forceValue(this._sizes.radius.factor(size, 'radius')),
        };
      });

      // Shadow
      ['no', 'xs', 'sm', 'md', 'lg', 'xl'].forEach((size) => {
        ret[attrName(cx('-', 'shadow'), size)] = {
          boxShadow: forceValue(this._sizes.shadow.factor(size, 'shadow')),
        };
      });

      // Displays
      ['none', 'block', 'inline-block', 'inline', 'flex', 'inline-flex'].forEach((display) => {
        ret[attrName('display', display)] = {
          display: forceValue(display),
        };
      });
      ret[attrName('flex-auto')] = {
        display: forceValue('flex'),
        alignItems: forceValue('center'),
        justifyContent: forceValue('center'),
      };
      ret[attrName('flex-grow')] = {
        flexGrow: forceValue(1),
      };
      ret[attrName('flex-row')] = {
        flexDirection: forceValue('row'),
      };
      ret[attrName('flex-col')] = {
        flexDirection: forceValue('column'),
      };
      ret[attrName('full-width')] = {
        width: forceValue('100%'),
      };

      // Text Aligns
      ['start', 'end', 'right', 'left', 'justify', 'center'].forEach((dynamicDir) => {
        const dir = staticDir(dynamicDir);
        ret[attrName(cx('-', 'align'), dynamicDir)] = {
          textAlign: forceValue(staticDir),
        };
      });
            
      // Directions
      ['direction', 'float'].forEach((prop) => {
        ['start', 'end', 'right', 'left'].forEach((dynamicDir) => {
          const dir = staticDir(dynamicDir);
          ret[attrName(cx('-', prop), dynamicDir)] = {
            [prop]: forceValue(staticDir),
          };
        });
      });
      ret[attrName('clear-both')] = {
        clear: forceValue('both'),
      };

      // Colors
      each(this._colors, (name, color) => {
        ret[attrName('color', name)] = {
          color: forceValue(color.text),
          backgroundColor: forceValue(color.normal),
          borderColor: forceValue(color.shade(-15)),
        };
        ret[attrName('text-color', name)] = {
          color: forceValue(color.normal),
        };
        ret[attrName('background-color', name)] = {
          backgroundColor: forceValue(color.normal),
        };
        ret[attrName('background-color', name)] = {
          borderColor: forceValue(color.normal),
        };
      });

      // Sizes
      ['xs', 'sm', 'md', 'lg', 'xl'].forEach((size) => {
        const height = forceValue(this._sizes.base.factor(size, 'height'));
        const fontSize = forceValue(this._sizes.font.factor(size, 'font'));
        ret[attrName('size', size)] = {
          height,
          minHeight: height,
          lineHeight: height,
          fontSize,
        };
        ret[attrName('text-size', size)] = {
          fontSize,
        };
        ret[attrName('height-size', size)] = {
          height,
          minHeight: height,
          lineHeight: height,
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
            // padding: this._sizes.base.multiplyBy(0.5),
            width: '100%',
            '& > *': {
              display: 'block',
              flexGrow: 1,
              width: 'auto',
              maxWidth: '100%',
              minHeight: '1px',
              // padding: this._sizes.base.multiplyBy(0.5),
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

    const reset = () => {
      return base({
        '*': {
          '-webkitOverflowScrolling': 'touch',
          '-webkitTapHighlightColor': 'rgba(0, 0, 0, 0)',
          touchAction: 'pan-y',
          boxSizing: 'border-box',
          '&::-moz-focus-inner': {
            border: 0,
          },
          '&:focus': {
            outline: 'none',
          }
        }
      })
    }


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
