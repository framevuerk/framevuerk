<template>
  <div
    :dir="direction"
    :class="$style.themeProvider"
  >
    <slot />
  </div>
</template>

<doc>
@doc @description Framevuerk version 3 has new component named fvThemeProviver for theming and styling. Using this component is mandatory and should be used at root level of your app.

@prop direction @type oneOf('ltr', 'rtl') @default 'ltr' @description App direction.
@prop sizes @type Object { sizeName: Number /* px value */ } @default { base: 8, font: 14, radius: 6, shadow: 2 } @description Application sizes. Keys described in default value will use in framevuerk styling system, others will accessable with `$theme.sizes` object provided by this component.
@prop colors @type Object { colorName: String /* hex color */ } @default { background: '#FFF', gray: '#AAA', primary: '#0B62EA', danger: '#EF2424', header: '#0B62EA', sidebar: '#2B2B2B', footer: '#152235' } @description Application colors. Keys described in default value will use in framevuerk styling system, others will accessable with `$theme.colors` object provided by this component.
@prop speed @type Number /* millisecond value */ @default 250 @description App animations base speed.

@slot default

@globalProp
</doc>

<example>
@config state false
@config example false

<fvThemeProvider
  direction="ltr"
  :colors="{
    primary: '#eee',
    customColor: '#fff',
  }"
  :sizes="{
    base: 8,
    font: 16,
    customSize: 12,
  }"
  :speed="320"
>
  <!-- Entire App -->
</fvThemeProvider>
</example>

<script>
/* eslint-disable no-underscore-dangle */
import {
  each, shadeColor, colorLightness, hexToRgb, rgbToText,
} from '../utility/utils';
import { provideAs, props } from '../utility/vue';

const join = (...args) => args.filter((arg) => arg).join('-');

function directionProvider(direction) {
  const isLtr = direction === 'ltr';
  const start = isLtr ? 'left' : 'right';
  const end = isLtr ? 'right' : 'left';
  const ste = direction;
  const ets = isLtr ? 'rtl' : 'ltr';
  return {
    val: direction,
    ste,
    ets,
    start,
    center: 'center',
    end,
    endKey: isLtr ? 39 : 37,
    startKey: isLtr ? 37 : 39,
    leftFactor: isLtr ? 1 : -1,
    rightFactor: isLtr ? -1 : 1,
    nextChar: isLtr ? '>' : '<',
    prevChar: isLtr ? '<' : '>',
    static: (dir) => (dir ? dir.replace('start', start).replace('end', end) : null),
    staticDir: (dir) => (dir ? dir.replace('start', ste).replace('end', ets).replace('left', 'ltr').replace('right', 'rtl') : null),
  };
}

function sizesProvider(sizes) {
  const px = (v) => `${v}px`;
  const isType = (key, type) => key.toLowerCase().endsWith(type);
  const factorNames = ['no', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'round'];
  const getFactor = (size, factors) => factors[factorNames.indexOf(size) - 1] || 0;
  const ret = {};
  each({
    space: 8,
    height: 40,
    font: 15,
    border: 1,
    radius: 4,
    shadow: 5,
    ...sizes,
  }, (key, value) => {
    const sizeRet = {
      value,
      px: px(value),
    };
    if (isType(key, 'space')) {
      sizeRet.factor = (size) => px(value * getFactor(size, [0.125, 0.25, 0.5, 1, 3, 6, 9]));
    } else if (isType(key, 'height')) {
      sizeRet.factor = (size) => px(value * getFactor(size, [0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6]));
    } else if (isType(key, 'font')) {
      sizeRet.factor = (size) => px(value * getFactor(size, [0.5, 0.67, 0.88, 1, 1.2, 1.6, 2.2]));
    } else if (isType(key, 'border')) {
      sizeRet.factor = (size) => px(value * getFactor(size, [0.25, 0.5, 1, 1, 1, 2, 4]));
    } else if (isType(key, 'radius')) {
      sizeRet.factor = (size) => (size === 'round' ? '50%' : px(value * getFactor(size, [0.125, 0.25, 0.5, 1, 2, 4, 8])));
    } else if (isType(key, 'shadow')) {
      sizeRet.factor = (size, dir) => {
        if (size === 'no') return 'none';
        const shadowSize = px(value * getFactor(size, [0, 0.125, 0.25, 0.5, 1, 1.5, 2.5, 5]));
        const shadowBlur = px(value * getFactor(size, [0, 0.35, 0.7, 1, 1.4, 1.75, 2.1, 2.8]));
        const shadowColor = '#00000020';
        const actualDir = dir;
        if (!actualDir) {
          return `0 0 ${shadowBlur} ${shadowSize} ${shadowColor}`;
        }
        if (['bottom', 'top'].includes(actualDir)) {
          return `0 ${actualDir === 'top' ? '-' : ''}${shadowSize} ${shadowBlur} 0 ${shadowColor}`;
        }
        return `${actualDir === 'left' ? '-' : ''}${shadowSize} 0 ${shadowBlur} 0 ${shadowColor}`;
      };
    }
    ret[key] = sizeRet;
  });
  return ret;
}

