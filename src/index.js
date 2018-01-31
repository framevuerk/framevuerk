import './style.scss'
import utility from './utility'

// Components
import fvMain from './components/fvMain.vue'
import fvContent from './components/fvContent.vue'
import fvHeader from './components/fvHeader.vue'
import fvFooter from './components/fvFooter.vue'
import fvSidebar from './components/fvSidebar.vue'
import fvForm from './components/fvForm.vue'
import fvSelect from './components/fvSelect.vue'
import fvDatepicker from './components/fvDatepicker.vue'
import fvList from './components/fvList.vue'
import fvListItem from './components/fvListItem.vue'
import fvMenu from './components/fvMenu.vue'
import fvInput from './components/fvInput.vue'
import fvButton from './components/fvButton.vue'
import fvFilepicker from './components/fvFilepicker.vue'
import fvSwitch from './components/fvSwitch.vue'
import fvDialog from './components/fvDialog.vue'
import fvTable from './components/fvTable.vue'
import fvCheck from './components/fvCheck.vue'
import fvTextarea from './components/fvTextarea.vue'
import fvImg from './components/fvImg.vue'
import fvSlider from './components/fvSlider.vue'
import fvToast from './components/fvToast.vue'

module.exports = {
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
  },
  name: process.env.name,
  version: process.env.version,
  locale: process.env.locale
}