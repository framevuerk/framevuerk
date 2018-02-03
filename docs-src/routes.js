module.exports = function (mode) {
  return [
    {
      name: 'Home',
      path: '/',
      component: mode === 'app' ? require('./pages/home.vue').default : null
    },
    {
      name: 'Setup',
      path: '/installation=setup',
      component: mode === 'app' ? require('./pages/installation/setup.vue').default : null
    },
    {
      name: '.framevuerkrc',
      path: '/installation=.framevuerkrc',
      component: mode === 'app' ? require('./pages/installation/.framevuerkrc.vue').default : null
    },
    {
      name: 'fvMain',
      path: '/components=fvMain',
      component: mode === 'app' ? require('./pages/components/fvMain.vue').default : null
    },
    {
      name: 'fvHeader',
      path: '/components=fvHeader',
      component: mode === 'app' ? require('./pages/components/fvHeader.vue').default : null
    },
    {
      name: 'fvSidebar',
      path: '/components=fvSidebar',
      component: mode === 'app' ? require('./pages/components/fvSidebar.vue').default : null
    },
    {
      name: 'fvContent',
      path: '/components=fvContent',
      component: mode === 'app' ? require('./pages/components/fvContent.vue').default : null
    },
    {
      name: 'fvFooter',
      path: '/components=fvFooter',
      component: mode === 'app' ? require('./pages/components/fvFooter.vue').default : null
    },
    {
      name: 'fvDialog',
      path: '/components=fvDialog',
      component: mode === 'app' ? require('./pages/components/fvDialog.vue').default : null
    },
    {
      name: 'fvMenu',
      path: '/components=fvMenu',
      component: mode === 'app' ? require('./pages/components/fvMenu.vue').default : null
    },
    {
      name: 'fvButton',
      path: '/components=fvButton',
      component: mode === 'app' ? require('./pages/components/fvButton.vue').default : null
    },
    {
      name: 'fvInput',
      path: '/components=fvInput',
      component: mode === 'app' ? require('./pages/components/fvInput.vue').default : null
    },
    {
      name: 'fvTextarea',
      path: '/components=fvTextarea',
      component: mode === 'app' ? require('./pages/components/fvTextarea.vue').default : null
    },
    {
      name: 'fvSelect',
      path: '/components=fvSelect',
      component: mode === 'app' ? require('./pages/components/fvSelect.vue').default : null
    },
    {
      name: 'fvDatepicker',
      path: '/components=fvDatepicker',
      component: mode === 'app' ? require('./pages/components/fvDatepicker.vue').default : null
    },
    {
      name: 'fvSwitch',
      path: '/components=fvSwitch',
      component: mode === 'app' ? require('./pages/components/fvSwitch.vue').default : null
    },
    {
      name: 'fvCheck',
      path: '/components=fvCheck',
      component: mode === 'app' ? require('./pages/components/fvCheck.vue').default : null
    },
    {
      name: 'fvFilepicker',
      path: '/components=fvFilepicker',
      component: mode === 'app' ? require('./pages/components/fvFilepicker.vue').default : null
    },
    {
      name: 'fvForm',
      path: '/components=fvForm',
      component: mode === 'app' ? require('./pages/components/fvForm.vue').default : null
    },
    {
      name: 'fvTable',
      path: '/components=fvTable',
      component: mode === 'app' ? require('./pages/components/fvTable.vue').default : null
    },
    {
      name: 'fvImg',
      path: '/components=fvImg',
      component: mode === 'app' ? require('./pages/components/fvImg.vue').default : null
    },
    {
      name: 'fvSlider',
      path: '/components=fvSlider',
      component: mode === 'app' ? require('./pages/components/fvSlider.vue').default : null
    },
    {
      name: 'fvList-fvListItem',
      path: '/components=fvList-fvListItem',
      component: mode === 'app' ? require('./pages/components/fvList-fvListItem.vue').default : null
    },
    {
      name: 'fvToast',
      path: '/components=fvToast',
      component: mode === 'app' ? require('./pages/components/fvToast.vue').default : null
    },
    {
      name: 'fvRow-fvCol',
      path: '/styles=fvRow-fvCol',
      component: mode === 'app' ? require('./pages/styles/fvRow-fvCol.vue').default : null
    }
  ]
}
