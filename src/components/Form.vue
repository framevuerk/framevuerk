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
@data alert = (x) => { alert(x) }

<fvForm @submit="alert('submitted')" @reject="alert('rejected')">
  <div>
    <fvInput v-model="val" required placeholder="Enter your name" />
  </div>
  <div css-padding-y="md" />
  <div>
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
            if (child.isValidate === false) {
              ret.push(child);
              if (typeof child.reject === 'function') {
                child.reject();
              }
            }
            if (child.$children.length) {
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
