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
        buttons: {
            type: Array
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
        close: function(){
            this.pShow = false;
            this.$emit('close');
        },
        focusIf: function(event){
            utility.doIt( ()=>{
                var focusedElem = document.querySelector(':focus');
                if( focusedElem !== null && !utility.isDescendant(this.$refs.modal.$el, focusedElem) ){
                    this.pFocus();
                }
            } )
        },
        pFocus: function(){
            if( this.$refs.buttonEl && this.$refs.buttonEl.length > 0 ){
                this.$refs.buttonEl[0].focus();
            }
        },
        pKeyDown: function(event){
            switch(event.which){
                case 13: // enter
                    event.preventDefault();
            } 
        },
        clickButton: function(button){
            this.$emit('click', button.key);
        }
    },
    computed: {
        pButtons: function(){
            let ret = [];
            this.buttons.reverse().forEach( (value)=>{
                ret.push({
                    key: value.key || value.text || value,
                    icon: value.icon || false,
                    text: value.text || value,
                    class: value.class || 'fv-primary'
                });
            });
            return ret;
        }
    },
})