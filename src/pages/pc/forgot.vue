<template>
  <div class="login min-width">
      <div class="login-box">
            <div class="title cl">
                <div class="select">{{$t('sign.forgotTitle')}}</div>
            </div>
            <div class="inner-box">
              <div class="email">
                  <input v-model="email" type="text" :placeholder="$t('sign.email')">
                  <div v-if="!isSendCode" class="send-code" @click="sendCode">{{$t('sign.sendCode')}}</div>
                  <div v-else class="send-code isSendCode">{{countNumber + $t('sign.second')}}</div>
              </div>
              <div class="verificationCode">
                  <input v-model="verificationCode" type="text" :placeholder="$t('sign.verificationCode')">
              </div>
              <div class="password">
                  <input v-model="password" type="password" :placeholder="$t('sign.newPwd')">
              </div>
              <div class="password">
                  <input v-model="passwordAg" type="password" :placeholder="$t('sign.newPwdAg')">
              </div>
              <div class="btn" @click="submit">{{$t('info.submit')}}</div>
            </div>
      </div>
  </div>
</template>

<script>
import { checkIsEmpty,messageTips,checkIsEmail,checkPwdFormat,checkPwdLength } from '../../assets/js/utils'
export default {
  data() {
    return {
      email: "",
      password: "",
      passwordAg: "",
      verificationCode: "",
      isSendCode : false,
      countNumber : 59,
      timer : null,
    }
  },
  methods : {
    submit(){
      var email = this.email;
      var password = this.password;
      var passwordAg = this.passwordAg;
      var verificationCode = this.verificationCode;
      // 驗證是否為空
      if(checkIsEmpty(email) || checkIsEmpty(password) || checkIsEmpty(passwordAg) || checkIsEmpty(verificationCode)){
        messageTips(this.$t("sign.tips.empty"),'error');
        return;
      }
      //驗證郵箱格式
      if(!checkIsEmail(email)){
        messageTips(this.$t("user.error.email"),'error');
        return;
      }
      //两次密码输入不一致
      if(password != passwordAg){
        messageTips(this.$t("sign.tips.pwdOther"),'error');
        return;
      }
      //检查密码長度
      if (!checkPwdLength(password)) {
        messageTips(this.$t("sign.tips.pwdLength"),'error');
        return;
      }
      //检查密码格式
      if(!checkPwdFormat(password)){
        messageTips(this.$t("sign.tips.pwdFormat"),'error');
        return;
      }
      this.axios.post(`api/web/v1/users/forget-password?lang_id=${this.lang_id}`,{
        code : verificationCode,
        password : password,
        repeat_password : passwordAg,
      }).then(res => {
        if(res.data.code != '1000'){
          messageTips(res.data.message,'error');
          return false;
        }
        messageTips(this.$t('sign.tips.forgotSuccess'));
        this.$router.push({path:'/Sign'});
      })
    },
    //發送驗證碼
    sendCode(){
      var email = this.email;
      if(checkIsEmpty(email) || !checkIsEmail(email)){
        messageTips(this.$t("user.error.email"),'error');
        return;
      }
      this.axios.post(`api/web/v1/emails/verification-code?lang_id=${this.lang_id}`,{
        email : email,
        type : '1'
      }).then(res => {
        if(res.data.code != '1000'){
          messageTips(res.data.message,'error');
          return false;
        }
        this.countCode();
      })
    },
    //開始倒計時
    countCode(){
      this.countNumber = 59;
      this.isSendCode = true;
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.countNumber--;
        if(this.countNumber == 0){
          clearInterval(this.timer);
          this.isSendCode = false;
        }
      },1000)
    }
  }
};
</script>

<style scoped>
.login {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: url(../../assets/images/sign-bg.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-color: #2993ff;
}
.login-box {
  width: 600px;
  position: absolute;
  top: 46%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.login .title > div {
  height: 80px;
  line-height: 80px;
  text-align: center;
  font-size: 28px;
  color: #000;
  -webkit-transition: all 0.15s;
  -moz-transition: all 0.15s;
  -ms-transition: all 0.15s;
  -o-transition: all 0.15s;
  transition: all 0.15s;
}
.login .title > div.select {
  color: #fff;
  font-size: 40px;
}
.inner-box {
  background-image: url(../../assets/images/sign-small-bg.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  text-align: center;
  padding: 45px 35px;
}
.inner-box>div{
  margin-bottom: 30px;
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
.inner-box .btn{
    width: 300px;
    font-size: 28px;
    color: #2d9aff;
    background-color: #fff;
    border-radius: 30px;
    margin: 0 auto;
    padding: 12px 0;
    margin-bottom: 0px;
    cursor: pointer;
    margin-top: 50px;
}
.email{
  position: relative;
}
.email input{
    padding-right: 140px;
}
.send-code{
  position: absolute;
  top: 0;
  right: 18px;
  height: 100%;
  line-height: 59px;
  color: #000;
  cursor: pointer;
}
.send-code.isSendCode{
  cursor: default;
}
</style>