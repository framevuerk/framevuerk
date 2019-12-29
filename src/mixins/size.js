export default {
  props: ['cssSize'],
  computed: {
    $size() {
      return this.$props.cssSize || 'md';
    },
  },
};
