<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | Framevuerk can have different language, direction, and colors based on the user's taste. To setup your custom version, create a file called <b>.framevuerkrc.js</b> in root of your project and put these on:
    doc-code(v-pre, title=".framevuerkrc.js:", lang="javascript")
      ="module.export = {\n"
      ="\t// config name\n"
      ="\t'config-name': 'foobar',\n\n"
      ="\t// your locale and direction.\n"
      ="\tlocale: 'en', // or 'fa'\n"
      ="\tdirection: 'ltr', // or 'rtl'\n\n"
      ="\t// theme colors:\n"
      ="\t'primary-color': '#41b883',\n"
      ="\t'danger-color': '#dd4b39',\n"
      ="\t'warning-color': '#ef8f00',\n"
      ="\t'info-color': '#14b0cf',\n"
      ="\t'bg-color': '#f9f9f9',\n\n"
      ="\t// base padding size\n"
      ="\tpadding: '15px',\n\n"
      ="\t// base animation speed\n"
      ="\t'transition-speed': '0.35s',\n\n"
      ="\t// base border radius applied to buttons, inputs and etc.\n"
      ="\t'border-radius': '4px',\n\n"
      ="\t// base shadow size applied to header, footer, form elements and etc.\n"
      ="\t'shadow-size': '3px'\n"
      ="}"
    doc-description
    | And output files goes to <b>dist</b> directory:
    doc-code(v-pre, title="framevuerk/dist", lang="javascript")
      ="framevuerk-foobar.js\n"
      ="framevuerk-foobar.min.js\n"
      ="framevuerk-foobar.css\n"
      ="framevuerk-foobar.min.css\n"
    doc-description
      | You can also use <b>.framevuerkrc.json</b>, <b>.framevuerkrc</b> or <b>framevuerk</b> key inside your package.json to pass this variables to Framevuerk!
      | <br> Framevuerk apply these config on before every install or by this cli command:
    doc-code(v-pre, title=" ", lang="terminal")
      ="framevuerk build lib\n"
      ="# or\n"
      ="./node_modules/.bin/framevuerk build lib\n"
    doc-description
    | You are now config your app to use <b>Framevuerk</b>! Let's go to use our components.
</template>

<script>
import docDescription from '../../components/docDescription.vue'
import docCode from '../../components/docCode.vue'

export default {
  components: {
    docDescription,
    docCode
  }
}
</script>
