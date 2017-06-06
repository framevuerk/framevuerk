import template from './template.pug'

export default ({
    template: template,
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
            default: 'blob' // or file
        }
    },
    data: function(){
        return {
            invalid: false,
            focus: false,
            displayValue: '',
            selected: false
        }
    },
    methods: {
        checkInvalid(){
            if( this.required ){
                const filesCount = this.$refs.fileinput.files.length;
                this.invalid = filesCount > 0? false: true;

            }
        },
        choose(event){
            //event.preventDefault();
            this.$refs.fileinput.click();
            //event.preventDefault();
            //event.stopPropagation();
        },
        pFocus(el="input"){
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
                this.displayValue = 'انتخاب';
                this.selected = false;
                return;
            }
            this.selected = true;
            switch( this.type ){
                case 'blob':
                    if( this.multiple ){
                        this.displayValue = `${filesCount} فایل انتخاب شد!`;
                    }
                    else{
                        this.displayValue = `فایل انتخاب شد!`;
                    }
                    break;
                case 'file':
                    if( this.multiple ){
                        this.displayValue = `${filesCount} فایل انتخاب شد!`;
                    }
                    else{
                        this.displayValue = this.value.name;
                    }
                    break;
            }
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
    }
})