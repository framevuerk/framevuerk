# Framevuerk

> Awesome fully responsive Vue.js framevuerk!

Framevuerk is designed to be a lightweight and both rtl and ltr support and multi-language [Vue.js](http://vuejs.org) UI framework with a simple API.

## Setup
First at all, you should install `Framevuerk` and of course `Vue` from terminal.

```terminal
npm install vue --save
npm install framevuerk --save
```

You can also install these, just if you want active touch actions support, `fvDatepicker` component and icons.
```terminal
npm install moment --save
npm install hammerjs --save
npm install font-awesome --save
```

And just follow the example and use it! (`commonjs` syntax and `require` also available)

```javascript
// Vue package
import Vue from 'vue'

// Framevuerk main js file
import Framevuerk from 'framevuerk/dist/framevuerk.js'

// If you handle styles with webpack, import this. Else you can include this via <link rel="stylesheet">
import 'framevuerk/dist/framevuerk.css'

// PersianDate package, just if you want active more features for fvDatepicker
import PersianDate from 'persian-date'
Framevuerk.use('persian-date', PersianDate)

// Hammer package, just if you want active touch actions support
import Hammer from 'hammerjs'
Framevuerk.use('hammer', Hammer)

// Font-Awesome icons, just if you want active icons
// If you handle styles with webpack, import this. Else you can include this via <link rel="stylesheet">
import 'font-awesome/css/font-awesome.css' //if you handled with webpack, else you can include this via <link rel="stylesheet">

// Active Framevuerk...
Vue.use(Framevuerk)

// And finally, Initializing app
const app = new Vue({
  el: "#app"
});"
```

Finally you need to create your template just like this.

```html
<html>
  <head>
    <link rel="stylesheet" href="path/to/your/app.css"/>
  </head>
  <body>
    <fv-main id="app">
      <!-- Your Content -->
    </fv-main>
    <script src="path/to/your/app.js"></script>
  </body>
</html>
```

## Customize

Framevuerk can have different language, direction, and colors based on the user's taste. To setup your custom version, create a file called `.framevuerkrc.js` in root of your project and put these on:

```javascript
module.export = {
  // config name
  'config-name': 'foobar',

  // your locale and direction.
  locale: 'en', // or 'fa'
  direction: 'ltr', // or 'rtl'

  // theme colors:
  'primary-color': '#41b883',
  'danger-color': '#dd4b39',
  'warning-color': '#ef8f00',
  'info-color': '#14b0cf',
  'bg-color': '#f9f9f9',

  // base padding size
  padding: '15px',

  // base animation speed
  'transition-speed': '0.35s',

  // base border radius applied to buttons, inputs and etc.
  'border-radius': '4px',

  // base shadow size applied to header, footer, form elements and etc.
  'shadow-size': '3px'
}
```

And output files goes to `./node_modules/framevuerk/dist` directory:

- framevuerk-foobar.js
- framevuerk-foobar.css
- framevuerk-foobar.min.js
- framevuerk-foobar.min.css

You can also use `.framevuerkrc.json`, `.framevuerkrc` or `framevuerk` key inside your `package.json` to pass this variables to Framevuerk!

Framevuerk apply these config on before every install or by this cli command:
```terminal
framevuerk build lib
# or
./node_modules/.bin/framevuerk build lib
```
    
You are now config your app to use `Framevuerk`! Let's go to use our components:
[Full Documention and Demo](http://framevuerk.com)


`Please do not use this before 1.x.x version for production! It is still under development!`