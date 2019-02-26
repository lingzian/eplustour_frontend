<template>
    <div v-if="!hideHeader" id="mb-head" class="mb-headNav cl" :class="{'isScroll':isScroll,'hasBG':hasBG}">
        <!-- 左邊 -->
        <div v-if="hasBack" @click="back"><i class="el-icon-arrow-left center"></i></div>
        <div v-else></div>
        <!-- 中間 -->
        <div v-if="hasSearch" class="search-bar">
            <i class="el-icon-search center-left"></i>
            <input v-model="querySearch" type="text" :placeholder="$t('head.placeholder')" @focus="searchFocus" @keyup.enter="searchBtn">
        </div>
        <div v-else class="title">{{title}}</div>
        <!-- 右邊 -->
        <div>
            <div class="point" v-if="hasMessage && token && headerData.unReadMessage != undefined && headerData.unReadMessage != '' && headerData.unReadMessage != '0'">
              <span v-if="parseInt(headerData.unReadMessage) <= 99">{{headerData.unReadMessage}}</span>
              <span v-if="parseInt(headerData.unReadMessage)>99">99+</span>
            </div>
            <img v-if="hasMessage" @click="$router.push({path:'/Message'})" src="../../assets/images/home_10.png" alt="">
            <i v-if="hasSearchBtn" class="el-icon-search center" @click="searchBtn"></i>
            <img v-if="hasScreen" class="screen center" src="../../assets/images/screen.png" alt="" @click="$emit('modelEvent','showScreen')">
            <i v-if="$route.name == 'TravelerList' || $route.name == 'ChooseTraveler'"
              class="el-icon-plus center"
              @click="$router.push({path:'/TravelerInfo',name:'TravelerInfo',params:{flag:$route.name == 'ChooseTraveler'}})">
            </i>
        </div>
    </div>
</template>

