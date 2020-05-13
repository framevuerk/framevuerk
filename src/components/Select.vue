<template>
  <fvInputBox
    :placeholder="isEmpty ? placeholder : ''"
    :search-input="searchInput"
    :query="query"
    @update:query="handleUpdateQuery"
    @keydown="handleOptionsHighlight"
    @focus="onFocus"
    @blur="onBlur"
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
      >
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="singleValueTemplate(item)" />
        <span
          css-cursor="pointer"
          css-border-start="md"
          css-padding-start="sm"
          css-padding-end="xs"
          @click="handleClickOption(item)"
        >
          x
        </span>
      </span>
    </div>
    <div slot="box">
      <fvList
        ref="optionsList"
        tabindex="-1"
        css-cursor="pointer"
      >
        <slot />
      </fvList>
    </div>
  </fvInputBox>
</template>

<doc>
@prop value @type oneOf(Any /* for non-multiple */, Array /* for multiple */) @default undefined @description Value of input.
@prop multiple @type Boolean @default false @description Allow user to select multiple items.
@prop placeholder @type String @default '' @description Showes when value is empty.
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
@data val = []
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
  inject: ['$theme'],
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
      return this.multiple ? this.value : (this.value ? [this.value] : []);
    },
    isEmpty() {
      return this.forceArrayValue.length === 0;
    },
    isValidate() {
      if (this.disabled) {
        return true;
      }
      if (this.required === true) {
        return !this.isEmpty;
      }
      if (typeof this.required === 'function') {
        return this.required(this.value);
      }
      return true;
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
    onFocus() {
      // this.$el.select();
      this.onFocusDefault();
    },
    onBlur() {
      // this.$el.select();
      this.onBlurDefault();
    },
    itemIndex(option) {
      return this.forceArrayValue.findIndex((x) => toStatic(x) === toStatic(option));
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
      this.$nextTick(() => {
        this.$emit('update:query', '');
      });
    },
  },
};
</script>
