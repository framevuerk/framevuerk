import template from './template.pug';
export default {
    template,
    data(){
        return {
            selectedTab: null
        }
    },
    props: {
        tabs: {
            type: Array
        }
    },
    computed: {
        pTabs(){
            let ret = [];
            this.tabs.forEach( (value, index)=>{
                ret.push({
                    index: index,
                    slot: value.slot || value.title || value,
                    icon: value.icon || false,
                    title: value.title || value,
                    disabled: value.disabled || false
                });
            });
            return ret;
        }
    },
    methods: {
        clickTab(slotName){
            this.selectedTab = slotName;

        }
    },
    mounted(){
        this.selectedTab = this.pTabs[0].slot;
    }
}