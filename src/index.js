import {name, version} from '../package.json'
import './style.scss'
import utility from './utility'

// Components
import fvMain from './components/fvMain.vue'
import fvContent from './components/fvContent.vue'
import fvHeader from './components/fvHeader.vue'
import fvFooter from './components/fvFooter.vue'
import fvSidebar from './components/fvSidebar.vue'
import fvSelect from './components/fvSelect.vue'
import fvDatepicker from './components/fvDatepicker.vue'
import fvList from './components/fvList.vue'
import fvMenu from './components/fvMenu.vue'
import fvInput from './components/fvInput.vue'
import fvButton from './components/fvButton.vue'
import fvFilepicker from './components/fvFilepicker.vue'
import fvSwitch from './components/fvSwitch.vue'
import fvDialog from './components/fvDialog.vue'
import fvTable from './components/fvTable.vue'
import fvTabs from './components/fvTabs.vue'
import fvRadio from './components/fvRadio.vue'
import fvTextarea from './components/fvTextarea.vue'
// Directives
import fvScroll from './directives/fvScroll.vue'

const framevuerk = {
  _dependencies: utility._dependencies,
  use (lib = null) {
    if (lib && (lib.name === 'jMoment' || lib.name === 'moment')) {
      utility._dependencies.moment = lib
      this._dependencies.moment = lib
    }
  },
  install (Vue) {
    // Components
    Vue.component('fvMain', fvMain)
    Vue.component('fvContent', fvContent)
    Vue.component('fvHeader', fvHeader)
    Vue.component('fvFooter', fvFooter)
    Vue.component('fvSidebar', fvSidebar)
    Vue.component('fvSelect', fvSelect)
    Vue.component('fvDatepicker', fvDatepicker)
    Vue.component('fvList', fvList)
    Vue.component('fvMenu', fvMenu)
    Vue.component('fvInput', fvInput)
    Vue.component('fvButton', fvButton)
    Vue.component('fvFilepicker', fvFilepicker)
    Vue.component('fvSwitch', fvSwitch)
    Vue.component('fvDialog', fvDialog)
    Vue.component('fvTable', fvTable)
    Vue.component('fvTabs', fvTabs)
    Vue.component('fvRadio', fvRadio)
    Vue.component('fvTextarea', fvTextarea)
    // Directives
    Vue.directive('fvScroll', fvScroll)
  },
  version,
  name
}
export default framevuerk
