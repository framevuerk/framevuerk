import template from './template.pug'

export default ({
    template: template,
    props: {
        width: {
            type: Number,
            default: 250
        },
        position: {
            type: String,
            default: 'right'
        }
    },
    data: function(){
        return {
            pShow: false,
            pPosition: 'right',
            pWidth: 250
        }
    },
    methods: {
        open: function(){
            this.pShow = true;
            this.$emit('open');
            
        },
        close: function(a){
            this.pShow = false;
            this.$emit('close');
        },
        toggle: function(){
            this[this.pShow?'close':'open']();
        },
        pSetPosition: function(){
            if( ['left','right'].indexOf( this.position) !== -1 ){
                this.pPosition = this.position;
            }
            else{
                this.pPosition = 'left';
            }
        },
        pSetWidth: function(){
            if( typeof this.width == 'number' && this.width > 0 ){
                this.pWidth = this.width;
            }
        }
    },
    mounted: function(){
        this.pSetPosition();
        this.pSetWidth();
    },
    watch: {
        position: function(){
            this.pSetPosition();
        },
        width: function(){
            this.pSetWidth();
        }
    }
})