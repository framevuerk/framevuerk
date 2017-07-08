<script>
    import utility from '../utility';
    export default {
        props: {
            type: {
                type: String,
                default: 'button'
            }
        },
        mounted(){
            utility.vueEvents().forEach(eventName=>{
                this.$refs.buttonEl.addEventListener(eventName, (event)=> this.$emit(eventName, event) );
            });
        }
    }
</script>

<template lang="pug">
    button.fv-button(ref="buttonEl",
        :type="type"
    )
        slot
</template>

<style lang="scss">
    @import "../styles/variables";
    @import "../styles/functions";
    @import "../styles/mixins";
    .fv-button{
        font-family: inherit;
        display: inline-block;
        border: 1px solid $shadow-color;
        box-shadow: 0 1em 1em $shadow-color-light;
        vertical-align: middle;
        text-align: center;
        cursor: pointer;
        max-width: 100%;
        border-radius: $border-radius;
        &.fv-xs{
            font-size: 0.7em;
            height: 2.5em;
        }
        &.fv-sm{
            font-size: 0.8em;
            height: 2.8em;
        }
        &, &.fv-md{
            font-size: 0.9em;
            height: 3.1em;
        }
        &.fv-lg{
            font-size: 1em;
            height: 3.4em;
        }
        &.fv-xl{
            font-size: 1.1em;
            height: 3.7em;
        }
        &, & span{
            @include nowrap;
        }
        &:focus, &.focus{
            @include outline($theme-color);
            &:invalid, &.invalid{
                @include outline($danger-color);
            }
        }
        &[disabled], &.disabled{
            @include disabled;
        }
        &, &.fv-default{
            @include yiq($default-color);
            &:active, &.active{
                @include yiq($default-color-dark);
            }
            &:focus, &.focus{
                @include yiq($default-color-light);
            }
        }
        &.fv-primary{
            @include yiq($primary-color);
            &:active, &.active{
                @include yiq($primary-color-dark);
            }
            &:focus, &.focus{
                @include yiq($primary-color-light);
            }
        }
        &.fv-info{
            @include yiq($info-color);
            &:active, &.active{
                @include yiq($info-color-dark);
            }
            &:focus, &.focus{
                @include yiq($info-color-light);
            }
        }
        &.fv-danger{
            @include yiq($danger-color-dark);
            &:active, &.active{
                @include yiq($danger-color-dark);
            }
            &:focus, &.focus{
                @include yiq($danger-color-dark);
            }
        }
        &.fv-warning{
            @include yiq($warning-color-dark);
            &:active, &.active{
                @include yiq($warning-color-dark);
            }
            &:focus, &.focus{
                @include yiq($warning-color-dark);
            }
        }
        &.fv-success{
            @include yiq($success-color-dark);
            &:active, &.active{
                @include yiq($success-color-dark);
            }
            &:focus, &.focus{
                @include yiq($success-color-dark);
            }
        }
        &:active, &.active{
            box-shadow: inset 0 1em 1em $shadow-color-light;
        }
    }
</style>