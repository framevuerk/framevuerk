module.exports = function(mode){
  return [
    {
      name: 'fvGrid',
      path: '/styles/fvGrid',
      component: mode === 'app' ? require('./pages/style_fvGrid').default : null
    },
    {
      name: 'Include',
      path: '/installation/include',
      component: mode === 'app' ? require('./pages/installation_include').default : null
    },
    {
      name: 'Usage',
      path: '/installation/usage',
      component: mode === 'app' ? require('./pages/installation_usage').default : null
    },
    {
      name: 'fvMain',
      path: '/components/fvMain',
      component: mode === 'app' ? require('./pages/component_fvMain').default : null
    },
    {
      name: 'fvHeader',
      path: '/components/fvHeader',
      component: mode === 'app' ? require('./pages/component_fvHeader').default : null
    },
    {
      name: 'fvSidebar',
      path: '/components/fvSidebar',
      component: mode === 'app' ? require('./pages/component_fvSidebar').default : null
    },
    {
      name: 'fvContent',
      path: '/components/fvContent',
      component: mode === 'app' ? require('./pages/component_fvContent').default : null
    },
    {
      name: 'fvFooter',
      path: '/components/fvFooter',
      component: mode === 'app' ? require('./pages/component_fvFooter').default : null
    },
    {
      name: 'fvDialog',
      path: '/components/fvDialog',
      component: mode === 'app' ? require('./pages/component_fvDialog').default : null
    },
    {
      name: 'fvMenu',
      path: '/components/fvMenu',
      component: mode === 'app' ? require('./pages/component_fvMenu').default : null
    },
    {
      name: 'fvButton',
      path: '/components/fvButton',
      component: mode === 'app' ? require('./pages/component_fvButton').default : null
    },
    {
      name: 'fvInput',
      path: '/components/fvInput',
      component: mode === 'app' ? require('./pages/component_fvInput').default : null
    },
    {
      name: 'fvTextarea',
      path: '/components/fvTextarea',
      component: mode === 'app' ? require('./pages/component_fvTextarea').default : null
    },
    {
      name: 'fvSelect',
      path: '/components/fvSelect',
      component: mode === 'app' ? require('./pages/component_fvSelect').default : null
    },
    {
      name: 'fvDatepicker',
      path: '/components/fvDatepicker',
      component: mode === 'app' ? require('./pages/component_fvDatepicker').default : null
    },
    {
      name: 'fvSwitch',
      path: '/components/fvSwitch',
      component: mode === 'app' ? require('./pages/component_fvSwitch').default : null
    },
    {
      name: 'fvCheck',
      path: '/components/fvCheck',
      component: mode === 'app' ? require('./pages/component_fvCheck').default : null
    },
    {
      name: 'fvFilepicker',
      path: '/components/fvFilepicker',
      component: mode === 'app' ? require('./pages/component_fvFilepicker').default : null
    },
    {
      name: 'fvForm',
      path: '/components/fvForm',
      component: mode === 'app' ? require('./pages/component_fvForm').default : null
    },
    {
      name: 'fvTable',
      path: '/components/fvTable',
      component: mode === 'app' ? require('./pages/component_fvTable').default : null
    },
    {
      name: 'fvImg',
      path: '/components/fvImg',
      component: mode === 'app' ? require('./pages/component_fvImg').default : null
    },
    {
      name: 'fvSlider',
      path: '/components/fvSlider',
      component: mode === 'app' ? require('./pages/component_fvSlider').default : null
    },
    {
      name: 'fvList + fvListItem',
      path: '/components/fvList+fvListItem',
      component: mode === 'app' ? require('./pages/component_fvList + fvListItem').default : null
    },
    {
      name: 'fvToast',
      path: '/components/fvToast',
      component: mode === 'app' ? require('./pages/component_fvToast').default : null
    },
    {
      name: 'notfound',
      path: '/*'
    }
  ]
}