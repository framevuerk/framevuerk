import utility from '../../utility'
import template from './template.pug'
export default {
    template: template,
    data: function(){
        return {
            page: 1,
            totalCount: this.local? this.rows.length: 0,
            apiRows: [],
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
        rows: {
            type: Array,
            default: () => []
        },
        api: {
            type: String,
            default: '/items?page:{page}&limit={limit}'
        },
        apiRowsKey: {
            type: String,
            default: 'items'
        },
        apiTotalCountKey: {
            type: String,
            default: 'total_count'
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
            this[this.local? 'rows': 'apiRows'].forEach( (row)=>{
                const pRow = {};
                this.pFields.forEach( (field)=>{
                    if( typeof row[field.value] !== 'undefined' ){
                        pRow[field.value] = field.formatter(row[field.value]);
                    }
                    else{
                        pRow[field.value] = '---';
                    }
                });
                pRow['pOriginalRow'] = row;

                ret.push(pRow);
            });
            return ret;
        },
        pApi: function(){
            console.log('pApi', this.api);
            return this.api.replace('{page}', this.page).replace('{limit}', this.limit);
        },
        totalPages: function(){
            if( this.local || this.apiRowsKey == ''){
                return 1;
            }
            else{
                return Math.ceil( this.totalCount / this.limit );
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
            else if( !this.$http ){
                console.error('Are you include vue-resource package to your project?');
                return false;
            }
            else{
                this.page = page;
                return this.$http.get(this.pApi).then(response => {
                    this.apiRows = this.apiRowsKey != ''? response.body[this.apiRowsKey]: response.body;
                    this.totalCount = this.apiRowsKey != ''? response.body[this.apiTotalCountKey]: response.body.length;
                    this.loading = false;
                    this.$emit('fetch', this.page);
                    
                }, response => {
                    this.page = currentPage;
                    this.loading = false;
                    this.$emit('fetch-error', this.page);
                });
            }
        },
        rowClick: function(row, index = null){
            if( this.clickableRows ){
                this.$emit('click-row', row.pOriginalRow );
                this.highlightedRow = index;
            }
        },
        setUserPage(page){
            clearTimeout( this.setUserPageTimeout );
            this.setUserPageTimeout = setTimeout(()=>{
                this.fetch( parseInt(page) );
            }, 1000);
        }
    },
    created: function(){
        this.fetch();
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