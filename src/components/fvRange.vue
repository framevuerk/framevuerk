<template lang="pug">
  .fv-range(v-if="!isBadStructure",
    :disabled="disabled",
    :invalid="!fvValidate",
    @wheel="wheel",
    @click.left="onClick")
    .container
      .filler(ref="filler")
      .handler(v-for="i in filteredValue.length",
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
      selectedHandler: -1
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
    isBadStructure () {
      if (this.multiple && (typeof this.value === 'undefined' || !(this.value instanceof Array))) {
        return true
      }
      // check if value is inside data
      for (let i = 0; i < this.filteredValue.length; i++) {
        const val = this.filteredValue[i]
        if (this.filteredData.findIndex(item => item.value === val) === -1) {
          return true
        }
      }
      return false
    },
    filteredValue () {
      if (this.multiple) {
        return this.value
      } else {
        return [this.value]
      }
    },
    middleValue () {
      return this.filteredData[parseInt(this.dataLength / 2)].value
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
        let sorted = [...this.data]
        sorted.sort()

        for (let index = 0; index < this.dataLength; index++) {
          ret.push({
            x: this.stepWidth * index,
            value: sorted[index]
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
      if (this.isBadStructure) {
        if (this.multiple) {
          this.$emit('input', [this.filteredData[0].value, this.filteredData[this.dataLength - 1].value])
        } else {
          this.$emit('input', this.filteredData[0].value)
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
      this.focus(this.selectedHandler)
      const x = parseInt(this.$refs.handler[this.selectedHandler].style[process.env.blockStart])
      const value = this.calcValueByX(x)
      if (typeof value === 'undefined') {
        this.unbindEvents()
        return
      }
      this.setValue(value, this.selectedHandler)
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
        this.setValue(value, 0)
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
      this.setValue(this.calcValueByX(x), this.selectedHandler)
    },
    wheel (event) {
      if (this.disabled || this.multiple) {
        return
      }
      event.preventDefault()
      if (this.selectedHandler < 0) {
        this.handlerFocus(0)
      }
      const currentValue = this.filteredValue[this.selectedHandler]
      const index = this.filteredData.findIndex(fd => JSON.stringify(fd.value) === JSON.stringify(currentValue))
      if ((event.deltaX < 0 || event.deltaY < 0) && index > 0) {
        this.setValue(this.filteredData[index - 1].value, this.selectedHandler)
      } else if (index < this.filteredData.length - 1) {
        this.setValue(this.filteredData[index + 1].value, this.selectedHandler)
      }
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
    valueIndex (value) {
      return this.filteredData.findIndex(v => JSON.stringify(v.value) === JSON.stringify(value))
    },
    setValue (value, handlerIndex) {
      let ret = this.filteredValue
      ret[handlerIndex] = value
      const valueIndex = this.valueIndex(value)
      const minPosibleIndex = handlerIndex === 0 ? 0 : this.valueIndex(this.filteredValue[0]) + 1
      const maxPosibleIndex = handlerIndex === 1 ? this.dataLength - 1 : (this.multiple ? this.valueIndex(this.filteredValue[1]) - 1 : this.dataLength - 1)

      if (valueIndex < minPosibleIndex || valueIndex > maxPosibleIndex) {
        return
      }

      const handlerPosition = []
      if (ret.length > 1) {
        handlerPosition.push(this.calcXByValue(ret[0]))
        handlerPosition.push(this.calcXByValue(ret[1]))
        this.$refs.filler.style[process.env.blockStart] = `${handlerPosition[0]}%`
        this.$refs.filler.style[process.env.blockEnd] = `${100 - handlerPosition[1]}%`
        this.$refs.handler[0].style[process.env.blockStart] = `${handlerPosition[0]}%`
        this.$refs.handler[0].style.transform = `translateX(-${handlerPosition[0]}%)`
        this.$refs.handler[1].style[process.env.blockStart] = `${handlerPosition[1]}%`
        this.$refs.handler[1].style.transform = `translateX(-${handlerPosition[1]}%)`
        this.$emit('input', ret)
      } else {
        handlerPosition.push(this.calcXByValue(value))
        this.$refs.filler.style[process.env.blockStart] = `0%`
        this.$refs.filler.style[process.env.blockEnd] = `${100 - this.calcXByValue(ret[0])}%`
        this.$refs.handler[0].style[process.env.blockStart] = `${handlerPosition[0]}%`
        this.$refs.handler[0].style.transform = `translateX(-${handlerPosition[0]}%)`
        this.$emit('input', ret[0])
      }
    },
    calcXByEvent (event) {
      let x = event.changedTouches && event.changedTouches.length ? event.changedTouches[0].clientX : (event.pageX - 0)
      x -= this.$el.getBoundingClientRect().x
      const width = this.$el.offsetWidth
      x *= (100 / width) // convert to percetange
      x = process.env.blockStart === 'right' ? 100 - x : x
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
  },
  watch: {
    value () {
      if (!this.$refs.filler || !this.$refs.handler) {
        return false
      }
      const ret = this.filteredValue
      const handlerPosition = []
      if (ret.length > 1) {
        handlerPosition.push(this.calcXByValue(ret[0]))
        handlerPosition.push(this.calcXByValue(ret[1]))
        this.$refs.filler.style[process.env.blockStart] = `${handlerPosition[0]}%`
        this.$refs.filler.style[process.env.blockEnd] = `${100 - handlerPosition[1]}%`
        this.$refs.handler[0].style[process.env.blockStart] = `${handlerPosition[0]}%`
        this.$refs.handler[0].style.transform = `translateX(-${handlerPosition[0]}%)`
        this.$refs.handler[1].style[process.env.blockStart] = `${handlerPosition[1]}%`
        this.$refs.handler[1].style.transform = `translateX(-${handlerPosition[1]}%)`
      } else {
        handlerPosition.push(this.calcXByValue(ret[0]))
        this.$refs.filler.style[process.env.blockStart] = `0%`
        this.$refs.filler.style[process.env.blockEnd] = `${100 - this.calcXByValue(ret[0])}%`
        this.$refs.handler[0].style[process.env.blockStart] = `${handlerPosition[0]}%`
        this.$refs.handler[0].style.transform = `translateX(-${handlerPosition[0]}%)`
      }
    }
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
    background: contrast($primary-color, 2, hard-light);
  }

  & .handler {
    @include shadow(bottom);

    padding: 0;
    height: 2em;
    width: 2em;
    display: inline-block;
    position: absolute;
    border-radius: 2em;
    background: contrast($bg-color, 1, force-light);
    border: solid 1px contrast($bg-color, 2, hard-dark);
    cursor: move;

    &:focus {
      @include outline;
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
}
</style>
