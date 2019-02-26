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
        <!-- <div class="code cl">
            <div>
                <input v-model="code" type="text" :placeholder="$t('sign.verificationCode')">
            </div>
            <div class="code-image" id="code-image" @click="refreshCode"></div>
        </div> -->
        <div class="btn" @click="submit">{{$t('sign.login')}}</div>
        <div class="forgot">
          <router-link to="/Forgot">{{$t('sign.forgotPwd')}}</router-link>
        </div>
        <div class="or">{{$t('sign.or')}}</div>
        <ul class="other cl">
            <li @click="facebookLogin"><img src="../../../assets/images/facebook.png" alt=""></li>
            <!-- <li><img src="../../../assets/images/wechat.png" alt=""></li> -->
            <!-- <li><img src="../../../assets/images/qq.png" alt=""></li> -->
        </ul>
    </div>
    <div class="back_toIndex">
      <router-link to="/">{{$t('head.backHome')}}</router-link>  
    </div>
  </div>
    
</template>

<script>
import {
  addEvent,
  removeEvent,
  afterLogin,
  messageTips,
  checkIsEmpty,
  checkPwdLength
} from "../../../assets/js/utils";
let FBLoad;
export default {
  data() {
    return {
      account: "",
      password: "",
      isRequest: false,
      canSeePwd: false
    };
  },
  created() {
    addEvent(document, "keyup.signIn", event => {
      var event = event || window.event;
      if (event.keyCode == 13) {
        this.submit();
      }
    });
    if (typeof FBLoad != "function") {
      FBLoad = require("../../../assets/js/facebook").FBLoad;
    }
  },
  destroyed(){
    removeEvent(document, "keyup.signIn");
  },
  methods: {
    //facebook登陸
    facebookLogin() {
      FBLoad({
        success: () => {
          FB.login(loginRes => {
            if (
              loginRes.status == undefined ||
              loginRes.status === "not_authorized"
            ) {
              messageTips(this.$t("sign.tips.landingAuthError"), "error");
              return false;
            }
            FB.api("/me", meRes => {
              let uid = meRes.id;
              let name = meRes.name;
              let avatar = `https://graph.facebook.com/${uid}/picture`;
              this.axios
                .post(`api/web/v1/facebooks/login?lang_id=${this.lang_id}`, {
                  uid: uid,
                  name: name,
                  avatar: avatar
                })
                .then(res => {
                  if (res.data.code != "1000") {
                    messageTips(res.data.message, "error");
                    return false;
                  }
                  messageTips(this.$t("sign.tips.loginSuccess"));
                  var token = res.data.data.api_token;
                  afterLogin(this, token, 1000);
                })
                .catch(error => {
                  //nothing
                });
            });
          });
        },
        error: () => {
          messageTips(this.$t("sign.tips.networkError"), "error");
        }
      });
    },
    //檢測登陸信息
    checkLogin(fn) {
      if (checkIsEmpty(this.account) || checkIsEmpty(this.password)) {
        messageTips(this.$t("sign.tips.empty"), "error");
        return;
      }
      //检查密码長度
      if (!checkPwdLength(this.password)) {
        messageTips(this.$t("sign.tips.pwdLength"), "error");
        return;
      }
      fn && fn.call(this);
    },
    //提交登陸
    submit() {
      this.checkLogin(() => {
        if (this.isRequest) return false;
        var qs = require("qs");
        this.isRequest = true;
        this.axios
          .post(
            `api/web/v1/users/login?lang_id=${this.lang_id}`,
            qs.stringify({
              username: this.account,
              password: this.password
            })
          )
          .then(res => {
            var data = res.data;
            if (data.code == "1008") {
              messageTips(this.$t("sign.tips.accountError"), "error");
            } else if (data.code == "1009") {
              messageTips(this.$t("sign.tips.pwdError"), "error");
            } else if (data.code == "1000") {
              messageTips(this.$t("sign.tips.loginSuccess"));
              var token = data.data.token;
              afterLogin(this, token, 1000);
            } else {
              messageTips(res.data.message, "error");
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
.inner-box .other {
  display: inline-block;
}
.inner-box .other li {
  float: left;
  width: 60px;
  overflow: hidden;
  margin-right: 15px;
  cursor: pointer;
}
.inner-box .other li:last-of-type {
  margin-right: 0;
}
.account,
.password {
  margin-bottom: 40px;
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
/* .code>div:first-of-type{
    float: left;
    width: 70%;
}
.code>div:last-of-type{
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
} */
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
.forgot a {
  color: #eee;
  font-size: 18px;
}
.forgot a:hover {
  text-decoration: underline;
}
.or {
  margin: 40px auto 20px auto;
  font-size: 18px;
  color: #eee;
}
</style>