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
      tabs: [
        {
          title: 'Props',
          slot: 'prop'
        },
        {
          title: 'Events',
          slot: 'event'
        },
        {
          title: 'Methods',
          slot: 'method'}
      ],
      value: this.rows.prop ? 'prop' : (this.rows.event ? 'event' : 'method')
    }
  },
  computed: {
    show () {
      if (this.rows.prop || this.rows.event || this.rows.method) {
        return true
      }
      return false
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
