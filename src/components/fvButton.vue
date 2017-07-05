<script>
    export default {
        props: {
            type: {
                type: String,
                default: 'button'
            }
        }
    }
</script>

<template lang="pug">
    button(class="fv-button",
        :type="type",
        @focus="$emit('focus', $event)",
        @click="$emit('click', $event)",
        @blur="$emit('blur', $event)",
        @keyup="$emit('keyup', $event)",
        @keydown="$emit('keydown', $event)",
        @keypress="$emit('keypress', $event)"
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
        font-size: 0.9em;
        height: 3.1em;
        border-radius: $border-radius;
        &, & span{
            @include nowrap;
        }
        &:focus, &.focus{
            @include outline($theme-color);
            &:invalid, &.invalid{
                @include outline($danger-color);
            }
        }
        &:disabled, &.disabled{
            opacity: 0.6;
            cursor: not-allowed;
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