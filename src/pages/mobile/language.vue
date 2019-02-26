<template>
  <div>
    <div class="mb-padding-content">
      <ul class="language-select">
        <li @click="selectLanguage('zh')">简体中文<i v-if="language == 'zh'" class="el-icon-check"></i></li>
        <li @click="selectLanguage('sp')">繁體中文<i v-if="language == 'sp'" class="el-icon-check"></i></li>
        <li @click="selectLanguage('en')">English<i v-if="language == 'en'" class="el-icon-check"></i></li>
      </ul>
    </div>
  </div>
</template>

<script>
import { cookie,messageTips } from '../../assets/js/utils'
import Vue from 'vue'
export default {
    data(){
      return {
        language: cookie.get('language') || 'zh'
      }
    },
    methods : {
      selectLanguage(command){
        this.$i18n.locale = command;
        cookie.set("language", command,30*24);
        this.language = command;
        if(command =='sp'){
          Vue.prototype.lang_id = 2;
        }else if(command == 'zh'){
          Vue.prototype.lang_id = 1;
        }else{
          Vue.prototype.lang_id = 3;
        }
        messageTips(this.$t('user.changeSuccess'))
      },
    },
    mounted() {
      document.body.style.backgroundColor = "#f5f5f5";
    },
    destroyed(){
      document.body.style.backgroundColor = "#fff";
    },
}
</script>

<style scoped>
.language-select{
    margin-top: .4rem;
    background-color: #fff;
}
.language-select li{
  height: 1rem;
  line-height: 1rem;
  font-size: .373333rem;
  padding: 0 .333333rem;
  border-bottom: .026667rem solid #ccc;
  position: relative;
}
.language-select li:last-of-type{
  border-bottom: 0;
}
.language-select li i{
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(-50%,-50%);
  font-size: .533333rem;
  color: #1d8918;
}
</style>
