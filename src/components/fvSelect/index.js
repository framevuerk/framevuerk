import utility from '../../utility'
import template from './template.pug'
export default ({
    template: template,
    data: ()=>{
        return {
            pShow: false,
            searchQuery: '',
            highlightedOption: 0
        }
    },
    props: {
        options: {
            type: Array,
            default: () => []
        },
        value: {
            required: true
        },
        multiple: {
            type: Boolean,
            default: false
        },
        required: {
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
        toggle: function(){
            this[this.pShow?'close':'open']();
        },
        open: function(){
            this.searchQuery = '';
            this.pShow = true;
            this.$emit('open');
            utility.doIt( ()=>{
                this.pFocus('select');
            });
        },
        close: function(){
            this.pShow = false;
            this.$emit('close');
        },
        closeIf: function(event){
            utility.doIt( ()=>{
                var focusedElem = document.querySelector(':focus');
                if( focusedElem !== null && !utility.isDescendant(this.$refs.select.$el, focusedElem) ){
                    this.close();
                }
            });
        },
        highlightOption: function(option={index:null}){
            this.highlightedOption = option.index;
        },
        pFocus: function(el="input"){
            if( el == 'input' ){
                this.$refs.inputEl.$el.focus();
            }
            else{
                if( this.search || this.allowInsert ){
                    this.$refs.searchQueryEl.$el.focus();
                }
                else{
                    this.$refs.justFocusEl.focus();
                }
            }
        },
        pSetValue: function(value){
            this.$emit('input', value);
            this.$emit('change');
        },
        pIsSelected: function(option={index:null,value:null}){
            if( this.multiple && typeof this.value === 'object' && this.value !== null){
                return this.value.indexOf( option.value ) !== -1;
            }
            else{
                return this.value === option.value;
            }
        },
        pKeyDown: function(event){
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
                    event.preventDefault();
                    if( this.highlightedOption !== null ){
                        this.clickOption( this.pOptions[ this.highlightedOption ], true );
                    }
                    else{
                        this.close();
                    }
                    break;
                case 27: //esc
                    this.close();
                /*
                default:
                    this.highlightedOption = null;
                    */
            }        
        },
        clickOption: function(option={index:null,value:null, action:'select'}, setHighlight = false){
            if( option.value === null ){
                if( this.multiple ){
                    this.pSetValue( [] );
                }
                else{
                    this.pSetValue( null );
                }
            }
            else if( this.allowInsert && option.action === 'insert' ){
                let newValue = this.value;
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
                let newValue = this.value;
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
            if(setHighlight){
                this.pFocus('select');
                this.highlightOption( option );
            }
            else{
                this.highlightOption();
            }
            this.searchQuery = '';
        },
        setStructure: function(){ // bug
            if( this.multiple ){
                this.pSetValue( [] );
                this.$emit('change');
            }
            else{
                this.pSetValue( null );
            }
        }
    },
    created: function(){
        this.setStructure();
    },
    mounted: function(){
    },
    computed: {
        mOptions: function(){
            const mOptions = this.options;
            if( this.value !== null ){
                if( this.multiple === true ){
                    this.value.forEach( (value,index)=>{
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
        pOptions: function(){
            let ret = [];

            this.mOptions.forEach( (option,index)=>{
                let text = typeof option == 'object' && option !== null? option.text: option;
                let value = typeof option == 'object' && option !== null? option.value: option;
                if(
                    utility.contains(text, this.searchQuery) ||
                    utility.contains(value, this.searchQuery)
                ){
                    ret.push({
                        index: index,
                        text: text,
                        value: value,
                        action: 'select'
                    });
                }
            });
            let index = ret.length;
            if( this.allowInsert === true && this.searchQuery.length > 0){
                ret.push({
                    index: index++,
                    text: `اضافه کردن "${this.searchQuery}"`,
                    value: this.searchQuery,
                    action: 'insert'
                });
            }
            return ret;
        },
        displayValue: function(){
            const ret = [];
            const value = this.value;
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
                    this.value.forEach( (value,index)=>{
                        ret.push( getText(value) );
                    });
                }
                else{
                    ret.push( getText(this.value) );
                }
            }
            return ret;
        }
    },
    watch: {
        highlightedOption: function(){
            if( this.highlightedOption !== null ){
                let focusedEl = this.$refs.optionElem[this.highlightedOption];
                if( focusedEl ){
                    if( !utility.isInViewport(focusedEl) ){
                        focusedEl.scrollIntoView();
                    }
                }
            }
        },
        searchQuery: function(){
            this.highlightedOption = this.pOptions.length > 0? 0: null;
        }
    }
})