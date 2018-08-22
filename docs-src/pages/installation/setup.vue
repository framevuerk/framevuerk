<template lang="pug">
  div
    doc-description
      | First at all, you should install <b>Framevuerk</b> and of course <b>Vue</b> from terminal.
    doc-code(v-pre, title="Terminal", lang="terminal")
      = "npm install vue --save\n"
      = "npm install framevuerk --save"
    doc-description
      | And just follow the example and use it! (`commonjs` syntax and `require` also available)
    doc-code(v-pre, title="app.js", lang="javascript")
      = "// Vue package\n"
      = "import Vue from 'vue'\n\n"
      = "// Framevuerk main js file\n"
      = "import Framevuerk from 'framevuerk/dist/framevuerk.js'\n\n"
      = "// If you handle styles with webpack, import this. Else you can include this via <link rel=\"stylesheet\"> in your template\n"
      = "import 'framevuerk/dist/framevuerk.css'\n\n"
      = "// Active Framevuerk...\n"
      = "Vue.use(Framevuerk)\n\n"
      = "// Initializing app\n"
      = "const app = new Vue({\n"
      = "  el: \"#app\"\n"
      = "});"
    doc-description
      | Finally you need to create your template just like this.
    doc-code(v-pre, title="index.html", lang="html")
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
      div.fv-margin
      fv-button.fv-block(icon="fa fa-long-arrow-right", @click="$router.push('/installation=customize')") Next
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
