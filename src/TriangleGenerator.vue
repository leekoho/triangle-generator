<template lang="html">
  <div id="triangle-generator" class="container">
    <header>
      <h1 class="title is-2">CSS三角形生成器</h1>
    </header>

    <article class="message">
      <div class="message-header">
        <p>Vue</p>
      </div>
      <div class="message-body">
        <div class="columns">
          <aside class="sidebar column is-half">
            <div class="field is-horizontal direction">
              <div class="field-label">
                <label class="label">箭头方向</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control not-rotate">
                    <label v-for="(dir, index) in specialDir" :key="index" :for="dir" class="radio"
                           :style="setDirectionPositionStyle(dir)" :class="{active: dir === direction}">
                      <input type="radio" name="direction" :id="dir" :value="dir" v-model="direction">
                    </label>
                  </div>

                  <div class="control rotate">
                    <label v-for="(dir, index) in normalDir" :key="index" :for="dir" class="radio"
                           :style="setDirectionPositionStyle(dir)"
                           :class="{active: dir === direction}">
                      <input type="radio" name="direction" :id="dir" :value="dir" v-model="direction">
                    </label>
                  </div>

                  <div class="centerFill"></div>
                </div>
              </div>
            </div>

            <div class="field is-horizontal">
              <div class="field-label">
                <label class="label">类型</label>
              </div>
              <div class="field-body">
                <div class="field is-narrow">
                  <div class="control">
                    <label for="iso" class="radio">
                      <input type="radio" id="iso" name="type" value="iso" v-model.number="type" :disabled="isSpecialDir">
                      等腰
                    </label>

                    <label for="equ" class="radio">
                      <input type="radio" id="equ" name="type" value="equ" v-model.number="type" :disabled="isSpecialDir">
                      等边
                    </label>
                  </div>

                </div>
              </div>
            </div>

            <div class="field is-horizontal align-center">
              <div class="field-label is-normal">
                <label class="label">宽</label>
              </div>
              <div class="field-body">
                <div class="field has-addons">
                  <p class="control is-expanded">
                    <input type="number" v-model="width" class="input">
                  </p>
                  <p class="control"><span class="button">px</span></p>
                </div>
              </div>
            </div>

            <div class="field align-center has-addons">
              <div class="field-label is-normal">
                <label class="label">高</label>
              </div>
              <div class="field-body">
                <div class="field has-addons">
                  <p class="control is-expanded">
                    <input type="number" v-model="height" class="input" placeholder="高度"
                           :disabled="isEquType && !isSpecialDir">
                  </p>
                  <p class="control"><span class="button" v-if="!isEquType">px</span></p>
                </div>
              </div>
            </div>

            <div class="field align-center has-addons">
              <div class="field-label is-normal">
                <label class="label">旋转角度</label>
              </div>
              <div class="field-body">
                <div class="field has-addons">
                  <p class="control is-expanded">
                    <input type="number" v-model.number="degOfRotate" class="input" placeholder="旋转角度">
                  </p>
                  <p class="control"><span class="button" v-if="!isEquType">deg</span></p>
                </div>
              </div>
            </div>

            <div class="field is-horizontal">
              <div class="field-label">
                <label class="label">颜色模式</label>
              </div>
              <div class="field-body">
                <div class="field is-narrow">
                  <div class="controßl">
                    <label for="hex" class="radio">
                      <input type="radio" id="hex" name="colorType" value="hex" v-model="colorType">hex
                    </label>

                    <label for="rgba" class="radio">
                      <input type="radio" id="rgba" name="colorType" value="rgba" v-model="colorType">rgba
                    </label>
                  </div>

                </div>
              </div>
            </div>

            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label">颜色</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="color-picker">
                    <chrome-picker v-model="pickedColors" @change-color="onChangeColorPicker"></chrome-picker>
                  </div>
                </div>

              </div>
            </div>
          </aside>
          <div class="workArea column">
            <h2 class="title">预览</h2>
            <div class="triangleOutput">
              <div class="triangle" ref="triangle" :style="{
                borderColor: setBorderColorStyle(),
                borderWidth: setBorderWidthStyle(),
                transform: setRotateStyle()
                }"></div>
            </div>
            <div class="cssOutput">
              <h2 class="title">CSS</h2>
              <figure class="highlight">
                <pre id="pre" @click="copyCode()">{{cssCode}}</pre>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </article>

    <div class="toast" v-show="toastVisible">{{toastText}}</div>
  </div>
