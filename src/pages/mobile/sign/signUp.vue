<template>
  <div>
        <div class="content">
            <!-- 账号 -->
            <div class="phone-icon">
                <div>
                    <input type="text" v-model="account" :placeholder="$t('sign.account')">
                </div>
            </div>
            <!-- 密码 -->
            <div class="pwd-icon">
                <div>
                    <input v-if="canSeePwd" type="text" v-model="password" :placeholder="$t('sign.pwd')">
                    <input v-else type="password" v-model="password" :placeholder="$t('sign.pwd')">
                    <img v-if="!canSeePwd" class="center-left" src="../../../assets/images/pwd-close.png" @click="canSeePwd = true">
                    <img v-else class="center-left" src="../../../assets/images/pwd-open.png" @click="canSeePwd = false">
                </div>
            </div>
            <!-- 邀请码 -->
            <div class="recommend-icon">
                <div>
                    <input type="text" v-model="recommendedCodeInput" :placeholder="$t('sign.recommendedCode')" :readonly="recommendedCodeOnlyRead">
                </div>
            </div>
            <!-- 验证码 -->
            <div class="code-icon">
                <div>
                    <input type="text" v-model="code" :placeholder="$t('sign.verificationCode')">
                    <div class="code code-image" id="code-image" @click="refreshCode"></div>
                </div>
            </div>
        </div>

        <div class="btn" @click="submit">{{$t('sign.register')}}</div>
        <div class="forgot">
          {{$t('sign.hasAccount')}}
          <router-link to="/Sign">{{$t('sign.login')}}</router-link>
        </div>
  </div>
</template>

<script>
import GVerify from '../../../assets/js/code'
import { afterLogin,checkIsPhone,checkIsEmail,checkIsEmpty,messageTips,checkPwdFormat,checkPwdLength,checkPhoneFormat } from "../../../assets/js/utils";
import { Indicator } from "mint-ui";
export default {
  props: {
    recommendedCode: {
      default: '',
      type: String
    },
    recommendedCodeOnlyRead: {
      type:Boolean,
      default: false
    }
  },
  data() {
    return {
      canSeePwd: false,
      checkbox: false,
      account: "",
      password: "",
      recommendedCodeInput:this.recommendedCode,
      // mobile: "",
      code : '',
      codeObj : new Object(),
      isRequest : false
    };
  },
  mounted(){
    this.createdCode();
  },
  methods: {
    createdCode(){
        this.codeObj = GVerify('code-image');
    },
    refreshCode(){
        this.codeObj.refresh();
        this.code = '';
    },
    checkLogin(fn) {
      if (checkIsEmpty(this.account) || checkIsEmpty(this.password)) {
        messageTips(this.$t("sign.tips.empty"));
        return;
      }
      //判断账号是手机还是邮箱
      var accountIsPhone = checkIsPhone(this.account);
      var accountIsEmail = checkIsEmail(this.account);
      if (accountIsPhone && !checkPhoneFormat(this.account)) {
        //如果账号是手機 ，檢查手機格式
        messageTips(this.$t("sign.tips.phoneCheck"));
        return;
      } else if (accountIsEmail && !checkIsEmail(this.account)) {
        //如果账号是郵箱，檢查郵箱格式
        messageTips(this.$t("user.error.email"));
        return;
      }else if(!accountIsPhone && !accountIsEmail){
        //如果账号不是邮箱也不是手机，提示账号有误
        messageTips(this.$t("sign.tips.accountCheck"));
        return;
      }

      //检查密码長度
      if (!checkPwdLength(this.password)) {
        messageTips(this.$t("sign.tips.pwdLength"));
        return;
      }
      //检查密码格式
      if(!checkPwdFormat(this.password)){
        messageTips(this.$t("sign.tips.pwdFormat"));
        return;
      }
      //检查验证码
      if(!this.codeObj.validate(this.code)){
          messageTips(this.$t('sign.tips.codeCheck'));
          this.refreshCode();
          return;
      }
      fn && fn.call(this);
    },
    submit() {
      this.checkLogin(() => {
        if(this.isRequest) return false;
        Indicator.open();
        var qs = require("qs");
        var sendData = {
          username: this.account,
          password: this.password,
          mobile: this.mobile
        };
        //如果有推荐码，添加推荐码
        if(!checkIsEmpty(this.recommendedCodeInput)){
          sendData["recommend_code"] = this.recommendedCodeInput;
        }
        this.isRequest = true;
        this.axios
          .post(`api/web/v1/users/register?lang_id=${this.lang_id}`, sendData)
          .then(res => {
            Indicator.close();
            var data = res.data;
            if (data.code == "1013") {
              messageTips(this.$t("sign.tips.accountIsExist"));
              this.refreshCode();
            } else if (data.code == "1000") {
              messageTips(this.$t("sign.tips.registerSuccess"));
              var token = data.data.api_token;
              afterLogin(this,token,1500);
            }else{
              messageTips(res.data.message);
              this.refreshCode();
            }
            this.isRequest = false;
          });
      });
    }
  }
};
</script>

