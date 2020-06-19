<template>
  <transition
    :name="$style.dialogAnimation"
  >
    <div
      v-if="visible"
      :class="$style.dialogContainer"
    >
      <div
        ref="dialog"
        :class="$style.dialog"
        css-color="background"
        css-border="md"
        css-shadow-bottom="md"
        css-radius="md"
        v-bind="$attrs"
        v-on="$listeners"
      >
        <slot />
      </div>
    </div>
  </transition>
</template>

<doc>
@prop visible @type Boolean @default false @description Visibility of dialog. If you want auto-close version of dialog, use this prop with `.sync` modifier.

@slot default

@event open @description Triggers when dialog opens.
@event close @description Triggers when dialog closes.
@event update:visible @description Triggers when component requests to change visible prop.
</doc>

<example>
@config title 'Default'
@config state true
@config example true

@data dialogOne = false

<fvButton css-color="primary" @click="dialogOne = !dialogOne"> Normal </fvButton>
<fvDialog :visible.sync="dialogOne">
  <h2 css-border-bottom="md" css-padding="md">Hi There</h2>
  <div css-border-bottom="md" css-padding="md">One Two Three Four</div>
</fvDialog>

</example>

<script>
import cancelDetector from '../utility/cancelDetector';

export default {
  inheritAttrs: false,
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  inject: ['$theme'],
  data() {
    return {
      cancelDetector: null,
      parentElement: null,
    };
  },
  watch: {
    visible(value) {
      this.handleVisibleChange(value);
    },
  },
  beforeDestroy() {
    if (this.cancelDetector) {
      this.cancelDetector.release();
    }
    this.$el.remove();
  },
  mounted() {
    this.handleVisibleChange(this.visible);
  },
  methods: {
    handleVisibleChange(value) {
      this[value ? 'handleOpen' : 'handleClose']();
    },
    handleOpen() {
      if (this.cancelDetector) {
        this.cancelDetector.release();
      }
      this.parentElement = this.$el.parentElement;
      document.body.appendChild(this.$el);
      this.$nextTick(() => {
        this.cancelDetector = cancelDetector(this.$refs.dialog, this.close);
        this.$emit('open');
      });
    },
    handleClose() {
      if (this.cancelDetector) {
        this.cancelDetector.release();
      }
      if (this.parentElement) {
        this.parentElement.appendChild(this.$el);
      }
      this.$emit('close');
    },
    close() {
      this.$emit('update:visible', false);
    },
  },
  style({ className }) {
    return [
      className('dialogContainer', {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        overflow: 'hidden',
      }),
      className('dialog', {
        width: '320px',
        height: 'auto',
        maxHeight: '95%',
        maxWidth: '95%',
        overflow: 'auto',
        zIndex: 3,
      }),
      className('dialogAnimation', {
        '&-enter-active, &-leave-active': {
          transitionDuration: '300ms',
          transitionProperty: 'opacity',
        },
        '&-enter, &-leave-to': {
          opacity: 0,
        },
      }),
    ];
  },
};

</script>
