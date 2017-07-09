<script>
    export default {
        props: {
            height: {
                type: Number,
                default: 55
            }
        },
        watch: {
            height(){
                this.setHeight();
            }
        },
        mounted(){
            this.setHeight();
        },
        methods: {
            setHeight(){
                this.$el.style.height = `${this.height}px`;
                this.$el.style.minHeight = `${this.height}px`;
                this.$el.style.maxHeight = `${this.height}px`;
            }
        }
    }
</script>

<template lang="pug">
    header(class="fv-header")
        slot
</template>

<style lang="scss">
    @import "../styles/variables";
    @import "../styles/functions";
    @import "../styles/mixins";
    .fv-header {
        z-index: 9999;
        @include yiq($theme-color);
        line-height: 1;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 5px 15px $shadow-color-light;
        width: 100%;
        top: 0;
        right: 0;
        transition: all $transition-speed;
        &.fv-invert{
            @include yiq($bg-color, 70%);
            border-bottom: solid 1px $shadow-color;
            & .fv-icon,
            & .fv-button {
                @include yiq($bg-color, 70%);
                &:focus, &.focus{
                    @include yiq($bg-color-dark, 70%);
                    @include outline($bg-color-dark);
                }
                &:disabled, &.disabled{
                    @include yiq($bg-color, 70%);
                    @include disabled;
                }
            }
        }
        & > * {
            width: auto;
            max-width: 100%;
            vertical-align: middle;
            &.fv-icon,
            &.fv-button {
                display: flex;
                align-items: center;
                justify-content: center;
                border: none;
                border-radius: 0;
                height: 100%;
                padding: 0 1.3em;
            }
            &.fv-icon {
                font-size: 1.2em;
                & > * {
                    vertical-align: middle;
                }
            }
            &.fv-form-control{
                margin: 0 $padding;
                background: $bg-color;
            }
            &.fv-title {
                padding: 0 $padding;
                flex-grow: 1;
                height: auto;
                & > * {
                    height: auto;
                    width: 100%;
                    @include nowrap;
                    margin: 0;
                    padding: 4px 0;
                }
            }
        }
    }

</style>