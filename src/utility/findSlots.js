export default (parentComponent, checkComponent, maxLevel = 4) => {
  const getFilteredSlots = (slot, currentLevel = 1) => {
    let ret = [];
    (slot || []).forEach((section) => {
      if (!section.type) return;
      if (checkComponent(section)) {
        ret = [...ret, section];
      } else if (section.children && currentLevel <= maxLevel) {
        let subSlot = [];
        if (Array.isArray(section.children)) {
          subSlot = section.children;
        } else if (
          typeof section.children === 'object' &&
          typeof section.children.default === 'function'
        ) {
          subSlot = section.children.default();
        }
        ret = [...ret, ...getFilteredSlots(subSlot, currentLevel + 1)];
      }
    });
    return ret;
  };
  return getFilteredSlots(parentComponent.$slots.default ? parentComponent.$slots.default() : []);
};
