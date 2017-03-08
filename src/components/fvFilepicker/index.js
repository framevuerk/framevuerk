import template from './template.pug'

export default ({
    template: template,
    props: {
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
        }
    },
    data: function(){
        return {
            invalid: false,
            focus: false,
            displayValue: 'انتخاب',
            selected: false
        }
    },
    methods: {
        checkInvalid: function(){
            if( this.required ){
                const filesCount = this.$refs.fileinput.files.length;
                this.invalid = filesCount > 0? false: true;
            }
        },
        choose: function(event){
            //event.preventDefault();
            this.$refs.fileinput.click();
            //event.preventDefault();
            //event.stopPropagation();
            //alert('clicked');
        },
        pFocus: function(el="input"){
            this.$refs.btnEl.$el.focus();
        },
        pick: function(){
            const loadAsBlob = (file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.addEventListener('load', ()=>{
                        resolve( new Blob([reader.result], {
                            type: file.type,
                            endings: 'native'
                        }) );
                    });
                    reader.addEventListener('error', reject)
                    reader.readAsArrayBuffer(file);
                });
            }
            let value = [];
            let j = 0;
            const filesCount = this.$refs.fileinput.files.length;
            if( filesCount === 0 ){
                this.displayValue = 'انتخاب';
                this.selected = false;
                this.$emit('input', this.multiple? []: null );
            }
            else{
                for( let i = 0; i < filesCount; i++ ){
                    loadAsBlob( this.$refs.fileinput.files[i] ).then( (result) => {
                        value.push( result );
                        j++;
                        if( j === filesCount ){
                            this.displayValue = `${filesCount} فایل انتخاب شد!`;
                            this.selected = true;
                            this.$emit('input', this.multiple? value: value[0] );
                        }
                    });;
                }
            }
        }
    },
    watch: {
        value: function(){
            this.checkInvalid();
        }
    }
})