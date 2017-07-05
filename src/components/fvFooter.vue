<script>
    export default {
        props: {
            height: {
                type: Number,
                default: 65
            }
        },
        methods: {
            setHeight(){
                this.$el.style.height = `${this.height}px`;
                this.$el.style.minHeight = `${this.height}px`;
                this.$el.style.maxHeight = `${this.height}px`;
                
            }
        },
        mounted(){
            this.setHeight();
        },
        watch: {
            height(){
                this.setHeight();
            }
        }
    }
</script>

<template lang="pug">
    footer(class="fv-footer")
        slot
</template>

<style lang="scss">
    @import "../styles/variables";
    @import "../styles/functions";
    @import "../styles/mixins";
    .fv-footer {
        @include yiq($bg-color-dark);
        line-height: 1;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: space-between;
        bottom: 0;
        width: 100%;
        padding: $padding-small $padding;
        & .fv-title {
            padding: 0 $padding;
            text-align: center;
            & > * {
                width: 100%;
                @include nowrap;
                margin: 0;
            }
        }
        & .fv-button{
            margin: 0 0.5em;
        }
        & .fv-grow {
            flex-grow: 1;
        }
    }
</style>