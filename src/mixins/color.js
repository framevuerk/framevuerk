export default {
  inject: ['$theme'],
  props: ['cssColor'],
  computed: {
    $color() {
      return this.$theme.colors[this.$props.cssColor || 'background'];
    },
  },
};
