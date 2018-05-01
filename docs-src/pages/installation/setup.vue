<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | First at all, you should install <b>Framevuerk</b> and of course <b>Vue</b> from terminal.
    doc-code(v-pre, title=" ", lang="terminal")
      = "npm install vue --save\n"
      = "npm install framevuerk --save"
    doc-description
      | You can also install these, just if you want active touch actions support, `fvDatepicker` jalaali dates supoort and icons.
    doc-code(v-pre, title=" ", lang="terminal")
      = "npm install idate --save\n"
      = "npm install hammerjs --save\n"
      = "npm install font-awesome --save"
    doc-description
      | And just follow the example and use it! (`commonjs` syntax and `require` also available)
    doc-code(v-pre, title=" ", lang="javascript")
      = "// Vue package\n"
      = "import Vue from 'vue'\n\n"
      = "// Framevuerk main js file\n"
      = "import Framevuerk from 'framevuerk/dist/framevuerk.js'\n\n"
      = "// If you handle styles with webpack, import this. Else you can include this via <link rel=\"stylesheet\">\n"
      = "import 'framevuerk/dist/framevuerk.css'\n\n"
      = "// IDate package, just if you want globally support jalaali dates for fvDatepicker\n"
      = "import IDate from 'idate'\n"
      = "Framevuerk.use('date', IDate)\n\n"
      = "// Hammer package, just if you want active touch actions support\n"
      = "import Hammer from 'hammerjs'\n"
      = "Framevuerk.use('hammer', Hammer)\n\n"
      = "// Font-Awesome icons, just if you want active icons\n"
      = "// If you handle styles with webpack, import this. Else you can include this via <link rel=\"stylesheet\">\n"
      = "import 'font-awesome/css/font-awesome.css'\n\n"
      = "// Active Framevuerk...\n"
      = "Vue.use(Framevuerk)\n\n"
      = "// Initializing app\n"
      = "const app = new Vue({\n"
      = "  el: \"#app\"\n"
      = "});"
    doc-description
      | Finally you need to create your template just like this.
    doc-code(v-pre, title="Template:", lang="html")
      = "<html>\n"
      = "\t<head>\n"
      = "\t\t<link rel=\"stylesheet\" href=\"path/to/your/app.css\"/>\n"
      = "\t</head>\n"
      = "\t<body>\n"
      = "\t\t<fv-main id=\"app\">\n"
      = "\t\t\t<!-- Your Content -->\n"
      = "\t\t</fv-main>\n"
      = "\t\t<script src=\"path/to/your/app.js\"></script>\n"
      = "\t</body>\n"
      = "</html>\n"
    doc-description
      a.fv-link(href="https://jsfiddle.net/nainemom/vhLkyg5u/", target="_blank") Simple Example

    fv-button.fv-sm.fv-block(icon="fa fa-long-arrow-right", @click="$router.push('/installation=customize')") Next
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
