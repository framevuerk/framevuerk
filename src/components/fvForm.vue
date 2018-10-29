<template lang="pug">
form.fv-form(@submit.prevent="submit")
  slot
</template>

<script>
export default {
  methods: {
    submit () {
      function fvValidate (child) {
        if (typeof child.disabled !== 'undefined' && child.disabled) {
          return true
        }
        if (typeof child.fvValidate !== 'undefined' && !child.fvValidate) {
          return false
        }
        return true
      }
      function focus (child) {
        if (typeof child.focus === 'function') {
          child.focus()
        } else if (typeof child.$el.focus === 'function') {
          child.$el.focus()
        }
      }
      function warn (child) {
        if (typeof child.warn === 'function') {
          child.warn()
        }
      }
      function getChilds (parent, force = false) {
        let ret = []
        if (
          (parent.$el.classList.contains('fv-form') || typeof parent.fvValidate !== 'undefined') &&
          !force) {
          return []
        }
        parent.$children.forEach(child => {
          ret.push(child)
          if (child.$children.length) {
            ret = ret.concat(getChilds(child, false))
          }
        })
        return ret
      }

      const childs = getChilds(this, true)

      const invalids = []

      childs.forEach(child => {
        if (!fvValidate(child)) {
          invalids.push(child)
          warn(child)
        }
      })
      if (invalids.length) {
        focus(invalids[0])
        this.$emit('reject', invalids)
      } else {
        this.$emit('submit')
      }
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';
@import '../styles/functions';

.fv-control-label {
  @include nowrap;

  color: $color-light;
  display: block;
  max-width: 100%;
  min-height: 1px;
}

.fv-form-control-group {
  @include shadow(bottom);

  border: border(md);
  border-radius: radius(md);
  clear: both;
  padding: padding(sm);

  & > legend {
    padding: inherit;
  }
}

.fv-form-control {
  font-family: inherit;
  max-width: 100%;
  width: 100%;
}

.fv-input-group {
  display: inline-block;

  & > * {
    margin: 0 #{padding(sm) / 2};
  }

  & > *:first-child {
    margin-#{$block-start}: 0;
  }

  & > *:last-child {
    margin-#{$block-end}: 0;
  }
}
</style>
