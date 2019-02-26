<template>
  <div>
    <div class="mb-padding-content">
        <div class="content">

            <div class="email-icon">
                <div>
                    <input type="text" v-model="email" :placeholder="$t('sign.email')">
                    <div v-if="!isSendCode" class="send-code" @click="sendCode">{{$t('sign.sendCode')}}</div>
                    <div v-else class="send-code">{{countNumber + $t('sign.second')}}</div>
                </div>
            </div>
            <div class="code-icon">
                <div>
                    <input type="text" v-model="verificationCode" :placeholder="$t('sign.verificationCode')">
                </div>
            </div>

            <div class="pwd-icon">
                <div>
                    <input v-if="canSeePwd" type="text" v-model="password" :placeholder="$t('sign.newPwd')">
                    <input v-else type="password" v-model="password" :placeholder="$t('sign.newPwd')">
                    <img v-if="!canSeePwd" class="center-left" src="../../assets/images/pwd-close.png" @click="canSeePwd = true">
                    <img v-else class="center-left" src="../../assets/images/pwd-open.png" @click="canSeePwd = false">
                </div>
            </div>
            <div class="pwd-icon">
                <div>
                    <input v-if="canSeePwdAg" type="text" v-model="passwordAg" :placeholder="$t('sign.newPwdAg')">
                    <input v-else type="password" v-model="passwordAg" :placeholder="$t('sign.newPwdAg')">
                    <img v-if="!canSeePwdAg" class="center-left" src="../../assets/images/pwd-close.png" @click="canSeePwdAg = true">
                    <img v-else class="center-left" src="../../assets/images/pwd-open.png" @click="canSeePwdAg = false">
                </div>
            </div>

        </div>
        <div class="btn" @click="submit">{{$t('info.submit')}}</div>
    </div>
  </div>
</template>

<script>
import { checkIsEmpty,messageTips,checkIsEmail,checkPwdFormat,checkPwdLength } from '../../assets/js/utils'
export default {
  data(){
    return {
      email:'',
      password : '',
      passwordAg : '',
      verificationCode : '',
      isSendCode : false,
      countNumber : 59,
      timer : null,
      canSeePwd : false,
      canSeePwdAg : false,
    }
  },
  mounted(){
    document.body.style.backgroundColor = "#f5f5f5";
  },
  destroyed(){
    document.body.style.backgroundColor = "#fff";
  },
  methods : {
    submit(){
      var email = this.email;
      var password = this.password;
      var passwordAg = this.passwordAg;
      var verificationCode = this.verificationCode;
      // 驗證是否為空
      if(checkIsEmpty(email) || checkIsEmpty(password) || checkIsEmpty(passwordAg) || checkIsEmpty(verificationCode)){
        messageTips(this.$t("sign.tips.empty"));
        return;
      }
      //驗證郵箱格式
      if(!checkIsEmail(email)){
        messageTips(this.$t("user.error.email"));
        return;
      }
      //两次密码输入不一致
      if(password != passwordAg){
        messageTips(this.$t("sign.tips.pwdOther"));
        return;
      }
      //检查密码長度
      if (!checkPwdLength(password)) {
        messageTips(this.$t("sign.tips.pwdLength"));
        return;
      }
      //检查密码格式
      if(!checkPwdFormat(password)){
        messageTips(this.$t("sign.tips.pwdFormat"));
        return;
      }
      this.axios.post(`api/web/v1/users/forget-password?lang_id=${this.lang_id}`,{
        code : verificationCode,
        password : password,
        repeat_password : passwordAg,
      }).then(res => {
        if(res.data.code != '1000'){
          messageTips(res.data.message);
          return false;
        }
        messageTips(this.$t('sign.tips.forgotSuccess'));
        this.$router.push({path:'/Sign'});
      });
    },
    //發送驗證碼
    sendCode(){
      var email = this.email;
      if(checkIsEmpty(email) || !checkIsEmail(email)){
        messageTips(this.$t("user.error.email"));
        return;
      }
      this.axios.post(`api/web/v1/emails/verification-code?lang_id=${this.lang_id}`,{
        email : email,
        type : '1'
      }).then(res => {
        if(res.data.code != '1000'){
          messageTips(res.data.message);
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
.content > div:nth-of-type(3)>div{
  border-bottom: 0.013333rem solid #eee;
}
.content > div img {
  width: 0.453333rem;
}
.content > div:nth-of-type(3) {
  margin-top: 0.266667rem;
}
.content > div > div {
  padding-left: 0.8rem;
  background-position: 0.2rem center;
  background-size: 0.4rem;
  background-repeat: no-repeat;
  position: relative;
}
.content > div.pwd-icon > div {
  background-image: url(../../assets/images/sign-pwd.png);
}
.content > div.code-icon > div {
  background-image: url(../../assets/images/sign-code.png);
}
.content > div.email-icon > div {
  background-image: url(../../assets/images/sign-email.png);
} 
.content > div.pwd-icon > div input {
  padding-right: 0.773333rem;
}
.content > div.email-icon > div input {
  padding-right: 2.3rem;
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
.send-code{
  position: absolute;
  top: 0;
  right: 0;
  width: 2.266667rem;
  text-align: center;
  color: #1c92ff;
  font-size: .32rem;
}
</style>