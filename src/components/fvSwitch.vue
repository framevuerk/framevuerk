<script>
    export default {
        props: {
            value: {
                default: false
            },
            onValue: {
                default: true
            },
            offValue: {
                default: false
            },
            required: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
                focus: false
            }
        },
        computed: {
            invalid(){
                return this.required === true && this.value !== this.onValue;
            }
        },
        watch: {
            value(){
                this.setStructure();
            }
        },
        created(){
            this.setStructure();
        },
        methods: {
            pSetValue(value){
                this.$emit('input', value);
                this.$emit('change');
            },
            pToggle(){
                this.pSetValue( this.value === this.onValue? this.offValue: this.onValue);
            },
            pFocus(){
                if( !this.disabled ){
                    this.$refs.switch.focus();
                }
            },
            pClick(){
                if( !this.disabled ){
                    this.pToggle();
                    this.focus = true;
                }
            },
            setStructure(){
                if( [this.offValue, this.onValue].indexOf( this.value ) === -1 ){
                    this.pSetValue(this.offValue);
                }
            },
            pKeyDown(event){
                switch(event.which){
                    case 13: case 32: // enter, space
                        event.preventDefault();
                        this.pToggle();
                        break;
                }
            },
        }
    }
</script>

<template lang="pug">
    span.fv-switch(:class="{on: onValue === value, invalid: invalid, focus: focus, 'disabled': disabled}",
        ref="switch",
        @click="pClick()",
        :tabindex="disabled? '': 0",
        @focus="pFocus()",
        @blur="focus=false",
        @keydown="pKeyDown($event)"
    )
        span.fv-handler
        input.fv-hide(type="checkbox",
            :required="required",
            :checked="onValue === value",
            @invalid.prevent="pFocus()"
        )
</template>

<style lang="scss">
    @import "../styles/variables";
    @import "../styles/functions";
    @import "../styles/mixins";
    .fv-switch{
        width: 3.2em;
        background: $gray-color;
        border: solid 1px $gray-color-dark;
        border-radius: #{$border-radius * 6};
        padding: 0;
        display: inline-block;
        height: 1.2em;
        margin: 0.9em 0;
        vertical-align: middle;
        direction: $direction;
        cursor: pointer;
        & > .fv-handler{
            width: 1.8em;
            height: 1.8em;
            display: inline-block;
            background: $gray-color-light;
            margin: calc( -0.3em - 1px );
            border-radius: 25px;
            box-shadow: 0 1px 4px $shadow-color;
            border: solid 1px $shadow-color;
        }
        &.on{
            background: rgba($theme-color-light, 0.8);
            & > .fv-handler{
                background: $theme-color;
                margin-#{$block-start}: 1.65em;
            }
        }
        &:focus, &.focus{
            @include outline;
            &:invalid, &.invalid{
                @include outline($danger-color);
            }
        }
        &[disabled], &.disabled{
            @include disabled;
        }
    }
</style>