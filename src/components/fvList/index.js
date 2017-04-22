import template from './template.pug'

export default ({
    template: template,
    props: {
        items: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        clickItem: function(item){
            if( !item.disabled ){
                this.$emit('click', item.key);
                item.action();
            }
        }
    },
    computed: {
        pItems: function(){
            let ret = [];
            this.items.forEach( (value)=>{
                ret.push({
                    key: value.key || value.text || value,
                    icon: value.icon || false,
                    text: value.text || value,
                    disabled: value.disabled || false,
                    selected: value.selected || false,
                    action: value.action || new Function()
                });
            });
            return ret;
        }
    }
})