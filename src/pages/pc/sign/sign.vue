<template>
  <div class="login min-width">
      <div class="login-box">
            <div class="title cl">
                <div :class="{'select':navIdx == 1}">
                    <router-link :to="{path:'/Sign',query:{redirect:this.$route.query.redirect}}" replace>{{$t('sign.login')}}</router-link>
                </div>
                <div :class="{'select':navIdx == 2}">
                    <router-link :to="{path:'/Sign/SignUp',query:{redirect:this.$route.query.redirect}}" replace>{{$t('sign.register')}}</router-link>
                </div>
            </div>
            <router-view :recommendedCode="recommendedCode" :recommendedCodeOnlyRead="recommendedCodeOnlyRead"/>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navIdx: 1,
      recommendedCode: this.$route.query.code || "",
      recommendedCodeOnlyRead : !!this.$route.query.code
    };
  },
  created() {
    this.setNav();
  },
  watch: {
    $route: function() {
      this.setNav();
    }
  },
  methods: {
    setNav() {
      if (this.$route.path.indexOf("SignUp") == -1) {
        this.navIdx = 1;
      } else {
        this.navIdx = 2;
      }
    },
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
  background-image: url(../../../assets/images/sign-bg.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-color: #2993ff;
  min-height: 960px;
}
.login-box {
  width: 600px;
  margin: 0 auto;
  margin-top: 120px;
  /* position: absolute;
  top: 46%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%); */
}
.login .title > div {
  float: left;
  width: 50%;
  height: 80px;
  line-height: 80px;
  text-align: center;
  font-size: 28px;
}
.login .title > div.select {
  font-size: 40px;
}
.login .title > div a {
  color: #000;
  -webkit-transition: all .15s;
  -moz-transition: all .15s;
  -ms-transition: all .15s;
  -o-transition: all .15s;
  transition: all .15s;
  border-bottom: 2px solid #000;
}
.login .title > div.select a {
  color: #fff;
  border-bottom: 0;
}
</style>
