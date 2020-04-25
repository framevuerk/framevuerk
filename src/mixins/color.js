export default {
  props: ['cssColor'],
  computed: {
    $color() {
      return this.$props.cssColor || 'background';
    },
  },
};
