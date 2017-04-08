import utility from '../../utility'
import template from './template.pug'
export default ({
    template: template,
    props: {
        options: {
            type: Array
        }
    },
    data: function(){
        return {
            pShow: false,
            highlightedOption: null
        }
    },
    methods: {
        pFocus: function(){
            this.$refs.justFocusEl.focus();
           },
        open: function(domElem=null){
            this.pSetPosition(domElem);
            this.pShow = true;
            this.$emit('open');
            utility.doIt( ()=>{
                this.pFocus();
            });
        },
        close: function(){
            this.pShow = false;
            this.$emit('close');
        },
        toggle: function(domElem=null){
            this[this.pShow?'close':'open'](domElem);
        },
        pSetPosition: function(domElem = null){
            let margin = 15;
            let windowOffset = utility.windowOffset();
            let offset = {
                left: 'auto',
                top: 'auto',
                right: 'auto',
                bottom: 'auto'
            }
            if( domElem ){
                let targetOffset = {
                    left: domElem.x,
                    top: domElem.y,
                    right: windowOffset.width - (domElem.x),
                    bottom: windowOffset.height - (domElem.y)
                }
                if( targetOffset.left > windowOffset.width / 2 ){
                    offset.right = `${targetOffset.right + margin}px`;
                }
                else{
                    offset.left = `${targetOffset.left + margin}px`;
                }
                if( targetOffset.top > windowOffset.height / 2 ){
                    offset.bottom = `${targetOffset.bottom + margin}px`;
                }
                else{
                    offset.top = `${targetOffset.top + margin}px`;
                }
            }
            else{
                offset.bottom = `${margin}px`;
                offset.right = `${margin}px`;
            }
            let menu = this.$refs.pMenu;
            menu.style.top = offset.top;
            menu.style.right = offset.right;
            menu.style.bottom = offset.bottom;
            menu.style.left = offset.left;

        },
        clickOption: function(option){
            if( !option.disabled ){
                this.$emit('click', option.key);
                this.close();
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
                    else{
                        this.close();
                    }
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
                    disabled: value.disabled || false
                });
            });
            return ret;
        }
    }
})