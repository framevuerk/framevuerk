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

const framevuerk = {
  install(Vue){
    Vue.component('fvMain', fvMain);
    Vue.component('fvContent', fvContent);
    Vue.component('fvHeader', fvHeader);
    Vue.component('fvFooter', fvFooter);
    Vue.component('fvSidebar', fvSidebar);
    Vue.component('fvSelect', fvSelect);
    Vue.component('fvDatepicker', fvDatepicker);
    Vue.component('fvMenu', fvMenu);
    Vue.component('fvInput', fvInput);
    Vue.component('fvButton', fvButton);
    Vue.component('fvFilepicker', fvFilepicker);
    Vue.component('fvSwitch', fvSwitch);
  }
};
module.exports = framevuerk;