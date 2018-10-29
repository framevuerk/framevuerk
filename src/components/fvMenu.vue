<template lang="pug">
fv-dialog.fv-menu(ref="dialog",
  :style="dialogStyle",
  :class="dialogClass",
  :value="value",
  @input="$emit('input', $event)",
  @close="$emit('close')",
  @open="onOpen")
  fv-content
    fv-list(ref="list",
      parent)
      fv-list-item(v-for="item in items",
        :key="itemProp(item, 'value')",
        @click="onItemClick(item)",
        :disabled="itemProp(item, 'disabled')")
        slot(v-if="$scopedSlots.default || $slots.default", :item="item")
        span(v-else) {{itemProp(item, 'text')}}
</template>

<script>
import utility from '../utility'

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    sourceElement: {
      type: HTMLElement
    },
    items: {
      type: Array,
      default: () => []
    },
    textKey: {
      type: String,
      default: 'text'
    },
    disabledKey: {
      type: String,
      default: 'disabled'
    }
  },
  inject: ['fvMain'],
  data () {
    return {
      dialogStyle: {},
      dialogClass: []
    }
  },
  methods: {
    onOpen () {
      this.$emit('open')
      const isSmall = this.fvMain.getSize().indexOf('md') === -1
      if (isSmall) {
        this.dialogStyle = {
          width: `calc(100% - 30px)`,
          maxHeight: `calc(100% - 60px)`,
          bottom: '15px',
          left: '15px',
          right: '15px'
        }
        this.dialogClass = ['not-center']
      } else if (this.sourceElement) {
        const offset = utility.offsetTo(this.sourceElement, this.fvMain.$el)
        this.dialogStyle = {
          left: `${offset.left}px`,
          top: `${offset.top}px`
        }
        this.dialogClass = ['not-center']
      } else {
        this.dialogStyle = {}
        this.dialogClass = []
      }
    },
    itemProp (item, prop = 'text') {
      switch (prop) {
        case 'text':
          return this.textKey ? item[this.textKey] : item
        case 'disabled':
          return this.disabledKey ? item[this.disabledKey] : false
      }
    },
    onItemClick (item) {
      this.$emit('click', item)
      this.$emit('input', false)
    }
  },
  created () {
    if (!this.fvMain) {
      throw utility.error('no_fvmain_parent')
    }
  }
}
</script>
