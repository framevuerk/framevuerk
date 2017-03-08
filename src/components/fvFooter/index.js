import template from './template.pug'
export default {
    template: template,
    props: {
        height: {
            type: Number,
            default: 65
        }
    },
    methods: {
        setHeight: function(height){
            this.$el.style.height = `${height}px`;
            this.$el.style.minHeight = `${height}px`;
            this.$el.style.maxHeight = `${height}px`;
            
        }
    },
    mounted: function(){
        this.setHeight(this.height);
    },
    watch: {
        height: function(){
            this.setHeight(this.height);
        }
    }
}