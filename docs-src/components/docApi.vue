<template lang="pug">
span(v-show="show")
  h3 {{title}}
  fv-slider(v-model="value")
    template(slot-scope="scope", slot="button")
      | {{ tabs.filter(function(tab){ return tab.slot===scope.value; })[0].title }}
    div(v-for="tab in tabs", :slot="tab.slot")
      br
      fv-table.doc-api-table(v-if="rows[tab.slot] && rows[tab.slot].length > 0",
        local,
        :fields="fields(tab.slot)",
        :footer="false",
        :rows="rows[tab.slot]",
        :clickable-rows="false")
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
          return ['name', 'type', {value: 'default', class: 'fv-hide-on-only-xs'}, {value: 'description', class: 'fv-hide-on-only-xs'}]
        case 'event':
          return ['name', 'params', {value: 'description', class: 'fv-hide-on-only-xs'}]
        case 'method':
          return ['name', 'params', {value: 'description', class: 'fv-hide-on-only-xs'}]
        case 'slot':
          return ['name', {value: 'description', class: 'fv-hide-on-only-xs'}]
        case 'scopedSlot':
          return ['name', 'params', {value: 'description', class: 'fv-hide-on-only-xs'}]
      }
    }
  }
}
</script>

<style lang="scss">
body .doc-api-table {
  & table {
    font-size: 0.85em;
  }
}
</style>
