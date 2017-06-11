import template from './template.pug'
export default ({
    template: template,
    props: {
        value: {
            default: null
        },
        displayValue: {
            default: null
        },
        type: {
            default: 'text'
        },
        required: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default : ''
        },
        icon: {
            default: 'fa fa-chevron-down'
        }
    },
    data: function(){
        return {
            invalid: false,
            focus: false
        }
    },
    methods: {
        checkInvalid: function(){
            if( this.required ){
                let length = this.value === null? 0: this.value.toString().length;
                this.invalid = length > 0? true: false;
            }
        },
        pFocus: function(){
            this.$refs.inputEl.focus();
        }
    },
    watch: {
        value: function(){
            this.checkInvalid();
        }
    }
})