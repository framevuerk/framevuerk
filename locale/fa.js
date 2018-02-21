module.exports = {
  ok () {
    return 'ثبت'
  },
  cancel () {
    return 'انصراف'
  },
  add (item = '') {
    return `اضافه کردن${item ? ` '${item}'` : ''}`
  },
  selectNone () {
    return 'حذف انتخاب'
  },
  clear () {
    return 'پاک کردن'
  },
  notFound () {
    return 'چیزی پیدا نشد...'
  },
  search () {
    return 'جست‌وجو کنید...'
  },
  browse () {
    return 'انتخاب کنید...'
  },
  nFileSelected (n = 1) {
    return `${n} فایل انتخاب شد!`
  },
  nextPage () {
    return 'بعدی'
  },
  prevPage () {
    return 'قبلی'
  },
  fromN (n = 1) {
    return `از ${n}`
  }
}
