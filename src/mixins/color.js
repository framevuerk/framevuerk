export default (defaultValue = 'background') => ({
  props: ['cssColor'],
  computed: {
    $color() {
      return this.$props.cssColor || defaultValue;
    },
  },
});
