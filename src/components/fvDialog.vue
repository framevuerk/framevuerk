<script>
    import utility from '../utility'
    export default {
        data(){
            return {
                pShow: false,
                pProp: null,
                focusBackElem: null
            }
        },
        props: {
            title: {
                default: '',
                required: false
            },
            position: {
                type: String,
                enum: ['bottom', 'center'],
                default: 'center'
            },
            autoClose: {
                type: Boolean,
                default: true
            },
            buttons: {
                type: Array,
                default: () => []
            },
            contentClass: {
                default: ''
            },
        },
        methods: {
            toggle(){
                this[this.pShow?'close':'open']();
            },
            open(prop = null){
                this.pShow = true;
                this.pProp = prop;
                this.focusBackElem = document.querySelector(':focus');
                this.$emit('open', this.pProp);
                utility.doIt( ()=>{
                    this.pFocus(false);
                });
            },
            close(){
                this.pShow = false;
                this.pProp = null;
                if( this.focusBackElem ){
                    utility.doIt( ()=>{
                        this.focusBackElem.focus();
                    });
                }
                this.$emit('close', this.pProp);
            },
            closeIf(){
                if( this.autoClose === true ){
                    this.close();
                }
            },
            pFocus(first=true){
                this.focusableItems[first? 0: this.focusableItems.length-1].focus();
            },
            pKeyDown(event){
                switch(event.which){
                    case 9: // tab
                        // when first item is focused and user press shift + tab
                        if( event.target == this.focusableItems[0]  && event.shiftKey ){
                            event.preventDefault();
                            this.pFocus(false);
                        }
                        // when last item is focused and user press tab
                        else if( event.target == this.focusableItems[this.focusableItems.length-1]  && !event.shiftKey ){
                            event.preventDefault();
                            this.pFocus(true);
                        }
                        break;
                    case 13: // enter
                        event.target.click();
                        event.preventDefault();
                        break;
                    case 27: //esc
                        this.closeIf();
                } 
            },
            clickButton(button){
                this.$emit('click-button', button.key, this.pProp);
                button.action(this.pProp);
                this.closeIf();
            }
        },
        computed: {
            pButtons(){
                let ret = [];
                this.buttons.forEach( (value)=>{
                    ret.push({
                        key: value.key || value.text || value,
                        icon: value.icon || false,
                        text: value.text || value,
                        action: value.action || new Function(),
                        class: value.class || 'fv-default',
                        disabled: value.disabled || false
                    });
                });
                return ret;
            },
            focusableItems(){
                return this.$refs.dialog.$el.querySelectorAll('select, input, textarea, button, a, [tabindex]');
            },
            animationName(){
                return `fv-dialog-${this.position}`;
            }
        },
    }
</script>

<template lang="pug">
    span
        transition(name="fv-fade")
            div(class="fv-overlay fv-dialog-overlay",
                v-show="pShow",
                @click="closeIf()"
            )
        transition(:name="animationName")
            fv-main(class="fv-dialog",
                :class="animationName",
                v-show="pShow",
                ref="dialog",
                @keydown="pKeyDown($event); $emit('keydown', $event)",
                @click="$emit('click', $event)"
            )
                fv-content(:class="contentClass")
                    h3(v-if="title.length > 0",
                        v-html="title"
                    )
                    br(v-if="title.length > 0")
                    slot
                fv-footer(v-if="pButtons.length > 0")
                    div(class="fv-grow")
                    fv-button(v-for="button in pButtons",
                        :key="button.key",
                        :class="button.class",
                        @click="clickButton(button)",
                        :disabled="button.disabled"
                    ) 
                        i(v-if="button.icon",
                            :class="button.icon"
                        )
                        =" "
                        span(v-html="button.text")
</template>

<style lang="scss">
    @import "../styles/variables";
    @import "../styles/functions";
    @import "../styles/mixins";
    .fv-dialog-overlay{
        z-index: 20000;
    }
    .fv-dialog {
        z-index: 20002;
        position: fixed;
        height: auto;
        width: auto;
        max-width: 90%;
        max-height: 90%;
        /* min-height: 200px; */
        min-width: 300px;

        margin: 0;
        padding: 0;
        @include yiq($bg-color);
        overflow: auto;
        box-shadow: 0 5px 15px $shadow-color;
        @include respond-to(only-xs) {
            max-height: 100%;
            max-width: 100%;
        }
        &.fv-dialog-bottom{
            width: 100%;
            max-width: 100%;
            left: 0;
            top: auto;
            bottom: 0;
        }
        &.fv-dialog-center{
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
    .fv-dialog-center-enter-active, .fv-dialog-center-leave-active{
        transition: all $transition-speed !important;
        transform: translate(-50%, -50%) !important;
        opacity: 1;
    }
    .fv-dialog-center-enter, .fv-dialog-center-leave-active {
        opacity: 0 !important;
        transform: translate(-50%, -34%) !important;
    }
    .fv-dialog-bottom-enter-active, .fv-dialog-bottom-leave-active{
        transition: all $transition-speed !important;
        transform: translateY(0);
    }
    .fv-dialog-bottom-enter, .fv-dialog-bottom-leave-active {
        transform: translateY(100%) !important;
    }
</style>