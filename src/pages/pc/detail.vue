<template>
    <div class="content col-width">
        <!-- 麵包屑 -->
        <div class="amount-nav-search">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">{{$t('footer.home')}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{$t('detail.detail')}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <right-navigation></right-navigation>
        <!-- 內容 -->
        <div class="detail-content" id="detail_content">
          <!-- 上 -->
          <div class="detail-title cl">
            <!-- 廣告圖 -->
            <div class="detail-title-banner">
              <!-- 积分抵扣 -->
              <div class="tipsBox" v-if="items.integral_deduction || items.integral">
                <span class="tripTips" v-if="items.integral_deduction && items.integral_deduction!=0">{{$t('info.integralUseDeduction',{integral:items.integral_deduction})}}</span>
                <span class="tripTips" v-if="items.integral && items.integral!=0">{{$t('info.canGetIntegral',{integral:items.integral})}}</span>
              </div>
              <!-- 輪播圖 -->
              <div class="banner-box bg">
                <swiper :options="swiperOptions" class="banner">
                  <swiper-slide v-for="(item,index) in items.thumb" :key="index" class="banner-slide">
                    <bg-image class="banner-slide-item bg" :thumb="item"></bg-image>
                  </swiper-slide>
                </swiper>
              </div>
              <div class="collection">
                    <img class="center" v-if="items.is_favourite == '1'" @click="cancelCollection" src="../../assets/images/collection-mark.png" alt="">
                    <img class="center" v-else @click="collection" src="../../assets/images/collection.png" alt="">
              </div>
            </div>
            <!-- 簡介 -->
            <div class="detail-title-info">
              <div class="title" :title="items.name">{{items.name}}</div>
              <div class="starBox">
                    <span>{{$t('detail.good')}}</span>
                    <div class="rate">
                        <rate-star
                        :scopes="Number(items.score).toFixed(1)"
                        :color="`rgb(247, 212, 33)`"
                        :bgColor="`rgb(247, 212, 33)`"
                        ></rate-star>
                    </div>
                    <span v-if="items.score">{{items.score | toFixed}} {{$t('detail.reviews')}}</span>
                    <span v-else>{{'0.0'}} {{$t('detail.reviews')}}</span>
              </div>
              <div class="price-box">
                <div class="commomPrice">
                  <span>{{$t('user.price')}} ：</span>
                  <span>
                    <span class="firstPirse">{{$t('moneys')}}</span>{{items.price ? items.price : 0}}
                  </span>
                </div>
                <div class="price">
                  <span>{{$t('buy.vip')}} : </span>
                  <span class="vipPrice">
                    <span>{{$t('moneys')}}</span>{{items.vip_price ? items.vip_price : 0}}
                  </span>
                </div>
                <div class="order-now bg" @click="buy">{{$t('buy.orderNow')}}</div>
              </div>
              <ul>
                <li>
                  <span>{{$t('detail.productDays')}} : </span>
                  <span>{{items.total_day}} {{$t('detail.day.last')}}</span>
                </li>
              </ul>
            </div>
          </div>
          <!-- 導航 -->
          <div class="detail-menu cl">
            <ul class="detail-menu-fixedbox cl col-width" id="detail-menu" :class="{'isFixed':menuFixed.isFixed,'liWidth': !menuFixed.isFixed}" :style="`left:${menuFixed.fixedLeft}px`">
                <li @click="menuClick(0)" :class="{Fixedactive: fixedIndex == 0}">{{$t('detail.productIntroduction')}}</li>
                <li @click="menuClick(1)" :class="{Fixedactive: fixedIndex == 1}">{{$t('detail.calendar')}}</li>
                <li @click="menuClick(2)" :class="{Fixedactive: fixedIndex == 2}">{{$t('detail.reservationNotice')}}</li>
                <li @click="menuClick(3)" :class="{Fixedactive: fixedIndex == 3}">{{$t('detail.meetingPoint')}}</li>
                <li @click="menuClick(4)" :class="{Fixedactive: fixedIndex == 4}">{{$t('info.experienceEvaluate')}}</li>
                <li>
                  <div v-if="menuFixed.isFixed" class="quickBuy" @click="buy">{{$t('buy.orderNow')}}</div>
                </li>
            </ul>
          </div>
          <!-- 內容 -->
          <div class="detail-info" id="detail-info">
            <!-- 产品介绍 -->
            <div class="seed1 cl" id="product_introduction">
              <div class="detail-info-title">
                <span>{{$t('detail.productIntroduction')}}</span>
              </div>
              <div class="detail-info-content editor" v-html="items.editor"></div>
            </div>
            <!-- 日程表 -->
            <div class="seed2 cl calendar">
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
            <!-- 预约通知 -->
            <div class="seed3 cl reservationNotice">
              <div class="detail-info-title">
                <span>{{$t('detail.reservationNotice')}}</span>
              </div>
              <div class="detail-info-content">
                <div v-for="(i,idx) in items.journey_declare" :key="idx"><span v-if="i.name">{{i.name}}</span>{{i.content}}</div>
              </div>
            </div>
            <!-- 集合地点 -->
            <div class="seed4 cl">
              <div class="detail-info-title">
                <span>{{$t('detail.meetingPoint')}}</span>
              </div>
              <div class="detail-info-content">{{items.meeting_place}}</div>
            </div>
            <!-- 评论 -->
            <div class=" seed5 cl" >
              <div class="detail-info-title">
                <span>{{$t('info.experienceEvaluate')}}</span>
              </div>
              <div class="detail-info-content">
                <div class="comtentHead cl">
                  <!-- 分数 -->
                  <div class="commentMark">
                    <div class="markTop" v-if="commentList.score">
                      {{commentList.score | toFixed}}<span>{{$t('detail.score')}}</span>
                    </div>
                    <div class="markTop" v-else>
                      {{'0.0'}}<span>{{$t('detail.score')}}</span>
                    </div>
                    <div class="markBottom">{{$t('detail.comprehensiveScore')}}</div>
                  </div>
                  <!-- 评论条 -->
                  <div class="startContent cl">
                    <div class="left_countTitle">
                      <span>{{$t('detail.praise')}}</span>
                      <span>{{$t('detail.normal')}}</span>
                      <span>{{$t('detail.bad')}}</span>
                    </div>
                    <div class="right_countLine">
                      <div class="staritem">
                        <el-progress :percentage="parseInt(commentList.good*100) || 0" style="width:200px"></el-progress>
                      </div>
                      <div class="staritem">
                        <el-progress :percentage="parseInt(commentList.half * 100) || 0" style="width:200px"></el-progress>
                      </div>
                      <div class="staritem">
                        <el-progress :percentage="parseInt(commentList.bad * 100) || 0" style="width:200px"></el-progress>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 評論 -->
                <div class="discussContent" v-for="(ele, idx) in commentListItem" :key="idx" v-if="currentPage == idx">
                  <div class="discussItem cl" v-for="(element,index) in ele" :key="index">
                    <div class="discussItem_left">
                      <bg-image class="discussItem_left_headPic" :thumb="element.thumb"></bg-image>
                      <div class="headerPic_name">{{element.name}}</div>
                    </div>
                    <div class="discussItem_right">
                      <div class="discussItem_right_comment">{{element.suggest}}</div>
                      <div class="rate">
                        <rate-star
                        :scopes="Number(element.score).toFixed(1)"
                        :color="`rgb(247, 212, 33)`"
                        :bgColor="`rgb(247, 212, 33)`"
                        ></rate-star>
                      </div>
                      <div class="discussTime">{{formatDate(element.create_time,false,true)}}{{$t('detail.published')}}</div>
                    </div>
                  </div>
                </div>

            </div>
              <!-- 分页器 -->
              <div class="Setpage cl" v-if="totalCount != 0">
                <el-pagination
                  background
                  layout="prev, pager, next"
                  :page-size="pageSize"
                  :total="parseInt(totalCount)"
                  :current-page="currentPage"
                  @current-change="currentPageChange">
                </el-pagination>
              </div>

            </div>
          </div>
        </div>
    </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import rateStar from '../../components/common/star';
