import utility from '../../utility'
import template from './template.pug'
export default {
    template: template,
    data: function(){
        return {
            page: 1,
            totalCount: this.local? this.rows.length: 0,
            apiResponse: null,
            loading: false,
            highlightedRow: null,
            setUserPageTimeout: null
        }
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
    computed: {
        pFields: function(){
            const ret = [];
            this.fields.forEach( (field)=>{
                ret.push({
                    value: field.value || field,
                    text: field.text || (field.value? utility.capitalizeFirstLetter(field.value): null) || utility.capitalizeFirstLetter(field),
                    class: field.class || '',
                    formatter: field.formatter || (x=>x)
                });
            });
            return ret;
        },
        pRows: function(){
            const ret = [];
            let rows = [];
            if( this.local ){
                rows = this.rows;
            }
            else if ( this.apiRowsKey != null && this.apiResponse && this.apiResponse ){
                rows = this.pFindValueByKey( this.apiRowsKey, this.apiResponse);
                if( typeof rows == 'undefined' ){
                    rows = [];
                }
            }
            else{
                return [];
            }
            rows.forEach( (row)=>{
                const pRow = {};
                this.pFields.forEach( (field)=>{
                    if( typeof row[field.value] !== 'undefined' ){
                        pRow[field.value] = field.formatter(row[field.value], row);
                    }
                    else{
                        pRow[field.value] = field.formatter(undefined, row);
                    }
                });
                pRow['pOriginalRow'] = row;

                ret.push(pRow);
            });
            return ret;
        },
        pApi: function(){
            return this.api.replace('{page}', this.page).replace('{limit}', this.limit);
        },
        totalPages: function(){
            if( this.local || !this.paginate ){
                return 1;
            }
            else if( !this.apiResponse || this.apiResponse.status < 200 || this.apiResponse > 299 || this.apiFinishedKey !== null ){
                return false;
            }
            // { rows: [...], total: 50 }
            else if( this.apiTotalCountKey !== null ){
                const totalCount = this.pFindValueByKey( this.apiTotalCountKey, this.apiResponse );
                if( typeof totalCount == 'undefined' ){
                    console.error('Where is totalCount in apiResponse?');
                    return false;
                }
                const totalPages = Math.ceil( totalCount / this.limit );
                return totalPages;
            }
            else{
                return 1;
            }
        },
        nextPage: function(){
            if( !this.paginate || !this.apiResponse || !this.apiRowsKey ){
                return false;
            }
            else{
                let page = this.page;
                // { rows: [...], total: 50 }
                if( this.apiTotalCountKey !== null ){
                    const totalPages = this.totalPages;
                    if( page < totalPages ){
                        page++;
                    }
                    else{
                        return false;
                    }
                }
                // { rows: [...], next: 'x', prev: 'y' }
                else if ( this.apiNextPageKey !== null ){
                    if( this.apiNextPageKey ){
                        console.error('Where is apiNextPageKey?');
                        return false;
                    }
                    page = this.pFindValueByKey( this.apiNextPageKey, this.apiResponse );
                    if( typeof page == 'undefined' ){
                        console.error('Where is apiNextPageKey in apiResponse?');
                        return false;
                    }       
                }
                // { rows: [...], is_lastpage: false }
                if( this.apiFinishedKey !== null ){
                    let key = this.apiFinishedKey;
                    let equal = true;
                    if( key.indexOf('!') !== -1 ){
                        equal = false;
                        key = key.split('!').join('');
                    }
                    const finished = this.pFindValueByKey( key, this.apiResponse );
                    if( typeof finished == 'undefined' ){
                        console.error('Where is apiFinishedKey in apiResponse?');
                        return false;
                    }
                    if( 
                        (equal && !finished) ||
                        (!equal && finished)
                    ){
                        page++;
                    }
                    else{
                        return false;
                    }
                }
                return page;
            }
        },
        previousPage: function(){
            if( !this.paginate || !this.apiResponse || !this.apiRowsKey ){
                return false;
            }
            else{
                let page = this.page;
                // { rows: [...], total: 50 }
                // { rows: [...], is_lastpage: false }
                if( this.apiTotalCountKey !== null || this.apiFinishedKey !== null ){
                    if( page > 1 ){
                        page--;
                    }
                    else{
                        return false;
                    }
                }
                // { rows: [...], next: 'x', prev: 'y' }
                else if ( this.apiPreviousPageKey !== null ){
                    page = this.pFindValueByKey( this.apiPreviousPageKey, this.apiResponse );
                    if( typeof page == 'undefined' ){
                        console.error('Where is apiPreviousPageKey in apiResponse?');
                        return false;
                    }
                }
                return page;
            }
        }
    },
    methods: {
        pKeyDown: function(event){
            switch(event.which){
                case 38: //up
                    this.highlightedRow = this.highlightedRow == null? this.pRows.length: this.highlightedRow;
                    this.highlightedRow = this.highlightedRow-1 < 0? this.pRows.length-1: this.highlightedRow-1;
                    break;
                case 40: // down
                    this.highlightedRow = this.highlightedRow == null? -1: this.highlightedRow;
                    this.highlightedRow = this.highlightedRow+1 >= this.pRows.length? 0: this.highlightedRow+1;
                    break;
                case 37: case 39: //left, right
                    break;
                case 13: // enter
                    event.preventDefault();
                    if( this.highlightedOption !== null ){
                        this.rowClick( this.pRows[ this.highlightedRow ] );
                    }
                    break;
                case 27: //esc
                    this.highlightedOption = null;
                /*
                default:
                    this.highlightedOption = null;
                    */
            }        
        },
        fetch: function(page=1){
            const currentPage = this.page;
            this.loading = true;
            if( this.local ){
                this.loading = false;
                return false;
            }
            else if( !this.ajax ){
                console.error('Are you set ajax prop?');
                return false;
            }
            else{
                this.page = page;
                return this.ajax.get(this.pApi).then(response => {
                    this.apiResponse = response;
                    this.loading = false;
                    this.$emit('fetch', this.page);
                    
                }).catch(response => {
                    this.$emit('fetch-error', this.page);
                    this.page = currentPage;
                    this.loading = false;
                });
            }
        },
        rowClick: function(row, index = false){
            if( this.clickableRows ){
                this.$emit('click-row', row.pOriginalRow );
                if( index !== false ) {
                    this.highlightedRow = index;
                }
            }
        },
        setUserPage(page){
            clearTimeout( this.setUserPageTimeout );
            this.setUserPageTimeout = setTimeout(()=>{
                page = parseInt(page);
                if( page > this.totalPages || page < 1 ){
                    this.userInputPage.$el.value = this.page;
                }
                else{
                    this.fetch( page );
                }
            }, 1000);
        },
        pFindValueByKey(key='', obj={}){
            if( key == null || obj == null ){
                return undefined;
            }
            if( key == '' ){
                return obj;
            }
            let ret = Object.assign({}, obj);
            key.split('.').forEach( (pr)=>{
                if( !pr || typeof ret[pr] == 'undefined' ){
                    ret = undefined;
                    return false;
                }
                ret = ret[pr];
            });
            return ret;
        }
    },
    created: function(){
        this.fetch(1);
    },
    watch: {
        highlightedRow: function(){
            if( this.highlightedRow !== null ){
                let focusedEl = this.$refs.rowElem[this.highlightedRow];
                if( focusedEl ){
                    if( !utility.isInViewport(focusedEl) ){
                        focusedEl.scrollIntoView();
                    }
                }
            }
        }
    }
}