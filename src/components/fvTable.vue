<template lang="pug">
fv-main.fv-table
  fv-header.fv-invert(v-if="header", height="3em")
    .field(v-if="checkList",
      :style="{width: '45px', maxWidth: '45px', minWidth: '45px'}")
      input(type="checkbox", v-model="checkAll", :value="true")
    .field(v-for="field in pFields",
      :style="{width: field.width, maxWidth: field.width}",
      :class="field.class")
      i(v-if="field.icon", :class="field.icon")
      =" "
      span(v-html="field.text")
    .field(v-if="menu",
      :style="{width: '60px', maxWidth: '60px', minWidth: '60px'}")
      fv-button.menu-btn(v-show="checked.length > 0", @click="$emit('menu', checked)")
        i.fa.fa-ellipsis-v
  fv-content
    .row(v-for="(row, index) in pRows",
      :class="{'fv-clickable': clickableRows}",
      ref="rowElem")
      .field(v-if="checkList",
        :style="{width: '45px', maxWidth: '45px', minWidth: '45px'}")
        input(type="checkbox", :value="row", v-model="checked")
      .field(v-for="field in pFields",
        :style="{width: field.width, maxWidth: field.width}",
        :class="field.class",
        @click="rowClick(row, index)",
        v-html="row[field.value]")
      .field(v-if="menu",
        :style="{width: '60px', maxWidth: '60px', minWidth: '60px'}")
        fv-button.menu-btn(v-show="checked.length === 0", @click="$emit('menu', [row])")
          i.fa.fa-ellipsis-v
  fv-footer(v-if="footer", height="57px")
    fv-button.fv-sm(@click.prevent="fetch(previousPage)",
      :disabled="previousPage === false || loading")
      span(v-html="prevPageBtnContent")
    fv-input.fv-form-control.fv-sm(type="number",
      :value="pPage",
      :min="1",
      :max="totalPages",
      @input="setUserPage($event)",
      ref="userInputPage",
      :disabled="totalPages == 1 || loading")
    .from-n(v-if="totalPages !== false") {{locale.fromN(totalPages)}}
    fv-button.fv-sm(@click.prevent="fetch(nextPage)",
      :disabled="nextPage === false || loading")
      span(v-html="nextPageBtnContent")
</template>

<script>
import utility from '../utility'
import locale from 'locale'
import fvMain from './fvMain.vue'
import fvHeader from './fvHeader.vue'
import fvContent from './fvContent.vue'
import fvFooter from './fvFooter.vue'
import fvButton from './fvButton.vue'
import fvInput from './fvInput.vue'

