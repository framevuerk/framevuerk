import './index.pcss'

//import "babel-polyfill";

import fvMain from './components/fvMain'
import fvContent from './components/fvContent'
import fvHeader from './components/fvHeader'
import fvFooter from './components/fvFooter'
import fvSidebar from './components/fvSidebar'
import fvSelect from './components/fvSelect'
import fvDatepicker from './components/fvDatepicker'
import fvMenu from './components/fvMenu'
import fvInput from './components/fvInput'
import fvButton from './components/fvButton'
import fvFilepicker from './components/fvFilepicker'
import fvSwitch from './components/fvSwitch'
import fvDialog from './components/fvDialog'
import fvList from './components/fvList'
import fvTable from './components/fvTable'

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
    Vue.component('fvMain', fvMain);
    Vue.component('fvContent', fvContent);
    Vue.component('fvHeader', fvHeader);
    Vue.component('fvFooter', fvFooter);
    Vue.component('fvSidebar', fvSidebar);
    Vue.component('fvSelect', fvSelect);
    Vue.component('fvDatepicker', fvDatepicker(this._dependencies.moment) );
    Vue.component('fvMenu', fvMenu);
    Vue.component('fvInput', fvInput);
    Vue.component('fvButton', fvButton);
    Vue.component('fvFilepicker', fvFilepicker);
    Vue.component('fvSwitch', fvSwitch);
    Vue.component('fvDialog', fvDialog);
    Vue.component('fvList', fvList);
    Vue.component('fvTable', fvTable);

    // why this mixin is here?
    // this is helps to pass true references to components like fvInput (handler property)
    // for more information, read this: https://github.com/vuejs/vue/issues/5561
    Vue.mixin({
      mounted(){
        this.$forceUpdate();
      }
    });
  }
};
module.exports = framevuerk;