</template>

<script lang="babel" type="es6">
import {Chrome} from 'vue-color'
import 'bulma'

export default {
  data () {
    return {
      direction: 'top',
      type: 'iso',
      colorType: 'hex',
      pickedColors: {
        hex: '#e96900'
      },
      width: 100,
      height: 100,
      degOfRotate: 0,
      colorStyle: {
        // t => transparent  c => color
        top: '/t /t /c',
        right: '/t /t /t /c',
        bottom: '/c /t /t',
        left: '/t /c /t /t',
        leftTop: '/c /t /t',
        rightTop: '/c /t /t',
        rightBottom: '/t /t /c',
        leftBottom: '/t /t /c'
      },
      widthStyle: {
        // w => width  w/2 => width/2
        top: '0 w/2 h',
        right: 'h/2 0 h/2 w',
        bottom: 'h w/2 0',
        left: 'h/2 w h/2 0',
        leftTop: 'h w 0 0',
        rightTop: 'h 0 0 w',
        rightBottom: '0 0 h w',
        leftBottom: '0 w h 0'
      },
      normalDir: ['top', 'right', 'bottom', 'left'],
      specialDir: ['leftTop', 'rightTop', 'rightBottom', 'leftBottom'],
      toastVisible: false,
      toastText: ''
    }
  },
  methods: {
    onChangeColorPicker (val) {
      this.pickedColors = val
    },
    setDirectionPositionStyle (direction) {
      switch (direction) {
        case 'top':
        case 'leftTop':
          return {
            top: 0,
            left: 0
          }
        case 'right':
        case 'rightTop':
          return {
            top: 0,
            right: 0
          }
        case 'bottom':
        case 'rightBottom':
          return {
            bottom: 0,
            right: 0
          }
        case 'left':
        case 'leftBottom':
          return {
            left: 0,
            bottom: 0
          }
      }
    },
    setBorderColorStyle () {
      let curDirectionColorStyle = this.colorStyle[this.direction]
      const replaceList = [{
        regex: /\/t/g,
        value: 'transparent'
      }, {
        regex: /\/c/g,
        value: () => {
          let color = this.pickedColors[this.colorType]
          if (this.colorType === 'rgba') {
            const {r, g, b, a} = color
            return `rgba(${r}, ${g}, ${b}, ${a})`
          }
          return color
        }
      }]
      replaceList.forEach(item => {
        curDirectionColorStyle = curDirectionColorStyle.replace(item.regex, item.value)
      })
      return curDirectionColorStyle
    },
    setBorderWidthStyle () {
      if (this.isSpecialDir && this.type === 'equ') {
        this.type = 'iso'
      }
      let curDirectionWidthStyle = this.widthStyle[this.direction]
      let getEquHeight = (v = 0) => {
        if (this.type === 'equ') {
          let equHeight = (Math.sqrt(3) / 2 * this.width).toFixed(1)
          equHeight = v === 0 ? equHeight : equHeight / v
          if (equHeight === 0) return 0
          return equHeight
        }
        return v === 0 ? this.height : this.height / v
      }
      const replaceList = [{
        regex: /w\/2/g,
        value: this.width / 2
      }, {
        regex: /w/g,
        value: this.width
      }, {
        regex: /h\/2/g,
        value: getEquHeight(2)
      }, {
        regex: /h/g,
        value: getEquHeight(0)
      }]
      replaceList.forEach(item => {
        if (parseInt(item.value) !== 0) item.value += 'px'
        curDirectionWidthStyle = curDirectionWidthStyle.replace(item.regex, item.value)
      })
      // 如果全部是0则返回0
      let isAllZero = curDirectionWidthStyle.match(/(0\s){2,}0/g)
      if (isAllZero) return 0
      return curDirectionWidthStyle
    },
    setRotateStyle () {
      if (this.degOfRotate === 0) return 0
      return `rotate(${this.degOfRotate}deg)`
    },
    toast (str) {
      if (!str) return
      if (this.toastVisible) return
      this.toastVisible = true
      this.toastText = str
      setTimeout(() => {
        this.toastVisible = false
      }, 2500)
    },
    copyCode () {
      const target = document.getElementById('pre')
      const range = document.createRange()
      range.selectNodeContents(target)

      // 移除已存在的复制内容，选择新的
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)

      // 执行copy命令
      const executed = document.execCommand('copy')

      executed ? this.toast('复制成功') : this.toast('复制失败, 请手动复制！！！')
    }
  },
  computed: {
    isEquType () {
      return this.type === 'equ'
    },
    isSpecialDir () {
      return this.specialDir.some((item) => {
        return this.direction === item
      })
    },
    cssCode () {
      return `width: 0;
height: 0;
border-style: solid;
border-width: ${this.setBorderWidthStyle()};
border-color: ${this.setBorderColorStyle()};  ${!this.degOfRotate ? `` : `\ntransform: ${this.setRotateStyle()};\n-webkit-transform: ${this.setRotateStyle()};`}
`
    }
  },
  components: {
    'chrome-picker': Chrome
  }
}
</script>

