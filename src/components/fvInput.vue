<script>
    export default {
        props: {
            value: {
                default: null
            },
            displayValue: {
                default: undefined
            },
            type: {
                default: 'text'
            },
            required: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            placeholder: {
                type: String,
                default : ''
            },
            icon: {
                default: 'fa fa-chevron-down'
            }
        },
        data(){
            return {
                invalid: false,
                focus: false
            }
        },
        watch: {
            value(){
                this.checkInvalid();
            }
        },
        methods: {
            checkInvalid(){
                if( this.required ){
                    let length = this.value === null? 0: this.value.toString().length;
                    this.invalid = length > 0? true: false;
                }
            },
            pFocus(){
                this.$refs.inputEl.focus();
            },
            pClick(event){
                if( !this.disabled ){
                    this.$emit('click', event);
                }
            }
        }
    }
</script>

<template lang="pug">
div.fv-input.fv-input-select(v-if="displayValue !== undefined",
    ref="inputEl",
    :class="{invalid: invalid, focus: focus, disabled: disabled}",
    :tabindex="disabled? '': 0",
    :disabled="disabled",
    @focus="checkInvalid(); $emit('focus', $event); focus = true;",
    @click="pClick($event)",
    @blur="$emit('blur', $event); focus = false;",
    @keyup="$emit('keyup', $event)",
    @keydown="$emit('keydown', $event)",
    @keypress="$emit('keypress', $event)",
    @invalid.prevent="pFocus()"
)
    span.placeholder(v-if="typeof displayValue == 'undefined' || displayValue === null || displayValue.length === 0",
        v-html="placeholder"
    )
    span.fv-input-select-item(v-else-if="displayValue.constructor == Array",
        v-for="val in displayValue",
        v-html="val"
    )
    span.fv-input-select-item(v-else,
        v-html="displayValue"
    )
    i(v-if="icon",
        :class="icon",
        class="fv-arrow"
    )
    input(class="fv-hidden",
        tabindex="999999999",
        :value="value",
        :required="required",
        @focus="$refs.inputEl.focus()"
    )
input.fv-input(v-else,
    ref="inputEl",
    :type="type",
    :tabindex="disabled? '': 0",
    :disabled="disabled",
    :value="value",
    :required="required",
    :placeholder="placeholder",
    @input="$emit('input', $event.target.value)",
    @focus="$emit('focus', $event)",
    @click="$emit('click', $event)",
    @blur="$emit('blur', $event)",
    @keyup="$emit('keyup', $event)",
    @keydown="$emit('keydown', $event)",
    @keypress="$emit('keypress', $event)",
    @invalid.prevent="pFocus()")

</template>

<style lang="scss">
    @import "../styles/variables";
    @import "../styles/functions";
    @import "../styles/mixins";
    .fv-input{
        
    }
    .fv-input-select,
    .fv-input-datepicker{
        cursor: pointer;
        & > .fv-input-select-item{
            @include yiq($gray-color-light);
            border: 1px solid $shadow-color;
            box-shadow: 0 2px 1px $shadow-color-light;
            border-radius: 0.5em;
            margin-#{$block-end}: 0.5em;
            padding: 0 0.5em;
            line-height: 3em;
        }
        & > .fv-arrow{
            float: $block-end;
            margin: 1.1em 0.4em 1em 0.4em;
        }
    }
</style>