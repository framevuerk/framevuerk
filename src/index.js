// Package information
const pkg = require('../package.json');

// Global Styles
import './style.scss';

// Components
import fvMain from './components/fvMain.vue';
import fvHeader from './components/fvHeader.vue';
import fvFooter from './components/fvFooter.vue';
import fvContent from './components/fvContent.vue';
import fvSidebar from './components/fvSidebar.vue';
import fvButton from './components/fvButton.vue';
import fvDialog from './components/fvDialog.vue';
import fvRadio from './components/fvRadio.vue';
import fvList from './components/fvList.vue';
import fvMenu from './components/fvMenu.vue';
import fvTabs from './components/fvTabs.vue';
import fvInput from './components/fvInput.vue';
import fvSelect from './components/fvSelect.vue';

// Directives
import fvScroll from './directives/fvScroll.vue';

const framevuerk = {
    _dependencies: {
        moment: null
    },
    use(lib=null){
        if( lib && lib.name == 'jMoment' ){
            this._dependencies.moment = lib;
        }
    },
    install(Vue){
        // Components
        Vue.component('fvMain', fvMain);
        Vue.component('fvContent', fvContent);
        Vue.component('fvHeader', fvHeader);
        Vue.component('fvFooter', fvFooter);
        Vue.component('fvSidebar', fvSidebar);
        Vue.component('fvSelect', fvSelect);
        // Vue.component('fvDatepicker', fvDatepicker(this._dependencies.moment) );
        Vue.component('fvList', fvList);
        Vue.component('fvMenu', fvMenu);
        Vue.component('fvInput', fvInput);
        Vue.component('fvButton', fvButton);
        // Vue.component('fvFilepicker', fvFilepicker);
        // Vue.component('fvSwitch', fvSwitch);
        Vue.component('fvDialog', fvDialog);
        // Vue.component('fvTable', fvTable);
        Vue.component('fvTabs', fvTabs);
        Vue.component('fvRadio', fvRadio);
        // Vue.component('fvTextarea', fvTextarea);
        // Directives
        Vue.directive('fvScroll', fvScroll);
    },
    version: pkg.version,
    name: pkg.name
}
module.exports = framevuerk;