<script>
import {
  addEvent,
  removeEvent,
  getRect,
  getScroll,
  cookie,
  messageTips,
  trimString
} from "../../assets/js/utils";
export default {
  props: {
    headerData: Object
  },
  data() {
    return {
      unReadMessage: "",
      hideHeader: false, //是否隱藏頭部
      querySearch: "", //綁定input的輸入
      isScroll: false, //監聽滾動給的狀態
      items: new Object(), //用戶信息
      token: cookie.get("token"), //token

      title: "", //標題
      hasBG: false,
      scrollBar: false,
      hasSearch: false,
      hasMessage: false,
      hasBack: false,
      isIndex: false,
      isHot: false,
      isSearch: false,
      hasSearchBtn: false,
      hasScreen: false,
      scrollBarHeight: 0,
      isRecommendSearch: false
    };
  },
  watch: {
    $route: function() {
      this.setData();
      this.play();
    }
  },
  mounted() {
    this.setData();
    this.play();
  },
  methods: {
    //返回按鈕
    back() {
      if (this.$route.name == "ChooseTraveler") {
        this.$emit("modelEvent", "back");
        return false;
      }
      if (this.$route.name == "TravelerInfo" && this.$route.params.flag) {
        this.$router.replace({
          path: "/ChooseTraveler",
          name: "ChooseTraveler",
          params: {
            flag: true
          }
        });
        return false;
      }
      if (this.routeIdx <= 1) {
        this.$router.push({ path: "/" });
      } else {
        this.$router.go(-1);
      }
    },
    //每次執行
    play() {
      if (!this.isSearch && !this.isRecommendSearch) {
        this.querySearch = "";
      }
      if (this.scrollBar) {
        this.$nextTick(() => {
          this.bindScroll();
        });
      } else {
        removeEvent(document, "scroll.mobileHeader");
      }
      if (this.hasMessage && this.token && this.$route.name != "Index") {
        this.getUserInfo();
      }
      if (this.isSearch) {
        this.querySearch = this.$route.query.querySearch || "";
      }
    },
    //請求用戶信息
    getUserInfo() {
      this.axios
        .get(`api/web/v1/users/profile?lang_id=${this.lang_id}`)
        .then(res => {
          if (res.data.code == "1000") {
            this.items = Object.freeze(res.data.data);
            this.unReadMessage = this.items.unread_message;
          } else {
            messageTips(res.data.message);
          }
        });
    },
    //點擊搜索按鈕
    searchBtn() {
      this.$router.push({
        path: "/Search",
        query: { querySearch: trimString(this.querySearch) }
      });
    },
    //當搜索框聚焦
    searchFocus() {
      if (this.isIndex || this.isHot) {
        this.$router.push({ path: "/RecommendSearch" });
      } else if (this.isSearch) {
        this.$router.go(-1);
      }
    },
    //滾動添加背景顏色
    bindScroll() {
      let head = document.querySelector("#mb-head");
      let headHeight = getRect(head).height;
      let minScrollTop =
        lib.flexible.rem2px(this.scrollBarHeight || 4.8) - headHeight;
      let setScroll = () => {
        let scrollTop = getScroll().top;
        if (scrollTop >= minScrollTop) {
          this.isScroll = true;
        } else {
          this.isScroll = false;
        }
      };
      setScroll();
      addEvent(document, "scroll.mobileHeader", () => {
        setScroll();
      });
    },
    //設置
    setData() {
      this.resetData();
      let name = this.$route.name;
      if (name == "Index") {
        this.hasSearch = true;
        this.scrollBar = true;
        this.hasMessage = true;
        this.isIndex = true;
      } else if (name == "Detail") {
        this.hasBack = true;
        this.scrollBar = true;
        this.scrollBarHeight = 8.266667;
      } else if (name == "RecommendSearch") {
        this.hasBG = true;
        this.hasSearch = true;
        this.hasBack = true;
        this.hasSearchBtn = true;
        this.isRecommendSearch = true;
      } else if (name == "Search") {
        this.hasBG = true;
        this.hasSearch = true;
        this.hasBack = true;
        this.hasScreen = true;
        this.isSearch = true;
      } else if (name == "SignIn" || name == "SignUp") {
        this.hasBack = true;
      } else if (name == "AboutUs") {
        this.hasBack = true;
        this.hasBG = true;
        this.title = this.$t("head.aboutUs");
      } else if (name == "Buy") {
        this.hasBG = true;
        this.hasBack = true;
        this.title = this.$t("buy.confirm");
      } else if (name == "CheckOut") {
        this.hasBG = true;
        this.title =
          this.headerData.type == "1"
            ? this.$t("info.checkOutSuccess")
            : this.$t("info.checkOutFailure");
      } else if (name == "Evaluate") {
        this.hasBG = true;
        this.hasBack = true;
        this.title = this.$t("info.evaluate");
      } else if (name == "Forgot") {
        this.hasBG = true;
        this.hasBack = true;
        this.title = this.$t("sign.forgotTitle");
      } else if (name == "Hot") {
        this.hasBG = true;
        this.hasSearch = true;
        this.hasBack = true;
        this.hasMessage = true;
        this.isHot = true;
      } else if (name == "Info") {
        this.hasBG = true;
        this.hasBack = true;
        this.title = this.$t("info.writeInfos");
      } else if (name == "Language") {
        this.hasBG = true;
        this.hasBack = true;
        this.title = this.$t("head.menu.language");
      } else if (name == "Message") {
        this.hasBG = true;
        this.hasBack = true;
        this.title = this.$t("head.message");
      } else if (name == "MessageList") {
        this.hasBG = true;
        this.hasBack = true;
        this.title = this.headerData.title || this.$route.query.name;
      } else if (name == "MessageDetail") {
        this.hasBack = true;
        this.hasBG = true;
        this.title = this.$t("head.messageDetail");
      } else if (name == "OrderDetail") {
        this.hasBG = true;
        this.hasBack = true;
        this.title = this.$t("order.name");
      } else if (name == "PassportDetail") {
        this.hasBack = true;
        this.hasBG = true;
        this.title =
          this.$route.query.is_passport == "0"
            ? this.$t("user.passportNew")
            : this.$t("user.passportDetail");
      } else if (name == "Pay") {
        this.hasBG = true;
        this.hasBack = true;
        this.title = this.$t("info.payment");
      } else if (name == "Qa") {
        this.hasBack = true;
        this.hasBG = true;
        this.title = this.$t("head.qa");
      } else if (name == "QaDetail") {
        this.hasBack = true;
        this.hasBG = true;
        this.title = this.$t("head.qa");
      } else if (name == "Strategy") {
        this.hasBG = true;
        this.hasBack = true;
        this.title = this.$t("head.menu.strategy");
      } else if (name == "Trip") {
        this.hasBack = true;
        this.hasBG = true;
        this.title = this.$t("head.trip");
      } else if (name == "Collection") {
        this.hasBack = true;
        this.hasBG = true;
        this.title = this.$t("user.collection");
      } else if (name == "PointsRebate") {
        this.hasBack = true;
        this.hasBG = false;
        this.title = this.$t("head.menu.rebate");
      } else if (name == "Profile") {
        this.hasBack = true;
        this.hasBG = true;
        this.title = this.$t("head.menu.profile");
      } else if (name == "TravelerList") {
        this.title = this.$t("user.travelerInformation");
        this.hasBG = true;
        this.hasBack = true;
      } else if (name == "TravelerInfo") {
        this.title = this.$route.query.id
          ? this.$t("user.travelerInformationEdit")
          : this.$t("user.travelerInformationAdd");
        this.hasBG = true;
        this.hasBack = true;
      } else if (name == "ChooseTraveler") {
        this.title = this.$t("user.chooseTraveler");
        this.hasBG = true;
        this.hasBack = true;
      } else {
        this.hideHeader = true;
      }
    },
    //重置
    resetData() {
      this.title = "";
      this.hasBG = false;
      this.scrollBar = false;
      this.hasSearch = false;
      this.hasMessage = false;
      this.hasBack = false;
      this.isIndex = false;
      this.isHot = false;
      this.isSearch = false;
      this.hasSearchBtn = false;
      this.hasScreen = false;
      this.scrollBarHeight = 0;
      this.isRecommendSearch = false;
      this.hideHeader = false;
      this.unReadMessage = "";
    },
  }
};
</script>

