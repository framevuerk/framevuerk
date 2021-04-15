/* eslint-disable import/prefer-default-export */
import { typeOf } from './utils';

export const inject = (...list) => {
  const ret = {};
  list.forEach((item) => {
    if (typeof item === 'string') {
      ret[item] = {};
    } else {
      ret[item[0]] = {
        default: item[1],
      };
    }
  });
  return {
    inject: ret,
  };
};

export const provideAs = (name, customField = false) => ({
  provide() {
    return {
      [name]: customField ? this[customField] : this,
    };
  },
});

const propDefaultValue = (defaultValue) => (typeof defaultValue === 'undefined' ? { required: true } : { default: defaultValue });

export const props = (obj) => ({
  props: obj,
});

props.str = (defaultValue = '') => ({
  type: String,
  ...propDefaultValue(defaultValue),
});

props.bool = (defaultValue = false) => ({
  type: Boolean,
  ...propDefaultValue(defaultValue),
});

props.num = (defaultValue = 0) => ({
  type: Number,
  ...propDefaultValue(defaultValue),
});

props.obj = (defaultValue = () => ({})) => ({
  validator: (v) => typeOf(v) === 'Object',
  ...propDefaultValue(defaultValue),
});

props.arr = (defaultValue = () => []) => ({
  validator: (v) => typeOf(v) === 'Array',
  ...propDefaultValue(defaultValue),
});

props.oneOf = (options, defaultValue) => ({
  validator: (v) => options.includes(v),
  ...propDefaultValue(defaultValue),
});

props.any = (defaultValue) => ({
  ...propDefaultValue(defaultValue),
});
