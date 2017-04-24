import utility from '../../utility'
import template from './template.pug'
//let isMoment = require.resolve('moment-jalaali');
//import moment from 'moment-jalaali'


export default ({
    template: template,
    data: ()=>{
        return {
            moment: null,
            pDate: {}, //moment.utc(),
            pValue: {},
            pDisplayValue: '',
            pShow: false,
            searchQuery: '',
            highlightedOption: null
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
        },
        placeholder: {
            type: String,
            default : ''
        }
    },
    methods: {
        pMath: function(action='add', type='day') {
            this.pDate[action](1, type + 's');
            this.pSetValue(this.pDate);
        },
        toggle: function(){
            this[this.pShow?'close':'open']();
        },
        open: function(){
            this.pShow = true;
            this.$emit('open');
            utility.doIt( ()=>{
                this.pFocus('datepicker');
            });
        },
        close: function(){
            this.pShow = false;
            this.$emit('close');
        },
        closeIf: function(event){
            utility.doIt( ()=>{
                var focusedElem = document.querySelector(':focus');
                if( focusedElem !== null && !utility.isDescendant(this.$refs.datepicker.$el, focusedElem) ){
                    this.close();
                }
            } )
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
                case 13: // enter
                    event.preventDefault();
                    this.close();
                    break;
                case 27: //esc
                    this.close();
                default:
                    this.highlightedOption = null;
            } 
        },
        clickOption: function(option={index:null,value:null}, setHighlight = false){
            if( option.value === null ){
                if( this.multiple ){
                    this.$emit('input', [] );
                }
                else{
                    this.$emit('input', null );
                }
            }
            else if( this.multiple ){
                let newValue = this.value;
                if( this.pIsSelected(option) ){
                    newValue.splice( newValue.indexOf(option.value) , 1);
                }
                else{
                    newValue.push( option.value );
                }
                this.$emit('input', newValue );
            }
            else{
                this.$emit('input', option.value );
            }
            if(setHighlight){
                this.highlightOption( option );
            }
            else{
                this.highlightOption();
            }
        },
        pSetValue: function(date=null){ // receive moment date and set date to value
            let newValue = null;
            if( date === null ){
                this.pDate = this.moment.utc();
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
                this.pDisplayValue = null;
            }
            else{
                let temp = this.displayFormat.split('jMMMM').join(this.pValue.month);
                this.pDisplayValue = this.pDate.format(temp);
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
        const target = utility.getTarget();
        if( target === 'module' ){
            this.moment = require('moment-jalaali');
            this.pSetValue(this.value === null? null: this.moment.utc() );
        }
        else if ( global.moment ){
            this.moment = global.moment;
            this.pSetValue(this.value === null? null: this.moment.utc() );
        }
        else{
            console.error('Moment not found!');
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
})