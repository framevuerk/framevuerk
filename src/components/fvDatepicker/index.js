import utility from '../../utility'
import template from './template.pug'

export default function(moment){
    return {
        template: template,
        data: ()=>{
            return {
                pDate: {}, //moment.utc(),
                pValue: {},
                displayValue: null,
                pShow: false,
                highlightedOption: null,
                dialogButtons: [
                    {
                        key: 'reset',
                        icon: 'fa fa-circle-o',
                        text: 'حذف انتخاب',
                        class: 'fv-default'
                    },
                    {
                        key: 'ok',
                        icon: 'fa fa-check',
                        text: 'باشه',
                        class: 'fv-primary'
                    }
                ]
            }
        },
        props: {
            value: {
                default: null,
                required: true
            },
            required: {
                type: Boolean,
                default: false
            },
            pick: {
                type: Array,
                default: ()=>[
                    'year',
                    'month',
                    'day',
                    'sp',
                    'hour',
                    'minute',
                    'second'
                ]
            },
            displayFormat: {
                default: 'jD jMMMM jYYYY ساعت HH:mm'
            }
        },
        methods: {
            open: function(){
                this.searchQuery = '';
                this.$refs.dialog.open();
                this.$emit('open');
            },
            close: function(){
                this.$refs.dialog.close();
                this.$emit('close');
            },
            pMath: function(action='add', type='day') {
                this.pDate[action](1, type + 's');
                this.pSetValue(this.pDate);
            },
            highlightOption: function(option={index:null}){
                this.highlightedOption = option.index;
            },
            pFocus: function(el="input"){
                if( el == 'input' ){
                    this.$refs.inputEl.$el.focus();
                }
                else{
                    this.$refs.justFocusEl.focus();
                }
            },
            pIsSelected: function(option={index:null,value:null}){
                if( this.multiple && typeof this.value === 'object' && this.value !== null){
                    return this.value.indexOf( option.value ) !== -1;
                }
                else{
                    return this.value === option.value;
                }
            },
            pKeyDown: function(event){
                console.log(this.highlightedOption);
                switch(event.which){
                    case 38: //up
                        if( this.highlightedOption !== null ){
                            this.pMath('add', this.pSections[this.highlightedOption].name);
                        }
                        break;
                    case 40: // down
                        if( this.highlightedOption !== null ){
                            this.pMath('subtract', this.pSections[this.highlightedOption].name);
                        }
                        break;
                    case 37: //left
                        this.highlightedOption = this.highlightedOption == null? -1: this.highlightedOption;
                        this.highlightedOption = this.highlightedOption+1 >= this.pSections.length? 0: this.highlightedOption+1;
                        this.highlightedOption = this.pSections[this.highlightedOption].type === 'sp'? this.highlightedOption+1: this.highlightedOption;
                        break;
                    case 39: //right
                        this.highlightedOption = this.highlightedOption == null? this.pSections.length: this.highlightedOption;
                        this.highlightedOption = this.highlightedOption-1 < 0? this.pSections.length-1: this.highlightedOption-1;
                        this.highlightedOption = this.pSections[this.highlightedOption].type === 'sp'? this.highlightedOption-1: this.highlightedOption;
                        break;
                    default:
                        this.highlightedOption = null;
                } 
            },
            clickButton: function(action){
                switch(action){
                    case 'reset':
                        this.pSetValue();
                    default:
                        this.close();
                }
            },
            pSetValue: function(date=null){ // receive moment date and set date to value
                let newValue = null;
                if( date === null ){
                    this.pDate = moment.utc();
                }
                else{
                    this.pDate = date;
                    newValue = this.pDate.toDate();
                }
                this.pValue =  {
                    year: this.pDate.format('jYYYY'),
                    month: utility.persianMonthName( parseInt( this.pDate.format('jMM') ) ),
                    day: this.pDate.format('jD'),
                    hour: this.pDate.format('HH'),
                    minute: this.pDate.format('mm'),
                    second: this.pDate.format('ss')
                }
                this.$emit( 'input', newValue );
                this.$emit( 'change' );
                if( date === null ){
                    this.displayValue = null;
                }
                else{
                    let temp = this.displayFormat.split('jMMMM').join(this.pValue.month);
                    this.displayValue = this.pDate.format(temp);
                }
            },
            closeIf: function(event){
                utility.doIt( ()=>{
                    var focusedElem = document.querySelector(':focus');
                    if( focusedElem !== null && !utility.isDescendant(this.$refs.datepicker.$el, focusedElem) ){
                        this.close();
                    }
                } );
            }
        },
        created: function(){
            if( moment ){
                this.pSetValue(this.value === null? null: moment.utc() );
            }
            else{
                throw 'Moment not found!';
            }
            
        },
        computed: {
            pSections: function(){
                return this.pick.map( (v)=>{
                    switch(v){
                        case 'year': return {
                            type: 'pick',
                            name: v,
                            title: 'سال'
                        };
                        case 'month': return {
                            type: 'pick',
                            name: v,
                            title: 'ماه'
                        }
                        case 'day': return {
                            type: 'pick',
                            name: v,
                            title: 'روز'
                        }
                        case 'hour': return {
                            type: 'pick',
                            name: v,
                            title: 'ساعت'
                        }
                        case 'minute': return {
                            type: 'pick',
                            name: v,
                            title: 'دقیقه'
                        }
                        case 'second': return {
                            type: 'pick',
                            name: v,
                            title: 'ثانیه'
                        }
                        case 'sp': return {
                            type: 'sp'
                        }
                        default: console.error('error in fv-datepicker pick attribute.');
                    }
                });            
            }
        }
    }
}