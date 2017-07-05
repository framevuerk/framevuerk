<script>
    export default {

    }
</script>

<template lang="pug">
    div(
        class="fv-main",
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
    .fv-main{
        display: flex;
        flex-direction: column;
        height: inherit;
        width: inherit;
        transition: all $transition-speed;
        transition-property: padding;
    }
</style>