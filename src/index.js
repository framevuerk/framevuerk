import {name, version} from '../package.json';
import './style.scss';
import utility from './utility';

const framevuerk = {
    _dependencies: utility._dependencies,
    use(lib=null){
        if( lib && ( lib.name == 'jMoment' || lib.name == 'moment' ) ){
            utility._dependencies.moment = lib;
            this._dependencies.moment = lib;
        }
    },
    install(Vue){
        // Components
        Vue.component('fvMain', require('./components/fvMain.vue').default);
        Vue.component('fvContent', require('./components/fvContent.vue').default);
        Vue.component('fvHeader', require('./components/fvHeader.vue').default);
        Vue.component('fvFooter', require('./components/fvFooter.vue').default);
        Vue.component('fvSidebar', require('./components/fvSidebar.vue').default);
        Vue.component('fvSelect', require('./components/fvSelect.vue').default);
        Vue.component('fvDatepicker', require('./components/fvDatepicker.vue').default);
        Vue.component('fvList', require('./components/fvList.vue').default);
        Vue.component('fvMenu', require('./components/fvMenu.vue').default);
        Vue.component('fvInput', require('./components/fvInput.vue').default);
        Vue.component('fvButton', require('./components/fvButton.vue').default);
        Vue.component('fvFilepicker', require('./components/fvFilepicker.vue').default);
        Vue.component('fvSwitch', require('./components/fvSwitch.vue').default);
        Vue.component('fvDialog', require('./components/fvDialog.vue').default);
        Vue.component('fvTable', require('./components/fvTable.vue').default);
        Vue.component('fvTabs', require('./components/fvTabs.vue').default);
        Vue.component('fvRadio', require('./components/fvRadio.vue').default);
        Vue.component('fvTextarea', require('./components/fvTextarea.vue').default);
        // Directives
        Vue.directive('fvScroll', require('./directives/fvScroll.vue').default);
    },
    version,
    name
}
module.exports = framevuerk;