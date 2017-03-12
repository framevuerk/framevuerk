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
            pShow: false
        }
    },
    methods: {
        open: function(domElem=null){
            this.pSetPosition(domElem);
            this.pShow = true;
            this.$emit('open');
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
                    left: domElem.target.offsetLeft,
                    top: domElem.target.offsetTop,
                    right: windowOffset.width - (domElem.target.offsetLeft + domElem.target.offsetWidth),
                    bottom: windowOffset.height - (domElem.target.offsetTop + domElem.target.offsetHeight)
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
            }
        }
    },
    computed: {
        pOptions: function(){
            let ret = [];
            this.options.forEach( (value)=>{
                ret.push({
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