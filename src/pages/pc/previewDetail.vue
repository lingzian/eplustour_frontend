<template>
    <div class="content col-width">

        <div class="language_set">
            <span>{{$t('head.menu.language')}} : </span>
            <span>
                <el-dropdown class="language-select" trigger="click" @command="handleLanguage">
                    <span class="el-dropdown-link" style="color:#2d9aff;font-size:16px;">{{language}}<i class="el-icon-arrow-down el-icon--right"></i></span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="zh">简体中文</el-dropdown-item>
                        <el-dropdown-item command="sp">繁体中文</el-dropdown-item>
                        <el-dropdown-item command="en">English</el-dropdown-item>
                    </el-dropdown-menu>
		        </el-dropdown>
            </span>
        </div>

        <!-- 麵包屑 -->
        <div class="amount-nav-search">
            <el-breadcrumb separator="//">
                <el-breadcrumb-item :to="{ path: '/' }">{{$t('footer.home')}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{$t('detail.detail')}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 內容 -->
        <div class="detail-content">

          <!-- 上 -->
          <div class="detail-title cl">
            <!-- 廣告圖 -->
            <div class="detail-title-banner">
              <!-- 輪播圖 -->
              <div class="banner-box bg">
                <swiper :options="swiperOptions" class="banner">
                  <swiper-slide v-for="(item,index) in items.thumb" :key="index" class="banner-slide">
                    <bg-image class="banner-slide-item bg" :thumb="item"></bg-image>
                  </swiper-slide>
                </swiper>
              </div>
              <!-- 廣告 -->
              <div class="trip-describe cl">
                <!-- 左邊評價 -->
                <div>
                  <div class="center">
                    <div>{{$t('detail.good')}}</div>
                    <div class="rate">
                        <el-rate
                            v-model="items.score"
                            disabled>
                        </el-rate>
                    </div>
                    <div>{{items.score || '0'}} {{$t('detail.reviews')}}</div>
                  </div>
                </div>
                <!-- 收藏 -->
                <div class="collection">
                    <img v-if="items.is_favourite == '1'" src="../../assets/images/collection-mark.png" alt="">
                    <img v-else src="../../assets/images/collection.png" alt="">
                </div>
              </div>
            </div>
            <!-- 簡介 -->
            <div class="detail-title-info">
              <div class="title" :title="items.name">{{items.name}}</div>
              <div class="price-box">
                <div class="price">
                  <span>{{$t('detail.price')}} : </span>
                  <span>******</span>
                </div>
                <div class="order-now bg">{{$t('buy.orderNow')}}</div>
              </div>
              <ul>
                <li>
                  <span>{{$t('detail.productNumber')}} : </span>
                  <span>{{items.number}}</span>
                </li>
                <li>
                  <span>{{$t('detail.productDays')}} : </span>
                  <span>{{items.total_day}} Days</span>
                </li>
              </ul>
            </div>
          </div>
          <!-- 導航 -->
          <div class="detail-menu">
            <ul class="detail-menu-fixedbox cl col-width" id="detail-menu" :class="{'isFixed':menuFixed.isFixed}" :style="`left:${menuFixed.fixedLeft}px`">
              <li @click="menuClick(0)">{{$t('detail.reservationNotice')}}</li>
              <li @click="menuClick(1)">{{$t('detail.meetingPoint')}}</li>
              <li @click="menuClick(2)">{{$t('detail.departureTime')}}</li>
              <li @click="menuClick(3)">{{$t('detail.calendar')}}</li>
              <li @click="menuClick(4)">{{$t('detail.productIntroduction')}}</li>
            </ul>
          </div>
          <!-- 內容 -->
          <div class="detail-info" id="detail-info">
            <!-- 预约通知 -->
            <div class="cl reservationNotice">
              <div class="detail-info-title">
                <span>{{$t('detail.reservationNotice')}}</span>
              </div>
              <div class="detail-info-content">
                <div v-for="(i,idx) in items.journey_declare" :key="idx"><span v-if="i.name">【{{i.name}}】</span>{{i.content}}</div>
              </div>
            </div>
            <!-- 集合地点 -->
            <div class="cl">
              <div class="detail-info-title">
                <span>{{$t('detail.meetingPoint')}}</span>
              </div>
              <div class="detail-info-content">{{items.meeting_place}}</div>
            </div>
            <!-- 出發日期 -->
            <div class="cl departureTime">
              <div class="detail-info-title">
                <span>{{$t('detail.departureTime')}}</span>
              </div>
              <div class="detail-info-content">
                <order-calendar v-if="items.sale_date" :textTop="dateTextTop" :saleDate="items.sale_date"></order-calendar>
              </div>
            </div>
            <!-- 日程表 -->
            <div class="cl calendar">
              <div class="detail-info-title">
                <span>{{$t('detail.calendar')}}</span>
                <div class="calendar-scroll" id="calendar-scroll" :class="{'isFixed':scrollInfoData.isFixed,'isBottom':scrollInfoData.isBottom}">
                  <div v-for="(item,index) in items.day_list" :key="index" @click="calendarClick(index)">D{{item.day}}</div>
                </div>
              </div>
              <div class="detail-info-content" id="calendar-box">
                <div v-for="(item,index) in items.day_list" :key="index">
                  <div class="detail-info-content-title">{{$t('detail.day.first')}} {{item.day}} {{$t('detail.day.last')}}</div>
                  <div class="hotel-name">{{item.hotel_name}}</div>
                  <ul>
                    <li v-for="(i,idx) in item.day_moment" :key="idx" class="cl">
                      <div><i class="el-icon-time"></i>{{i.start_time}}</div>
                      <div>{{i.content}}</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- 产品介绍 -->
            <div class="cl">
              <div class="detail-info-title">
                <span>{{$t('detail.productIntroduction')}}</span>
              </div>
              <div class="detail-info-content editor" v-html="items.editor"></div>
            </div>

          </div>
        </div>
    </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import {
  addEvent,
  removeEvent,
  getPositionTop,
  getScroll,
  scrollTop,
  messageTips,
  cookie
} from "../../assets/js/utils";
import suctionTop from "../../assets/js/suctionTop"; //吸頂應用
import orderCalendar from "../../components/common/order-calendar"; //日历插件
import bgImage from "../../components/common/bgImage";
let scrollMenuEventRes = null;

export default {
  components: {
    swiper,
    swiperSlide,
    orderCalendar,
    bgImage
  },
  data() {
    return {
      language: "",
      lang_id: this.$route.query.lang_id, //語言id
      token: this.$route.query.token, //帶過來的token
      mylang_id: 3,

      id: this.$route.query.id, //詳情頁id
      items: new Object(), //數據
      departureTime: 0, //出發日期
      //日期
      dateTextTop: [
        this.$t("date.sun"),
        this.$t("date.mon"),
        this.$t("date.tue"),
        this.$t("date.wed"),
        this.$t("date.thu"),
        this.$t("date.fri"),
        this.$t("date.sat")
      ],
      //吸頂菜單
      menuFixed: {
        isFixed: false,
        fixedLeft: 0
      },
      //吸頂應用
      scrollInfoData: {
        minTop: 0,
        maxTop: 0,
        boxLeft: 0,
        isFixed: false,
        isBottom: false,
        flagHeight: 65,
        boxWidth: 0,
        boxId: "calendar-scroll",
        referenceBoxId: "calendar-box",
        styleId: "calendar-scroll-style",
        right: 100,
        minTopHeight: 120,
        maxTopHeight: 41,
        maxTopHeightTop: 20
      },
      //輪播圖
      swiperOptions: {
        autoplay: {
          delay: 2000,
          disableOnInteraction: false
        }
      }
    };
  },
  created() {
    this.getLanguage(); //獲取語言id
    scrollTop();
    this.requestDetail(); //請求詳情
  },
  mounted() {
    document.body.style.backgroundColor = "#f5f5f5";
    this.scrollMenu(); //菜單吸頂
    suctionTop.scrollBox(this, "scrollInfoData"); //吸頂
  },
  destroyed() {
    document.body.style.backgroundColor = "#fff";
    removeEvent(window, "scroll.scrollMenu"); //解綁菜單吸頂事件
    suctionTop.removeEvent();
  },
  methods: {
    //选择语言触发的回调
    handleLanguage(command) {
      if(command == "zh"){
        this.language = "简体中文";
        this.mylang_id = 1;
      }else if(command == "sp"){
        this.language = "繁体中文";
        this.mylang_id = 2;
      }else{
        this.language = "English";
        this.mylang_id = 3;
      }
      this.$i18n.locale = command;
      this.requestDetail();
    },
    //獲取語言id
    getLanguage(){
      var messages = this.lang_id;
      if (messages == "1") {
        this.language = "简体中文";
        this.mylang_id = 1;
        this.$i18n.locale = 'zh';
      } else if (messages == "2") {
        this.language = "繁体中文";
        this.mylang_id = 2;
        this.$i18n.locale = 'sp';
      } else if (messages == "3") {
        this.language = "English";
        this.mylang_id = 3;
        this.$i18n.locale = 'en';
      }
    },
    //請求詳情
    requestDetail() {
      this.axios
        .get("api/web/v1/journeys/preview", {
          params: {
            lang_id: this.mylang_id,
            access_token: this.token,
            journey_id: this.id
          }
        })
        .then(res => {
          if (res.data.code != "1000") {
            messageTips(res.data.message, "error");
            return false;
          }
          res.data.data.items.score = parseInt(res.data.data.items.score);
          if (res.data.data.items.sale_date == undefined)
            res.data.data.items.sale_date = [];
          this.items = res.data.data.items;
          //重新計算吸頂的導航
          this.$nextTick(() => {
            suctionTop.resetScrollTopMenu(this, "scrollInfoData");
          });
        });
    },
    //菜單吸頂
    scrollMenu() {
      scrollMenuEventRes = getPositionTop(
        document.querySelector("#detail-menu")
      );
      addEvent(window, "scroll.scrollMenu", () => {
        let res = scrollMenuEventRes;
        let scroll = getScroll();
        let scrollY = scroll.top;
        let scrollX = scroll.left;
        if (scrollY >= res) {
          this.menuFixed.isFixed = true;
        } else {
          this.menuFixed.isFixed = false;
        }
        if (scrollY >= res) {
          this.menuFixed.fixedLeft = -1 * scrollX;
        } else {
          this.menuFixed.fixedLeft = 0;
        }
      });
    },
    //點擊菜單
    menuClick(idx) {
      let showBox = document.querySelectorAll("#detail-info>div")[idx];
      scrollTop(getPositionTop(showBox) - 55);
    },
    //行程點擊
    calendarClick(idx) {
      let showBox = document.querySelectorAll("#calendar-box>div")[idx];
      scrollTop(getPositionTop(showBox) - 60);
    }
  }
};
</script>

<style scoped>
.language_set {
  padding-bottom: 30px;
}
.language_set > span:last-of-type {
  cursor: pointer;
}
.content {
  padding: 25px 0;
}
.detail-content {
  margin-top: 25px;
}
.detail-title {
  height: 510px;
  margin-bottom: 20px;
  overflow: hidden;
}
.detail-title .detail-title-banner {
  float: left;
  width: 670px;
  height: 100%;
  overflow: hidden;
}
.detail-title .detail-title-banner .banner-box {
  width: 100%;
  height: 410px;
  background-image: url(../../assets/images/no_banner.png);
}
.detail-title .detail-title-banner .banner-box .banner {
  height: 100%;
}
.detail-title .detail-title-banner .banner-box .banner-slide-item {
  height: 100%;
}
.detail-title .detail-title-banner .trip-describe {
  height: 100px;
  background-color: #fff;
}
.detail-title .detail-title-banner .trip-describe > div {
  float: left;
  height: 100%;
}
.detail-title .detail-title-banner .trip-describe > div:first-of-type {
  width: 580px;
  text-align: center;
  position: relative;
  color: #aaa;
}
.detail-title .detail-title-banner .trip-describe > div:first-of-type > div {
  font-size: 14px;
}
.detail-title .detail-title-banner .trip-describe > div:first-of-type .rate {
  margin-bottom: 6px;
  margin-top: 4px;
}
.detail-title .detail-title-banner .trip-describe > div:nth-of-type(2) {
  width: 80px;
  line-height: 100px;
  text-align: center;
}
.detail-title .detail-title-banner .trip-describe > div:nth-of-type(2) img {
  width: 30px;
  cursor: pointer;
}
.detail-title .detail-title-info {
  width: 506px;
  height: 100%;
  float: right;
  background-color: #fff;
  padding: 16px;
  overflow: hidden;
}
.detail-title .detail-title-info .title {
  color: #000;
  font-size: 18px;
  line-height: 24px;
  font-weight: bold;
}
.detail-title .detail-title-info .price-box {
  margin: 10px 0;
  text-align: center;
}
.detail-title .detail-title-info .price-box > div {
  height: 70px;
  line-height: 70px;
}
.detail-title .detail-title-info .price-box .price {
  text-align: left;
}
.detail-title .detail-title-info .price-box > div:first-of-type {
  margin-right: 4%;
}
.detail-title .detail-title-info .price span {
  vertical-align: middle;
}
.detail-title .detail-title-info .price span:first-of-type {
  color: #000;
  padding-right: 15px;
}
.detail-title .detail-title-info .price span:last-of-type {
  color: #f00;
  font-size: 36px;
}
.detail-title .detail-title-info .order-now {
  cursor: pointer;
  background-image: url(../../assets/images/detail-bg.png);
  color: #fff;
  font-size: 24px;
}
.detail-title .detail-title-info ul li {
  padding: 4px 0;
}
.detail-title .detail-title-info ul li span:first-of-type {
  color: #000;
  font-weight: bold;
}
.detail-title .detail-title-info ul li span:last-of-type {
  line-height: 18px;
}
.detail-menu {
  position: relative;
}
.detail-menu .detail-menu-fixedbox {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  line-height: 50px;
  background-color: #fff;
}
.detail-menu .detail-menu-fixedbox.isFixed {
  position: fixed;
  top: 0;
  box-shadow: 0px 0px 20px 1px #ccc;
  z-index: 1;
}
.detail-menu .detail-menu-fixedbox > li {
  width: 20%;
  float: left;
  text-align: center;
  cursor: pointer;
  -webkit-transition: color 0.15s;
  -moz-transition: color 0.15s;
  -ms-transition: color 0.15s;
  -o-transition: color 0.15s;
  transition: color 0.15s;
}
.detail-menu .detail-menu-fixedbox > li:hover {
  color: #2d9aff;
}
.detail-info {
  margin-top: 90px;
  background-color: #fff;
  padding: 25px 20px;
}
.detail-info > div {
  padding: 25px 0;
  border-bottom: 1px dashed #ccc;
}
.detail-info > div:first-of-type {
  padding-top: 0;
}
.detail-info > div:last-of-type {
  border-bottom: 0;
}
.detail-info > div .detail-info-title {
  float: left;
  color: #2d9aff;
  width: 205px;
}
.detail-info > div .detail-info-title > span {
  display: inline-block;
  width: 100%;
}
.detail-info > div .detail-info-content {
  float: left;
  width: 955px;
}
.detail-info > div .detail-info-content > div ul li {
  margin-top: 10px;
}
.departureTime .detail-info-content {
  height: 400px;
}
/*预约通知*/
.reservationNotice .detail-info-content > div {
  margin-bottom: 15px;
  color: #666;
}
/*日程表*/
.calendar .detail-info-content > div {
  margin-bottom: 18px;
}
.calendar .detail-info-content > div:last-of-type {
  margin-bottom: 0;
}
.calendar .detail-info-content-title {
  color: #000;
  font-weight: bold;
  background-image: url(../../assets/images/detail-trip.png);
  background-repeat: no-repeat;
  background-size: 20px;
  background-position: left center;
  padding-left: 30px;
  margin-bottom: 10px;
}
.calendar .hotel-name {
  color: #2d9aff;
  margin-bottom: 4px;
  background-image: url(../../assets/images/detail-hotel.png);
  background-repeat: no-repeat;
  background-size: 20px;
  background-position: left center;
  padding-left: 30px;
  line-height: 20px;
}
.calendar ul li div {
  float: left;
}
.calendar ul li div:first-of-type {
  width: 70px;
  color: #aaa;
  font-size: 14px;
  height: 24px;
  line-height: 24px;
}
.calendar ul li div:first-of-type i {
  margin-right: 4px;
}
.calendar ul li div:last-of-type {
  color: #666;
  width: 885px;
  line-height: 24px;
}
.calendar .detail-info-title {
  position: relative;
}
.calendar .detail-info-title span {
  padding-bottom: 20px;
}
.calendar .calendar-scroll {
  margin-left: 100px;
}
.calendar .calendar-scroll > div {
  width: 30px;
  height: 30px;
  line-height: 28px;
  text-align: center;
  border-radius: 50%;
  font-size: 12px;
  margin-bottom: 15px;
  border: 1px solid #2d9aff;
  color: #2d9aff;
  cursor: pointer;
  -webkit-transition: all 0.15s;
  -moz-transition: all 0.15s;
  -ms-transition: all 0.15s;
  -o-transition: all 0.15s;
  transition: all 0.15s;
}
.calendar .calendar-scroll > div:hover {
  background-color: #2d9aff;
  color: #fff;
}
.calendar .calendar-scroll > div:last-of-type {
  margin-bottom: 0px;
}
/*产品介绍*/
.detail-info > div .detail-info-content.editor {
  line-height: 22px;
  letter-spacing: 1px;
}
</style>