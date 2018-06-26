<template lang="pug">
span(v-show="show")
  h3 {{title}}
  fv-slider(v-model="value")
    template(slot-scope="scope", slot="button")
      | {{ tabs.filter(function(tab){ return tab.slot===scope.value; })[0].title }}
    div(v-for="tab in tabs", :slot="tab.slot")
      br
      fv-table.doc-api-table(v-if="rows[tab.slot] && rows[tab.slot].length > 0",
        :fields="fields(tab.slot)",
        :rows="rows[tab.slot]")
        template(slot="field-Name", slot-scope="scope")
          .fmin.fv-text-primary {{scope.row.name}}
        template(slot="field-Type", slot-scope="scope")
          .fmin {{scope.row.type === '' ? 'Any': scope.row.type}}
        template(slot="field-Default", slot-scope="scope")
          .fmin.fv-control-label {{scope.row.default === '' ? 'undefined': scope.row.default}}
        template(slot="field-Params", slot-scope="scope")
          .fmin {{scope.row.params === '' ? '---': scope.row.params}}
        template(slot="field-Description", slot-scope="scope")
          p.fv-text-justify.fv-inline-block {{scope.row.description}}
      p.fv-text-center(v-else) No {{tab.title}} are available!
  br
</template>

<script>
export default {
  props: {
    rows: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: 'API'
    }
  },
  data () {
    return {
      value: this.rows.prop ? 'prop' : (this.rows.event ? 'event' : (this.rows.method ? 'method' : (this.rows.slot ? 'slot' : 'scopedSlot')))
    }
  },
  computed: {
    tabs () {
      const tabs = []
      if (this.rows.prop) {
        tabs.push({
          title: 'Props',
          slot: 'prop'
        })
      }
      if (this.rows.event) {
        tabs.push({
          title: 'Events',
          slot: 'event'
        })
      }
      if (this.rows.method) {
        tabs.push({
          title: 'Methods',
          slot: 'method'
        })
      }
      if (this.rows.slot) {
        tabs.push({
          title: 'Slots',
          slot: 'slot'
        })
      }
      if (this.rows.scopedSlot) {
        tabs.push({
          title: 'Scoped Slots',
          slot: 'scopedSlot'
        })
      }
      return tabs
    },
    show () {
      return this.rows.prop || this.rows.event || this.rows.method || this.rows.slot || this.rows.scopedSlot
    }
  },
  methods: {
    fields (type) {
      switch (type) {
        case 'prop':
          return ['Name', 'Type', 'Default', 'Description']
        case 'event':
          return ['Name', 'Params', 'Description']
        case 'method':
          return ['Name', 'Params', 'Description']
        case 'slot':
          return ['Name', 'Description']
        case 'scopedSlot':
          return ['Name', 'Params', 'Description']
      }
    }
  }
}
</script>

<style lang="scss">
body .doc-api-table {
  & .fmin {
    min-width: 80px;
  }
}
</style>
