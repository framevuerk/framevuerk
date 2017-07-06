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
        &:after{
            content: '';
            clear: both;
            display: block;
        }
    }
</style>