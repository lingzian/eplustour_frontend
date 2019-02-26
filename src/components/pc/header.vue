<template>
  <div class="head min-width">
      <div class="col-width cl">
          <div class="logo">
              <!-- 判断是否首页，是否需要点击 -->
              <router-link v-if="$route.path!='/'" to="/">
                <img class="center" src="../../assets/images/1_02.png" alt="">
              </router-link>
              <img v-else class="center" src="../../assets/images/1_02.png" alt="">
          </div>

          <div class="input">
              <input v-model="input" class="input-inner center-left" @focus="searchBoxShow = true" @blur="searchBoxShow = false" @keyup.enter="routerToSearch" type="text" :placeholder="$t('head.placeholder')" spellcheck="false">
              <i class="el-icon-search" @click="routerToSearch"></i>
              <!-- 弹出层 -->
              <transition name="fade">
                <div v-if="searchBoxShow" class="input-box">
                  <i class="el-icon-arrow-up"></i>
                  <ul>
                    <li>
                      <div class="title">{{$t('head.hotSearch')}}</div>
                      <div class="search-list cl">
                        <div v-for="(item,index) in searchRecommend.items" :key="index" @click="input = item.name;routerToSearch()">{{item.name}}</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </transition>
          </div>

          <div class="tourist">

            <el-tooltip effect="dark" :content="$t('head.trip')" placement="bottom">
              <router-link v-if="token" to="/Trip">
                <img src="../../assets/images/10_05.png" alt="">
              </router-link>
            </el-tooltip>

            <el-tooltip effect="dark" :content="$t('head.qa')" placement="bottom">
              <router-link to="/Qa">
                <img src="../../assets/images/10_07.png" alt="">
              </router-link>
            </el-tooltip>

            <el-tooltip effect="dark" :content="$t('head.message')" placement="bottom">
              <router-link v-if="token" to="/Message">
                <span class="bell-number">
                  <div v-if="items.unread_message && items.unread_message != '0'"><span v-if="items.unread_message <= 99">{{items.unread_message}}</span><span v-if="items.unread_message > 99">99</span><span v-if="parseInt(items.unread_message)>99">+</span></div>
                  <img src="../../assets/images/10_10.png" alt="">
                </span>
              </router-link>
             </el-tooltip>

            <el-tooltip effect="dark" :content="$t('user.vipName')" placement="bottom">
              <router-link to="/User/Vip">
                <img src="../../assets/images/vip-headicon.png" alt="">
              </router-link>
            </el-tooltip>

            <div class="user-head-box">
              <router-link to="/User">
                <span v-if="!token">
                  <img class="user-head" src="../../assets/images/user1.png" alt="">
                </span>
                <span v-else-if="items.thumb != undefined">
                  <head-image class="user-head" :thumb="items.thumb"></head-image>
                </span>
              </router-link>
            </div>

            <el-dropdown class="language-select" trigger="click" @command="handleLanguage">
              <span class="el-dropdown-link" style="color:#2d9aff;font-size:16px;">{{language}}<i class="el-icon-arrow-down el-icon--right"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="zh">简体中文</el-dropdown-item>
                <el-dropdown-item command="sp">繁體中文</el-dropdown-item>
                <el-dropdown-item command="en">English</el-dropdown-item>
              </el-dropdown-menu>
		        </el-dropdown>

            <span v-if="token" class="exit" @click="exit">{{$t('head.exit')}}</span>

          </div>

      </div>
  </div>
</template>