import {
  addEvent,
  removeEvent,
  getPositionTop,
  getScroll,
  scrollTop,
  messageTips,
  cookie,
  getParams,
  formatDate,
  getRect,
  back_topTop
} from "../../assets/js/utils";
import suctionTop from "../../assets/js/suctionTop"; //吸頂應用
import rightNavigation from '../../components/pc/rightNavigation'//右边导航
import bgImage from "../../components/common/bgImage";
let scrollMenuEventRes = null;
export default {
  components: {
    swiper,
    swiperSlide,
    bgImage,
    rightNavigation,
    rateStar
  },
  data() {
    return {
      clickMenu: '',//点击导航条的中传值
      commentList: new Object(), //回来的数据
      commentListItem: new Object(),
      totalCount: 0,//评论总数
      pageSize: 6, //每页多少条
      currentPage: 1, //当前页
      hasList: false, //是否有页数
      fixedList:[],//获取节点数组
      fixedIndex:-1,//出发active的索引
      imgArr: [
        {
          offers: [
            {
              url: require("../../assets/images/discuss-pic.png")
            },
            {
              url: require("../../assets/images/about-name.png")
            }
          ]
        }
      ],
      id: this.$route.query.id, //詳情頁id
      items: new Object(), //數據
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
      },
      token: cookie.get("token"),
    };
  },
  filters: {
    toFixed (val) {
      let score = Number(val);
      score = score.toFixed(1);
      return score;
    }
  },
  created() {
    this.requestDetail(); //請求詳情
    this.requestComment(this.currentPage);//请求评论
  },
  mounted() {
    document.body.style.backgroundColor = "#f5f5f5";
    this.scrollMenu(); //菜單吸頂
    suctionTop.scrollBox(this, "scrollInfoData"); //吸頂
    this.itemData = this.imgArr;
  },
  destroyed() {
    document.body.style.backgroundColor = "#fff";
    removeEvent(window, "scroll.scrollMenu"); //解綁菜單吸頂事件
    suctionTop.removeEvent();
  },
  methods: {
    // 吸顶列表数组
    createScroll(){
      this.fixedList.splice(0);
      for(let i = 1; i< 6; i++){
        let scrollDoc = document.querySelector('.seed'+i);
        let scrollTop = getRect(scrollDoc).top - 60;
        this.fixedList.push(scrollTop);
      }
    },
    //评论分页请求
    requestComment(val) {
      this.axios("api/web/v1/evaluations", {
        params: {
          journey_id: this.$route.query.id,
          lang_id: this.lang_id,
          "pre-page": 6,//每页显示数量
          page: val,//当前页码
        }
      }).then(res => {
        if (res.data.code != "1000") {
          messageTips(res.data.message, "error");
          return false;
        }
        let data = res.data.data;
        this.commentList = data.items;
        this.totalCount = data._meta.totalCount;
        this.currentPage = val;
        // data.items.evaluation.forEach((ele, idx) => {
        //   ele.score = Number(ele.score);
        // })
        this.$set(this.commentListItem, this.currentPage, Object.freeze(data.items.evaluation));
      });
    },
    currentPageChange(idx) {
        if(!this.commentListItem[idx]){
          requestComment(idx);
        }
        else{
          this.currentPage = idx;
        }
    },
    //收藏
    collection() {
      if (!this.token) {
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
              messageTips(res.data.message, "error");
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
            messageTips(res.data.message, "error");
            return false;
          }
          res.data.data.score = Number(res.data.data.score);
          if (res.data.data.sale_date == undefined)
            res.data.data.sale_date = [];
            this.items = res.data.data;
            let total_inventory = 0;
            this.items.sale_date.forEach(ele => {
              total_inventory += parseInt(ele.inventory);
            });
          this.$set(this.items, "total_inventory", total_inventory);

          //重新計算吸頂的導航
          this.$nextTick(() => {
            scrollTop();
            suctionTop.resetScrollTopMenu(this, "scrollInfoData", true);
            let node = document.querySelector('#product_introduction');
            let img = node.getElementsByTagName('img');
            if(img.length == 0) this.createScroll();
            Array.from(img).forEach(ele => {
              ele.onload = () => {
                suctionTop.resetScrollTopMenu(this, "scrollInfoData", true);
                this.createScroll();
              }
            });

          });
        });
    },
    //菜單吸頂
    scrollMenu() {
      scrollMenuEventRes = getPositionTop(
        document.querySelector("#detail-menu")
      );
      let beforeScrollTop = getScroll().top;
      addEvent(window, "scroll.scrollMenu", () => {
        let res = scrollMenuEventRes;
        let scroll = getScroll();
        let scrollY = scroll.top;
        let scrollX = scroll.left;
        if (scrollY >= res) {
          this.menuFixed.isFixed = true;
        } else {
          this.menuFixed.isFixed = false;
          this.fixedIndex = -1;
        }
        if (scrollY >= res) {
          this.menuFixed.fixedLeft = -1 * scrollX;
        } else {
          this.menuFixed.fixedLeft = 0;
        }

        //滚动监听变色
        let idx = -1;
        let last_idx = this.fixedList.length - 1;
        this.fixedList.forEach((ele,index) => {
          if(idx == -1 && index == last_idx && scrollY+10 >= this.fixedList[last_idx]){
            idx = last_idx;
          }else{
            if(idx == -1 && scrollY+10 >= ele && scrollY+10 < this.fixedList[index + 1]) idx = index;
          }
        });
        if(scrollY >= beforeScrollTop && this.clickMenu && this.clickMenu >= idx){
          this.fixedIndex = this.clickMenu;
          beforeScrollTop = scrollY;
        }
        else{
          this.clickMenu = '';
          this.fixedIndex = idx;
          beforeScrollTop = scrollY;
        }
      });
    },
    //點擊菜單
    menuClick(idx) {
      let scrollTop = this.fixedList[idx];
      back_topTop(scrollTop, 100);
      this.clickMenu = idx;
      this.fixedIndex = idx;

    },
    //行程點擊
    calendarClick(idx) {
      let showBox = document.querySelectorAll("#calendar-box>div")[idx];
      scrollTop(getPositionTop(showBox) - 60);
    },
    formatDate :formatDate,
  }
};
</script>

