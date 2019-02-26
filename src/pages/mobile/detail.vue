<template>
    <div>
      <div class="mb-detail-box">
        <!-- 輪播圖 -->
        <div class="banner bg">
          <div class="orangeTips" v-if="items.integral_deduction || items.integral">
            <span v-if="items.integral_deduction && items.integral_deduction !=0">{{$t('info.integralUseDeduction',{integral:items.integral_deduction})}}</span>
            <span v-if="items.integral && items.integral !=0">{{$t('info.canGetIntegral',{integral:items.integral})}}</span>
          </div>
          <swiper :options="swiperOptions" ref="mySwiper">
            <swiper-slide v-for="(item,index) in items.thumb" :key="index" class="banner-slide">
              <bg-image class="banner-slide-item bg" :thumb="item" @click="showAtlas"></bg-image>
            </swiper-slide>
          </swiper>
          <div v-if="items.thumb" class="banner-count">{{items.thumb.length != 0 ? $refs.mySwiper.swiper.activeIndex + 1 : 0}}/{{items.thumb.length}}</div>
        </div>
        <!-- 描述 -->
        <div class="content">
          <!-- 標題 評分 -->
          <div class="title cl">
            <div>{{items.district_name}}</div>
            <div class="rate">
                <rate-star
                :scopes="Number(items.score).toFixed(1)"
                :starCount="5"
                :color="`rgb(247, 212, 33)`"
                :bgColor="`rgb(247, 212, 33)`"
                ></rate-star>
            </div>
          </div>
          <!-- 行程描述 -->
          <div class="destrict">{{items.name}}</div>
          <!-- 價格 -->
          <div class="priceBox cl">
            <div class="price">
              <span>{{$t('user.price')}} ：</span>
              <span>{{$t('moneys')}}</span>
              <span class="firstPrice">{{items.price ? items.price : 0}}</span>
            </div>
            <div class="vipPrice">
              <span class="vipBefore">{{$t('buy.vip')}} ：{{$t('moneys')}}
                <span class="secondPrice">{{items.vip_price ? items.vip_price : 0}}</span>
              </span>
            </div>
          </div>
          <!-- 天數 -->
          <div class="productDays">{{$t('detail.productDays')}}<span>{{items.total_day}}</span></div>
          <!-- 聲明 -->
          <ul class="declare">
              <li v-for="(item,index) in items.journey_declare" :key="index">
                <div class="declare_title">{{item.name}}</div>
                <div>{{item.content}}</div>
              </li>
          </ul>
        </div>
        <!-- 集合地點 -->
        <div class="content meetingPoint-box">
          <div class="meetingPoint cl">
            <div>{{$t('detail.meetingPoint')}} : </div>
            <div>{{items.meeting_place}}</div>
          </div>
        </div>
        <!-- 日程表 -->
        <div class="content calendar-box">
          <div class="content-title calendar">{{$t('detail.calendar')}}</div>
          <ul class="calendar-list">
            <li v-for="(item,index) in items.day_list" :key="index">
              <div class="item-title">{{$t('detail.day.first')}} {{item.day}} {{$t('detail.day.last')}}</div>
              <div class="item-hotel">{{item.hotel_name}}</div>
              <div v-for="(i,idx) in item.day_moment" :key="idx">
                <div class="item-date">
                  <div>{{i.start_time}}</div>
                  <div>{{i.content}}</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <!-- 詳情 -->
        <div class="content editor-box" v-html="items.editor"></div>
      </div>
      <!-- 底部 -->
      <div id="buy-footer" class="buy-footer cl">
        <div>
          <div>
            <img v-if="items.is_favourite == 0" src="../../assets/images/collection.png" alt="" @click="collection">
            <img v-else-if="!items.is_favourite" src="../../assets/images/collection.png" alt="" @click="collection">
            <img v-else src="../../assets/images/collection-mark.png" alt="" @click="cancelCollection">
          </div>
        </div>
        <div @click="buy">
          <span class="btn">{{$t('detail.bookNow')}}</span>
        </div>
        <span class="canUse">({{$t('info.integralUseDeduction',{integral:items.integral_deduction})}})</span>
      </div>
      <atlas :isShow="atlasOptions.isShow" :thumb="items.thumb" @closeAtlas="closeAtlas" :activeIndex="atlasOptions.index"></atlas>
    </div>
</template>

