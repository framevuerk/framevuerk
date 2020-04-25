<template lang="pug">
transition(:name="animation", afterEnter="onOpen(2)", @beforeLeave="onClose(1)", @afterLeave="onClose(2)")
  .fv-dialog(v-show="value",
    @click.stop="cancel")
    slot
</template>

<script>
import parent from '../utility/parent.js';
import CancelDetector from '../utility/CancelDetector.js';
import FocusStoler from '../utility/FocusStoler.js';

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    animation: {
      type: String,
      default: 'fv-fade',
    },
  },
  data() {
    return {
      cancelDetector: new CancelDetector(),
      focusStoler: new FocusStoler(),
      outer: null,
    };
  },
  watch: {
    value(value) {
      this.valueHandler(value);
    },
  },
  beforeDestroy() {
    this.onClose();
  },
  mounted() {
    this.valueHandler(this.value);
  },
  methods: {
    valueHandler(value) {
      if (value) {
        this.onOpen(1);
      }
      // onClose handled by transition
    },
    onOpen(step) {
      if (step === 1) {
        this.$emit('open');
        this.cancelDetector.start(this.onCancel);
        this.outer = parent.newEl('div', 'fv-dialog-outer');
        this.outer.onclick = this.onCancel;
        this.outer.appendChild(this.$el);
        parent.lock(this._uid);
        this.focusStoler.stole(this.outer);
      } else if (step === 2) {
        this.outer.scrollTo(0, 0);
      }
    },
    onCancel(event) {
      if (this.value) {
        this.$emit('input', false);
      }
    },
    onClose(step) {
      if (step === 1) {
        this.$emit('close');
        this.cancelDetector.stop();
        parent.unlock(this._uid);
      } else if (step === 2) {
        parent.appendChild(this.$el);
        this.$nextTick(() => {
          this.focusStoler.restore();
          if (this.outer) {
            this.outer.remove();
          }
        });
      }
    },
    cancel() {

    },
  },
};

</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/functions';
@import '../styles/mixins';

.fv-dialog-outer {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  background: $shadow-color-light;
  padding: padding(lg);
}

.fv-dialog {
  @include yiq($bg-color);
  @include shadow(bottom);

  backface-visibility: hidden;
  height: auto;
  border: solid 1px contrast($bg-color, 2, hard-dark);
  overflow: visible;
  border-radius: $border-radius;
  min-width: 200px;
  max-width: 100%;
  min-height: auto;
  max-height: auto;
  margin: auto;
  z-index: 3;

  & > .header,
  & > .footer {
    padding: $padding;
  }

  & > .footer {
    display: flex;

    & > .fv-button {
      margin-#{$block-start}: $padding;
    }
  }
}
</style>