<style lang='sass' rel="stylesheet/sass">
  #triangle-generator
    .align-center
      align-items: center
    .field-label
      padding-top: 0 !important
    .title
      font-weight: 300
    header
      margin: 1.5em auto
      text-align: center
    .direction
      input[type = "radio"]
        display: none
      .field
        position: relative
        width: 100%
        height: 70px
        .centerFill
          position: absolute
          $t: 12px
          top: $t
          left: $t
          $w: 38px
          width: $w
          height: $w
          background: #fff
        .not-rotate
          $w: 60px
          width: $w
          height: $w
          label
            $w: 30px
            width: $w
            height: $w
            background: #194d33
        .rotate
          $w: 54px
          width: $w
          height: $w
          margin: 4px 0 0 4px
          transform: rotate(45deg)
          label
            $w: 27px
            width: $w
            height: $w
            background: lighten(#194d33, 30)
        .control
          position: absolute
          top: 0
          left: 0
          label
            position: absolute
            margin-left: 0
            transition: all .4s ease
            &.active
              background: #e96900
            &:hover
              background: #e96900
            &#top-label, &#left-top-label
              top: 0
              left: 0
            &#right-label, &#right-top-label
              top: 0
              right: 0
            &#bottom-label, &#right-bottom-label
              bottom: 0
              right: 0
            &#left-label, &#left-bottom-label
              left: 0
              bottom: 0
    .color-picker
      display: inline-block
    .workArea
      .triangleOutput
        display: flex
        align-items: center
        min-height: 15em
        overflow: auto
        background: #fff
        background-image: linear-gradient(45deg, #bbb 25%, transparent 0), linear-gradient(45deg, transparent 75%, #bbb 0), linear-gradient(45deg, #bbb 25%, transparent 0), linear-gradient(45deg, transparent 75%, #bbb 0)
        background-position: 0 0, 15px 15px, 15px 15px, 30px 30px
        background-size: 30px 30px
    .triangle
      margin: 0 auto
      width: 0
      height: 0
      border-style: solid
      border-width: 100px
      transition: all .4s ease
    .cssOutput
      margin-top: 1.5em
      pre
        padding: 1.4em
        font-size: .75em
        background: lightgray
        overflow-x: auto

  .toast
    position: fixed
    bottom: 100px
    left: 50%
    box-sizing: border-box
    max-width: 80%
    height: 40px
    line-height: 20px
    padding: 10px 20px
    transform: translateX(-50%)
    text-align: center
    z-index: 9999
    font-size: 14px
    color: #fff
    border-radius: 5px
    background: rgba(0, 0, 0, 0.7)
    animation: show-toast .5s
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
    @keyframes show-toast
      from
        opacity: 0
        transform: translate(-50%, -10px)
        -webkit-transform: translate(-50%, -10px)
      to
        opacity: 1
        transform: translate(-50%, 0)
</style>
