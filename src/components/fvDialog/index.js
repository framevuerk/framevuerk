import utility from '../../utility'
import template from './template.pug'
export default ({
    template: template,
    data: ()=>{
        return {
            pShow: false
        }
    },
    props: {
        title: {
            default: '',
            required: false
        },
        closeOnEscape: {
            type: Boolean,
            default: true
        },
        buttons: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        toggle: function(){
            this[this.pShow?'close':'open']();
        },
        open: function(){
            this.pShow = true;
            this.$emit('open');
            utility.doIt( ()=>{
                this.pFocus();
            });
        },
        closeIf: function(){
            if( this.closeOnEscape === true ){
                this.close();
            }
        },
        close: function(){
            this.pShow = false;
            this.$emit('close');
        },
        focusIf: function(event){
            utility.doIt( ()=>{
                var focusedElem = document.querySelector(':focus');
                if( focusedElem !== null && !utility.isDescendant(this.$refs.dialog.$el, focusedElem) ){
                    this.pFocus();
                }
            });
        },
        pFocus: function(){
            this.$refs.buttonEl[0].$el.focus();
        },
        pKeyDown: function(event){
            switch(event.which){
                case 13: // enter
                    event.preventDefault();
                case 27: //esc
                    this.closeIf();
            } 
        },
        clickButton: function(button){
            this.$emit('click', button.key);
            button.action();
            this.close();
        }
    },
    computed: {
        pButtons: function(){
            let ret = [];
            this.buttons.forEach( (value)=>{
                ret.push({
                    key: value.key || value.text || value,
                    icon: value.icon || false,
                    text: value.text || value,
                    action: value.action || new Function(),
                    class: value.class || 'fv-default'
                });
            });
            return ret;
        }
    },
})