<script>
import {
  afterExit,
  cookie,
  messageTips,
  trimString
} from "../../assets/js/utils";
import headImage from "../common/headImage";
export default {
  props: ["headerData"],
  components: {
    headImage
  },
  data() {
    return {
      input: this.$route.query.querySearch || "",
      language: "",
      items: new Object(),
      searchRecommend: new Object(),
      searchBoxShow: false,
      token: cookie.get("token")
    };
  },
  watch: {
    $route() {
      this.input = this.$route.query.querySearch || "";
      this.token && this.getUserInfo();
      this.getRecommends();
    }
  },
  created() {
    this.getRecommends();
    this.getMessage();
    this.token && this.getUserInfo();
  },
  methods: {
    //跳去搜索頁
    routerToSearch() {
      if (this.$route.path == "/Search") {
        this.$emit("modelEvent", "headerSearch", this.input);
      } else {
        this.$router.push({
          path: "/Search",
          query: {
            querySearch: trimString(this.input)
          }
        });
      }
    },
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
            this.$emit('modelEvent', 'getSearchPlaceholder', this.searchRecommend.items);
          } else {
            messageTips(res.data.message, "error");
          }
        });
    },
    //獲取用戶信息
    getUserInfo() {
      this.axios
        .get(`api/web/v1/users/profile?lang_id=${this.lang_id}`)
        .then(res => {
          if (res.data.code == "1000") {
            this.items = res.data.data;
            this.$emit("modelEvent", "getUserData", this.items);
          } else {
            messageTips(res.data.message, "error");
          }
        });
    },
    //选择语言触发的回调
    handleLanguage(command) {
      this.$i18n.locale = command;
      cookie.set("language", command, 30 * 24);
      this.$emit("modelEvent", "changeLanguage");
      this.$router.go(0);
    },
    //語言信息
    getMessage() {
      if (this.lang_id == 1) {
        this.language = "简体中文";
      } else if (this.lang_id == 2) {
        this.language = "繁體中文";
      } else if (this.lang_id == 3) {
        this.language = "English";
      }
    },
    //退出登陆
    exit() {
      this.axios
        .post(`/api/web/v1/users/logout?lang_id=${this.lang_id}`)
        .then(res => {
          if (res.data.code == "1000") {
            messageTips(this.$t("head.exitSuccess"));
            afterExit(this);
          } else {
            messageTips(res.data.message, "error");
          }
        });
    }
  }
};
</script>

<style scoped>
.user-head{
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.head {
  height: 80px;
  border-bottom: 2px solid #2d9aff;
  background-color: #fff;
}
.head > div,
.head > div > div {
  height: 100%;
}
.logo {
  float: left;
  position: relative;
  width: 130px;
  text-align: center;
}
.logo img {
  height: auto;
}
.input {
  float: left;
  width: 500px;
  margin-left: 110px;
  position: relative;
}
.input .input-box {
  position: absolute;
  top: 58px;
  left: 0;
  width: 470px;
  background-color: #fff;
  z-index: 2;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 15px;
}
.input .input-box i {
  position: absolute;
  top: -11px;
  left: 50px;
  color: #ccc;
  background-color: #fff;
}
.input .input-inner {
  font-size: 15px;
  width: 470px;
  height: 35px;
  border-bottom: 1px solid #2d9aff;
  outline: 0;
}
.input > i {
  position: absolute;
  top: 55%;
  right: 0;
  -webkit-transform: translate(0, -50%);
  -moz-transform: translate(0, -50%);
  -ms-transform: translate(0, -50%);
  -o-transform: translate(0, -50%);
  transform: translate(0, -50%);
  font-size: 22px;
  color: #2d9aff;
  cursor: pointer;
}
.input .title {
  color: #ffad52;
  font-size: 14px;
  border-bottom: 1px solid #eee;
  height: 30px;
  line-height: 30px;
}
.input .search-list {
  margin-bottom: 8px;
}
.input .search-list > div {
  float: left;
  margin-right: 15px;
  margin-top: 15px;
  font-size: 14px;
  word-break: break-all;
  cursor: pointer;
}
.tourist {
  float: right;
  line-height: 80px;
}
.tourist img {
  width: 20px;
  margin: 0 10px;
}
.tourist .newAdd_img {
  width: 17px;
}
.language-select {
  cursor: pointer;
}
.user-head {
  width: 40px !important;
  height: 40px;
  border-radius: 50%;
  display: inline-block;
  vertical-align: middle;
}
.notice {
  position: relative;
}
.notice:after {
  content: " ";
  display: block;
  position: absolute;
  top: -45%;
  right: 16%;
  width: 10px;
  height: 10px;
  background-color: #f00;
  border-radius: 50%;
}
.exit {
  font-size: 14px;
  cursor: pointer;
  color: #979797;
}
.exit:hover {
  text-decoration: underline;
}
.bell-number {
  position: relative;
}
.bell-number div {
  background-color: #f00;
  color: #fff;
  position: absolute;
  top: -9px;
  right: -6px;
  text-align: center;
  height: 16px;
  line-height: 14px;
  padding: 0 6px;
  font-size: 12px;
  border-radius: 14px;
}
.bell-number span:last-child{
  vertical-align: 1px;
}
.user-head-box {
  display: inline-block;
  width: 60px;
  text-align: center;
}
</style>