<style scoped>
.mb-headNav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 1.333333rem;
  line-height: 1.333333rem;
  color: #fff;
  background-color: transparent;
  padding: 0 0.333333rem;
  z-index: 3;
}
.mb-headNav.isScroll {
  background-color: #54b5ff;
}
.mb-headNav.hasBG,
.mb-headNav.isScroll {
  background-color: #2d9aff;
}
.mb-headNav > div:first-of-type,
.mb-headNav > div:last-of-type {
  position: relative;
  z-index: 2;
  height: 100%;
  width: 0.6rem;
}
.mb-headNav > div:first-of-type {
  float: left;
}
.mb-headNav > div:first-of-type i {
  font-size: 0.533333rem;
}
.mb-headNav > div.title {
  width: 100%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  text-align: center;
  font-size: 0.45rem;
  letter-spacing: 0.013333rem;
  text-indent: 0.013333rem;
  z-index: 1;
}
.mb-headNav > div:last-of-type {
  float: right;
}
.mb-headNav > div:last-of-type img {
  margin-top: -0.04rem;
}
.mb-headNav > div:last-of-type i {
  font-size: 0.533333rem;
}
.mb-headNav .search-bar {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.mb-headNav .search-bar input {
  width: 7.466667rem;
  height: 0.733333rem;
  border: 0;
  outline: 0;
  padding: 0 0.75rem;
  border-radius: 0.106667rem;
  font-size: 0.38rem;
}
.mb-headNav .search-bar i {
  font-size: 0.4rem;
  left: 0.133333rem;
  color: #54b5ff;
}
.mb-headNav .screen {
  width: 0.48rem;
}
.point {
  position: absolute;
  min-width: 0.36rem;
  height: 0.36rem;
  line-height: 0.36rem;
  text-align: center;
  background-color: #f00;
  padding: 0 0.1rem;
  color: #fff;
  font-size: 0.3rem;
  border-radius: 50px 50px 50px 50px;
  top: 0.3rem;
  right: -0.2rem;
}
</style>