<script>
import atlas from "../../components/mobile/atlas"; //圖冊
import rateStar from '../../components/common/star';
import {
  formatDate,
  cookie,
  scrollTop,
  messageTips,
  getPositionTop,
  getRect
} from "../../assets/js/utils";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import bgImage from "../../components/common/bgImage";
let isCanShowMonthError = true;
let showNumError = true;
let selectSuccessTips = true;
let timer = 1800;
export default {
  components: {
    swiper,
    swiperSlide,
    atlas,
    bgImage,
    rateStar
  },
  data() {
    return {
      atlasOptions: {
        isShow: false,
        index: 0
      },
      id: this.$route.query.id,
      items: new Object(),
      swiperOptions: {
        watchOverflow: true,
        resistanceRatio: 0,
        autoplay: {
          delay: 2000,
          disableOnInteraction: false
        }
      },
      token: cookie.get("token")
    };
  },
  created() {
    this.requestDetail();
    scrollTop();
  },
  methods: {
    //顯示圖冊
    showAtlas() {
      this.atlasOptions.index = this.$refs.mySwiper.swiper.activeIndex;
      this.atlasOptions.isShow = true;
    },
    //關閉圖冊
    closeAtlas() {
      this.atlasOptions.isShow = false;
    },
    //購買
    buy() {
      this.$router.push({
        path: "/Buy",
        query: {
          id: this.id
        }
      });
    },
    //請求詳情
    requestDetail() {
      this.axios
        .get(`api/web/v1/journeys/${this.id}`, {
          params: {
            lang_id: this.lang_id
          }
        })
        .then(res => {
          if (res.data.code != "1000") {
            messageTips(res.data.message);
            return false;
          }
          if (res.data.data.sale_date == undefined)
            res.data.data.sale_date = [];
          this.items = res.data.data;

          let total_inventory = 0;
          this.items.sale_date.forEach(ele => {
            total_inventory += parseInt(ele.inventory);
          });
          this.$set(this.items, "total_inventory", total_inventory);
        });
    },
    //收藏
    collection() {
      if (!this.token) {
        console.log(this.$route.path);
        this.$router.push({
          path: "/Sign",
          query: { redirect: `${this.$route.path}?id=${this.id}` }
        });
      } else {
        this.axios
          .post(`api/web/v1/favourites?lang_id=${this.lang_id}`, {
            journey_id: this.id
          })
          .then(res => {
            if (res.data.code != "1000") {
              messageTips(res.data.message);
              return false;
            }
            messageTips(this.$t("detail.collectionSuccess"));
            this.items.favourite_id = res.data.data.id;
            this.items.is_favourite = "1";
          });
      }
    },
    //取消收藏
    cancelCollection() {
      this.axios
        .delete(
          `api/web/v1/favourites/${this.items.favourite_id}?lang_id=${
            this.lang_id
          }`
        )
        .then(res => {
          if (res.data.code != "1000") {
            messageTips(res.data.message);
            return false;
          }
          messageTips(this.$t("detail.cancelCollectionSuccess"));
          this.items.is_favourite = "0";
        });
    }
  },
  mounted() {
    document.body.style.backgroundColor = "#f5f5f5";
  },
  destroyed() {
    document.body.style.backgroundColor = "#fff";
  }
};
</script>

<style scoped>

.costDetailFirst{
  width: 100%;
  height: 1rem;
  line-height: 1rem;
  color: black;
  border-radius: 30px;
  background: #f3f3f3;
  padding-left: 8%;
  margin-bottom: 0.3rem;
}
.costDetailFirst::before{
  content: '';
  width: 0.15rem;
  height: 0.15rem;
  background: #2d9aff;
  border-radius: 50px;
  display: block;
  float: left;
  margin-top: 0.45rem;
  margin-right: 0.15rem;
}
.costDetail-list{
  margin-bottom: 0.3rem;
}


