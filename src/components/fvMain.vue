<script>
    import utility from '../utility';
    export default {
        mounted(){
            utility.vueEvents().forEach(eventName=>{
                this.$refs.el.addEventListener(eventName, (event)=> this.$emit(eventName, event) );
            });
        }
    }
</script>

<template lang="pug">
    div.fv-main(ref="el")
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