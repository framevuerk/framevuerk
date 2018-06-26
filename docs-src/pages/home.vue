<template lang="pug">
  .logo-container
    .logo(:class="{ready: ready}", v-html="require('../assets/logo.svg')")
    .sp
    .logo-text
      h1 Framevuerk
      p <b>Fast</b>, <b>Responsive</b>, <b>Multi Language</b>, <b>Both Direction Support</b> and <b>Configurable</b> UI Framework based on <a class="fv-link" href="http://vuejs.org" target="_blank">Vue.js</a>.
      router-link.fv-link.get-started(to="/installation=setup") GET STARTED
      a.github(:href="$root.githubRepo", target="_blank") GITHUB
</template>

<script>
export default {
  data () {
    return {
      ready: false
    }
  },
  mounted () {
    setTimeout(() => {
      this.ready = !this.ready
    }, 300)
  }
}
</script>

<style lang="scss">
.logo-container {
  margin-top: 5.5em;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 19em;
  & svg {
    max-width: 100%;
    height: auto;
    & polygon {
      transform: translateY(-100%);
      transition-duration: 2s;
    }
    & path {
      fill: transparent;
      transition-delay: 0.6s;
      transition-duration: 1s;
    }
  }
  &.ready {
    & svg {
      & polygon {
        transform: translateY(0);
        fill: #41B883;
      }
      & path {
        stroke: transparent;
        stroke-width: 0;
        fill: #35495E;
      }
    }
  }
}
.sp {
  height: 1px;
  display: inline-block;
  width: 14em;
  background: rgba(0, 0, 0, 0.1);
  margin: 2em 0;
}

.logo-text {
  line-height: 2.35em;
}

.logo-text h1 {
  margin: 0;
  font-size: 2.3em;
}

.logo-text p {
  margin: 0;
  font-size: 1em;
}

.get-started {
  font-size: 1.1em;
  cursor: pointer;
  color: #41b883;
  font-weight: bold;
  margin-right: 1em;
}

.github {
  font-size: 1.1em;
  cursor: pointer;
  color: #35495e;
  font-weight: bold;
}

</style>
