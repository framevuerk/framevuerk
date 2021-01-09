export default {
  beforeCreate() {
    const block = this.$options.static;
    this.$static = typeof block === 'function' ? block.call(this) : {};
  },
};
