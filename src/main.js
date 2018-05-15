import Vue from 'vue'
import App from './TriangleGenerator'

console.info('%cGitHub地址: ', 'color: #3fc180; font-size: 12px; font-weight: bold')

console.info('https://github.com/leekoho/triangle-generator')

Vue.config.productionTip = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
