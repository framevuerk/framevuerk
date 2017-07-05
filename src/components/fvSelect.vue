<script>
    import utility from '../utility'
    import locale from '../locale'
    export default {
        data(){
            return {
                locale,
                pValue: null,
                pShow: false,
                searchQuery: '',
                highlightedOption: 0,
                dialogButtons: [
                    {
                        key: 'reset',
                        icon: 'fa fa-circle-o',
                        text: locale.selectNone(),
                        class: 'fv-default'
                    },
                    {
                        key: 'ok',
                        icon: 'fa fa-check',
                        text: locale.ok(),
                        class: 'fv-primary'
                    }
                ]
            }
        },
        props: {
            options: {
                type: Array,
                default: () => []
            },
            inputClass: {
                default: ''
            },
            dialogClass: {
                default: ''
            },
            value: {
                default: null
            },
            multiple: {
                type: Boolean,
                default: false
            },
            required: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            search: {
                type: Boolean,
                default: true
            },
            placeholder: {
                type: String,
                default : ''
            },
            allowInsert: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            open(){
                this.searchQuery = '';
                this.$refs.dialog.open();
            },
            close(){
                this.$refs.dialog.close();
            },
            highlightOption(option={index:null}){
                this.highlightedOption = option.index;
            },
            pFocus(el="input"){
                if( el == 'input' ){
                    this.$refs.inputEl.$el.focus();
                }
                else{
                    if( this.search || this.allowInsert ){
                        this.$refs.searchQueryEl.$el.focus();
                        
                    }
                    else{
                        this.$refs.dialog.pFocus();
                    }
                }
            },
            pSetValue(value, emit=true){
                this.pValue = value;
                if( emit ){
                    this.$emit('input', value);
                    this.$emit('change');
                }
            },
            pIsSelected(option={index:null,value:null}){
                if( this.multiple && typeof this.pValue === 'object' && this.pValue !== null){
                    return this.pValue.indexOf( option.value ) !== -1;
                }
                else{
                    return this.pValue === option.value;
                }
            },
            pKeyDown(event){
                switch(event.which){
                    case 38: //up
                        this.highlightedOption = this.highlightedOption == null? this.pOptions.length: this.highlightedOption;
                        this.highlightedOption = this.highlightedOption-1 < 0? this.pOptions.length-1: this.highlightedOption-1;
                        break;
                    case 40: // down
                        this.highlightedOption = this.highlightedOption == null? -1: this.highlightedOption;
                        this.highlightedOption = this.highlightedOption+1 >= this.pOptions.length? 0: this.highlightedOption+1;
                        break;
                    case 37: case 39: //left, right
                        break;
                    case 13: // enter
                        if( this.highlightedOption !== null ){
                            this.clickOption( this.pOptions[ this.highlightedOption ], true );
                        }
                        if( event.target.tagName == 'BUTTON' ){
                            event.preventDefault();
                            event.target.click();
                        }
                        break;
                }        
            },
            clickOption(option={index:null,value:null, key:'select'}, setHighlight = false){
                if( option.disabled || option.key == 'none' ){
                    return;
                }
                if(setHighlight){
                    this.highlightOption( option );
                }
                else{
                    this.highlightOption();
                }
                if( option.value === null ){
                    if( this.multiple ){
                        this.pSetValue( [] );
                    }
                    else{
                        this.pSetValue( null );
                    }
                }
                else if( this.allowInsert && option.key === 'insert' ){
                    let newValue = this.pValue;
                    if( this.multiple ){
                        newValue.push( option.value );
                    }
                    else{
                        newValue = option.value;
                    }
                    this.$emit('insert', option.value);
                    this.pSetValue( newValue );
                }
                else if( this.multiple ){
                    let newValue = this.pValue;
                    if( this.pIsSelected(option) ){
                        newValue.splice( newValue.indexOf(option.value) , 1);
                    }
                    else{
                        newValue.push( option.value );
                    }
                    this.pSetValue( newValue );
                }
                else{
                    this.pSetValue( option.value );
                }
                this.searchQuery = '';
            },
            clickButton(action){
                switch(action){
                    case 'reset':
                        this.clickOption();
                    default:
                        this.close();
                }
            },
            setStructure(){
                if( this.multiple ){
                    if( !this.value || this.value.constructor !== Array ){
                        this.pSetValue( [] );
                    }
                    else{
                        this.pSetValue( this.value, false );
                    }
                }
                else{
                    this.pSetValue( this.value, false );
                }
            }
        },
        created: function(){
            this.setStructure();
        },
        computed: {
            mOptions(){
                const mOptions = this.options;
                if( this.pValue !== null ){
                    if( this.multiple === true ){
                        this.pValue.forEach( (value,index)=>{
                            const founded = mOptions.find((v) => v.value == value);
                            if( !founded ){
                                mOptions.unshift({
                                    text: value,
                                    value: value
                                });
                            }
                        });
                    }
                }
                return mOptions;
            },
            pOptions(){
                let ret = [];

                this.mOptions.forEach( (option,index)=>{
                    let text = typeof option == 'object' && option !== null? option.text: option;
                    let value = typeof option == 'object' && option !== null? option.value: option;
                    let disabled = typeof option == 'object' && option !== null? option.disabled || false: false;
                    let selected = this.pIsSelected({value});
                    if(
                        utility.contains(text, this.searchQuery) ||
                        utility.contains(value, this.searchQuery)
                    ){
                        ret.push({
                            text: text,
                            value: value,
                            highlighted: this.highlightedOption === index,
                            disabled: disabled,
                            selected: selected,
                            key: 'select',
                            index: index,
                        });
                    }
                });
                let index = ret.length;
                if( this.allowInsert === true && this.searchQuery.length > 0){
                    ret.push({
                        text: locale.add(this.searchQuery),
                        value: this.searchQuery,
                        highlighted: this.highlightedOption === index,
                        key: 'insert',
                        index: index++,
                    });
                }
                if( ret.length === 0 ){
                    ret.push({
                        text: locale.notFound(),
                        value: null,
                        highlighted: this.highlightedOption === index,
                        key: 'none',
                        index: index++,
                    });
                }
                return ret;
            },
            displayValue(){
                const ret = [];
                const value = this.pValue;
                const mOptions = this.mOptions;
                function getText(value){
                    const founded = mOptions.find((v) => v.value == value);
                    if( founded ){
                        return founded.text;
                    }
                    else{
                        return value;
                    }
                }

                if( value === null ){
                    return [];
                }
                else{
                    if( this.multiple ){
                        this.pValue.forEach( (value,index)=>{
                            ret.push( getText(value) );
                        });
                    }
                    else{
                        ret.push( getText(this.pValue) );
                    }
                }
                return ret;
            }
        },
        watch: {
            searchQuery(){
                this.highlightedOption = this.pOptions.length > 0? 0: null;
            },
            value(){
                this.setStructure();
            }
        }
    }
