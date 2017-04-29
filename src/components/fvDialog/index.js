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
        autoClose: {
            type: Boolean,
            default: true
        },
        buttons: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        toggle(){
            this[this.pShow?'close':'open']();
        },
        open(){
            this.pShow = true;
            this.$emit('open');
            utility.doIt( ()=>{
                this.pFocus(false);
            });
        },
        close(){
            this.pShow = false;
            this.$emit('close');
        },
        closeIf(){
            if( this.autoClose === true ){
                this.close();
            }
        },
        pFocus(first=true){
            this.focusableItems[first? 0: this.focusableItems.length-1].focus();
        },
        pKeyDown(event){
            switch(event.which){
                case 9: // tab
                    // when first item is focused and user press shift + tab
                    if( event.target == this.focusableItems[0]  && event.shiftKey ){
                        event.preventDefault();
                        this.pFocus(false);
                    }
                    // when last item is focused and user press tab
                    else if( event.target == this.focusableItems[this.focusableItems.length-1]  && !event.shiftKey ){
                        event.preventDefault();
                        this.pFocus(true);
                    }
                    break;
                case 13: // enter
                    event.target.click();
                    event.preventDefault();
                    break;
                case 27: //esc
                    this.closeIf();
            } 
        },
        clickButton(button){
            this.$emit('click', button.key);
            if( button.action() !== false ){
                this.close();
            }
        }
    },
    computed: {
        pButtons(){
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
        },
        focusableItems(){
            return this.$refs.dialog.$el.querySelectorAll('select, input, textarea, button, a');
        }
    },
})