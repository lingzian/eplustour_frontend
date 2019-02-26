<template>
  <div>
     <div class="inner-box">
        <div class="account">
            <input v-model="account" type="text" :placeholder="$t('sign.account')" :spellcheck="false">
        </div>
        <div class="password">
            <input v-if="canSeePwd" type="text" v-model="password" :placeholder="$t('sign.pwd')" :spellcheck="false">
            <input v-else type="password" v-model="password" :placeholder="$t('sign.pwd')" :spellcheck="false">
            <img v-if="!canSeePwd" src="../../../assets/images/pwd-close.png" @click="canSeePwd = true">
            <img v-else src="../../../assets/images/pwd-open.png" @click="canSeePwd = false">
        </div>
        <div class="recommendedCode">
            <input v-model="recommendedCodeInput" type="text" :placeholder="$t('sign.recommendedCode')" :spellcheck="false" :readonly="recommendedCodeOnlyRead" />
        </div>
        <div class="code cl">
            <div>
                <input v-model="code" type="text" :placeholder="$t('sign.verificationCode')" :spellcheck="false">
            </div>
            <div class="code-image" id="code-image" @click="refreshCode"></div>
        </div>
        <div class="btn" @click="submit">{{$t('sign.register')}}</div>
        <div class="forgot">
            {{$t('sign.hasAccount')}}
            <router-link to="/Sign">{{$t('sign.login')}}</router-link>
        </div>
    </div>
    <div class="back_toIndex">
      <router-link to="/">{{$t('head.backHome')}}</router-link>
    </div>
  </div>

</template>

<script>
import GVerify from "../../../assets/js/code";
import {
  addEvent,
  removeEvent,
  afterLogin,
  checkIsPhone,
  checkIsEmail,
  checkIsEmpty,
  messageTips,
  checkPwdFormat,
  checkPwdLength,
  checkPhoneFormat
} from "../../../assets/js/utils";
export default {
  props: {
    recommendedCode: {
      type : String,
      default : ''
    },
    recommendedCodeOnlyRead: {
      type:Boolean,
      default: false
    }
  },
  data() {
    return {
      account: "",
      password: "",
      code: "",
      codeObj: new Object(),
      recommendedCodeInput : this.recommendedCode,
      isRequest: false,
      canSeePwd: false
    };
  },
  created() {
    addEvent(document, "keyup", event => {
      var event = event || window.event;
      if (event.keyCode == 13) {
        this.submit();
      }
    });
  },
  destroyed(){
    removeEvent(document, "keyup");
  },
  mounted() {
    this.createdCode();
  },
  methods: {
    createdCode() {
      this.codeObj = GVerify("code-image");
    },
    refreshCode() {
      this.codeObj.refresh();
      this.code = "";
    },
    checkLogin(fn) {
      if (checkIsEmpty(this.account) || checkIsEmpty(this.password)) {
        messageTips(this.$t("sign.tips.empty"), "error");
        return;
      }
      //判断账号是手机还是邮箱
      var accountIsPhone = checkIsPhone(this.account);
      var accountIsEmail = checkIsEmail(this.account);
      if (accountIsPhone && !checkPhoneFormat(this.account)) {
        //如果账号是手機 ，檢查手機格式
        messageTips(this.$t("sign.tips.phoneCheck"), "error");
        return;
      } else if (accountIsEmail && !checkIsEmail(this.account)) {
        //如果账号是郵箱，檢查郵箱格式
        messageTips(this.$t("user.error.email"), "error");
        return;
      } else if (!accountIsPhone && !accountIsEmail) {
        //如果账号不是邮箱也不是手机，提示账号有误
        messageTips(this.$t("sign.tips.accountCheck"), "error");
        return;
      }
      //检查密码長度
      if (!checkPwdLength(this.password)) {
        messageTips(this.$t("sign.tips.pwdLength"), "error");
        return;
      }
      //检查密码格式
      if (!checkPwdFormat(this.password)) {
        messageTips(this.$t("sign.tips.pwdFormat"), "error");
        return;
      }
      //检查验证码
      if (!this.codeObj.validate(this.code)) {
        messageTips(this.$t("sign.tips.codeCheck"), "error");
        this.refreshCode();
        return;
      }
      fn && fn.call(this);
    },
    submit() {
      this.checkLogin(() => {
        if (this.isRequest) return false;
        var qs = require("qs");
        var sendData = {
          username: this.account,
          password: this.password,
          mobile: this.mobile
        };
        //如果有推荐码，添加推荐码
        if (!checkIsEmpty(this.recommendedCodeInput)) {
          sendData["recommend_code"] = this.recommendedCodeInput;
        }
        this.isRequest = true;
        this.axios
          .post(`api/web/v1/users/register?lang_id=${this.lang_id}`, sendData)
          .then(res => {
            var data = res.data;
            if (data.code == "1013") {
              messageTips(this.$t("sign.tips.accountIsExist"), "error");
              this.refreshCode();
            } else if (data.code == "1000") {
              messageTips(this.$t("sign.tips.registerSuccess"));
              var token = data.data.api_token;
              afterLogin(this, token, 1000);
            } else {
              messageTips(res.data.message, "error");
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
.back_toIndex{
  margin-top: 20px;
  width: 100%;
  text-align: center;
}
.back_toIndex a{
  cursor: pointer;
  color: white;
}
.inner-box {
  background-image: url(../../../assets/images/sign-small-bg.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  text-align: center;
  padding: 40px 35px;
  padding-bottom: 31px;
}
.inner-box input {
  border: 0;
  outline: 0;
  background-color: #348cfa;
  width: 100%;
  padding: 18px 20px;
  border-radius: 30px;
  color: #fff;
  font-size: 20px;
  padding-right: 50px;
}
.inner-box input::-webkit-input-placeholder {
  color: #fff;
}
.inner-box input::-moz-placeholder {
  color: #fff;
}
.inner-box input:-moz-placeholder {
  color: #fff;
}
.inner-box input:-ms-input-placeholder {
  color: #fff;
}
.account,
.password,
.code,
.recommendedCode,
.phone {
  margin-bottom: 30px;
  height: 59px;
}
.password {
  position: relative;
}
.password img {
  position: absolute;
  top: 50%;
  right: 25px;
  width: 20px;
  transform: translate(0, -50%);
  cursor: pointer;
}
.code {
  margin-bottom: 31px;
}
.code > div:first-of-type {
  float: left;
  width: 70%;
}
.code > div:last-of-type {
  float: right;
  width: 28%;
  height: 100%;
  border-radius: 30px;
  background-color: #ccc;
  font-size: 24px;
  line-height: 59px;
  letter-spacing: 3px;
  text-indent: 3px;
  cursor: pointer;
  color: #000;
  overflow: hidden;
}
.btn {
  width: 300px;
  font-size: 28px;
  color: #2d9aff;
  background-color: #fff;
  border-radius: 30px;
  margin: 0 auto;
  padding: 12px 0;
  margin-bottom: 20px;
  cursor: pointer;
}
.forgot {
  color: #eee;
  font-size: 18px;
}
.forgot a {
  color: #000;
  border-bottom: 1px solid #000;
}
</style>
