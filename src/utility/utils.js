// export const dashCase = (str) => str.split('').map((char) => (/[A-Z]/.test(char) ? '-' : '') + char.toLowerCase()).join('');

// export const makeError = (msg) => { throw new Error(`[VueComponentStyle] ${msg}`); };

export const typeOf = (x) => toString.call(x).match(/\s([a-zA-Z]+)/)[1];

export const each = (obj, cb) => (typeOf(obj) === 'Object' ? Object.keys(obj).forEach((key) => cb(key, obj[key])) : obj.forEach(cb));


// https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)#--version-2-hex--
export const hexToRgb = (hexColor) => {
  const color = (() => {
    let c = hexColor.replace('#', '');
    if (c.length === 3) {
      c = c.split('').map(x => x + x).join('');
    }
    if (c.length !== 6) {
      throw new Error('Bad color passes!');
    }
    return c;
  })();
  const f = parseInt(color, 16);
  // eslint-disable-next-line no-bitwise, no-mixed-operators
  return [f >> 16, f >> 8 & 0x00FF, f & 0x0000FF];
};

export const shadeColor = (rgb, percent) => {
  const [r, g, b] = rgb;
  const pp = percent % 100;
  const t = pp < 0 ? 0 : 255;
  const p = pp < 0 ? pp * -1 : pp;
  return [
    (Math.round((t - r) * p) + r),
    (Math.round((t - g) * p) + g),
    (Math.round((t - b) * p) + b),
  ];
};

export const colorLightness = (rgb) => {
  const [r, g, b] = rgb;
  return (((0.299 * r + 0.587 * g + 0.114 * b) * 100) / 255);
};

export const rgbToText = (rgb, alpha = 1) => {
  const isRgba = alpha !== 1;
  return `rgb${isRgba ? 'a' : ''}(${rgb.join(',')}${isRgba ? `,${alpha}` : ''})`;
}