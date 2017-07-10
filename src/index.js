import { name, version } from '../package.json'
import './style.scss'
import utility from './utility'

// Components
import fvMain from './components/fvMain'
import fvContent from './components/fvContent'
import fvHeader from './components/fvHeader'
import fvFooter from './components/fvFooter'
import fvSidebar from './components/fvSidebar'
import fvSelect from './components/fvSelect'
import fvDatepicker from './components/fvDatepicker'
import fvList from './components/fvList'
import fvMenu from './components/fvMenu'
import fvInput from './components/fvInput'
import fvButton from './components/fvButton'
import fvFilepicker from './components/fvFilepicker'
import fvSwitch from './components/fvSwitch'
import fvDialog from './components/fvDialog'
import fvTable from './components/fvTable'
import fvTabs from './components/fvTabs'
import fvRadio from './components/fvRadio'
import fvTextarea from './components/fvTextarea'
// Directives
import fvScroll from './directives/fvScroll'

const framevuerk = {
  use (lib = null) {
    if (lib && (lib.name === 'jMoment' || lib.name === 'moment')) {
      utility._dependencies.moment = lib
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
module.exports = framevuerk
