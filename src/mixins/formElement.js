const set = (component, key, value) => {
  if (component) {
    // eslint-disable-next-line no-param-reassign
    component[key] = value;
  }
};

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
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: () => Math.random().toString(),
    },
    validation: {
      type: Function,
      default: () => true,
    },
    formatter: {
      type: Function,
      default: (v) => v,
    },
  },
  inject: {
    $formElement: {
      default: false,
    },
  },
  data() {
    return {
      isValidate: true,
      errors: [],
      formattedValue: this.formatter(this.value),
    };
  },
  methods: {
    focus() {
      this.$el.focus();
    },
    onFocusDefault() {
      set(this.$formElement, 'isHighlighted', true);
    },
    onBlurDefault() {
      set(this.$formElement, 'isHighlighted', false);
    },
    valueChangesHandler(newValue) {
      const formattedValue = this.formatter(newValue);
      let errors = [];
      if (!this.disabled) {
        const validation = this.validation(formattedValue);
        if (typeof validation === 'string') {
          errors = [
            validation,
          ];
        } else if (Array.isArray(validation)) {
          errors = [
            ...validation,
          ];
        } else if (
          validation === false
          || (
            this.required
            && (
              !formattedValue
              || (this.multiple && (
                !Array.isArray(formattedValue)
                || formattedValue.length === 0
              ))
            )
          )
        ) {
          errors = [
            'Invalid Value',
          ];
        }
      }
      this.formattedValue = formattedValue;
      this.isValidate = errors.length === 0;
      this.errors = errors;
    },
  },
  watch: {
    value(newValue) {
      this.valueChangesHandler(newValue);
    },
    errors(errors) {
      set(this.$formElement, 'errors', errors);
    },
    isValidate(isValidate) {
      set(this.$formElement, 'isValidate', isValidate);
    },
  },
};
