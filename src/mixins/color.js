export default {
  inject: ['$theme'],
  props: {
    color: {
      type: String,
      default: 'background',
    },
  },
  computed: {
    $color() {
      return this.$theme.colors[this.color];
    },
  },
};
