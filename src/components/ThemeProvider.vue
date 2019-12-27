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
      const start = direction === 'ltr' ? 'left' : 'right';
      const end = direction !== 'ltr' ? 'left' : 'right';
      return {
        start,
        center: 'center',
        end,
        value: direction,
        leftFactor: direction === 'ltr' ? 1 : -1,
        rightFactor: direction === 'ltr' ? -1 : 1,
        static: (dir) => dir ? dir.replace('start', start).replace('end', end) : null,
      };
    },
    _sizes() {
      const defaultSizes = {
        base: 8,
        font: 14,
        radius: 8,
        shadow: 2,
      };
      const sizes = Object.assign(defaultSizes, this.sizes);
      const heightFactor = [0, 1, 3, 5, 7, 9];
      const sizeFactor = [0, 0.1, 0.33, 1, 3, 9];
      const shadowFactor = [0, 0.25, 0.5, 1, 2, 4];
      const shadowBlurFactor = [0, 0.5, 0.75, 1, 1.25, 1.5];
      const fontFactor = [0, 0.5, 0.7, 1, 1.15, 1.8];
      const borderFactor = [0, 0.0625, 0.125, 0.125, 0.1875, 0.25];
      const factors = ['no', 'xs', 'sm', 'md', 'lg', 'xl', 'round'];
      const ret = {};
      each(sizes, (key, value) => {
        ret[key] = {
          normal: `${value}px`,
          multiplyBy: (number) => `${value * number}px`,
          factor: (size, factorType = 'size', options = {}) => {
            if (size === 'auto') {
              return 'auto';
            }
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
            const shadowColor = this._colors[options.color || 'background'].shade(-50, 0.14);
            const dir = this._direction.static(options.dir || 'all');
            if (dir === 'all') {
              return `0 0 ${shadowBlur} ${shadowSize} ${shadowColor}`;
            }
            if (['bottom', 'top'].includes(dir)) {
              return `0 ${dir === 'top' ? '-' : ''}${shadowSize} ${shadowBlur} 0 ${shadowColor}`;
            }
            return `${dir === 'left' ? '-' : ''}${shadowSize} 0 ${shadowBlur} 0 ${shadowColor}`;
          },
        };
      });
      return ret;
    },
    _colors() {
      const defaultColors = {
        background: '#fff',
        primary: '#0B62EA',
        secondary: '#35485d',
        info: '#14b0cf',
        warning: '#ffd400',
        danger: '#dd4b39',
        header: '#0B62EA',
        sidebar: '#2B2B2B',
        footer: '#152235',
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
          autoShade: (percent,alpha = 1) => {
            const ver1 = shadeColor(rgb, percent);
            const ver2 = shadeColor(rgb, -1 * percent);
            const ver1Lightness = colorLightness(ver1);
            return rgbToText(ver1Lightness > 5 && ver1Lightness < 95 ? ver1 : ver2, alpha);
          },
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
  style({ className, mediaQuery, custom }) {
    console.time('Theme Provided in');
    const base = (content) => className('themeProvider', {
      '& ': {
        ...content,
      },
    });
    const mediaNames = ['xs', 'sm', 'md', 'lg', 'xl'];
    const mediaStarts = [0, 480, 768, 992, 1200];
    const forceValue = (value) => `${value} !important`;
    const queryBase = (size, content) => mediaQuery(size, [content]);
    const attrName = (name, value = null) => value ? `[css-${name}="${value}"]` : `[css-${name}]`;

    const helperClasses = () => {
      const ret = {};
      // Border
      ['border', 'shadow'].forEach((property) => {
        [null, 'top', 'bottom', 'start', 'end', 'right', 'left'].forEach((dynamicDir) => {
          ['no', 'xs', 'sm', 'md', 'lg', 'xl'].forEach((size, sizeIndex) => {
            const rule = attrName(cx('-', property, dynamicDir), size);
            const dir = this._direction.static(dynamicDir);
            if (property === 'border') {
              const prop = cx('-', 'border', dir);
              ret[rule] = {
                [cx('-', prop, 'style')]: forceValue('solid'),
                [cx('-', prop, 'width')]: forceValue(this._sizes.base.factor(size, 'border')),
              };
            } else { // shadow
              ret[rule] = {
                boxShadow: forceValue(this._sizes.base.factor(size, 'shadow', { dir })),
              };
            }
          });
        });
      });

      // Padding and Margin
      ['padding', 'margin'].forEach((property) => {
        [null, 'x', 'y', 'top', 'bottom', 'start', 'end', 'right', 'left'].forEach((dynamicDir) => {
          ['no', 'xs', 'sm', 'md', 'lg', 'xl', 'auto'].forEach((size) => {
            const rule = attrName(cx('-', property, dynamicDir), size);
            const dir = this._direction.static(dynamicDir);
            if (dir === 'x') {
              const prop1 = cx('-', property, 'left');
              const prop2 = cx('-', property, 'right');
              ret[rule] = {
                [prop1]: forceValue(this._sizes.base.factor(size, 'size')),
                [prop2]: forceValue(this._sizes.base.factor(size, 'size')),
              };
            } else if (dir === 'y') {
              const prop1 = cx('-', property, 'top');
              const prop2 = cx('-', property, 'bottom');
              ret[rule] = {
                [prop1]: forceValue(this._sizes.base.factor(size, 'size')),
                [prop2]: forceValue(this._sizes.base.factor(size, 'size')),
              };
            } else {
              const prop = cx('-', property, dir);
              ret[rule] = {
                [prop]: forceValue(this._sizes.base.factor(size, 'size')),
              };
            }
          });
        });
      });

      // Spaces
      ['x', 'y'].forEach((dir) => {
        ['no', 'xs', 'sm', 'md', 'lg', 'xl', 'auto'].forEach((size) => {
          const rule = attrName(cx('-', 'space', dir), size);
          if (dir === 'x') {
            ret[rule] = {
              display: forceValue('inline-block'),
              marginLeft: forceValue(this._sizes.base.factor(size, 'size')),
            };
          } else { // y
            ret[rule] = {
              display: forceValue('block'),
              marginTop: forceValue(this._sizes.base.factor(size, 'size')),
            };
          }
        });
      });

      // Radius
      [null, 'top', 'bottom', 'start', 'end', 'right', 'left'].forEach((dynamicSide) => {
        ['no', 'xs', 'sm', 'md', 'lg', 'xl', 'round'].forEach((size) => {
          const side = this._direction.static(dynamicSide);
          const rule = attrName(cx('-', 'radius', dynamicSide), size);
          const value = forceValue(this._sizes.radius.factor(size, 'radius'));
          if (dynamicSide === null) {
            ret[rule] = {
              borderRadius: forceValue(this._sizes.radius.factor(size, 'radius')),
            };
          } else {
            const side1 = ['top', 'bottom'].includes(dynamicSide) ? `${side}-right` : `top-${side}`;
            const side2 = ['top', 'bottom'].includes(dynamicSide) ? `${side}-right` : `bottom-${side}`;
            ret[rule] = {
              [cx('-', 'border', side1, 'radius')]: value,
              [cx('-', 'border', side2, 'radius')]: forceValue(this._sizes.radius.factor(size, 'radius')),
            };
          }
        });
      });

      // Displays
      ['none', 'block', 'inline-block', 'inline', 'flex', 'inline-flex'].forEach((display) => {
        ret[attrName('display', display)] = {
          display: forceValue(display),
        };
      });
      ret[attrName('flex')] = {
        display: forceValue('flex'),
        alignItems: forceValue('center'),
        justifyContent: forceValue('center'),
      };
      ret[attrName('grow')] = {
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
      ret[attrName('overflow', 'hidden')] = {
        overflow: forceValue('hidden'),
      };

      // Text Aligns
      ['start', 'end', 'right', 'left', 'justify', 'center'].forEach((dynamicDir) => {
        const dir = this._direction.static(dynamicDir);
        ret[attrName('text-align', dynamicDir)] = {
          textAlign: forceValue(dir),
        };
      });
            
      // Directions
      ['direction', 'float'].forEach((prop) => {
        ['start', 'end', 'right', 'left'].forEach((dynamicDir) => {
          const dir = this._direction.static(dynamicDir);
          ret[attrName(cx('-', prop), dynamicDir)] = {
            [prop]: forceValue(dir),
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
      ['xs', 'sm', 'md', 'lg', 'xl'].forEach((size, index) => {
        const height = forceValue(this._sizes.base.factor(size, 'height'));
        const fontSize = forceValue(this._sizes.font.factor(size, 'font'));
        ret[attrName('max-width', size)] = {
          maxWidth: forceValue(mediaStarts[index + 1] ? `${mediaStarts[index + 1] - 1}px` : '100%'),
        };
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
            display: forceValue('flex'),
            flexWrap: forceValue('wrap'),
            width: forceValue('100%'),
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
            display: forceValue('none'),
          } : {
            flex: forceValue(`0 0 ${size}`),
            width: forceValue(size),
            maxWidth: forceValue(size),
          };
          ret[attrName(cx('-', 'col-offset', prefix), name)] = {
            [cx('-', 'margin', this._direction.start)]: forceValue(size),
          };
        }
        ret[attrName(cx('-', 'hidden', prefix))] = {
          display: forceValue('none'),
        };
        return base(ret);
      } if (section === 'mediaQuery') { // real queries
        const ret = [];
        const sizeCover = (s) => `${s}px`;
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

    const reset = () => [
      custom('*', {
        padding: 0,
        margin: 0,
        border: 0,
        verticalAlign: 'baseline',
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
      }),
    ];

    const style = [
      ...reset(),
      helperClasses(),
      gridClasses('base'),
      ...gridClasses('mediaQuery'),
    ];
    console.timeEnd('Theme Provided in');
    return style;
  },
};
</script>
