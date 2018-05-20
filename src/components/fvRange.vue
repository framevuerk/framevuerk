<template lang="pug">
div
  div {{filteredData}}
  div {{width}}
  div {{inlineWidth}}
  div {{filteredValue}}
  .fv-range(
      zclick="focus")
    .step(v-for="step in filteredData", :style="{left: step.x + 'px'}", :title="step.value")
    .filler(ref="filler")
    .handler(v-for="i in filteredValue.length",
      ref="handler",
      :key="i",
      @mousedown="moveStart($event, i - 1)",
      @mouseup="moveEnd($event, selectedHandler)",
      zmousemove="moving($event, movingHandler)",
      @touchstart="moveStart($event, i - 1)",
      @mousemove.stop="",
      ztouchmove="moving($event, i - 1)",
      @touchend="moveEnd($event, movingHandler)"
      tabindex="0")
</template>

<script>
import utility from '../utility'

export default {
  props: {
    value: {
      type: [Array, Number],
      default: 0
    },
    data: {
      type: [Array, Object], // [1,2,3,...] or {from:1, to: 99}
      default: () => [1,2,3,4,5,6]
    },
    multiple: {
      type: Boolean,
      default: false
    },
    required: {
      type: [Boolean, Function],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      width: 0,
      isMoving: false,
      handlerTempPosition: [0, 0],
      selectedHandler: 0,
      movingHandler: -1
    }
  },
  computed: {
    fvValidate () {
      if (this.required === true) {
        return this.value === this.onValue
      } else if (typeof this.required === 'function') {
        return this.required(this.value)
      }
      return true
    },
    inlineWidth () {
      return this.width - this.height
    },
    filteredValue () {
      if (this.multiple) {
        return this.value
      } else {
        return [this.value]
      }
    },
    stepWidth () {
      return (this.inlineWidth / (this.data.length - 1))
    },
    filteredData () {
      const ret = []
      
      for(let index = 0; index < this.data.length; index++) {
        ret.push({
          x: this.stepWidth * index,
          value: this.data[index]
        })
      }
      return ret
    },
    handlerPosition () {
      return this.filteredValue.map(fvalue => {
        const filteredDataItem = this.filteredData.find(fd => fd.value === fvalue)
        return `${(filteredDataItem ? filteredDataItem.x : 0)}px`
      })
    }
  },
  mounted () {
    utility.doIt(()=>{
      this.width = this.$el.offsetWidth
      this.height = this.$refs.handler[0].offsetHeight
      if (this.multiple) {
        this.setValue(this.value[0], 0)
        this.setValue(this.value[1], 1)
      }
    })
  },
  methods: {
    focus() {
      this.$refs.handler[this.selectedHandler].focus()
    },  
    moveStart (event, handlerIndex) {
      event.preventDefault()
      console.log('move start by', event.type, handlerIndex)
      this.movingHandler = handlerIndex
      this.selectedHandler = handlerIndex
      this.bindEvents()
      

    },
    moveEnd (event) {
      event.preventDefault()
      console.log('move end by', event.type, this.selectedHandler)
      const x = parseInt(this.$refs.handler[this.selectedHandler].style.left)
      const value = this.calcValueByX(x)
      
      this.setValue(value, this.selectedHandler)
      this.unbindEvents()
      this.movingHandler = -1
      this.selectedHandler = 0
    },
    moving (event) {
      event.preventDefault()
      if (this.movingHandler === -1) {
        return
      }
      console.log('move ing by', event.type, this.movingHandler)
      event.stopPropagation()
      let x = event.changedTouches && event.changedTouches.length ? event.changedTouches[0].clientX: event.screenX
      x-=this.$el.getBoundingClientRect().x
      x = x > this.inlineWidth ? this.inlineWidth : x
      x = x < 0 ? 0 : x

      this.setValue(this.calcValueByX(x), this.movingHandler)
    },
    bindEvents () {
      document.body.addEventListener('mousemove', this.moving)
      document.body.addEventListener('touchmove', this.moving)
      document.body.addEventListener('mouseup', this.moveEnd)
      document.body.addEventListener('touchend', this.moveEnd)
    },
    unbindEvents () {
      document.body.removeEventListener('mousemove', this.moving)
      document.body.removeEventListener('touchmove', this.moving)
      document.body.removeEventListener('mouseup', this.moveEnd)
      document.body.removeEventListener('touchend', this.moveEnd)
    },
    setValue(value, handlerIndex, emit = true) {
      let ret = this.filteredValue
      ret[handlerIndex] = value
      ret.sort((a, b) => a >= b ? 1 : -1)

      let left
      let right
      
      if (ret.length > 1) {
        this.$refs.filler.style.left = `${this.calcXByValue(ret[0])}px`
        this.$refs.filler.style.right = `${this.width - this.calcXByValue(ret[1])}px`
        this.$refs.handler[0].style.left = `${this.calcXByValue(ret[0])}px`
        this.$refs.handler[1].style.left = `${this.calcXByValue(ret[1])}px`
        this.$emit('input', ret)
      } else {
        this.$refs.filler.style.left = `0px`
        this.$refs.filler.style.right = `${this.width - this.calcXByValue(ret[0])}px`
        this.$refs.handler[0].style.left = `${this.calcXByValue(value)}px`
        this.$emit('input', ret[0])
      }
    },
    calcValueByX(x){
      for (const i = 0; i < this.filteredData.length; i++) {
        if (x >= this.filteredData[i].x - (this.stepWidth / 2) && x < this.filteredData[i].x + (this.stepWidth / 2)) {
          return this.filteredData[i].value
        }
      }
    },
    calcXByValue(value){
      return this.filteredData.find(fd => JSON.stringify(fd.value) === JSON.stringify(value)).x
    }
  }
}

</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-range {
  // @include shadow(inset-bottom, $shadow-color);

  background: $bg-color-dark;
  border: solid 1px $shadow-color;
  padding: 0;
  position: relative;
  height: 0.5em;
  border-radius: 0.3em;
  margin: 0.9em 0;

  & .step {
    width: 1px;
    margin-left: 1em;
    display: block;
    position: absolute;
    top: 0;
    height: 100%;
    background: $shadow-color;
  }
  & .filler {
    margin: 0;
    display: block;
    position: absolute;
    width: auto;
    height: 100%;
    background: $primary-color;
    border-radius: 0.3em;
  }

  & > .handler {
    @include shadow(bottom, $shadow-color);

    margin: 0 -1px;
    padding: 0;
    height: 2em;
    width: 2em;
    top: -0.75em;
    display: inline-block;
    position: absolute;
    border-radius: 1em;
    background: $bg-color-light;
    border: solid 1px $shadow-color;
    box-shadow: 0 1px 4px $shadow-color;

    // transition-duration: $transition-speed;
    // transition-property: left;

    &:focus {
      @include outline;
    }
  }


  &[disabled] {
    @include disabled;
  }
}
</style>