</script>

<template lang="pug">
    span
        fv-input(:class="inputClass",
            :display-value="displayValue",
            :placeholder="placeholder",
            :required="required",
            :disabled="disabled",
            :value="value",
            @keydown.enter="open()",
            @click="open()",
            ref="inputEl"
        )
        fv-dialog.fv-select(ref="dialog",
            :class="dialogClass",
            :buttons="dialogButtons",
            @click-button="clickButton($event)",
            @click="pFocus('search')",
            @keydown="pKeyDown($event)",
            @close="$emit('close'); pFocus('input');",
            @open="$emit('open')"
        )
            fv-main(ref="select")
                fv-header(v-if="search || allowInsert")
                    fv-input(class="fv-form-control fv-grow",
                        :placeholder="locale.enterSearch()",
                        v-model="searchQuery",
                        ref="searchQueryEl"
                    )
                fv-list.no-outline-border(:items="pOptions", @click-item="clickOption($event, true)", @click="pFocus('search')")
</template>

<style lang="scss">
    @import "../styles/variables";
    @import "../styles/functions";
    @import "../styles/mixins";
    .fv-select > .fv-main{
        @include respond-to(only-xs){
            height: 100%;
            max-height: 100%;
            width: 100%;
            max-width: 100%;
        }
        & > .fv-content{
            padding: 0;
        }
        & .fv-option {
            position: relative;
            display: block;
            overflow: hidden;
            padding: $padding-small $padding;
            cursor: pointer;
            &:last-child{
                border-bottom: none;
            }
            &:active,
            &.fv-focused{
                background: $shadow-color-light;
            }
            &.fv-disabled{
                color: $shadow-color;
                cursor: not-allowed;
            }
            &.fv-selected{
                @include yiq($theme-color);
                &:active,
                &.fv-focused{
                    background: $theme-color-dark;
                }
            }
        }
    }
</style>