<style scoped>
.discussContent {
  width: 100%;
}
.discussItem {
  border-bottom : 2px solid #e5e5e5;
  padding-bottom:20px;
  margin-top: 20px;
}
.discussItem_left{
  width: 9.4%;
  float: left;
  text-align: center;
  color: black;
  font-size: 14px;
}
.discussItem_left_headPic{
  width: 45px;
  height: 45px;
  border-radius: 50px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  background-repeat: no-repeat;
  background-size: cover;
}
.discussItem_right{
  float: left;
  width: 90.6%;

}
.discussItem_right_comment{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  color: #666666;
  font-size: 16px;
  height: 42px;
  line-height: 20px;
}
.discussTime{
  font-size: 14px;
  color: #999999;
  margin-top: 10px;
}
.headerPic_name{
  margin-top: 10px;

}
.detail-menu-fixedbox li:last-child{
  position: relative;
  height: 100%;
}
.quickBuy{
  width: 100px;
  height: 30px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #2d9aff;
  color: white;
  font-size: 16px;
  line-height: 30px;
}
/*  體驗點評 */
.comtentHead {
  height: 90px;
  color: black;
}
.commentMark {
  float: left;
}
.markTop {
  font-size: 35px;
}
.markTop span {
  font-size: 15px;
}
.markBottom {
  text-align: center;
  font-size: 15px;
  padding-top: 5px;
}
.startContent {
  float: left;
  margin-left: 30px;
}
.staritem {
  margin-bottom: 15px;
  font-size: 14px;
  height: 20px;
}
.staritem span {
  color: #606266;
  float: left;
  display: block;
  line-height: 15px;
  padding-right: 5px;
  min-width: 72px;
}
.left_countTitle {
  float: left;
}
.left_countTitle span {
  color: #606266;
  display: block;
  font-size: 14px;
  line-height: 15px;
  padding-right: 5px;
  height: 20px;
  margin-bottom: 15px;
  margin-right: 10px;
}
.right_countLine{
  float: left;
}
.start span {
  line-height: 24px;
}
.staritem div {
  display: inline-block;
  line-height: 12px;
}
.startContent .staritem:last-child {
  margin-bottom: 0;
}
.varticalLine {
  width: 1.5px;
  height: 90%;
  float: left;
  background: #eeeeee;
  margin: 5px 30px 0;
}
.headerRight {
  float: left;
  width: 360px;
  height: 100%;
}
.what_about_feel {
  width: 100%;
  height: 20px;
  font-size: 15px;
}
.feelItemBox {
  width: 100%;
  height: 70px;
}
.feelItem {
  color: #838383;
}
.feelItemBox .feelItem:first-child {
  margin-left: 0;
}
.feelItem {
  padding: 4px 10px;
  margin: 5px;
  border: 1px solid #c5c5c5;
  border-radius: 5px;
  text-align: center;
  font-size: 12px;
  display: inline-block;
}
.feelActive {
  color: #63b4ff;
  border: 1px solid#63b4ff;
}

