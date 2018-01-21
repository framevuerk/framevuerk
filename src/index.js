// import { name, version } from '../package.json'
import './style.scss'
import utility from './utility'
/* global PKG_NAME, PKG_VERSION */

// Components
import fvMain from './components/fvMain'
import fvContent from './components/fvContent'
import fvHeader from './components/fvHeader'
import fvFooter from './components/fvFooter'
import fvSidebar from './components/fvSidebar'
import fvForm from './components/fvForm'
import fvSelect from './components/fvSelect'
import fvDatepicker from './components/fvDatepicker'
import fvList from './components/fvList'
import fvListItem from './components/fvListItem'
import fvMenu from './components/fvMenu'
import fvInput from './components/fvInput'
import fvButton from './components/fvButton'
import fvFilepicker from './components/fvFilepicker'
import fvSwitch from './components/fvSwitch'
import fvDialog from './components/fvDialog'
import fvTable from './components/fvTable'
import fvCheck from './components/fvCheck'
import fvTextarea from './components/fvTextarea'
import fvImg from './components/fvImg'
import fvSlider from './components/fvSlider'
import fvToast from './components/fvToast'
// Directives
import fvScroll from './directives/fvScroll'

const framevuerk = {
  fvMain,
  fvContent,
  fvHeader,
  fvFooter,
  fvSidebar,
  fvForm,
  fvSelect,
  fvDatepicker,
  fvList,
  fvListItem,
  fvMenu,
  fvInput,
  fvButton,
  fvFilepicker,
  fvSwitch,
  fvDialog,
  fvTable,
  fvCheck,
  fvTextarea,
  fvImg,
  fvSlider,
  fvToast,
  use (lib = null) {
    if (lib) {
      switch (lib.name) {
      case 'jMoment':
      case 'moment':
        utility._dependencies.moment = lib
        break
      case 'Hammer':
        utility._dependencies.hammer = lib
        break
      }
    }
  },
  install (Vue) {
    // Components
    Vue.component('fvMain', fvMain)
    Vue.component('fvContent', fvContent)
    Vue.component('fvHeader', fvHeader)
    Vue.component('fvFooter', fvFooter)
    Vue.component('fvSidebar', fvSidebar)
    Vue.component('fvForm', fvForm)
    Vue.component('fvSelect', fvSelect)
    Vue.component('fvDatepicker', fvDatepicker)
    Vue.component('fvList', fvList)
    Vue.component('fvListItem', fvListItem)
    Vue.component('fvMenu', fvMenu)
    Vue.component('fvInput', fvInput)
    Vue.component('fvButton', fvButton)
    Vue.component('fvFilepicker', fvFilepicker)
    Vue.component('fvSwitch', fvSwitch)
    Vue.component('fvDialog', fvDialog)
    Vue.component('fvTable', fvTable)
    Vue.component('fvCheck', fvCheck)
    Vue.component('fvTextarea', fvTextarea)
    Vue.component('fvImg', fvImg)
    Vue.component('fvSlider', fvSlider)
    Vue.prototype.$fvToast = new (Vue.extend(fvToast))()
    Vue.fvToast = Vue.prototype.$fvToast
    // Directives
    Vue.directive('fvScroll', fvScroll)
  },
  name: PKG_NAME,
  version: PKG_VERSION
}
module.exports = framevuerk
