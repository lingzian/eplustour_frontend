import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { cookie } from './utils'
Vue.use(ElementUI);
if(cookie.get('language') == 'en'){
    let lang = require('element-ui/lib/locale/lang/en').default;
    let locale = require('element-ui/lib/locale').default;
    locale.use(lang);
}