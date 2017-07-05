export default {
    ok(){
        return 'ثبت';
    },
    cancel(){
        return 'انصراف';
    },
    add(item=''){
        return `اضافه کردن${item? ` ${item}`:''}`;
    },
    selectNone(){
        return 'حذف انتخاب';
    },
    notFound(){
        return 'چیزی پیدا نشد...';
    },
    enterSearch(){
        return 'متن خود را وارد کنید...';
    }
}