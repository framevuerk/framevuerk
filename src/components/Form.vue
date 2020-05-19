<template>
  <form @submit.prevent="submit">
    <slot />
  </form>
</template>

<doc>
@slot default

@event submit @description Triggers when form submitted.
@event reject @params listOfInvalids @description Triggers when form submitted but it's rejected because of element validation.
</doc>

<example>
@config title 'Default'
@config state false
@config example true

@data val = ''
@data val2 = []
@data alert = (x) => { console.log(x) }

<fvForm @submit="alert('submitted')" @reject="alert('rejected')" css-border="md" css-max-width="xs">
  <fvFormElement css-padding="md">
    <div slot="label"> Name </div>
    <fvInput v-model="val" required placeholder="Enter your name" />
  </fvFormElement>
  <fvFormElement css-padding="md" inline>
    <div slot="label"> Gender </div>
    <fvCheck content="ss" v-model="val2" multiple required> Super-Small </fvCheck>
    <fvCheck content="xs" v-model="val2" multiple required> X-Small </fvCheck>
    <fvCheck content="sm" v-model="val2" multiple required> Small </fvCheck>
    <fvCheck content="md" v-model="val2" multiple required> Medium </fvCheck>
    <fvCheck content="lg" v-model="val2" multiple required> Large </fvCheck>
    <fvCheck content="xl" v-model="val2" multiple required> X-Large </fvCheck>
    <fvCheck content="sl" v-model="val2" multiple required> Super-Large </fvCheck>
  </fvFormElement>
  <div css-margin-top="md" css-padding="md" css-border-top="md">
    <fvButton css-color="primary" type="submit"> Submit </fvButton>
  </div>
</fvForm>
</example>

<script>
export default {
  methods: {
    submit() {
      const invalids = (() => {
        const insideFunc = (el) => {
          let ret = [];
          el.$children.forEach((child) => {
            if (typeof child.isValidate !== 'undefined' && !child.isValidate) {
              ret.push(child);
              if (typeof child.reject === 'function') {
                child.reject();
              }
            } else if (child.$children.length) {
              ret = ret.concat(insideFunc(child));
            }
          });
          return ret;
        };
        return insideFunc(this);
      })();

      if (invalids.length) {
        invalids[0].focus();
        this.$emit('reject', invalids);
      } else {
        this.$emit('submit');
      }
    },
  },
};
</script>
