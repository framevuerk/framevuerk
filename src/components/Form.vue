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
      function isValidate(child) {
        if (typeof child.disabled !== 'undefined' && child.disabled) {
          return true;
        }
        if (typeof child.isValidate !== 'undefined' && !child.isValidate) {
          return false;
        }
        return true;
      }
      function focus(child) {
        if (typeof child.focus === 'function') {
          child.focus();
        } else if (typeof child.$el.focus === 'function') {
          child.$el.focus();
        }
      }
      function reject(child) {
        if (typeof child.reject === 'function') {
          child.reject();
        }
      }
      function getChilds(parent, force = false) {
        let ret = [];
        if (
          (parent.$el.tagName !== 'FORM' || typeof parent.isValidate !== 'undefined')
          && !force) {
          return [];
        }
        parent.$children.forEach((child) => {
          ret.push(child);
          if (child.$children.length) {
            ret = ret.concat(getChilds(child, false));
          }
        });
        return ret;
      }

      const childs = getChilds(this, true);

      const invalids = [];

      childs.forEach((child) => {
        if (!isValidate(child)) {
          invalids.push(child);
          reject(child);
        }
      });
      if (invalids.length) {
        focus(invalids[0]);
        this.$emit('reject', invalids);
      } else {
        this.$emit('submit');
      }
    },
  },
};
</script>
