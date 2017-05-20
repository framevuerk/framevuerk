# Framevuerk

> A RTL and mobile-first Vue.js framevuerk.

Framevuerk is designed to be a lightweight and RTL [Vue.js](http://vuejs.org) UI framework with a simple API.

`There is no stable api before 1.x.x :)`

## Installation

```bash
npm install framevuerk --save
```

## Usage

### CommonJS
> Make sure to include `dist/framevuerk.css` file.

```js
var Vue = require('vue');
var framevuerk = require('framevuerk');

Vue.use(framevuerk);

new Vue({
    // All framevuerk components allerdy registred.
});
```


### ES6

> Make sure to include `dist/framevuerk.css` file.

```js
import Vue from 'vue';
import framevuerk from 'framevuerk';

Vue.use(framevuerk);

new Vue({
    // All framevuerk components allerdy registred.
});
```

### Globals

First, add a stylesheet link to the Framevuerk CSS file in `dist/framevuerk.css`. Then, add a script tag pointing to `dist/framevuerk.js` _after_ adding Vue.

Example:

```html
<html>
    <head>
        ...
        <link rel="stylesheet" href="path/to/framevuerk.css">
        ...
    </head>
    <body>
        <div id="app">
            <fv-button>Hello world!</fv-button>
        </div>
        <script src="path/to/vue.js"></script>
        <script src="path/to/framevuerk.js"></script>
        <script>
            Vue.use(framevuerk);
            new Vue({
                el: '#app'
            });
        </script>
    </body>
</html>
```

