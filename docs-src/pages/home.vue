<template lang="pug">
  .logo-container(:class="{ready: ready}", style="opacity: 0")
    img.logo(src="../assets/logo.svg")
    .sp
    .logo-text
      h1 Framevuerk
      p <b>Responsive</b>, <b>Multi Language</b>, <b>Both Direction Support</b> and <b>Configurable</b> UI Framework based on <a class="fv-link" href="http://vuejs.org" target="_blank">Vue.js</a>.
      router-link.get-started(to="/installation=setup") GET STARTED
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
      this.ready = true
    }, 250)
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
  width: 11em;
  transform: rotateY(180deg);
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

.logo-container * {
  transition: all 1s;
}

.logo-container,
.logo-container.ready * {
  transform: translate(0) rotate(0deg) !important;
  opacity: 1 !important;
}
</style>