<style scoped>
.content > div {
  padding: 0 0.4rem;
  height: 1.6rem;
  line-height: 1.6rem;
  background-color: #fff;
}
.content > div:first-of-type {
  margin-top: 0.4rem;
}
.content > div:first-of-type > div,
.content > div:nth-of-type(2) > div {
  border-bottom: 0.013333rem solid #eee;
}
.content > div img {
  width: 0.453333rem;
}
.content > div:nth-of-type(4),
.content > div:last-of-type {
  margin-top: 0.266667rem;
}
.content > div > div {
  padding-left: 0.8rem;
  background-position: 0.2rem center;
  background-size: 0.4rem;
  background-repeat: no-repeat;
  position: relative;
}
.content > div.phone-icon > div {
  background-image: url(../../../assets/images/sign-account.png);
}
.content > div.pwd-icon > div {
  background-image: url(../../../assets/images/sign-pwd.png);
}
.content > div.code-icon > div {
  background-image: url(../../../assets/images/sign-code.png);
}
.content > div.recommend-icon > div {
  background-image: url(../../../assets/images/sign-recommend.png);
}
.content > div.mobile-icon > div {
  background-image: url(../../../assets/images/sign-mobile.png);
}
.content > div.pwd-icon > div input {
  padding-right: 0.773333rem;
}
.content > div.code-icon > div input {
  padding-right: 2.2rem;
}
.content > div input {
  width: 100%;
  height: 100%;
  border: 0;
  outline: 0;
  padding-left: 0.133333rem;
  font-size: 0.346667rem;
}
.content > div > div img {
  right: 0.133333rem;
}
.content .code {
  position: absolute;
  width: 2rem;
  height: 100%;
  background-color: #ccc;
  right: 0;
  top: 0;
  text-align: center;
  color: #000;
  letter-spacing: 0.026667rem;
  text-indent: 0.026667rem;
  font-size: 0.4rem;
}
.btn {
  width: 8.466667rem;
  height: 1.2rem;
  line-height: 1.2rem;
  background-color: #1c92ff;
  margin: 0.466667rem auto;
  color: #fff;
  text-align: center;
  border-radius: 0.666667rem;
  font-size: 0.453333rem;
  letter-spacing: 0.026667rem;
  text-indent: 0.026667rem;
}
.forgot {
  text-align: center;
  padding: 0.2rem 0;
  font-size: 0.4rem;
  margin-bottom: 0.66rem;
}
.forgot a {
  color: #1c92ff;
  text-decoration: underline;
}
.checkbox {
  text-align: center;
  margin-top: 0.466667rem;
}
.checkbox i {
  visibility: hidden;
}
.checkbox > div {
  display: inline-block;
  vertical-align: middle;
  border: 0.026667rem solid #aaa;
  border-radius: 0.106667rem;
  background-color: #fff;
  margin-top: -0.04rem;
}
.checkbox.select > div {
  color: #1c92ff;
  border-color: #1c92ff;
}
.checkbox.select i {
  visibility: visible;
}
</style>
