export default {
  props: {
    value: {
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    required: {
      type: [Boolean, Function],
      default: false,
    },
  },
  inject: {
    $formElement: {
      default: false,
    },
  },
  computed: {
    isValidate() {
      return true;
    },
  },
  methods: {
    focus() {
      this.$el.focus();
    },
    reject() {
      this.$emit('reject');
    },
    onFocusDefault() {
      if (this.$formElement) {
        this.$formElement.turn(true);
      }
    },
    onBlurDefault() {
      if (this.$formElement) {
        this.$formElement.turn(false);
      }
    },
  },
  watch: {
    isValidate(x) {
      if (this.$formElement) {
        this.$formElement.setIsValidate(x);
      }
    },
  },
};
