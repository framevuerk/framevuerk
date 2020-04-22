export default {
  inject: ['$theme'],
  props: {
    cssColor: {
      type: String,
      default: 'background',
    },
  },
  computed: {
    $color() {
      return this.$theme.colors[this.$props.cssColor || 'background'];
    },
  },
};
