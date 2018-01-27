module.exports = {
  direction: 'rtl',
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
  momentDisplayFormat (part = false) {
    if (!part) {
      return 'jD jMMMM jYYYY ساعت HH:mm'
    }
    switch (part) {
      case 'year':
        return 'jYYYY'
      case 'month':
        return 'jM'
      case 'day':
        return 'jD'
      case 'hour':
        return 'H'
      case 'minute':
        return 'm'
      case 'second':
        return 's'
      default:
        return ''
    }
  },
  second () {
    return 'ثانیه'
  },
  minute () {
    return 'دقیقه'
  },
  hour () {
    return 'ساعت'
  },
  day () {
    return 'روز'
  },
  week () {
    return 'هفته'
  },
  month () {
    return 'ماه'
  },
  year () {
    return 'سال'
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
