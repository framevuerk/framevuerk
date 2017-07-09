<script>
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
            }
        },
        watch: {
            sheet(){
                this.bindEvents();
            }
        },
        created(){
            this.bindEvents();
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
                this.highlightedOption = null;
                this.$refs.menu.open(param);
            },
            close(){
                this.$refs.menu.close();
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
            }
        }
    }
</script>

<template lang="pug">
    fv-dialog.fv-menu(ref="menu",
        content-class="fv-no-padding",
        :position="pSheet? 'bottom': 'center'",
        @click="pFocus('search')",
        @keydown="pKeyDown($event)",
        @close="$emit('close'); pFocus('input');",
        @open="$emit('open')"
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
        &.fv-not-sheet{

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