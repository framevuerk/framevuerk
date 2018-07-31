<template lang="pug">
.fv-main(:style="{paddingLeft: offset.left, paddingRight: offset.right}")
  slot
</template>

<script>
export default {
  props: {
    parent: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      locks: 0,
      offset: {
        left: 0,
        right: 0
      }
    }
  },
  methods: {
    $appendChild (child) {
      this.$el.appendChild(child)
    },
    $lock (fn = () => {}, manualClose = false) {
      const hash = `${window.location.hash.indexOf('?') !== -1 ? '&' : '?'}fv${new Date().valueOf()}`
      let hashChange = true // some hash changes applied by this component and does not need to be handeled. this variable keep state of this.
      const unlock = () => {
        window.removeEventListener('hashchange', onHashChange)
        removeHash()
        if (overlay) {
          overlay.remove()
        }
        if (typeof fn === 'function') {
          fn()
        }
      }
      const addHash = () => {
        if (window.location.hash.indexOf(hash) === -1) {
          window.location.hash += hash
        }
      }
      const removeHash = () => {
        window.location.hash = window.location.hash.replace(hash, '')
      }
      const onHashChange = (event) => {
        if (hashChange) {
          addHash()
        } else if (!manualClose) {
          unlock()
        }
        hashChange = !hashChange
      }

      const overlay = document.createElement('div')
      overlay.classList.add('fv-overlay')
      if (!manualClose) {
        overlay.addEventListener('click', unlock, {
          once: true
        })
      }

      addHash()
      this.$appendChild(overlay)

      this.$nextTick(() => {
        setTimeout(() => {
          window.addEventListener('hashchange', onHashChange)
        })
      })
      return unlock
    },
    $unlock (lockId) {
      if (typeof lockId === 'function') {
        lockId()
        lockId = null
      }
    },
    setOffset (position = 'left', size = '0px') {
      this.offset[position] = size
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-main {
  @include yiq($bg-color);

  direction: $direction;
  display: flex;
  flex-direction: column;
  height: inherit;
  position: relative;
  // width: inherit;
}
</style>
