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
            default: null // or false or true
        }
    },
    data: function(){
        return {
            pShow: false,
            pPosition: 'right',
            pWidth: 250,
            pPin: false
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
        widthChangeEvent: function(event){
            const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
            if( width < 992 ){
                this.pPin = false;
                this.close();
            }
            else{
                this.pPin = true;
                this.open();
            }
        },
        bindEvents: function(set=true){
            if( set ){
                window.addEventListener('resize', this.widthChangeEvent );
                window.addEventListener('orientationChange', this.widthChangeEvent );
            }
            else{
                window.removeEventListener('resize', this.widthChangeEvent );
                window.removeEventListener('orientationChange', this.widthChangeEvent );
            }
        },
        pSetPin: function(){
            this.pPin = this.pin;
            if( this.pPin === true ){
                this.bindEvents(false);
                this.open();
            }
            else if( this.pPin === false ){
                this.bindEvents(false);
                this.close();
            }
            else{
                this.bindEvents(true);
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
            if( this.pPin && this.pShow ){
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
        this.pSetPin();
        this.pMainPadding();
    },
    watch: {
        position: function(){
            this.pSetPosition();
        },
        pin: function(){
            this.pSetPin();
            this.pMainPadding();
        },
        width: function(){
            this.pSetWidth();
            this.pMainPadding();
        }
    }
})