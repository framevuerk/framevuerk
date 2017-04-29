import template from './template.pug'
export default {
    template: template,
    props: {
        height: {
            type: Number,
            default: 55
        }
    },
    methods: {
        setHeight: function(height=55){
            this.$el.style.height = `${height}px`;
            this.$el.style.minHeight = `${height}px`;
            this.$el.style.maxHeight = `${height}px`;
        }
    },
    mounted: function(){
        this.setHeight(this.height);
        // this.$parent.addEventListener('scroll', this.pAutoShow);
    },
    destroyed: function(){
        // this.$parent.removeEventListener('scroll', this.pAutoShow);
    },
    watch: {
        height: function(){
            this.setHeight(this.height);
        }
    }
}