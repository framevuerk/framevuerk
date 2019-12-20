import parent from './parent.js';

export default class FocusStoler {
  constructor() {
    this.$src = null;
    this.$focusableItems = [];
    this.onTab = (event) => {
      if (event.which === 9) {
        // if tab button clicked
        if (event.target === this.$focusableItems[0] && event.shiftKey) {
          // when first item is focused and user press shift + tab
          event.preventDefault();
          this.$focusableItems[this.$focusableItems.length - 1].focus();
        } else if (event.target === this.$focusableItems[this.$focusableItems.length - 1] && !event.shiftKey) {
          // when last item is focused and user press tab
          event.preventDefault();
          this.$focusableItems[0].focus();
        }
      }
    };
  }

  stole($dest) {
    this.$src = parent.$document.querySelector(':focus');
    this.$focusableItems = $dest.querySelectorAll('select, input, textarea, button, [tabindex]:not([tabindex=""])');
    const $force = $dest.querySelector('[autofocus]');
    if ($force) {
      $force.focus();
    } else if (this.$focusableItems.length) {
      this.$focusableItems[this.$focusableItems.length - 1].focus();
    }
    parent.on('keydown', this.onTab);
  }

  restore() {
    if (this.$src) {
      this.$src.focus();
    }
    parent.off('keydown', this.onTab);
  }
}
