<script>
import findSlots from '../utility/findSlots';

export default {
  name: 'CustomSlot',
  emits: ['update'],
  // eslint-disable-next-line vue/require-prop-types
  props: ['uid', 'component', 'customCheck', 'slots'],
  render() {
    if (this.slots) return this.slots;
    if (!this.uid) return null;
    const checkComponent = (section) => {
      if (
        (this.component && (section.type || {}).name !== this.component)
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
    const filteredSlots = findSlots($parent, checkComponent, 4);
    this.$emit('update', filteredSlots);
    return filteredSlots;
  },
};
</script>
