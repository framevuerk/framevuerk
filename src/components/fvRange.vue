<template lang="pug">
  .fv-range(:disabled="disabled",
    :invalid="!fvValidate",
    @click.left="onClick")
    .filler(ref="filler")
    .handler(v-for="i in filteredValue.length",
      :tabindex="disabled? '' : 0",
      ref="handler",
      :key="i",
      @focus="onHandlerFocus(i - 1)",
      @mousedown="moveStart($event, i - 1)",
      @touchstart="moveStart($event, i - 1)",
      @keydown="onKeydown($event, i - 1)",
      @click="onHandlerFocus(i - 1)")
</template>

<script>
export default {
  props: {
    value: {
      required: true
    },
    data: {
      type: [Array, Object], // [1,2,3,...] or {from:1, to: 99}
      default: () => {
        return {
          from: 1,
          to: 10
        }
      },
      validator: (value) => {
        if (value instanceof Array || (value === Object(value) && typeof value.from === 'number' && typeof value.to === 'number' && value.from < value.to)) {
          return true
        }
        return false
      }
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
      height: 0,
      blockStart: process.env.direction === 'ltr' ? 'left' : 'right',
      blockEnd: process.env.direction === 'ltr' ? 'right' : 'left',
      selectedHandler: -1
    }
  },
  computed: {
    fvValidate () {
      if (this.required === true) {
        return typeof this.value !== 'undefined'
      } else if (typeof this.required === 'function') {
        return this.required(this.value)
      }
      return true
    },
    filteredValue () {
      if (this.multiple) {
        return this.value
      } else {
        return [this.value]
      }
    },
    dataLength () {
      if (this.data instanceof Array) {
        return this.data.filter((item, i, arr) => arr.indexOf(item) === i).length
      } else if (this.data === Object(this.data)) {
        return (this.data.to - this.data.from) + 1
      }
    },
    stepWidth () {
      return 100 / (this.dataLength - 1)
    },
    filteredData () {
      let ret = []
      if (this.data instanceof Array) {
        for (let index = 0; index < this.dataLength; index++) {
          ret.push({
            x: this.stepWidth * index,
            value: this.data[index]
          })
          ret = ret.filter((item, i, arr) => arr.indexOf(item) === i)
        }
      } else if (this.data === Object(this.data)) {
        let index = 0
        for (let value = this.data.from; value <= this.data.to; value++ && index++) {
          ret.push({
            x: this.stepWidth * index,
            value
          })
        }
      }
      return ret
    }
  },
  created () {
    this.setStructure()
  },
  mounted () {
    this.$nextTick(() => {
      this.setValue(this.filteredValue[0], 0)
      if (this.multiple) {
        this.setValue(this.filteredValue[1], 1)
      }
    })
  },
  methods: {
    setStructure () {
      const set = () => {
        if (this.multiple) {
          this.$emit('input', [this.filteredData[0].value, this.filteredData[this.dataLength - 1].value])
        } else {
          this.$emit('input', this.filteredData[0].value)
        }
      }
      if (this.multiple && (typeof this.value === 'undefined' || !(this.value instanceof Array))) {
        set()
      }
      for (let val of this.filteredValue) {
        if (this.filteredData.findIndex(item => item.value === val) === -1) {
          set()
          break
        }
      }
    },
    focus (handlerIndex = -1) {
      if (this.disabled) {
        return
      }
      this.selectedHandler = handlerIndex < 0 ? 0 : handlerIndex
      this.$refs.handler[this.selectedHandler].focus()
    },
    onKeydown (event, handlerIndex) {
      const currentValue = this.filteredValue[handlerIndex]
      const index = this.filteredData.findIndex(fd => JSON.stringify(fd.value) === JSON.stringify(currentValue))
      switch (event.which) {
        case process.env.direction === 'ltr' ? 37 : 39: // 37: left, 39: right,
          if (index === 0) {
            return
          }
          this.setValue(this.filteredData[index - 1].value, handlerIndex)
          break
        case process.env.direction === 'ltr' ? 39 : 37: // 37: left, 39: right,
          if (index === this.dataLength - 1) {
            return
          }
          this.setValue(this.filteredData[index + 1].value, handlerIndex)
          break
      }
    },
    onHandlerFocus (handlerIndex) {
      if (this.disabled) {
        return
      }
      this.selectedHandler = handlerIndex
    },
    moveStart (event, handlerIndex) {
      if (this.disabled) {
        return
      }
      event.preventDefault()
      this.focus(handlerIndex)
      this.bindEvents()
    },
    moveEnd (event) {
      event.preventDefault()
      this.focus(this.selectedHandler)
      const x = parseInt(this.$refs.handler[this.selectedHandler].style[this.blockStart])
      const value = this.calcValueByX(x)
      if (typeof value === 'undefined') {
        this.unbindEvents()
        return
      }
      this.setValue(value, this.selectedHandler)
      this.unbindEvents()
    },
    onClick (event) {
      if (this.disabled) {
        return
      }
      const x = this.calcXByEvent(event)
      const value = this.calcValueByX(x)
      const handlerIndex = this.multiple && value >= this.filteredValue[1] ? 1 : 0
      this.focus(handlerIndex)
      this.setValue(this.calcValueByX(x), handlerIndex)
    },
    handlerFocus (handlerIndex) {
      if (this.disabled) {
        return
      }
      this.selectedHandler = handlerIndex
    },
    moving (event) {
      if (this.selectedHandler === -1 || this.disabled) {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      this.focus(this.selectedHandler)
      const x = this.calcXByEvent(event)
      this.setValue(this.calcValueByX(x), this.selectedHandler)
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
    setValue (value, handlerIndex) {
      let ret = this.filteredValue
      ret[handlerIndex] = value
      ret.sort((a, b) => a >= b ? 1 : -1)

      if (ret.length > 1) {
        this.$refs.filler.style[this.blockStart] = `${this.calcXByValue(ret[0])}%`
        this.$refs.filler.style[this.blockEnd] = `${100 - this.calcXByValue(ret[1])}%`
        this.$refs.handler[0].style[this.blockStart] = `${this.calcXByValue(ret[0])}%`
        this.$refs.handler[1].style[this.blockStart] = `${this.calcXByValue(ret[1])}%`
        this.$emit('input', ret)
      } else {
        this.$refs.filler.style[this.blockStart] = `0%`
        this.$refs.filler.style[this.blockEnd] = `${100 - this.calcXByValue(ret[0])}%`
        this.$refs.handler[0].style[this.blockStart] = `${this.calcXByValue(value)}%`
        this.$emit('input', ret[0])
      }
    },
    calcXByEvent (event) {
      let x = event.changedTouches && event.changedTouches.length ? event.changedTouches[0].clientX : (event.pageX - 0)
      x -= this.$el.getBoundingClientRect().x
      const width = this.$el.offsetWidth
      x *= (100 / width) // convert to percetange
      x = this.blockStart === 'right' ? 100 - x : x
      return x
    },
    calcValueByX (x) {
      for (let i = 0; i < this.dataLength; i++) {
        if (x >= 100) {
          return this.filteredData[this.filteredData.length - 1].value
        } else if (x <= 0) {
          return this.filteredData[0].value
        } else if (x >= this.filteredData[i].x - (this.stepWidth / 2) && x < this.filteredData[i].x + (this.stepWidth / 2)) {
          return this.filteredData[i].value
        }
      }
    },
    calcXByValue (value) {
      return this.filteredData.find(fd => JSON.stringify(fd.value) === JSON.stringify(value)).x
    }
  }
}

</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-range {
  @include shadow(inset-bottom);

  background: $bg-color-dark;
  border: solid 1px $shadow-color;
  padding: 0;
  position: relative;
  height: 0.8em;
  border-radius: 0.4em;
  margin: 1em 1em;

  & .filler {
    margin: 0;
    position: absolute;
    width: auto;
    height: 100%;
    background: $primary-color-light;
    border-radius: 0.4em;
  }

  & > .handler {
    @include shadow(bottom, $shadow-color);

    padding: 0;
    height: 2em;
    width: 2em;
    top: -0.6em;
    display: inline-block;
    position: absolute;
    border-radius: 1em;
    background: $bg-color-light;
    border: solid 1px $shadow-color;
    box-shadow: 0 1px 4px $shadow-color;
    // margin-#{$block-start}: -1em;
    cursor: move;

    &:focus {
      @include outline;
    }
  }

  &[disabled] {
    @include disabled;
  }

  &[invalid] {
    & > .handler:focus {
      @include outline($danger-color);
    }
  }
}
</style>
