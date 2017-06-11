import template from './template.pug'

export default ({
    template: template,
    props: {
        value: {
            default: false
        },
        onValue: {
            default: true
        },
        offValue: {
            default: false
        },
        required: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data: function(){
        return {
            focus: false
        }
    },
    methods: {
        pSetValue: function(value){
            this.$emit('input', value);
            this.$emit('change');
        },
        pToggle: function(){
            this.pSetValue( this.value === this.onValue? this.offValue: this.onValue);
        },
        pFocus(){
            if( !this.disabled ){
                this.$refs.switch.focus();
            }
        },
        pClick(){
            if( !this.disabled ){
                this.pToggle();
                this.focus = true;
            }
        },
        setStructure: function(){
            if( [this.offValue, this.onValue].indexOf( this.value ) === -1 ){
                this.pSetValue(this.offValue);
            }
        },
        pKeyDown: function(event){
            switch(event.which){
                case 13: case 32: // enter, space
                    event.preventDefault();
                    this.pToggle();
                    break;
            }        
        },
    },
    computed: {
        invalid: function(){
            return this.required === true && this.value !== this.onValue;
        }
    },
    watch: {
        value: function(){
            this.setStructure();
        }
    },
    created: function(){
        this.setStructure();
    }
})