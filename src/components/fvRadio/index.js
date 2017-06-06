import template from './template.pug'

export default ({
    template,
    props: {
        options: {
            type: Array,
            default: () => []
        },
        value: {
            default: null
        },
    },
    methods: {
        clickOption(option){
            if( !option.disabled && option.value !== this.value ){
                this.$emit('input', option.value);
                this.$emit('change');
            }
        },
        isChecked(option){
            return option.value === this.value;
        }
    },
    computed: {
        pOptions(){
            let ret = [];
            this.options.forEach( (option,index)=>{
                ret.push({
                    index: index,
                    text: option.text || option,
                    value: option.value || option.text || option,
                    disabled: option.disabled || false,
                });
            });
            return ret;
        }
    }
})