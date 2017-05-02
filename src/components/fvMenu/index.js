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
            let targetOffset;
            if( this.domElem === null || this.sheet ){
                targetOffset = {
                    left: 'initial',
                    top: 'initial',
                    width: 'initial',
                    height: 'initial'
                }
            }
            else{
                const margin = 15;
                const windowOffset = utility.windowOffset();
                const elemOffset = {
                    left: domElem.pageX,
                    top: domElem.pageY
                }
                targetOffset = {
                    left: elemOffset.left + margin,
                    top: elemOffset.top + margin,
                    width: this.menuSize.width,
                    height: this.menuSize.height
                }
                if( targetOffset.left + targetOffset.width > windowOffset.width ){
                    targetOffset.left = windowOffset.width - targetOffset.width - margin;
                }
                if( targetOffset.top + targetOffset.height > windowOffset.height ){
                    targetOffset.top = windowOffset.height - targetOffset.height - margin;
                }
            }
            const menu = this.$refs.pMenu;
            menu.style.top = `${targetOffset.top}px`;
            menu.style.left = `${targetOffset.left}px`;
            menu.style.height = `${targetOffset.height}px`;
            menu.style.width = `${targetOffset.width}px`;

        },
        clickOption: function(option){
            if( !option.disabled ){
                this.$emit('click', option.key);
                option.action();
                //this.close();
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
        menuSize(){
            const width = 200;
            const itemHeight = 45;
            return {
                width,
                height: itemHeight * this.pOptions.length
            }
        },
        animationName(){
            return this.sheet? 'fv-sheet': 'fv-menu';
        }
    }
})