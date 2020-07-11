<template>
  <div
    :class="[$style.formElement, singleLine && 'single-line', inline && 'inline']"
  >
    <div
      class="label"
      :class="[isHighlighted && 'highlighted', !isValidate && 'unvalid']"
    >
      <slot
        name="label"
        :highlighted="isHighlighted"
      />
    </div>
    <div
      v-if="singleLine || inline"
      :class="$style.container"
    >
      <slot />
    </div>
    <slot v-else />
    <div v-if="hasErrorsSlot">
      <slot
        name="errors"
        :errors="errors"
      />
    </div>
  </div>
</template>

<doc>
@prop signleLine @type Boolean @default false @description Show both label and form element in single line?
@prop inline @type Boolean @default false @description Only set this true for inline form elements including fvCheck, fvSwitch, etc.

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
@data val3 = undefined
@data alert = (x) => console.warn(x)

<fvForm css-row="fv-row" @submit="alert('submit')" @reject="alert('reject')">
  <fvFormElement css-col-lg="4" css-col-md="6" css-margin="sm">
    <label slot="label"> Name </label>
    <fvInput v-model="val1" placeholder="Enter your name" required/>
  </fvFormElement>
  <fvFormElement css-col-lg="4" css-col-md="6" css-margin="sm">
    <label slot="label"> Family </label>
    <fvInput v-model="val2" placeholder="Enter your family" required/>
  </fvFormElement>
  <fvFormElement css-col-lg="4" css-col-md="6" css-margin="sm">
    <label slot="label"> Age </label>
    <fvSelect v-model="val3" placeholder="Enter your age" required>
      <fvSelectOption value="-7"> Under 7 </fvSelectOption>
      <fvSelectOption value="7-13"> 7 to 13 </fvSelectOption>
      <fvSelectOption value="13-25"> 13 to 25 </fvSelectOption>
      <fvSelectOption value="+26"> More than 26 </fvSelectOption>
    </fvSelect>
  </fvFormElement>
  <div css-col="12" css-margin="sm">
    <fvButton type="submit"> Done </fvButton>
  </div>

</fvForm>
</example>

<script>
import { hasSlot } from '../utility/utils';

export default {
  inject: ['$theme'],
  props: {
    singleLine: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isHighlighted: false, // will set from child component
      isValidate: true, // will set from child component
      errors: [], // will set from child component
    };
  },
  computed: {
    hasErrorsSlot() {
      return hasSlot(this, 'errors');
    },
  },
  provide() {
    return {
      $formElement: this,
    };
  },
  style({ className }) {
    return [
      className('formElement', {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '& > .label': {
          display: 'block',
          minWidth: '25%',
          fontWeight: 'bold',
          '&:not(.highlighted)': {
            opacity: 0.7,
          },
          '&.unvalid': {
            color: this.$theme.colors.danger.normal,
          },
        },
        '&:not(.single-line)': {
          flexDirection: 'column',

          '& > .label': {
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
            flexGrow: 1,
          },
          '& > *': {
            '&:last-child': {
              [`margin-${this.$theme.direction.start}`]: this.$theme.sizes.base.normal,
            },
          },
          '&:not(.inline) > .container > *': {
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
