<script>
    import utility from '../utility';
    export default {
        props: {
            value: {
                default: null
            },
            required: {
                type: Boolean,
                default: false
            },
            placeholder: {
                type: String,
                default : ''
            }
        },
        methods: {
            pFocus(){
                this.$refs.inputEl.focus();
            }
        },
        mounted(){
            utility.vueEvents().forEach(eventName=>{
                this.$refs.inputEl.addEventListener(eventName, (event)=> this.$emit(eventName, event) );
            });
        }
    }
</script>

<template lang="pug">
    textarea.fv-textarea(ref="inputEl",
        tabindex="0",
        :value="value",
        :required="required",
        :placeholder="placeholder",
        @invalid.prevent="pFocus()"
    )
        slot
</template>

<style lang="scss">
    @import "../styles/variables";
    @import "../styles/functions";
    @import "../styles/mixins";
    .fv-textarea{
        
    }
</style>