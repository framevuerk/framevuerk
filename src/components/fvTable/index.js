import template from './template.pug'
import style from './style.scss'
import utility from '../../utility'
import locale from 'locale'
/* global CONFIG */

export default {
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
    footer: {
      type: Boolean,
      default: true
    },
    paginate: {
      type: Boolean,
      default: true
    },
    apiRowsKey: {
      default: null
    },
    apiNextPageKey: {
      default: null
    },
    apiPreviousPageKey: {
      default: null
    },
    apiFinishedKey: {
      default: null // also you can use '!' at start of this string to reverse value in api response
    },
    apiTotalCountKey: {
      default: null
    },
    clickableRows: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number,
      default: 15
    }
  },
  data () {
    return {
      locale,
      page: 1,
      totalCount: this.local ? this.rows.length : 0,
      apiResponse: null,
      loading: false,
      setUserPageTimeout: null
    }
  },
  computed: {
    nextPageBtnContent () {
      if (CONFIG.DIRECTION === 'rtl') {
        return `${locale.nextPage()} <i class="fa fa-arrow-left"></i>`
      } else {
        return `${locale.nextPage()} <i class="fa fa-arrow-right"></i>`
      }
    },
    prevPageBtnContent () {
      if (CONFIG.DIRECTION === 'rtl') {
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
          class: field.class || '',
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
      return this.api.replace('{page}', this.page).replace('{limit}', this.limit)
    },
    totalPages () {
      if (this.local || !this.paginate) {
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
      if (!this.paginate || !this.apiResponse || !this.apiRowsKey) {
        return false
      } else { // { rows: [...], total: 50 }
        let page = this.page
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
      if (!this.paginate || !this.apiResponse || !this.apiRowsKey) {
        return false
      } else { // { rows: [...], total: 50 } or { rows: [...], is_lastpage: false }
        let page = this.page
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
    this.fetch(1)
  },
  methods: {
    fetch (page = 1) {
      const currentPage = this.page
      this.loading = true
      if (this.local) {
        this.loading = false
        return false
      } else if (!this.ajax) {
        throw new Error('Are you set ajax prop?')
      } else {
        this.page = page
        return this.ajax.get(this.pApi).then(response => {
          this.apiResponse = response
          this.loading = false
          this.$emit('fetch', this.page)
        }).catch(response => {
          this.$emit('fetch-error', this.page, response)
          this.page = currentPage
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
          this.userInputPage.$el.value = this.page
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
  style,
  render: template.render
}
