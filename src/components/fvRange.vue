<template lang="pug">
div
  div value: {{value}}, dataLength: {{dataLength}}, data: {{data}}
  .fv-range(vif="!iszBadStructure",
    :disabled="disabled",
    :invalid="!fvValidate",
    zwheel="wheel",
    @click.left="onClick")
    .container
      .filler(ref="filler")
      .handler(v-for="i in (multiple ? 2 : 1)",
        :tabindex="disabled? '' : 0",
        ref="handler",
        :key="i",
        @focus="onHandlerFocus(i - 1)",
        @blur="onHandlerBlur",
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
      selectedHandler: -1,
      localValue: [null, null]
    }
  },
  inject: {
    fvFormElement: {
      default: false
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
    dataType () {
      return this.data instanceof Array ? 'array' : 'object'
    },
    dataLength () {
      if (this.data instanceof Array) {
        return this.data.length
      } else if (this.data === Object(this.data)) {
        return (this.data.to - this.data.from) + 1
      }
    },
    firstAvailableData () {
      return this.data[this.dataType === 'array' ? 0 : 'from']
    },
    lastAvailableData () {
      return this.data[this.dataType === 'array' ? (this.data.length - 1) : 'to']
    }
  },
  created () {
    this.syncLocalValue()
    this.syncValue()
    // this.setStructure()
  },
  mounted () {
    // this.setValue
    this.$nextTick(this.redraw)
  },
  methods: {
    // check if value is inside data or not
    isTrustyValue (v) {
      if (this.dataType === 'array') {
        return this.data.indexOf(v) !== -1
      } else {
        return v === parseInt(v) && v >= this.data.from && v <= this.data.to
      }
    },
    // force calc trusty localValue based on value. normally called at startup and when value changes by parent
    syncLocalValue () {
      if (this.multiple) {
        for (let i = 0; i < 2; i++) {
          try {
            if (!this.setLocalValue(JSON.parse(JSON.stringify(this.value[i])), i)) {
              throw new Error()
            }
          } catch (e) {
            this.localValue[i] = i === 0 ? this.firstAvailableData : this.lastAvailableData
          }
        }
      } else {
        try {
          if (!this.setLocalValue(JSON.parse(JSON.stringify(this.value)), 0)) {
            throw new Error()
          }
        } catch (e) {
          this.localValue[0] = this.lastAvailableData
        }
        this.localValue[1] = null
      }
    },
    // fire input event to set value based on localValue
    syncValue () {
      const freshLocalValue = JSON.parse(JSON.stringify(this.localValue))
      if (this.multiple) {
        this.$emit('input', freshLocalValue)
      } else {
        this.$emit('input', freshLocalValue[0])
      }
    },
    // set localValue
    setLocalValue (value, index) {
      if (!this.isTrustyValue(value)) {
        return
      }
      if (this.multiple) {
        if (index === 1) {
          if (value <= this.localValue[0]) {
            return
          }
        } else if (index === 0) {
          if (value >= this.localValue[1]) {
            return
          }
        }
        this.localValue[index] = value
      } else {
        this.localValue[0] = value
      }
      return true
    },
    focus (handlerIndex = -1) {
      if (this.disabled) {
        return
      }
      this.selectedHandler = handlerIndex < 0 ? 0 : handlerIndex
      this.$refs.handler[this.selectedHandler].focus()
    },
    onKeydown (event, handlerIndex) {
      if ([37, 39].indexOf(event.which) === -1) {
        return
      }
      const currentValue = this.localValue[handlerIndex]
      const increase = process.env.direction === 'ltr' ? 39 : 37 // 39: right, 37: left
      const newValue = this.getNeightboorValue(currentValue, event.which === increase ? 1 : -1)
      this.setLocalValue(newValue, handlerIndex)
      this.redraw()
      this.syncValue()
    },
    onHandlerFocus (handlerIndex) {
      if (this.disabled) {
        return
      }
      this.selectedHandler = handlerIndex
      if (this.fvFormElement) {
        this.fvFormElement.turn(true)
      }
    },
    onHandlerBlur (event) {
      if (this.fvFormElement) {
        this.fvFormElement.turn(false)
      }
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
      // this.focus(this.selectedHandler)
      // const x = parseInt(this.$refs.handler[this.selectedHandler].style[process.env.blockStart])
      // const value = this.calcValueByX(x)
      // if (typeof value === 'undefined') {
      //   this.unbindEvents()
      //   return
      // }
      // this.localValue[this.selectedHandler] = value
      // this.redraw()
      // this.syncValue()
      this.unbindEvents()
    },
    onClick (event) {
      if (this.disabled || event.target === this.$refs.handler[0] || event.target === this.$refs.handler[1]) {
        return
      }
      if (!this.multiple) {
        const x = this.calcXByEvent(event)
        const value = this.calcValueByX(x)
        this.focus(0)
        this.setLocalValue(value, 0)
        this.redraw()
        this.syncValue()
      } else {
        this.focus(0)
      }
    },
    handlerFocus (handlerIndex) {
      if (this.disabled || this.selectedHandler === handlerIndex) {
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
      const value = this.calcValueByX(x)
      this.setLocalValue(value, this.selectedHandler)
      this.redraw()
      this.syncValue()
      // console.log('i m movin calcs', this.selectedHandler, this.localValue, this.value)
    },
    // wheel (event) {
    //   if (this.disabled || this.multiple) {
    //     return
    //   }
    //   event.preventDefault()
    //   if (this.selectedHandler < 0) {
    //     this.handlerFocus(0)
    //   }
    //   const currentValue = this.filteredValue[this.selectedHandler]
    //   const index = this.filteredData.findIndex(fd => JSON.stringify(fd.value) === JSON.stringify(currentValue))
    //   if ((event.deltaX < 0 || event.deltaY < 0) && index > 0) {
    //     this.setValue(this.filteredData[index - 1].value, this.selectedHandler)
    //   } else if (index < this.filteredData.length - 1) {
    //     this.setValue(this.filteredData[index + 1].value, this.selectedHandler)
    //   }
    // },
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
    // private function to set handler and filler positions used by .redraw method
    setHandlerPosition (x, handlerIndex) {
      const filler = [null, null]
      const fillerDirs = [process.env.blockStart, process.env.blockEnd]
      const movingFiller = this.multiple ? handlerIndex : 1
      // console.log('setHandlerPosition', 'movingFiller', movingFiller)
      filler[movingFiller] = movingFiller === 0 ? x : (100 - x)

      this.$refs.filler.style[fillerDirs[movingFiller]] = `${filler[movingFiller]}%`

      // for (let i = 0; i < 2; i++) {
      //   if (filler[i] !== null) {
      //   }
      // }
      // const blockDir = handlerIndex === 0 ? process.env.blockStart : process.env.blockEnd
      const translateX = (process.env.direction === 'ltr' ? -1 : 1) * x
      this.$refs.handler[handlerIndex].style[process.env.blockStart] = `${(process.env.direction === 'ltr' ? 1 : -1) * x}%`
      this.$refs.handler[handlerIndex].style.transform = `translateX(${translateX}%)`
    },
    // set handler and filler positions based on localValue
    redraw () {
      this.setHandlerPosition(this.calcXByValue(this.localValue[0]), 0)
      if (this.multiple) {
        this.setHandlerPosition(this.calcXByValue(this.localValue[1]), 1)
      }
    },
    calcXByEvent (event) {
      let x = event.changedTouches && event.changedTouches.length ? event.changedTouches[0].clientX : (event.pageX - 0)
      x -= this.$el.getBoundingClientRect().x
      const width = this.$el.offsetWidth
      x *= (100 / width) // convert to percetange
      x = process.env.blockStart === 'right' ? 100 - x : x
      return x > 100 ? 100 : (x < 0 ? 0 : x)
    },
    calcValueByX (x) {
      let value
      const inBorderX = x > 100 ? 100 : (x < 0 ? 0 : x)
      const index = Math.floor((inBorderX / 100) * (this.dataLength - 1))
      if (this.dataType === 'array') {
        value = this.data[index]
      } else if (this.dataType === 'object') {
        value = index + this.data.from
      }
      return value
    },
    getNeightboorValue (value, sum = 1) {
      if (this.dataType === 'array') {
        const valueIndex = this.data.indexOf(value)
        try {
          return this.data[valueIndex + sum]
        } catch (e) {
          return value
        }
      } else if (this.dataType === 'object') {
        return value + sum
      }
    },
    calcXByValue (value) {
      let valueIndex
      if (this.dataType === 'array') {
        valueIndex = this.data.indexOf(value)
      } else if (this.dataType === 'object') {
        valueIndex = value - this.firstAvailableData
      }
      const x = (valueIndex / (this.dataLength - 1)) * 100
      return x
    }
  },
  watch: {
    value () {}
  }
}

</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-range {
  position: relative;
  min-height: heightSize(md);
  width: 100%;

  & .container {
    @include shadow(inset-bottom);

    top: 40%;
    height: 20%;
    width: 100%;
    position: absolute;
    background: contrast($bg-color, 1, force-light);
    border: solid 1px contrast($bg-color, 2, hard-dark);
    border-radius: $border-radius;
    display: flex;
    align-items: center;
  }

  & .filler {
    margin: 0;
    position: absolute;
    width: auto;
    height: 100%;
    left: 0;
    right: 0;
    background: contrast($primary-color, 2, hard-light);
  }

  & .handler {
    @include shadow(bottom);

    padding: 0;
    height: 1.1em;
    width: 1.1em;
    display: inline-block;
    position: absolute;
    border-radius: $border-radius;
    background: contrast($bg-color, 1, force-light);
    border: solid 1px contrast($bg-color, 2, hard-dark);
    cursor: move;
    // opacity: 0;
    transition-property: opacity;
    transition-duration: $transition-speed;

    &:focus {
      @include outline;
      // opacity: 1;
    }
  }

  &:invalid .handler:focus,
  &[invalid] .handler:focus {
    @include outline($danger-color);
  }

  &:not([disabled]) .handler:hover:not(:focus) {
    border: solid 1px contrast($bg-color, 3, hard-dark);
  }

  &[disabled] {
    @include disabled;
  }

  &:hover {
    & .handler {
      opacity: 1;
    }
  }
}
</style>
