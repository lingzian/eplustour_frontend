<template>
    <div>
        <div class="content">
            <div class="phone-icon">
                <div>
                    <input type="text" v-model="account" :placeholder="$t('sign.account')">
                </div>
            </div>
            <div class="pwd-icon">
                <div>
                    <input v-if="canSeePwd" type="text" v-model="password" :placeholder="$t('sign.pwd')">
                    <input v-else type="password" v-model="password" :placeholder="$t('sign.pwd')">
                    <img v-if="!canSeePwd" class="center-left" src="../../../assets/images/pwd-close.png" @click="canSeePwd = true">
                    <img v-else class="center-left" src="../../../assets/images/pwd-open.png" @click="canSeePwd = false">
                </div>
            </div>
            <!-- <div class="code-icon">
                <div>
                    <input type="text" v-model="code" :placeholder="$t('sign.verificationCode')">
                    <div class="code code-image" id="code-image" @click="refreshCode"></div>
                </div>
            </div> -->
        </div>
        <div class="btn" @click="submit">{{$t('sign.login')}}</div>
        <div class="forgot">
          <router-link to="/Forgot">{{$t('sign.forgotPwd')}}</router-link>
        </div>
        <div class="or">
            <div class="radius">{{$t('sign.or')}}</div>
            <div class="line center-left"></div>
        </div>
        <ul class="other cl">
            <div>
                <!-- <li><img src="../../../assets/images/wechat-mb.png" alt=""></li> -->
                <li @click="facebookLogin"><img src="../../../assets/images/facebook-mb.png" alt=""></li>
                <!-- <li><img src="../../../assets/images/qq-mb.png" alt=""></li> -->
            </div>
        </ul>
    </div>
</template>

<script>
import {
  afterLogin,
  messageTips,
  checkIsEmpty,
  checkPwdLength
} from "../../../assets/js/utils";
import { Indicator } from "mint-ui";
let FBLoad;
export default {
  data() {
    return {
      canSeePwd: false,
      password: "",
      account: "",
      isRequest: false
    };
  },
  created() {
    if (typeof FBLoad != "function") {
      FBLoad = require("../../../assets/js/facebook").FBLoad;
    }
  },
  methods: {
    facebookLogin() {
      Indicator.open();
      FBLoad({
        success: () => {
          FB.login(loginRes => {
            Indicator.close();
            if (
              loginRes.status == undefined ||
              loginRes.status === "not_authorized"
            ) {
              messageTips(this.$t("sign.tips.landingAuthError"));
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
                    messageTips(res.data.message);
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
          setTimeout(() => {
              Indicator.close();
          },1)
          messageTips(this.$t("sign.tips.networkError"), "error");
        }
      });
    },
    checkLogin(fn) {
      if (checkIsEmpty(this.account) || checkIsEmpty(this.password)) {
        messageTips(this.$t("sign.tips.empty"));
        return;
      }
      //检查密码長度
      if (!checkPwdLength(this.password)) {
        messageTips(this.$t("sign.tips.pwdLength"));
        return;
      }
      fn && fn.call(this);
    },
    submit() {
      this.checkLogin(() => {
        if (this.isRequest) return false;
        Indicator.open();
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
            Indicator.close();
            var data = res.data;
            if (data.code == "1008") {
              messageTips(this.$t("sign.tips.accountError"));
            } else if (data.code == "1009") {
              messageTips(this.$t("sign.tips.pwdError"));
            } else if (data.code == "1000") {
              messageTips(this.$t("sign.tips.loginSuccess"));
              var token = data.data.token;
              afterLogin(this, token, 1500);
            } else {
              messageTips(res.data.message);
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
.content > div:first-of-type > div {
  border-bottom: 0.013333rem solid #eee;
}
.content > div img {
  width: 0.453333rem;
}
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
.content > div:nth-of-type(2) > div input {
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
/* .content .code {
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
} */
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
  text-decoration: underline;
  padding: 0.2rem 0;
}
.forgot a {
  color: #1c92ff;
  font-size: 0.4rem;
}
.or {
  margin-top: 0.533333rem;
  position: relative;
}
.or > div.radius {
  width: 0.866667rem;
  height: 0.866667rem;
  border: 0.013333rem solid #ccc;
  line-height: 0.866667rem;
  text-align: center;
  border-radius: 50%;
  margin: 0 auto;
  color: #ccc;
  position: relative;
  z-index: 2;
  background-color: #f5f5f5;
}
.or > div.line {
  height: 0.03rem;
  background-color: #ccc;
  left: 0.533333rem;
  right: 0.533333rem;
  z-index: 1;
}
.other {
  text-align: center;
  padding: 0.666667rem 0;
}
.other > div {
  display: inline-block;
}
.other img {
  width: 1.2rem;
  height: 1.2rem;
}
.other li {
  float: left;
  margin-right: 1.466667rem;
}
.other li:last-of-type {
  margin-right: 0;
}
</style>
