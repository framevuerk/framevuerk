<script>
    import utility from '../utility';
    import locale from 'locale';
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
        data(){
            return {
                locale,
                page: 1,
                totalCount: this.local? this.rows.length: 0,
                apiResponse: null,
                loading: false,
                setUserPageTimeout: null
            }
        },
        computed: {
            nextPageBtnContent(){
                if(CONFIG.DIRECTION == 'rtl'){
                    return `${locale.nextPage()} <i class="fa fa-arrow-left"></i>`;
                }
                else{
                    return `${locale.nextPage()} <i class="fa fa-arrow-right"></i>`;
                }
            },
            prevPageBtnContent(){
                if(CONFIG.DIRECTION == 'rtl'){
                    return `<i class="fa fa-arrow-right"></i> ${locale.prevPage()}`;
                }
                else{
                    return `<i class="fa fa-arrow-left"></i> ${locale.prevPage()}`;
                }
            },
            pFields(){
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
            pRows(){
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
            pApi(){
                return this.api.replace('{page}', this.page).replace('{limit}', this.limit);
            },
            totalPages(){
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
                        throw new Error('Where is totalCount in apiResponse?');
                    }
                    const totalPages = Math.ceil( totalCount / this.limit );
                    return totalPages;
                }
                else{
                    return 1;
                }
            },
            nextPage(){
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
                            throw new Error('Where is apiNextPageKey?');
                        }
                        page = this.pFindValueByKey( this.apiNextPageKey, this.apiResponse );
                        if( typeof page == 'undefined' ){
                            throw new Error('Where is apiNextPageKey in apiResponse?');
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
                            throw new Error('Where is apiFinishedKey in apiResponse?');
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
            previousPage(){
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
                            throw new Error('Where is apiPreviousPageKey in apiResponse?');
                        }
                    }
                    return page;
                }
            }
        },
        created(){
            this.fetch(1);
        },
        methods: {
            fetch(page=1){
                const currentPage = this.page;
                this.loading = true;
                if( this.local ){
                    this.loading = false;
                    return false;
                }
                else if( !this.ajax ){
                    throw new Error('Are you set ajax prop?');
                }
                else{
                    this.page = page;
                    return this.ajax.get(this.pApi).then(response => {
                        this.apiResponse = response;
                        this.loading = false;
                        this.$emit('fetch', this.page);

                    }).catch(response => {
                        this.$emit('fetch-error', this.page, response);
                        this.page = currentPage;
                        this.loading = false;
                    });
                }
            },
            rowClick(row){
                if( this.clickableRows ){
                    this.$emit('click-row', row.pOriginalRow );
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
        }
    }
</script>

<template lang="pug">
    div.fv-table
        table(:class="{'tf-loading': loading}")
            thead
                tr
                    th(v-for="field in pFields",
                        :class="field.class",
                        v-html="field.text"
                    )
            tbody
                tr(v-for="(row, index) in pRows",
                    :class="{'fv-clickable': clickableRows}",
                    ref="rowElem",
                    @click="rowClick(row, index)"
                )
                    td(v-for="field in pFields",
                        :class="field.class",
                        v-html="row[field.value]"
                    )
            tfoot(v-if="footer")
                tr
                    td(:colspan="pFields.length")
                        div.page-control-continer(v-if="paginate && !local")
                            fv-button(@click="fetch(previousPage)",
                                :disabled="previousPage === false",
                                v-html="prevPageBtnContent"
                            ) 
                            fv-input.fv-form-control(type="number",
                                :value="page",
                                :min="1",
                                :max="totalPages",
                                @input="setUserPage($event)",
                                ref="userInputPage",
                                :disabled="totalPages == 1"
                            ) 
                            span(v-if="totalPages !== false") {{locale.fromN(totalPages)}} 
                            fv-button(@click="fetch(nextPage)",
                                :disabled="nextPage === false",
                                v-html="nextPageBtnContent"
                            )
</template>

<style lang="scss">
    @import "../styles/variables";
    @import "../styles/functions";
    @import "../styles/mixins";
    .fv-table {
        @include respond-to(only-xs) {
            overflow-x: auto;
            overflow-y: hidden;
            & > table {
                max-width: 100%;
            }
        }
        & > table{
            border: solid 1px $shadow-color;
            box-shadow: 0 1em 1em $shadow-color-light;
            width: 100%;
            border-spacing: 0;
            &.tf-loading{
                opacity: 0.4;
            }
            & > thead{
                position: sticky;
                font-weight: bold;
                top: 0;
            }
            & > tfoot{
                position: sticky;
                bottom: 0;
            }
            & > thead > tr > th,
            & > tbody > tr > td,
            & > tfoot > tr > td{
                padding: $padding-small $padding;
                text-align: center;
                //border-bottom: solid 1px $shadow-color;
                &:not(:last-child){
                    //border-#{$block-end}: solid 1px $shadow-color;
                }
            }
            & > tbody{
                @include yiq($bg-color-light);
                & > tr:nth-child(2n) td{
                    @include yiq( darken($bg-color-light, 2%) );
                }
            }
            & > tbody > tr.fv-clickable{
                cursor: pointer;
                &:active td,
                &.fv-focused td{
                    background: $shadow-color-light;
                }
            }
            & > thead > tr > th,
            & > tfoot > tr > td{
                @include yiq($default-color-light);
            }

            & > tfoot > tr > td{
                & > *{
                    line-height: 3em;
                }
            }
            & .page-control-continer{
                & > *{
                    margin: 0 2px;
                    width: auto;
                }
                & > .fv-input{
                    text-align: center;
                    width: 70px;
                }
            }

        }
    }
</style>