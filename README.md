# Framevuerk

> Awesome fully responsive Vue.js framevuerk!

Framevuerk is designed to be a lightweight and both rtl and ltr support [Vue.js](http://vuejs.org) UI framework with a simple API.

[Documention and Demo](http://framevuerk.com)


## Installation

`Please do not use this before 1.x.x version for production! It is still under development!`

## Installation

```bash
npm install framevuerk --save
```

## Usage

### CommonJS
```js
var Vue = require('vue');
var framevuerk = require('framevuerk');

Vue.use(framevuerk);

new Vue({
    // All framevuerk components already registred.
});
```


### ES6

```js
import Vue from 'vue';
import framevuerk from 'framevuerk';

Vue.use(framevuerk);

new Vue({
    // All framevuerk components already registred.
});
```

### Globals

Just add `path/to/framevuerk.js` to your page with `script` tag and use it!

Example:

```html
<html>
    <head>
        ...
    </head>
    <body>
        <div id="app">
            <fv-button>Hello world!</fv-button>
        </div>
        <script src="path/to/vue.js"></script>
        <script src="path/to/framevuerk-en.js"></script>
        <script>
            Vue.use(framevuerk);
            new Vue({
                el: '#app'
            });
        </script>
    </body>
</html>
```

