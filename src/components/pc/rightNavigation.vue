<template>
    <div v-show="isFixed" class="navBox">
        <div class="nav">
            <ul class="nav_tourist">

                <li v-if="token">
                    <el-tooltip effect="dark" :content="$t('head.trip')" placement="left">
                        <router-link v-if="token" to="/Trip">
                            <i class="icon-order"></i>
                        </router-link>
                    </el-tooltip>
                </li>

                <li>
                    <el-tooltip effect="dark" :content="$t('head.qa')" placement="left">
                        <router-link to="/Qa">
                            <i class="icon-question"></i>
                        </router-link>
                    </el-tooltip>
                </li>

                <li v-if="token">
                    <el-tooltip effect="dark" :content="$t('head.message')" placement="left">
                        <router-link v-if="token" to="/Message">
                            <span class="bell-number">
                                <div v-if="items.unread_message && items.unread_message != '0'">{{items.unread_message}}</div>
                                <i class="icon-notice"></i>
                            </span>
                        </router-link>
                    </el-tooltip>
                </li>

                <li>
                    <el-tooltip effect="dark" :content="$t('user.vipName')" placement="left">
                        <router-link to="/User/Vip">
                            <i class="icon-vip"></i>
                        </router-link>
                    </el-tooltip>
                </li>

                <li class="go_toTop" @click="toTop(0, 100)">
                    <i class="el-icon-arrow-up"></i>
                </li>

            </ul>
        </div>
    </div>
</template>
<script>
import {
  cookie,
  messageTips,
  addEvent,
  removeEvent,
  getScroll,
  back_topTop
} from "../../assets/js/utils";
import headImage from "../common/headImage";
export default {
  components: {
    headImage
  },
  data() {
    return {
      isFixed: false,
      items: new Object(),
      searchRecommend: new Object(),
      token: cookie.get("token")
    };
  },
  watch: {
    $route() {
      this.token ;
    }
  },
  created() {
    this.getRecommends();
  },
  methods: {
    //推薦熱標籤
    getRecommends() {
      this.axios
        .get("/api/web/v1/recommends", {
          params: {
            lang_id: this.lang_id
          }
        })
        .then(res => {
          if (res.data.code == "1000") {
            this.$set(
              this.searchRecommend,
              "items",
              Object.freeze(res.data.data.items)
            );
          } else {
            messageTips(res.data.message, "error");
          }
        });
    },
    scrollEvent() {
        addEvent(window, 'scroll.rightNav',() => {
            let routerPath = this.$route.path;
            if(routerPath == '/'){
                if(getScroll().top>=578){
                    this.isFixed = true;
                }else{
                    this.isFixed = false;
                }
            }
            if(routerPath == '/Detail'){
                if(getScroll().top>=78){
                    this.isFixed = true;
                }else{
                    this.isFixed = false;
                }
            }
        });
    },
    toTop(a,b) {
        back_topTop(a,b);
    }
  },
  mounted () {
      this.scrollEvent();
  },
  destroyed () {
      removeEvent(window, 'scroll.rightNav');
  }
};
</script>

<style scoped>
.navBox{
    z-index: 10;
    width: 50px;
    height: 100vh;
    position: fixed;
    background: #333;
    top: 0%;
    right: 0%;
}
.nav {
  width: 100%;
  height: 100%;
}
.nav_tourist{
    height: 100%;
    position: relative;
    margin-top: 50px;
}
.nav_tourist li{
    height: 50px;
    width: 100%;
}
.el-icon-arrow-up{
    text-align: center;
    position: absolute;
    bottom: 50px;
    cursor: pointer;
}
.nav_tourist li i{
    font-size: 25px;
    line-height: 50px;
    text-align: center;
    color: white;
}
.nav_tourist li i::before{
    color: white;
}
.nav_tourist li :hover{
    background: white;
 }
 .nav_tourist li:hover i:before{
     color: #2d9aff;
 }
.nav_tourist li a{
    display: inline-block;
    height: 100%;
    width: 100%;
    line-height: 50px;
    text-align: center;
}

/* 首页右侧导航 */
.go_toTop:last-child{
    position: absolute;
    bottom: 50px;
}
.go_toTop i{
	font-size: 25px;
    text-align: center;
    color: white;
    display: inline-block;
    width: 100%;
    line-height: 50px;
    position: relative;
    bottom: 0;
}
.go_toTop i:hover{
    color: #2d9aff;
}

</style>
