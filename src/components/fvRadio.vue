<script>
    export default {
        props: {
            options: {
                type: Array,
                default: () => []
            },
            value: {
                default: null
            },
        },
        computed: {
            pOptions(){
                let ret = [];
                this.options.forEach( (option,index)=>{
                    ret.push({
                        index: index,
                        text: option.text || option,
                        value: option.value || option.text || option,
                        disabled: option.disabled || false,
                    });
                });
                return ret;
            }
        },
        methods: {
            clickOption(option){
                if( !option.disabled && option.value !==   this.value ){
                    this.$emit('input', option.value);
                    this.$emit('change');
                }
            },
            isChecked(option){
                return option.value === this.value;
            }
        }
    }
</script>

<template lang="pug">
    div.fv-radio
        span.fv-radio-check(
            :tabindex="option.disabled? '': 0",
            v-for="option in pOptions",
            @click="clickOption(option)",
            @keydown.enter="clickOption(option)",
            :class="{'fv-checked': isChecked(option), 'fv-disabled': option.disabled}"
        )
            i.fv-radio-icon.fa(:class="{'fa-circle-o': !isChecked(option), 'fa-dot-circle-o': isChecked(option)}")
            ="  "
            label.fv-control-label(v-html="option.text")
</template>

<style lang="scss">
    @import "../styles/variables";
    @import "../styles/functions";
    @import "../styles/mixins";
    .fv-radio{
        height: 1.2em;
        margin: .7em 0;
        display: inline-block;
        & > .fv-button{
            padding-#{$block-end}: 1.5em;
            padding-#{$block-start}: 1.5em;
            &:not(:last-child):not(:first-child){
                border-radius: 0;
                border-#{$block-end}: 0;
                border-#{$block-start}: 0;
            }
            &:first-child{
                border-top-#{$block-end}-radius: 0;
                border-bottom-#{$block-end}-radius: 0;
                border-#{$block-end}: 0;
            }
            &:last-child{
                border-top-#{$block-start}-radius: 0;
                border-bottom-#{$block-start}-radius: 0;
                border-#{$block-start}: 0;
            }
        }
        & .fv-radio-check:not(:last-child){
            margin-#{$block-end}: .7em;
        }
        & .fv-radio-check{
            color: inherit;
            border-radius: $border-radius;
            &, & *{
                cursor: pointer;
            }
            &.fv-disabled{
                opacity: .5;
                &, & *{
                    cursor: not-allowed;
                }
            }
            &.fv-checked, &.fv-checked *{
                color: $primary-color;
            }
            &:focus, &.focus{
                @include outline;
            }
        }
        & .fv-radio-icon{
            font-size: 1.2em;
            display: inline;
            vertical-align: middle;
        }
        & .fv-control-label{
            display: inline;
        }
    }
</style>