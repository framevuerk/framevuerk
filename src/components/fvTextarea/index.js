import template from './template.pug'

export default ({
    template: template,
    props: {
        value: {
            default: null
        },
        required: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default : ''
        }
    },
    methods: {
        pFocus: function(){
            this.$refs.inputEl.focus();
        }
    },
})