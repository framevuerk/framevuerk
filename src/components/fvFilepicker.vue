<script>
    import locale from 'locale';
    export default {
        props: {
            value: {
                default: null
            },
            extension: {
                default: 'jpg,png,gif'
            },
            required: {
                type: Boolean,
                default: false
            },
            multiple: {
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                enum: ['blob', 'file'],
                default: 'blob' // or file
            }
        },
        data(){
            return {
                invalid: false,
                focus: false,
                displayValue: '',
                selected: false
            }
        },
        watch: {
            value(){
                this.checkInvalid();
                this.valueChanges();
            }
        },
        created(){
            this.valueChanges();
        },
        methods: {
            checkInvalid(){
                if( this.required ){
                    const filesCount = this.$refs.fileinput.files.length;
                    this.invalid = filesCount > 0? false: true;

                }
            },
            choose(){
                this.$refs.fileinput.click();
            },
            pFocus(){
                this.$refs.btnEl.$el.focus();
            },
            pick(){ // here, should fire when input type file changed by user
                const loadAsBlob = (file) => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.addEventListener('load', ()=>{
                            resolve( new Blob([reader.result], {
                                type: file.type,
                                endings: 'native'
                            }) );
                            this.$emit('change');
                        });
                        reader.addEventListener('error', reject)
                        reader.readAsArrayBuffer(file);
                    });
                }
                let value = [];
                let j = 0;
                const filesCount = this.$refs.fileinput.files.length;
                if( filesCount === 0 ){
                    this.$emit('input', this.multiple? []: null );
                }
                else{
                    switch( this.type ){
                        case 'blob':
                            for( let i = 0; i < filesCount; i++ ){
                                loadAsBlob( this.$refs.fileinput.files[i] ).then( (result) => {
                                    value.push( result );
                                    j++;
                                    if( j === filesCount ){
                                        this.$emit('input', this.multiple? value: value[0] );
                                    }
                                });
                            }
                            break;
                        case 'file':
                            this.$emit('input', this.multiple? this.$refs.fileinput.files: this.$refs.fileinput.files[0] );
                            break;
                    }
                }
            },
            valueChanges(){
                if( this.value == null ){
                    this.displayValue = locale.browse();
                    this.selected = false;
                    return;
                }
                const filesCount = this.$refs.fileinput.files.length;
                this.selected = true;
                switch( this.type ){
                    case 'blob':
                        if( this.multiple ){
                            this.displayValue = locale.nFileSelected(filesCount);
                        }
                        else{
                            this.displayValue = locale.nFileSelected(1);
                        }
                        break;
                    case 'file':
                        if( this.multiple ){
                            this.displayValue = locale.nFileSelected(filesCount);
                        }
                        else{
                            this.displayValue = this.value.name;
                        }
                        break;
                }
            }
        }
    }
</script>

<template lang="pug">
    fv-button(@click="choose($event)",
        type="button",
        class="fv-file-picker",
        :class="{invalid: invalid}",
        @focus="checkInvalid()",
        ref="btnEl"
    )
        i.fa(:class="{'fa-file': selected,'fa-file-o': !selected}")
        =" "
        span(v-html="displayValue")
        input.fv-hide(type="file",
            ref="fileinput",
            @change="pick()",
            :multiple="multiple",
            :required="required",
            @invalid.prevent="pFocus()"
        )
</template>

<style lang="scss">
    @import "../styles/variables";
    @import "../styles/functions";
    @import "../styles/mixins";
</style>