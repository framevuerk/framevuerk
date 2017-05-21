import utility from '../../utility'
import template from './template.pug'
export default ({
    template: template,
    props: {
        options: {
            type: Array,
            default: () => []
        },
        sheet: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        }
    },
    data: function(){
        return {
            pShow: false,
            highlightedOption: null,
            pParam:  null
        }
    },
    methods: {
        pFocus: function(){
            this.$refs.justFocusEl.focus();
        },
        open: function(param=null){
            this.pParam = param;
            this.pShow = true;
            this.$emit('open');
            utility.doIt( ()=>{
                this.pFocus();
            });
        },
        close: function(){
            this.pShow = false;
            this.pParam = null;
            this.$emit('close');
        },
        toggle: function(domElem=null){
            this[this.pShow?'close':'open'](domElem);
        },
        clickOption: function(option){
            if( !option.disabled ){
                this.$emit('click', option.key, this.pParam);
                option.action(this.pParam);
                this.pFocus();
            }
        },
        highlightOption: function(option={index:null}){
            this.highlightedOption = option.index;
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
                    break;
                case 9: // tab
                    event.preventDefault();
                    this.pFocus();
                    break;
                case 27: //esc
                    this.close();
            }        
        },
    },
    computed: {
        pOptions: function(){
            let ret = [];
            this.options.forEach( (value, index)=>{
                ret.push({
                    index: index,
                    key: value.key || value.text || value,
                    icon: value.icon || false,
                    text: value.text || value,
                    disabled: value.disabled || false,
                    action: value.action || new Function()
                });
            });
            return ret;
        },
        animationName(){
            return this.sheet? 'fv-sheet': 'fv-menu';
        }
    }
})