<template lang="pug">
fv-dialog.fv-menu(ref="dialog",
  :left.sync="dialogPosition.left",
  :top.sync="dialogPosition.top",
  :title="title",
  @close="$emit('close')",
  @open="$emit('open')")
  fv-content.fv-no-padding
    fv-list.fv-no-border(ref="list",
      parent)
      fv-list-item(v-for="item in items",
        :key="itemProp(item, 'value')",
        @click="onItemClick(item)",
        :disabled="itemProp(item, 'disabled')")
        slot(v-if="$scopedSlots.default", :item="item", :user-argument="userArgument")
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
    title: {
      type: String,
      default: ''
    },
    autoClose: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      userArgument: null,
      dialogPosition: {}
    }
  },
  methods: {
    open (clickEvent = null, userArgument = null) {
      this.userArgument = userArgument
      const main = utility.fvParent(this, 'fv-main')
      const content = utility.fvChild(main, 'fv-content')
      const offset = utility.offsetTo(event.target, main.$el)
      offset.top -= content ? content.$el.scrollTop : 0
      this.dialogPosition = {
        left: `${offset.left}px`,
        top: `${offset.top}px`
      }
      this.$refs.dialog.open()
    },
    close () {
      this.$refs.dialog.close()
    },
    toggle () {
      this.$refs.dialog.toggle()
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
      this.$emit('item-click', item, this.userArgument)
      if (this.autoClose) {
        this.close()
      }
    }
  }
}
</script>