.Setpage {
  height: 30px;
  float: left;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  -webkit-transform: translateX(-50%);
  -moz-transform: translateX(-50%);
  -o-transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  margin-top: 20px;
}

.content {
  padding: 25px 0;
}
.detail-content {
  margin-top: 25px;
}
.detail-title {
  height: 410px;
  margin-bottom: 20px;
  overflow: hidden;
}
.detail-title .detail-title-banner {
  float: left;
  width: 670px;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.collection {
  width: 50px;
  height: 50px;
  position: absolute;
  top: 2%;
  right: 2%;
  background: #a7afc5;
  border-radius: 50px;
  z-index: 2;
  opacity: 0.7;
  cursor: pointer;
}
.collection img {
  width: 25px;
  height: 25px;
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
.tipsBox {
  z-index: 2;
  width: auto;
  height: auto;
  position: absolute;
  top: 2%;
  display: flex;
  align-items: flex-start;
  box-align: flex-start;
  flex-flow: column;
}
.tripTips {
  padding: 8px 15px;
  border-radius: 0 20px 20px 0;
  background-color: #ff5501;
  margin-top: 10px;
  font-size: 15px;
  color: white;
}
.starBox {
  margin: 15px 0;
  height: 20px;
  width: 100%;
}
.starBox span {
  font-size: 14px;
  display: inline-block;
  float: left;
  line-height: 21px;
}
.starBox span:first-child {
  padding-right: 10px;
}
.starBox span:last-child {
  padding-left: 10px;
}
.rate {
  height: 20px;
}
.starBox .rate {
  display: block;
  height: 20px;
  float: left;
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
.detail-title .detail-title-info .price-box .price {
  color: black;
  text-align: left;
  height: 50px;
  width: 100%;
}
.detail-title .detail-title-info .price-box > div:first-of-type {
  margin-right: 4%;
}
.commomPrice {
  text-align: left;
  font-size: 17px;
  color: black;
}
.commomPrice span:nth-of-type(2){
  font-size: 22px;
  display: inline-block;
  vertical-align: -1px;
}
.firstPirse{
  font-size: 18px !important;
}
.detail-title .detail-title-info .price {
  margin: 15px 0;
}
.detail-title .detail-title-info .price .vipAfter {
  padding: 3px 5px;
  background: #ff5501;
  border-radius: 30px;
  color: white;
  margin: 0 5px;
  font-size: 14px;
}
.detail-title .detail-title-info .price .canUse {
  color: #b8b8b8;
  font-size: 14px;
}
.vipPrice {
  color: #ff5501;
  font-size: 36px;
  line-height: 50px;
  vertical-align: -2px;
}
.vipPrice span{
  font-size: 26px;
  color: #ff5501 !important;
}
.detail-title .detail-title-info .order-now {
  cursor: pointer;
  background-image: url(../../assets/images/detail-bg.png);
  color: #fff;
  font-size: 24px;
  height: 50px;
  line-height: 50px;
}
.detail-title .detail-title-info ul li {
  padding: 10px 0;
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
  /* opacity: .2; */
}
.detail-menu .detail-menu-fixedbox.isFixed {
  position: fixed;
  top: 0;
  box-shadow: 0px 0px 20px 1px #ccc;
  z-index: 1;
}
.detail-menu .detail-menu-fixedbox > li {
  width: 16.667%;
  float: left;
  text-align: center;
  cursor: pointer;
  -webkit-transition: color 0.15s;
  -moz-transition: color 0.15s;
  -ms-transition: color 0.15s;
  -o-transition: color 0.15s;
  transition: color 0.15s;
}
.detail-menu .liWidth > li{
  width: 20%;
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
  line-height: 22px;
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
.detail-title .detail-title-info .price .vipAfter .Ejia {
  font-size: 14px;
  color: white;
  position: relative;
}
.detail-title .detail-title-info .price .vipAfter .Ejia::after {
  content: "+";
  font-size: 15px;
  color: white;
  position: absolute;
  top: -113%;
}
.Fixedactive{
  background: #2d9aff;
  color: white;
}
.detail-menu .detail-menu-fixedbox .Fixedactive:hover{
  color: black;
}
</style>
