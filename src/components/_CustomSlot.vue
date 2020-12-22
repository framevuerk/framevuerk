<script>
export default {
  name: 'CustomSlot', // use for check to do not enter inside same child component
  emits: ['update'],
  // eslint-disable-next-line vue/require-prop-types
  props: ['uid', 'component', 'customCheck'],
  render() {
    if (!this.uid) return null;
    const checkComponent = (section) => {
      if (
        (this.component && section.type.name !== this.component)
        || (this.customCheck && !this.customCheck(section))
      ) {
        return false;
      }
      return true;
    };
    const $parent = (() => {
      let parent = this.$parent;
      while (parent && parent.$.uid !== this.uid) {
        parent = parent.$parent;
      }
      return parent;
    })();
    const getFilteredSlots = (slot, currentLevel = 1) => {
      let ret = [];
      (slot || []).forEach((section) => {
        if (!section.type) return;
        if (checkComponent(section)) {
          ret = [...ret, section];
        } else if (section.children && currentLevel <= 4 && section.type.name !== this.$options.name) {
          let subSlot = [];
          if (Array.isArray(section.children)) {
            subSlot = section.children;
          } else if (typeof section.children === 'object' && typeof section.children.default === 'function') {
            subSlot = section.children.default();
          }
          ret = [...ret, ...getFilteredSlots(subSlot, currentLevel + 1)];
        }
      });
      return ret;
    };
    const $filteredSlots = getFilteredSlots($parent.$slots.default ? $parent.$slots.default() : []);
    this.$emit('update', $filteredSlots);
    return $filteredSlots;
  },
};
</script>
