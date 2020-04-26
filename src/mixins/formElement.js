export default function (fillingCheck = () => true) {
  return {
    props: {
      value: {
        default: undefined,
      },
      disabled: {
        type: Boolean,
        default: false,
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
        if (this.required === true) {
          return fillingCheck(this.value);
        }
        if (typeof this.required === 'function') {
          return this.required(this.value);
        }
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
  };
}
