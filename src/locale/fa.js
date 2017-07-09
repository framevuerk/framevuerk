export default {
    ok() {
        return 'ثبت';
    },
    cancel() {
        return 'انصراف';
    },
    add(item = '') {
        return `اضافه کردن${item ? ` '${item}'` : ''}`;
    },
    selectNone() {
        return 'حذف انتخاب';
    },
    notFound() {
        return 'چیزی پیدا نشد...';
    },
    search() {
        return 'جست‌وجو کنید...';
    },
    momentDisplayFormat() {
        return 'jD jMMMM jYYYY ساعت HH:mm';
    },
    momentFormatPrefix() {
        return 'j';
    },
    second() {
        return 'ثانیه';
    },
    minute() {
        return 'دقیقه';
    },
    hour() {
        return 'ساعت';
    },
    day() {
        return 'روز';
    },
    week() {
        return 'هفته';
    },
    month() {
        return 'ماه';
    },
    year() {
        return 'سال';
    },
    browse() {
        return 'انتخاب کنید...';
    },
    nFileSelected(n = 1) {
        return `${n} فایل انتخاب شد!`;
    },
    nextPage() {
        return 'صفحه بعد';
    },
    prevPage() {
        return 'صفحه قبل';
    },
    fromN(n = 1) {
        return `از ${n}`;
    }
};
