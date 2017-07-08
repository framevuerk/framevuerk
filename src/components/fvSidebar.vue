<script>
    export default {
        props: {
            width: {
                type: Number,
                default: 250
            },
            position: {
                type: String,
                default: CONFIG.DIRECTION=='ltr'? 'left': 'right'
            },
            main: {
                default: null
            },
            pin: {
                default: null // or false or true
            }
        },
        data(){
            return {
                pAnimation: null,
                pShow: false,
                pPosition: this.position,
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
            close: function(){
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
            widthChangeEvent: function(){
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
                    this.widthChangeEvent();
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
                const paddingDir = `padding${(this.position === 'right'? 'Right': 'Left')}`;
                if( this.pPin && this.pShow ){
                    el.style[paddingDir] = this.pWidth + 'px';
                }
                else{
                    el.style[paddingDir] = '';
                }
                return true;
            }
        },
        computed: {
            animationName(){
                if( this.pAnimation === true ){
                    return `fv-sidebar-${this.pPosition}`;
                }
                else{
                    return '';
                }
            }
        },
        created(){
            this.pAnimation = false;
        },
        mounted: function(){
            
            this.pSetPosition();
            this.pSetWidth();
            this.pSetPin();
            this.pMainPadding();
            setTimeout(()=>{
                this.pAnimation = true;
            }, 300);
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
    }
</script>

<template lang="pug">
    span
        transition(name="fv-fade")
            div(class="fv-overlay", v-show="pShow && !pPin", @click="close()")
        transition(:name="animationName")
            aside(class="fv-sidebar", v-show="pShow", :style="{width: pWidth+'px'}", :class="{'fv-left': pPosition=='left', 'fv-right': pPosition=='right'}", ref="sidebar")
                slot
</template>

<style lang="scss">
    @import "../styles/variables";
    @import "../styles/functions";
    @import "../styles/mixins";
    .fv-sidebar {
        z-index: 10000;
        position: absolute;
        top: 0;
        height: 100%;
        @include yiq($sidebar-bg-color);
        overflow-y: auto;
        overflow-x: hidden;
        &.fv-right{
            right: 0;
        }
        &.fv-left{
            left: 0;
        }
        & .fv-list .fv-item.fv-disabled{
            color: rgba(255, 255, 255, 0.2);
        }
    }

    .fv-sidebar-left-enter-active, .fv-sidebar-left-leave-active,
    .fv-sidebar-right-enter-active, .fv-sidebar-right-leave-active{
        transition: all $transition-speed ease;
        transform: translateX(0);
        opacity: 1;
    }

    .fv-sidebar-left-enter, .fv-sidebar-left-leave-active{
        transform: translateX(-100%);
        opacity: 1;
    }

    .fv-sidebar-right-enter, .fv-sidebar-right-leave-active{
        transform: translateX(100%);
        opacity: 1;
    }
</style>