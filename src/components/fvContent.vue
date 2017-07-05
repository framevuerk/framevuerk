<script>
    export default {

    }
</script>

<template lang="pug">
    div(class="fv-content")
        slot
</template>

<style lang="scss">
    @import "../styles/variables";
    @import "../styles/functions";
    @import "../styles/mixins";
    .fv-content{
        position: relative;
        display: block;
        width: 100%;
        padding: $padding;
        height: 100%;
        overflow: auto;
        flex-grow: 1;
        &.no-padding{
            padding: 0;
        }
        &.no-vertical-padding{
            padding-top: 0;
            padding-bottom: 0;
        }
        &.no-horizontal-padding{
            padding-left: 0;
            padding-right: 0; 
        }
        &:after{
            content: '';
            clear: both;
            display: block;
        }
    }
</style>