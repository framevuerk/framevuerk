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
        },
        main: {
            default: null
        },
        pin: {
            default: true // or true
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
            this.pMainPadding();
            this.$emit('open');           
        },
        close: function(a){
            this.pShow = false;
            this.pMainPadding();
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
        },
        pMainPadding: function(){
            let el = this.$refs.sidebar;
            do{
                if( el.classList.contains('fv-main') ){
                    console.log(el);
                    break;
                }
                else{
                    el = el.parentElement;
                }
            } while (el !== null)
            if( el === null ){
                return false;
            }
            const paddingDir = 'padding' + (this.position === 'right'? 'Right': 'Left');
            if( this.pin && this.pShow ){
                el.style[paddingDir] = this.pWidth + 'px';
            }
            else{
                el.style[paddingDir] = '';
            }
            return true;
            
        }
    },
    mounted: function(){
        this.pSetPosition();
        this.pSetWidth();
        this.pMainPadding();
    },
    watch: {
        position: function(){
            this.pSetPosition();
        },
        pin: function(){
            this.pMainPadding();
        },
        width: function(){
            this.pSetWidth();
            this.pMainPadding();
        }
    }
})