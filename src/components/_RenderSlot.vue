<script>
export default {
  name: 'RenderSlot',
  // eslint-disable-next-line vue/require-prop-types
  props: ['slots'],
  render() {
    if (!this.slots) return null;
    return this.slots;
  },
};
</script>
