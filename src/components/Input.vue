<template>
<component
  :is="tag"
  :class="$style.input"
  :disabled="disabled"
  :invalid="!fvValidate"
  :value="value"
  v-html="value"
  @focus="onFocus"
  @blur="onBlurDefault"
  @input="onInput" />
</template>

<script>
import color from '../mixins/color';
import size from '../mixins/size';
import formElement from '../mixins/formElement';

export default {
  inject: ['$theme'],
  mixins: [
    color,
    size,
    formElement((v) => !!v),
  ],
  props: {
    multiLine: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    tag() {
      return this.multiLine ? 'textarea' : 'input';
    },
  },
  methods: {
    onFocus() {
      this.$el.select();
      this.onFocusDefault();
    },
    onInput(event) {
      this.$emit('input', event.target.value);
    },
  },
  style({className}) {
    return [
      className('input', {
        display: 'inline-block',
        backgroundColor: this.$color.shade(5),
        color: this.$color.text,
        boxShadow: this.$theme.sizes.shadow.factor(this.$size, 'shadow', { dir: 'bottom' }),
        borderWidth: '1px',
        borderColor: this.$color.shade(-13),
        borderRadius: this.$theme.sizes.radius.factor(this.$size, 'radius'),
        minHeight: this.$theme.sizes.base.factor(this.$size, 'height'),
        height: this.multiLine ? this.$theme.sizes.base.factor('xl', 'height') : this.$theme.sizes.base.factor(this.$size, 'height'),
        fontSize: this.$theme.sizes.font.factor(this.$size, 'font'),
        padding: this.$theme.sizes.base.multiplyBy(2),
        resize: 'vertical',
        '&:hover, &:focus': {
          borderColor: this.$color.autoShade(-39),
        },
      }),
    ];
  },
};
</script>
