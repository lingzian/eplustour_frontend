<template>
    <div>
        <div class="banner"><img src="../../../assets/images/top.jpg" alt=""></div>
        <div class="nav cl">
            <div :class="{'select':navIdx == 1}">
                <div class="center"><router-link :to="{path:'/Sign',query:{redirect:this.$route.query.redirect}}" replace>{{$t('sign.login')}}</router-link></div>
            </div>
            <div :class="{'select':navIdx == 2}">
                <div class="center"><router-link :to="{path:'/Sign/SignUp',query:{redirect:this.$route.query.redirect}}" replace>{{$t('sign.register')}}</router-link></div>
            </div>
        </div>
        <router-view :recommendedCode="recommendedCode" :recommendedCodeOnlyRead="recommendedCodeOnlyRead" />
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
  mounted() {
    document.body.style.backgroundColor = "#f5f5f5";
    this.setNav();
  },
  destroyed(){
    document.body.style.backgroundColor = "#fff";
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
    }
  }
};
</script>

<style scoped>
.banner {
  height: 3.8rem;
}
.banner img {
  height: 100%;
}
.nav {
  background-color: #fff;
}
.nav > div {
  width: 50%;
  height: 1.2rem;
  line-height: 1.2rem;
  float: left;
  position: relative;
}
.nav > div div {
  width: 50%;
  height: 100%;
  font-size: 0.4rem;
  text-align: center;
}
.nav > div.select div {
  border-bottom: 0.04rem solid #1c92ff;
}
.nav > div div a{
  color: #000;
}
.nav > div.select div a{
  color: #1c92ff;
}
</style>
