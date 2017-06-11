import utility from '../../utility'
import template from './template.pug'
export default ({
    template: template,
    data: ()=>{
        return {
            pShow: false,
            pProp: null
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
        open(prop = null){
            this.pShow = true;
            this.pProp = prop;
            this.$emit('open', this.pProp);
            utility.doIt( ()=>{
                this.pFocus(false);
            });
        },
        close(){
            this.pShow = false;
            this.pProp = null;
            this.$emit('close', this.pProp);
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
            this.$emit('click-button', button.key, this.pProp);
            button.action(this.pProp);
            this.closeIf();
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
                    class: value.class || 'fv-default',
                    disabled: value.disabled || false
                });
            });
            return ret;
        },
        focusableItems(){
            return this.$refs.dialog.$el.querySelectorAll('select, input, textarea, button, a');
        }
    },
})