<template lang="pug">
fv-dialog.fv-menu(ref="dialog",
  :style="dialogStyle",
  :class="dialogClass",
  :title="title",
  :visible="visible",
  @update:visible="$emit('update:visible', $event)",
  @close="$emit('close')",
  @open="onOpen")
  fv-content.fv-no-padding
    fv-list.fv-no-border(ref="list",
      parent)
      fv-list-item(v-for="item in items",
        :key="itemProp(item, 'value')",
        @click="onItemClick(item)",
        :disabled="itemProp(item, 'disabled')")
        slot(v-if="$scopedSlots.default || $slots.default", :item="item", :user-argument="userArgument")
        span(v-else) {{itemProp(item, 'text')}}
</template>

<script>
import utility from '../utility'
import fvDialog from './fvDialog.vue'
import fvContent from './fvContent.vue'
import fvList from './fvList.vue'

export default {
  components: {
    fvDialog,
    fvContent,
    fvList
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    disabledKey: {
      type: String,
      default: 'disabled'
    },
    textKey: {
      type: String,
      default: 'text'
    },
    visible: {
      type: Boolean
    },
    sourceElement: {
      default: null
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      userArgument: null,
      dialogStyle: {},
      dialogClass: [],
      main: null
    }
  },
  methods: {
    getMain () {
      if (!this.main) {
        this.main = utility.fvParent(this, 'fv-main')
      }
      return this.main
    },
    onOpen () {
      this.$emit('open')
      const main = utility.fvParent(this, 'fv-main')
      const isSmall = utility.viewportSize(main.$el).indexOf('md') === -1
      if (isSmall) {
        this.dialogStyle = {
          width: `calc(100% - ${parseInt(process.env.padding) * 2}px)`,
          maxHeight: `calc(100% - ${parseInt(process.env.padding) * 8}px)`,
          bottom: process.env.padding,
          left: process.env.padding,
          right: process.env.padding
        }
        this.dialogClass = ['not-center']
      } else if (this.sourceElement) {
        const offset = utility.offsetTo(this.sourceElement, utility.fvParent(this, 'fv-main').$el)
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
      this.$emit('item-click', item)
      this.$emit('update:visible', false)
    }
  }
}
</script>
