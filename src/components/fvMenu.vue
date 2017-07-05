<script>
    import utility from '../utility'
    export default {
        props: {
            options: {
                type: Array,
                default: () => []
            },
            sheet: {
                default: null /* or true or false */
            },
            title: {
                type: String,
                default: ''
            },
            autoClose: {
                type: Boolean,
                default: true
            }
        },
        data(){
            return {
                pShow: false,
                pSheet: false,
                highlightedOption: null,
                pParam:  null,
                focusBackElem: null
            }
        },
        methods: {
            pFocus(el){
                if( el == 'back' && this.focusBackElem ){
                    this.focusBackElem.focus();
                }
                else{
                    this.$refs.justFocusEl.focus();
                }
            },
            open(param=null){
                this.pParam = param;
                this.focusBackElem = document.querySelector(':focus');
                this.pShow = true;
                this.$emit('open');
                utility.doIt( ()=>{
                    this.pFocus();
                });
            },
            close(){
                utility.doIt( ()=>{
                    this.pFocus('back');
                });
                this.pShow = false;
                this.pParam = null;
                this.$emit('close');
            },
            toggle(domElem=null){
                this[this.pShow?'close':'open'](domElem);
            },
            clickOption(option){
                if( !option.disabled ){
                    this.$emit('click-item', option.key, this.pParam);
                    option.action(this.pParam);
                    if( this.autoClose ){
                        this.close();
                    }
                }
            },
            highlightOption(option={index:null}){
                this.highlightedOption = option.index;
            },
            pKeyDown(event){
                switch(event.which){
                    case 38: //up
                        this.highlightedOption = this.highlightedOption == null? this.pOptions.length: this.highlightedOption;
                        this.highlightedOption = this.highlightedOption-1 < 0? this.pOptions.length-1: this.highlightedOption-1;
                        break;
                    case 40: // down
                        this.highlightedOption = this.highlightedOption == null? -1: this.highlightedOption;
                        this.highlightedOption = this.highlightedOption+1 >= this.pOptions.length? 0: this.highlightedOption+1;
                        break;
                    case 37: case 39: //left, right
                        break;
                    case 13: // enter
                        event.preventDefault();
                        if( this.highlightedOption !== null ){
                            this.clickOption( this.pOptions[ this.highlightedOption ], true );
                        }
                        break;
                    case 9: // tab
                        event.preventDefault();
                        this.pFocus();
                        break;
                    case 27: //esc
                        this.close();
                }        
            },
            widthChangeEvent(){
                const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
                if( width < 768 ){
                    this.pSheet = true;
                }
                else{
                    this.pSheet = false;
                }
            },
            bindEvents(){
                if( this.sheet === null ){
                    this.widthChangeEvent();
                    window.addEventListener('resize', this.widthChangeEvent );
                    window.addEventListener('orientationChange', this.widthChangeEvent );
                }
                else{
                    window.removeEventListener('resize', this.widthChangeEvent );
                    window.removeEventListener('orientationChange', this.widthChangeEvent );
                    this.pSheet = this.sheet;
                }
            },
        },
        computed: {
            pOptions(){
                let ret = [];
                this.options.forEach( (value, index)=>{
                    ret.push({
                        index: index,
                        key: value.key || value.text || value,
                        icon: value.icon || false,
                        text: value.text || value,
                        highlighted: this.highlightedOption === index,
                        disabled: value.disabled || false,
                        action: value.action || new Function()
                    });
                });
                return ret;
            },
            className(){
                return this.pSheet? 'fv-sheet': 'fv-not-sheet';
            }
        },
        created(){
            this.bindEvents();
        },
        watch: {
            sheet(){
                this.bindEvents();
            }
        }
    }
</script>

<template lang="pug">
    span
        transition(name="fv-fade")
            div.fv-overlay(v-show="pShow",
                style="z-index: 10003",
                @click="close()"
            )
        transition(:name="className")
            div.fv-menu(:class="className",
                v-show="pShow",
                ref="pMenu",
                @keydown="pKeyDown($event)"
            )
                span(tabindex="0",
                    ref="justFocusEl"
                )
                div(v-if="title",
                    class="fv-menu-title",
                    @click="pFocus()"
                )
                    label.fv-control-label(v-html="title")
                fv-list.no-outline-border(:items="pOptions",
                    @click-item="clickOption($event)",
                    @click="pFocus()"
                )
</template>

<style lang="scss">
    @import "../styles/variables";
    @import "../styles/functions";
    @import "../styles/mixins";
    .fv-menu {
        z-index: 10003;
        position: fixed;
        @include yiq($bg-color);
        overflow-y: auto;
        overflow-x: hidden;
        box-shadow: 0 5px 15px $shadow-color;
        max-height: 90%;
        &.fv-not-sheet{
            width: auto;
            max-width: 60%;
            min-width: 320px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
        &.fv-sheet{
            left: 0;
            bottom: 0;
            width: 100%;
        }
        & .fv-menu-item,
        & .fv-menu-title {
            z-index: 10003;
            position: relative;
            display: block;
            overflow: hidden;
            padding: $padding-small $padding;
            padding-#{$block-end}: #{$padding-large * 2};
            & i{
                padding-#{$block-end}: $padding-small;
            }
            &:last-child{
                border-bottom: none;
            }
            &.fv-menu-item{
                border-bottom: solid 1px $shadow-color-light;
                cursor: pointer;
                &:active:not(.disabled):not([disabled]), &.focus{
                    background: $shadow-color-light;
                }
                &.disabled, &[disabled]{
                    color: $shadow-color;
                    cursor: not-allowed;
                }
            }
        }
    }
    .fv-not-sheet-enter-active, .fv-not-sheet-leave-active{
        transition: all $transition-speed ease;
        opacity: 1;
    }
    .fv-not-sheet-enter, .fv-not-sheet-leave-active {
        opacity: 0;
        transform: translate(-50%, -40%) !important;
    }

    .fv-sheet-enter-active, .fv-sheet-leave-active{
        transition: transform $transition-speed ease;
        transform: translateY(0);
    }
    .fv-sheet-enter, .fv-sheet-leave-active {
        transform: translateY(100%);
    }
</style>