.banner {
  position: relative;
  background-image: url(../../assets/images/no_banner.png);
}
.banner-count {
  background-color: rgba(0, 120, 255, 0.8);
  position: absolute;
  bottom: 4%;
  right: 4%;
  color: #fff;
  font-size: 0.4rem;
  z-index: 1;
  padding: 0.14rem 0.3rem;
  background-image: url(../../assets/images/banner-image-icon.png);
  background-repeat: no-repeat;
  background-position: 0.2rem center;
  background-size: 0.4rem;
  text-indent: 0.5rem;
  border-radius: 0.2rem;
}
.banner,
.banner .banner-slide-item {
  height: 8.266667rem;
}
.content {
  padding: 0 0.533333rem;
  background-color: #fff;
  overflow: hidden;
}
.orangeTips{
  position: absolute;
  left: 0;
  top: 15%;
  display: flex;
  align-items:flex-start;
  box-align:flex-start;
  flex-flow: column;
  z-index: 2;
}
.orangeTips span{
  padding: 0.2rem;
  color: white;
  margin-bottom: 0.1rem;
  border-radius: 0 15px 15px 0;
  font-size: 0.35rem;
  background-color: rgba(243, 78, 27, 0.8)
}
.content-title {
  color: #000;
  padding-left: 0.666667rem;
  font-size: 0.4rem;
  height: 1rem;
  line-height: 1rem;
  background-repeat: no-repeat;
  background-size: 0.36rem;
  background-position: left center;
}
.content-title.departureTime {
  background-size: 0.44rem;
  background-image: url(../../assets/images/mb-detail-icon-date.png);
}
.content-title.calendar {
  background-image: url(../../assets/images/mb-detail-icon-detail.png);
}
.title {
  height: 0.8rem;
  line-height: 0.5rem;
  margin-top: 0.2rem;
}
.title > div:first-of-type {
  float: left;
  color: #8b2121;
  font-size: 0.4rem;
  word-break: break-all;
}
.title > div:last-of-type {
  float: right;
  padding-top: 0.2rem;
}
.destrict {
  color: #000;
  font-size: 0.466667rem;
  line-height: 0.586667rem;
}
.priceBox{
  width: 100%;
  border-bottom: 0.04rem solid #ddd;
}
.price {
  color: #999999;
  padding: 0.3rem 0;
  font-size: 0.4rem;
}
.firstPrice{
  font-size: 0.5rem;
}
.vipPrice {
  color: #ff5501;
  font-size: 0.45rem;
  padding-bottom: 0.3rem;
  position: relative;
}
.vipBefore{
  float: left;
  display: inline-block;
  color: #ff5501;
  font-size: 0.45rem;
  padding-bottom: 0.3rem;
}
.secondPrice{
  font-size: 0.6rem;
}
.vipPriceAfter{
  display: inline-block;
  padding: 0.1rem 0.2rem;
  background: #ff5501;
  color: white;
  font-size: 0.35rem;
  border-radius: 30px;
  line-height: 0.35rem;
  margin-left: 0.25rem;
  position: absolute;
}
.vipPriceAfter span{
  position: relative;
  padding-right: 0.1rem;
}
.vipPriceAfter span::after{
  content: '+';
  position: absolute;
  font-size: 0.32rem;
  top: -5%;
  right: -40%;
}
.productDays {
  color: #000;
  font-size: 0.346667rem;
  padding: 0.3rem 0;
}
.productDays span {
  color: #888;
  padding-left: 0.266667rem;
}
.declare_title {
  color: #000;
  font-size: 0.346667rem;
  padding-bottom: 0.1rem;
}
.declare li {
  color: #888;
  margin-bottom: 0.4rem;
  font-size: 0.346667rem;
  line-height: 0.5rem;
}
.meetingPoint-box {
  margin: 0.186667rem 0;
  display: table;
  width: 100%;
}
.meetingPoint-box .meetingPoint {
  font-size: 0.4rem;
  padding: 0.3rem 0;
}
.meetingPoint-box .meetingPoint > div {
  color: #000;
}
.meetingPoint-box .meetingPoint > div:first-of-type {
  display: table-cell;
  white-space: nowrap;
  vertical-align: middle;
  background-image: url(../../assets/images/mb-detail-icon-area.png);
  background-repeat: no-repeat;
  background-size: 0.36rem;
  background-position: left center;
  padding-left: 0.666667rem;
}
.meetingPoint-box .meetingPoint > div:last-of-type {
  display: table-cell;
  padding-left: 0.2rem;
  line-height: 0.6rem;
}
.editor-box,
.departureTime-box {
  padding-bottom: 0.186667rem;
}
.departureTime-box,
.calendar-box {
  margin-bottom: 0.186667rem;
}
.editor-box {
  padding-top: 0.186667rem;
  font-size: 0.4rem;
  line-height: 0.44rem;
  letter-spacing: 0.013333rem;
}
.calendar-list li {
  margin-bottom: 0.4rem;
}
.calendar-list li .item-title {
  color: #fff;
  background-color: #2d9aff;
  width: 2.2rem;
  height: 0.6rem;
  line-height: 0.6rem;
  background-image: url(../../assets/images/mb-detail-icon-item.png);
  background-repeat: no-repeat;
  background-size: 0.46rem;
  background-position: 0.2rem center;
  padding-left: 0.5rem;
  border-radius: 0.133333rem;
  text-indent: 0.266667rem;
  font-style: italic;
}
.calendar-list li .item-hotel {
  color: #ffcc01;
  background-image: url(../../assets/images/detail-hotel.png);
  background-repeat: no-repeat;
  background-position: left center;
  font-size: 0.373333rem;
  padding-left: 0.6rem;
  background-size: 0.4rem;
  line-height: 0.4rem;
  margin: 0.2rem 0;
}
.calendar-list li .item-date {
  margin-bottom: 0.2rem;
  padding-left: 0.5rem;
  background-image: url(../../assets/images/calendar-bg.png);
  background-repeat: no-repeat;
  background-size: 0.32rem;
}
.calendar-list li .item-date > div:first-of-type {
  font-weight: bold;
  color: #000;
  font-size: 0.346667rem;
  margin-bottom: 0.106667rem;
}
.calendar-list li .item-date > div:last-of-type {
  font-size: 0.346667rem;
  color: #888;
}
.mb-detail-box {
  padding-bottom: 1.266667rem;
}
.buy-footer {
  height: 1.266667rem;
  line-height: 1.266667rem;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  box-shadow: 0px -1px 6px 0px #ccc;
  border-top: 0.026667rem solid #eee;
  padding: 0 0.5rem;
}
.buy-footer > div:first-of-type {
  float: left;
}
.buy-footer > div:first-of-type img {
  width: 0.666667rem;
}
.buy-footer > div:last-of-type {
  float: right;
}
.buy-footer .btn {
  color: #000;
  background-color: #ffcc01;
  border-radius: 0.133333rem;
  padding: 0.2rem 0.6rem;
  font-size: 0.373333rem;
}
.canUse{
  float: right;
  margin-right: 0.2rem;
}
</style>
