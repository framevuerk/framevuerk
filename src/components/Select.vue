<template>
  <fvInputBox
    :placeholder="isEmpty ? placeholder : ''"
    @keydown="handleOptionsHighlight"
  >
    <div
      v-if="!isEmpty"
      slot="input"
    >
      <span
        v-for="item in forceArrayValue"
        :key="item"
        css-display="inline-block"
        css-border="md"
        css-radius="md"
        css-padding-x="sm"
        css-margin-y="xs"
        css-margin-end="xs"
        v-text="item"
      />
    </div>
    <div slot="box">
      <fvList
        ref="optionsList"
        tabindex="-1"
        css-cursor="pointer"
      >
        <fvListItem
          v-for="(option, index) in options"
          :key="index"
          :selected="itemIndex(option) > -1"
          @click="handleClickOption(option, $event)"
        >
          {{ option }}
        </fvListItem>
      </fvList>
    </div>
  </fvInputBox>
</template>

<doc>
@prop value @type oneOf(Any /* for non-multiple */, Array /* for multiple */) @default undefined @description Value of input.
@prop multiple @type Boolean @default false @description Allow user to select multiple items.
@prop placeholder @type String @default '' @description Showes when value is empty.
@prop options @type Array @default [] @description List of options.
@prop required @type Boolean or Function @default false @description If you use this element inside `form` component, the `form` component will reject until this element filled. by passing `false` this check will be skiped and by passing function, you can manualy get current value as an argument and return true/false to allow/reject form submits.
@prop disabled @type Boolean @default false @description Is disabled?

@prop cssColor @type String @default 'background' @description Use any colors that already declared in themeProvider.
@prop cssSize @type oneOf('xs', 'sm', 'md', 'lg', 'xl') @default 'md' @description Size of element.

@event input @params newValue @description Triggers when value changes within component.
</doc>

<example>
@config title 'Default'
@config state true
@config example true

@data val = undefined
@data options = ['men', 'women', 'other']
<fvSelect v-model="val" :options="options" placeholder="Choose one"/>

</example>

<example>
@config title 'Multiple'
@config state true
@config example true

@data val = []
@data options = ['hat', 'shirt', 't-shirt', 'scarf', 'poliver']
<fvSelect v-model="val" multiple :options="options" placeholder="Choose"/>

</example>


<script>
import color from '../mixins/color';
import size from '../mixins/size';
import formElement from '../mixins/formElement';

const toStatic = JSON.stringify;

export default {
  inject: ['$theme'],
  mixins: [
    color,
    size,
    formElement,
  ],
  props: {
    // eslint-disable-next-line vue/require-prop-types
    value: {
      valudator(v) {
        return this.multiple ? Array.isArray(v) : true;
      },
      default: undefined,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    forceArrayValue() {
      return this.multiple ? this.value : [this.value];
    },
    isEmpty() {
      return this.multiple
        ? this.value.length === 0
        : typeof this.value === 'undefined';
    },
    isValidate() {
      if (this.disabled) {
        return true;
      }
      if (this.required === true) {
        return !!this.isEmpty;
      }
      if (typeof this.required === 'function') {
        return this.required(this.value);
      }
      return true;
    },
  },
  methods: {
    onFocus() {
      // this.$el.select();
      this.onFocusDefault();
    },
    itemIndex(option) {
      if (this.multiple) {
        return this.value.findIndex((x) => toStatic(x) === toStatic(option));
      }
      return toStatic(this.value) === toStatic(option) ? 0 : -1;
    },
    onInput(event) {
      this.$emit('input', event.target.value);
    },
    handleOptionsHighlight(e) {
      // console.log(e);
      this.$refs.optionsList.onKeydown(e, 'select');
    },
    handleClickOption(item) {
      const index = this.itemIndex(item);
      if (this.multiple) {
        if (index > -1) {
          this.$emit('input', [
            ...this.value.slice(0, index),
            ...this.value.slice(index + 1),
          ]);
        } else {
          this.$emit('input', [
            ...this.value,
            item,
          ]);
        }
      } else if (index > -1) {
        this.$emit('input', undefined);
      } else {
        this.$emit('input', item);
      }
    },
  },
};
</script>
