import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from "../language/en"
import zh from "../language/zh"
import sp from "../language/sp"
import { cookie } from './utils'
Vue.use(VueI18n);

/*
  獲取瀏覽器默認的語言設置
*/
let defaults = window.navigator.language.toLowerCase();
let defaultLocale = 'en';
if(defaults.includes('zh')){
  defaultLocale = 'zh';
}else if(defaults.includes('tw')){
  defaultLocale = 'sp';
}

/*
  去cookie裡面拿用戶設置的語言，如果沒有，則使用瀏覽器默認的語言
*/
let ln = cookie.get('language');
const locale = ln ? ln : defaultLocale;


/*
  設置lang_id
  lang_id = 1; //簡體中文
  lang_id = 2; //繁體中文
  lang_id = 3; //英文
*/
let lang_id;
if(locale == 'sp'){
  lang_id = 2;
}else if(locale == 'zh'){
  lang_id = 1;
}else{
  lang_id = 3;
}
Vue.prototype.lang_id = lang_id;


const i18n = new VueI18n({
  locale: locale,
  messages: {
    'en': en,// 英文语言包
    'zh': zh,// 中文语言包
    'sp': sp,//繁体中文
  }
})
export default i18n