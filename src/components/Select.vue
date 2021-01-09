<template>
  <fvInputBox
    :placeholder="isEmpty ? placeholder : ''"
    :search-input="searchInput"
    :query="query"
    :disabled="disabled"
    :is-validate="isValidate"
    :auto-close="!multiple"
    @update:query="handleUpdateQuery"
    @keydown="handleOptionsHighlight"
    @focus="onFocusDefault"
    @blur="onBlurDefault"
  >
    <template
      v-if="!isEmpty"
      #input
    >
      <span
        v-for="item in forceArrayValue"
        :key="item"
        css-display="inline-block"
        css-border="md"
        css-radius="md"
        css-padding-start="md"
        css-margin-y="xs"
        css-margin-end="xs"
      >
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="singleValueTemplate(item)" />
        <span
          css-cursor="pointer"
          css-border-start="md"
          css-padding-x="md"
          @click="handleClickOption(item)"
        >
          x
        </span>
      </span>
    </template>
    <template #box>
      <fvList
        ref="optionsList"
        tabindex="-1"
        css-cursor="pointer"
      >
        <slot />
      </fvList>
    </template>
  </fvInputBox>
</template>

<doc>
@prop value @type oneOf(Any /* for non-multiple */, Array /* for multiple */) @default undefined @description Value of input.
@prop multiple @type Boolean @default false @description Allow user to select multiple items.

@prop disabled @type Boolean @default false @description Is disabled?
@prop required @type Boolean @default false @description Is required to fill?
@prop validation @type Function @default () => true @description If you use this element inside `form` component, the `form` component will reject until this function pass `true` or empty array. You can return Array of errors or even Boolean value at the end of function.
@prop formatter @type Function @default (value) => value @description If you use this element inside `form` component, will format `value` of component by this function.
@prop name @type String @default () => Math.random() @description If you use this element inside `form` component, you will access the value and triggered errors of this component by this key.
@prop placeholder @type String @default '' @description Showes when value is empty.
@prop cssColor @type String @default 'background' @description Use any colors that already declared in themeProvider.
@prop cssSize @type oneOf('xs', 'sm', 'md', 'lg', 'xl') @default 'md' @description Size of element.

@event input @params newValue @description Triggers when value changes within component.
</doc>

<example>
@config title 'Default'
@config state true
@config example true

@data val = 'm'
<fvSelect v-model="val" placeholder="Sex">
  <fvSelectOption value="m"> Male </fvSelectOption>
  <fvSelectOption value="f"> Female </fvSelectOption>
  <fvSelectOption value="o"> Other </fvSelectOption>
</fvSelect>
</example>

<example>
@config title 'Multiple'
@config state true
@config example true

@data options = [{value: 'milan', title: 'A.C. Milan'}, {value: 'inter', title: 'Inter Milan'}, {value: 'juve', title: 'Juventus F.C.'}, {value: 'napoli', title: 'S.C.S. Napoli'}, {value: 'lazio', title: 'SS Lazio'}]
@data val = ['milan']
@data query = ''
<fvSelect v-model="val" multiple placeholder="Favorite Teams" :search-input="true" :query.sync="query">
  <fvSelectOption
    v-for="opt in options"
    :value="opt.value"
    :key="opt.value"
    v-if="opt.value.includes(query)"
  >
    {{ opt.title }}
  </fvSelectOption>
</fvSelect>

</example>


<script>
import color from '../mixins/color';
import size from '../mixins/size';
import formElement from '../mixins/formElement';

const toStatic = JSON.stringify;

export default {
  provide() {
    return {
      $select: this,
    };
  },
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
    searchInput: {
      type: Boolean,
      default: false,
    },
    query: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      options: [], // filled by childs
    };
  },
  computed: {
    forceArrayValue() {
      // eslint-disable-next-line no-nested-ternary
      return this.multiple ? this.value : (typeof this.value !== 'undefined' ? [this.value] : []);
    },
    isEmpty() {
      return this.forceArrayValue.length === 0;
    },
  },
  methods: {
    singleValueTemplate(value) {
      try {
        const optionComponent = this.options.find((option) => toStatic(option.value) === toStatic(value));
        return optionComponent.$el.querySelector('.content').innerHTML; // TODO use better way
      } catch (_e) {
        return value;
      }
    },
    handleUpdateQuery(newQuery) {
      this.$emit('update:query', newQuery);
    },
    handleOptionsHighlight(e) {
      this.$refs.optionsList.onKeydown(e, 'select');
    },
    handleClickOption(item) {
      if (this.disabled) {
        return;
      }
      const index = this.forceArrayValue.findIndex((x) => toStatic(x) === toStatic(item));
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
      this.$nextTick(() => {
        this.$emit('update:query', '');
      });
    },
  },
};
</script>