function colorsProvider(colors) {
  const ret = {};
  each({
    background: '#FFF',
    gray: '#AAA',
    primary: '#35495e',
    danger: '#EF2424',
    header: '#FFF',
    sidebar: '#FFF',
    footer: '#FFF',
    ...colors,
  }, (key, value) => {
    const rgb = hexToRgb(value);
    const lightness = colorLightness(rgb);
    ret[key] = {
      value: rgb,
      bg: rgbToText(rgb),
      fg: rgbToText(shadeColor(rgb, lightness < 80 ? 90 : -90)),
      lightness,
      autoShade: (percent, alpha = 1) => {
        const trueColor = shadeColor(rgb, percent);
        const trueColorLightness = colorLightness(trueColor);
        if (trueColorLightness > 5 && trueColorLightness < 95) return rgbToText(trueColor, alpha);
        return rgbToText(shadeColor(rgb, -1 * percent), alpha);
      },
      shade: (percent, alpha = 1) => rgbToText(shadeColor(rgb, percent), alpha),
    };
  });
  return ret;
}

function speedProvider(speed) {
  const ms = (v) => `${v}ms`;
  return {
    value: speed,
    ms: ms(speed),
    multiplyBy: (number) => ms(speed * number),
  };
}

export default {
  ...props({
    direction: props.oneOf(['ltr', 'rtl'], 'ltr'),
    sizes: props.obj(),
    colors: props.obj(),
    speed: props.num(250),
  }),
  ...provideAs('$theme', '$theme'),
  computed: {
    $theme() {
      return {
        direction: directionProvider(this.direction),
        sizes: sizesProvider.call(this, this.sizes),
        colors: colorsProvider(this.colors),
        speed: speedProvider(this.speed),
      };
    },
  },
  style({ className, mediaQuery, custom }) {
    // eslint-disable-next-line no-console
    console.time('Theme Provided in');
    const base = (content) => className('themeProvider', {
      '& ': {
        ...content,
      },
    });
    const { direction, sizes, colors } = this.$theme;

    const directionNames = ['top', 'bottom', 'start', 'end', 'right', 'left'];
    const directionBorderNames = ['x', 'y'];
    const sizeNames = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
    const nativeTagSizes = [null, 'h6', 'h5', 'h4', 'h3', 'h2', 'h1'];
    const mediaNames = ['xs', 'sm', 'md', 'lg', 'xl'];
    const mediaStarts = [0, 480, 768, 992, 1200];
    const forceValue = (value) => `${value} !important`;
    const queryBase = (size, content) => mediaQuery(size, [content]);
    const attrName = (name, value = null) => (value ? `[css-${name}="${value}"]` : `[css-${name}]`);
    const attrTag = (tagName) => tagName;

    const helperClasses = () => {
      const ret = {};

      // Border, Shadow
      each([null, ...directionNames], (dynamicDir) => {
        each(['no', ...sizeNames], (size) => {
          const staticDir = direction.static(dynamicDir);
          ret[attrName(join('border', dynamicDir), size)] = {
            [join('border', staticDir, 'style')]: forceValue('solid'),
            [join('border', staticDir, 'width')]: forceValue(sizes.border.factor(size)),
          };
          ret[attrName(join('shadow', staticDir), size)] = {
            boxShadow: forceValue(sizes.shadow.factor(size, staticDir)),
          };
        });
      });

      // BorderRadius
      each(['no', ...sizeNames], (size) => {
        ret[attrName(join('radius'), size)] = {
          borderRadius: forceValue(sizes.radius.factor(size)),
        };
      });

      // Padding, Margin
      each(['padding', 'margin'], (property) => {
        each([null, ...directionBorderNames, ...directionNames], (dynamicDir) => {
          each(['no', 'auto', ...sizeNames], (size) => {
            const rule = attrName(join(property, dynamicDir), size);
            let sizeValue;
            if (size === 'auto') {
              sizeValue = size;
            } else if (size === 'no') {
              sizeValue = 0;
            } else {
              sizeValue = sizes.space.factor(size);
            }
            sizeValue = forceValue(sizeValue);

            if (dynamicDir === 'x') {
              ret[rule] = {
                [join(property, 'left')]: sizeValue,
                [join(property, 'right')]: sizeValue,
              };
            } else if (dynamicDir === 'y') {
              ret[rule] = {
                [join(property, 'top')]: sizeValue,
                [join(property, 'bottom')]: sizeValue,
              };
            } else {
              const trueDir = direction.static(dynamicDir);
              ret[rule] = {
                [join(property, trueDir)]: sizeValue,
              };
            }
          });
        });
      });

      // Space
      each([...directionBorderNames], (dir) => {
        each(['no', ...sizeNames], (size) => {
          const rule = attrName(join('space', dir), size);
          if (dir === 'x') {
            ret[rule] = {
              display: forceValue('inline-block'),
              paddingLeft: forceValue(sizes.space.factor(size)),
            };
          } else {
            ret[rule] = {
              display: forceValue('block'),
              paddingTop: forceValue(sizes.space.factor(size)),
            };
          }
        });
      });

      // Cursors
      each(['none', 'pointer', 'default', 'not-allowed', 'text'], (cursor) => {
        ret[attrName('cursor', cursor)] = {
          cursor: forceValue(cursor),
        };
      });

      // Displays
      each(['none', 'block', 'inline-block', 'inline', 'flex', 'inline-flex'], (display) => {
        ret[attrName('display', display)] = {
          display: forceValue(display),
        };
      });

      // Flex
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
        const dir = direction.static(dynamicDir);
        ret[attrName('text-align', dynamicDir)] = {
          textAlign: forceValue(dir),
        };
      });

      // Directions
      ['direction', 'float'].forEach((prop) => {
        ['start', 'end', 'right', 'left'].forEach((dynamicDir) => {
          const dir = direction[prop === 'direction' ? 'staticDir' : 'static'](dynamicDir);
          ret[attrName(join(prop), dynamicDir)] = {
            [prop]: forceValue(dir),
          };
        });
      });
      ret[attrName('clear-both')] = {
        clear: forceValue('both'),
      };

      // Colors
      each(colors, (name, color) => {
        ret[attrName('color', name)] = {
          color: forceValue(color.fg),
          backgroundColor: forceValue(color.bg),
          borderColor: forceValue(color.shade(-15)),
        };
        ret[attrName('fg-color', name)] = {
          color: forceValue(color.bg),
        };
        ret[attrName('bg-color', name)] = {
          backgroundColor: forceValue(color.bg),
        };
        ret[attrName('border-color', name)] = {
          borderColor: forceValue(color.bg),
        };
      });

      // Sizes
      each(sizeNames, (size, index) => {
        const height = forceValue(sizes.height.factor(size));
        const fontSize = forceValue(sizes.font.factor(size));
        const nativeTag = nativeTagSizes[index];
        if (!['xxs', 'xxl'].includes(size)) {
          ret[attrName('max-width', size)] = {
            maxWidth: forceValue(mediaStarts[index] ? `${mediaStarts[index] - 1}px` : '100%'),
          };
        }

        const heightValue = {
          height,
          minHeight: height,
          lineHeight: height,
        };
        const fontValue = {
          fontSize,
        };

        // h1 to h6
        if (nativeTag) {
          ret[attrTag(nativeTag)] = {
            ...fontValue,
            fontWeight: 'bold',
          };
        }

        ret[attrName('size', size)] = {
          ...heightValue,
          ...fontValue,
        };
        ret[attrName('text-size', size)] = fontValue;
        ret[attrName('height-size', size)] = heightValue;
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
            },
          };
          ret[attrName(join('col-static'))] = {
            flexGrow: forceValue(1),
            flexBasis: forceValue(0),
            flexShrink: forceValue(1),
          };
        }
        for (let i = 0; i <= 12; i += 1) {
          const size = `${width1 * i}%`;
          const name = i.toString();
          ret[attrName(join('col', prefix), name)] = i === 0 ? {
            display: forceValue('none'),
          } : {
            flex: forceValue(`0 0 ${size}`),
            width: forceValue(size),
            maxWidth: forceValue(size),
          };
          ret[attrName(join('col-offset', prefix), name)] = {
            [join('margin', direction.start)]: forceValue(size),
          };
        }
        ret[attrName(join('hidden', prefix))] = {
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
            const prefixName = join(type, mediaName);
            ret.push(queryBase(media, gridClasses('base', prefixName)));
          });
        });
        return ret;
      }
      return null;
    };

    const reset = () => [
      custom('*', {
        padding: 0,
        margin: 0,
        listStyle: 'none',
        borderStyle: 'solid',
        borderWidth: '0px',
        verticalAlign: 'baseline',
        backfaceVisibility: 'hidden',
        color: 'inherit',
        borderColor: 'inherit',
        backgroundColor: 'transparent',
        borderSpacing: 0,
        font: 'unset',
        '-webkitOverflowScrolling': 'touch',
        '-webkitTapHighlightColor': 'rgba(0, 0, 0, 0)',
        touchAction: 'pan-y',
        boxSizing: 'border-box',
        '&::-moz-focus-inner': {
          border: 0,
        },
        '&:focus': {
          outline: 'none',
        },
      }),
      custom('a, a:hover, a:visited', {
        textDecoration: 'none',
      }),
    ];

    const style = [
      ...reset(),
      helperClasses(),
      gridClasses('base'),
      ...gridClasses('mediaQuery'),
    ];
    // eslint-disable-next-line no-console
    console.timeEnd('Theme Provided in');
    return style;
  },
};
</script>
