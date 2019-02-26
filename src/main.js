import Vue from 'vue'
import App from './App'

import { isPC } from './assets/js/utils';
const isPCFlag = isPC();
Vue.prototype.isPC = isPCFlag;

import './assets/js/lib-flexible';
//引入路由
import router from './router';

//引入垫片
import "babel-polyfill";

//引入element-ui
import './assets/js/element-ui-default';

//引入i18n
import i18n from "./assets/js/i18n-default"

//引入axios
import './assets/js/axios-default'

//錯誤圖片
Vue.prototype.errorImageUrl = require('./assets/images/no_banner.png');
//默認人物頭像
Vue.prototype.defaultHead = require('./assets/images/user1.png');

new Vue({
  el: '#app',
  router,
  i18n,
  components: { App },
  template: '<App/>'
});
