export default {
    ok(){
        return 'OK';
    },
    cancel(){
        return 'Cancel';
    },
    add(item=''){
        return `Add${item? ` '${item}'`:''}`;
    },
    selectNone(){
        return 'Select none';
    },
    notFound(){
        return 'Not found anything!';
    },
    search(){
        return 'Search...';
    }
}