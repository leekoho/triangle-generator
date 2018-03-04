<template>
  <div id="app">
    <TriangleGenerator/>
  </div>
</template>

<script>
import TriangleGenerator from './TriangleGenerator.vue'

export default {
  name: 'App',
  components: {
    TriangleGenerator
  }
}
</script>

<style lang='sass' rel="stylesheet/sass">
*
  box-sizing: border-box
body, html
  font-family: Microsoft Yahei, STXihei, Helvetica, Arial, sans-serif
p, ul, li
  margin: 0
  padding: 0
ul
  list-style: none
img
  max-width: 100%
input
  border: none
  outline: none
</style>
