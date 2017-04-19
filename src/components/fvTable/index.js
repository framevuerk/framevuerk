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
                    text: field.text || utility.capitalizeFirstLetter(field),
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
                }, response => {
                    this.page = currentPage;
                    this.loading = false;
                });
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
        local: function(){
            this.fetch();
        }
    }
}