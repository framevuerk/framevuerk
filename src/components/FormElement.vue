<!-- template lang="pug">
  .fv-form-element(:class="{ 'single-line': singleLine, 'multi-line': !singleLine, inline: inline, block: !inline }")
    label(:class="{ highlighted: isHighlighted, valid: isValid, unvalid: !isValid }")
      slot(v-if="$slots.label || $scopedSlots.label", :label="label", :highlighted="isHighlighted", name="label")
      span(v-else) {{label}}
    .container(v-if="singleLine || inline")
      slot
    slot(v-else)
</template -->

<template>
  <div :class="[$style.formElement, singleLine && 'single-line', !singleLine && 'multi-line', inline && 'inline', !inline && 'block']">
    <label :class="[isHighlighted && 'highlighted', isValid && 'valid', !isValid && 'unvalid']">
      <slot v-if="$slots.label" name="label" :highlighted="isHighlighted" :label="label" />
      <span v-else v-text="label" />
    </label>
    <div v-if="singleLine || inline" :class="$style.container">
      <slot />
    </div>
    <slot v-else />
  </div>
</template>

<doc>
@slot label @params label @params highlighted @description Optional slot to manul rendering label section.
@slot default @description The form element component. Input, Dropdown, etc.

@event submit @description Triggers when form submitted.
@event reject @params listOfInvalids @description Triggers when form submitted but it's rejected because of element validation.
</doc>

<example>
@config title 'Normal'
@config state false
@config example true

@data val1 = ''
@data val2 = ''
@data val3 = ''
@data val4 = ''
@data alert = (x) => console.warn(x)

<fvForm css-row="fv-row" @submit="alert('submit')" @reject="alert('reject')">
  <fvFormElement css-col-lg="4" css-col-md="6" css-margin="sm" label="Name">
    <fvInput v-model="val1" placeholder="Enter your name" required/>
  </fvFormElement>
  <fvFormElement css-col-lg="4" css-col-md="6" css-margin="sm" label="Family">
    <fvInput v-model="val2" placeholder="Enter your family" required/>
  </fvFormElement>
  <fvFormElement css-col-lg="4" css-col-md="6" css-margin="sm" label="Age">
    <fvInput v-model="val3" placeholder="Enter your age" required/>
  </fvFormElement>
  <div css-col="12" css-margin="sm">
    <fvButton type="submit"> Done </fvButton>
  </div>

</fvForm>
</example>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    singleLine: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: false,
    },
  },
  inject: ['$theme'],
  data() {
    return {
      isHighlighted: false,
      isValid: true,
    };
  },
  provide() {
    return {
      $formElement: this,
    };
  },
  methods: {
    turn(on = true) {
      this.isHighlighted = on;
    },
    setIsValidate(newValue) {
      this.isValid = newValue;
    },
  },
  style({ className }) {
    return [
      className('formElement', {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '& > label': {
          display: 'block',
          minWidth: '25%',
          '&:not(.highlighted)': {
            opacity: 0.7,
          },
          '&.unvalid': {
            color: this.$theme.colors.danger.normal,
          },
        },
        '&.multi-line': {
          flexDirection: 'column',

          '& > label': {
            paddingBottom: this.$theme.sizes.base.multiplyBy(0.5),
          },
          '& > *': {
            width: '100%',
            minWidth: '100%',
            maxWidth: '100%',
          },
        },
        '&.single-line': {
          flexDirection: 'row',

          '& > label': {
            paddingBottom: this.$theme.sizes.base.normal,
          },
          '& > *': {
            '&:last-child': {
              [`margin-${this.$theme.direction.start}`]: this.$theme.sizes.base.normal,
              flexGrow: 1,
            },
          },
          '&.block > .container > *': {
            width: '100%',
            minWidth: '100%',
            maxWidth: '100%',
          },
        },
      }),
    ];
  },
};
</script>

<!--style lang="scss">
@import '../styles/variables';
@import '../styles/functions';
@import '../styles/mixins';

.fv-form-element {
  display: flex;

  & > label {
    @include nowrap;

    color: $color-light;
    display: block;
    min-width: 25%;

    &.highlighted {
      color: $color;
    }
  }

  &.multi-line {
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    & > label {
      padding-bottom: padding(sm);
    }

    & > * {
      font-family: inherit;
      min-width: 100%;
      max-width: 100%;
      width: 100%;
    }
  }

  &.single-line {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    & > .container {
      display: flex;
      flex-direction: row-reverse;
      flex-wrap: wrap;
      align-items: center;
    }

    & > * {
      font-family: inherit;

      &:last-child {
        margin-#{$block-start}: padding(md);
        flex-grow: 1;
      }
    }

    &.block > .container > * {
      font-family: inherit;
      max-width: 100%;
      width: 100%;
      min-width: 100%;
    }
  }
}
</style-->