export default {
  components: {
    fvMain,
    fvHeader,
    fvContent,
    fvFooter,
    fvButton,
    fvInput
  },
  props: {
    fields: {
      type: Array,
      required: true
    },
    local: {
      type: Boolean,
      default: false
    },
    ajax: {
      default: null
    },
    rows: {
      type: Array,
      default: () => []
    },
    api: {
      type: String,
      default: '/items?page:{page}&limit={limit}'
    },
    header: {
      type: Boolean,
      default: true
    },
    footer: {
      type: Boolean,
      default: true
    },
    apiRowsKey: {
      type: [String, Object],
      default: null
    },
    apiTotalCountKey: {
      type: [String, Object],
      default: null
    },
    apiFinishedKey: {
      type: [String, Object],
      default: null // also you can use '!' at start of this string to reverse value in api response
    },
    apiNextPageKey: {
      type: [String, Object],
      default: null
    },
    apiPreviousPageKey: {
      type: [String, Object],
      default: null
    },
    clickableRows: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number,
      default: 15
    },
    page: {
      type: Number,
      default: 1
    },
    menu: {
      type: Boolean,
      default: false
    },
    checkList: {
      type: Boolean,
      default: false
    },
    initialState: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pPage: this.page,
      locale,
      totalCount: this.local ? this.rows.length : 0,
      apiResponse: null,
      loading: false,
      setUserPageTimeout: null,
      checked: [],
      checkAll: false
    }
  },
  computed: {
    nextPageBtnContent () {
      if (process.env.direction === 'rtl') {
        return `${locale.nextPage()} <i class="fa fa-arrow-left"></i>`
      } else {
        return `${locale.nextPage()} <i class="fa fa-arrow-right"></i>`
      }
    },
    prevPageBtnContent () {
      if (process.env.direction === 'rtl') {
        return `<i class="fa fa-arrow-right"></i> ${locale.prevPage()}`
      } else {
        return `<i class="fa fa-arrow-left"></i> ${locale.prevPage()}`
      }
    },
    pFields () {
      const ret = []
      this.fields.forEach((field) => {
        ret.push({
          value: field.value || field,
          text: field.text || (field.value ? utility.capitalizeFirstLetter(field.value) : null) || utility.capitalizeFirstLetter(field),
          icon: field.icon || '',
          class: field.class || '',
          width: field.width || `${100 / this.fields.length}%`,
          formatter: field.formatter || (x => x)
        })
      })
      return ret
    },
    pRows () {
      const ret = []
      let rows = []
      if (this.local) {
        rows = this.rows
      } else if (this.apiRowsKey != null && this.apiResponse && this.apiResponse) {
        rows = this.pFindValueByKey(this.apiRowsKey, this.apiResponse)
        if (typeof rows === 'undefined') {
          rows = []
        }
      } else {
        return []
      }
      rows.forEach((row) => {
        const pRow = {}
        this.pFields.forEach((field) => {
          if (typeof row[field.value] !== 'undefined') {
            pRow[field.value] = field.formatter(row[field.value], row)
          } else {
            pRow[field.value] = field.formatter(undefined, row)
          }
        })
        pRow['pOriginalRow'] = row

        ret.push(pRow)
      })
      return ret
    },
    pApi () {
      return this.api.replace('{page}', this.pPage).replace('{limit}', this.limit)
    },
    totalPages () {
      if (this.local || !this.footer) {
        return 1
      } else if (!this.apiResponse || this.apiResponse.status < 200 || this.apiResponse > 299 || this.apiFinishedKey !== null) {
        return false
      } else if (this.apiTotalCountKey !== null) { // { rows: [...], total: 50 }
        const totalCount = this.pFindValueByKey(this.apiTotalCountKey, this.apiResponse)
        if (typeof totalCount === 'undefined') {
          throw new Error('Where is totalCount in apiResponse?')
        }
        const totalPages = Math.ceil(totalCount / this.limit)
        return totalPages
      } else {
        return 1
      }
    },
    nextPage () {
      if (this.local || !this.apiResponse || !this.apiRowsKey) {
        return false
      } else { // { rows: [...], total: 50 }
        let page = this.pPage
        if (this.apiTotalCountKey !== null) {
          const totalPages = this.totalPages
          if (page < totalPages) {
            page++
          } else {
            return false
          }
        } else if (this.apiNextPageKey !== null) { // { rows: [...], next: 'x', prev: 'y' }
          if (this.apiNextPageKey) {
            throw new Error('Where is apiNextPageKey?')
          }
          page = this.pFindValueByKey(this.apiNextPageKey, this.apiResponse)
          if (typeof page === 'undefined') {
            throw new Error('Where is apiNextPageKey in apiResponse?')
          }
        }
        if (this.apiFinishedKey !== null) { // { rows: [...], is_lastpage: false }
          let key = this.apiFinishedKey
          let equal = true
          if (key.indexOf('!') !== -1) {
            equal = false
            key = key.split('!').join('')
          }
          const finished = this.pFindValueByKey(key, this.apiResponse)
          if (typeof finished === 'undefined') {
            throw new Error('Where is apiFinishedKey in apiResponse?')
          }
          if (
            (equal && !finished) ||
                        (!equal && finished)
          ) {
            page++
          } else {
            return false
          }
        }
        return page
      }
    },
    previousPage () {
      if (this.local || !this.apiResponse || !this.apiRowsKey) {
        return false
      } else { // { rows: [...], total: 50 } or { rows: [...], is_lastpage: false }
        let page = this.pPage
        if (this.apiTotalCountKey !== null || this.apiFinishedKey !== null) {
          if (page > 1) {
            page--
          } else {
            return false
          }
        } else if (this.apiPreviousPageKey !== null) { // { rows: [...], next: 'x', prev: 'y' }
          page = this.pFindValueByKey(this.apiPreviousPageKey, this.apiResponse)
          if (typeof page === 'undefined') {
            throw new Error('Where is apiPreviousPageKey in apiResponse?')
          }
        }
        return page
      }
    }
  },
  created () {
    if (this.initialState) {
      this.pPage = this.initialState.page || this.page || 1
      this.apiResponse = this.initialState.apiResponse || null
    }
    this.fetch(this.pPage)
  },
  methods: {
    getState () {
      return {
        page: this.pPage,
        apiResponse: this.apiResponse
      }
    },
    fetch (page = 1) {
      const currentPage = this.pPage
      this.loading = true
      this.checkAll = false
      if (this.local) {
        this.loading = false
        return false
      } else if (!this.ajax) {
        throw new Error('Are you set ajax prop?')
      } else {
        this.pPage = page
        return this.ajax.get(this.pApi).then(response => {
          this.apiResponse = response
          if (this.pRows.length === 0 && this.pPage !== 1) {
            this.pPage = 1
            this.fetch(1)
          } else {
            this.loading = false
            this.$emit('fetch', this.pPage)
          }
        }).catch(response => {
          this.$emit('fetch-error', this.pPage, response)
          this.pPage = currentPage
          this.loading = false
        })
      }
    },
    rowClick (row) {
      if (this.clickableRows) {
        this.$emit('click-row', row.pOriginalRow)
      }
    },
    setUserPage (page) {
      clearTimeout(this.setUserPageTimeout)
      this.setUserPageTimeout = setTimeout(() => {
        page = parseInt(page)
        if (page > this.totalPages || page < 1) {
          this.$refs.userInputPage.$el.value = this.page
        } else {
          this.fetch(page)
        }
      }, 1000)
    },
    pFindValueByKey (key = '', obj = {}) {
      if (key === null || obj === null) {
        return undefined
      }
      if (key === '') {
        return obj
      }
      let ret = Object.assign({}, obj)
      key.split('.').forEach((pr) => {
        if (!pr || typeof ret[pr] === 'undefined') {
          ret = undefined
          return false
        }
        ret = ret[pr]
      })
      return ret
    }
  },
  watch: {
    checkAll (v) {
      if (v) {
        this.checked = JSON.parse(JSON.stringify(this.pRows))
      } else {
        if (this.checked.length === this.pRows.length) {
          this.checked = []
        }
      }
    },
    checked (v) {
      if (v.length !== this.pRows.length) {
        this.checkAll = false
      }
    },
    page (page) {
      this.fetch(page)
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.fv-table {
  border: solid 1px $shadow-color;
  border-spacing: 0;
  box-shadow: 0 1em 1em $shadow-color-light;
  cursor: default;
  max-width: 100%;
  width: 100%;

  & .fv-header {
    & > .field {
      flex-grow: 1;
      padding: $padding-small;
      text-align: center;
    }
  }

  & .fv-content {
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0;

    & > .row {
      align-items: center;
      display: flex;
      justify-content: space-between;

      &.fv-clickable {
        cursor: pointer;

        &:active,
        &.active {
          background: $shadow-color-light;
        }
      }

      & > .field {
        flex-grow: 1;
        padding: $padding-small;
        text-align: center;
      }
    }

    & > .row:nth-child(even) {
      background: rgba(#000, 0.02);
    }
  }

  & .fv-footer {
    & .fv-button {
      flex-grow: 1;
    }

    & .fv-input {
      width: auto;
    }
  }

  & .menu-btn {
    background: transparent;
    border: 0;
    box-shadow: none;
    height: 1.6em;
    line-height: 1.6;
    max-height: 1.6em;
    max-width: 30px;
    min-height: 1.6em;
    min-width: 30px;
    padding: 0 $padding-small;
    width: 30px;
  }
}
</style>
