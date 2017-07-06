export default {
    ok(){
        return 'ثبت';
    },
    cancel(){
        return 'انصراف';
    },
    add(item=''){
        return `اضافه کردن${item? ` '${item}'`:''}`;
    },
    selectNone(){
        return 'حذف انتخاب';
    },
    notFound(){
        return 'چیزی پیدا نشد...';
    },
    search(){
        return 'جست‌وجو کنید...';
    }
}