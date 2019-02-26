<template>
  <div>
    <div class="mb-padding-content">
      <div class="content">
        <div class="title">{{$t('head.search')}}  "{{$route.query.querySearch}}"</div>
        <div class="cl" id="search-content">
          <mb-item v-for="(item,index) in requestData.result" :key="index" :itemData="item" class="mb-item small"></mb-item>
          <div v-if="!requestData.isFirst&&!hasResult" class="no-result">{{$t('noResult')}}</div>
          <div v-else v-show="scrollLoad.isShowLoad" class="loading" v-html="scrollLoad.isComplete ? scrollLoad.allLoading : scrollLoad.loading"></div>
        </div>
      </div>
    </div>
    <!-- 篩選彈窗 -->
    <transition name="fade">
      <div v-if="screen.show" class="screen" @click="closeScreen()">
        <div class="screen-box" :class="{'slide':screen.slide}" @click.stop>

          <!-- 筛选标题 -->
          <div class="box-title">{{$t('screen.screen')}}</div>

          <!-- 筛选内容 -->
          <div class="screen-content" id="screen-content">
            <div v-for="(item,key,index) in filter.result" :key="index" class="screen-item">
              <div class="title" v-if="key == 'filter_days'">{{$t('screen.travelDays')}} :</div>
              <div class="title" v-else-if="key == 'filter_price'">{{$t('screen.priceRange')}} :</div>
              <div class="title" v-else-if="key == 'filter_place'">{{$t('screen.place')}} :</div>
              <ul class="select-item cl">
                <li v-for="(i,idx) in item" :key="idx" :class="{'select':filterSelect[index] == i.key}" @click="filterSelect[index] = i.key">{{i.name}}</li>
              </ul>
            </div>
            <!-- 出发时间 -->
            <div v-if="filter.result" class="departureDate screen-item">
              <div class="title">{{$t('item.departureDate')}} :</div>
              <div class="departureDate-content select-items cl">
                <div @click="openDatePicker('start')">{{date.dateStart}}</div>
                <span class="line center"></span>
                <div @click="openDatePicker('end')">{{date.dateEnd}}</div>
              </div>
            </div>
          </div>

          <!-- 筛选按钮 -->
          <div class="btn cl">
            <div @click="screenReset">{{$t('screen.resetBtn')}}</div>
            <div @click="screenConfirm">{{$t('screen.confirmBtn')}}</div>
          </div>

        </div>
      </div>
    </transition>
    <!-- 开始时间选择器 -->
    <mt-datetime-picker
      ref="start"
      v-model="date.selectDateStart"
      type="date"
      :startDate="new Date()"
      :year-format="'{value} '+$t('dateFormat.year')"
      :month-format="'{value} '+$t('dateFormat.month')"
      :date-format="'{value} '+$t('dateFormat.date')"
      :cancelText="$t('head.cancel')"
      :confirmText="$t('head.sure')"
      @confirm="onDateSelectStart">
    </mt-datetime-picker>
    <!-- 结束时间选择器 -->
    <mt-datetime-picker
      ref="end"
      v-model="date.selectDateEnd"
      type="date"
      :startDate="date.selectDateStart || new Date()"
      :year-format="'{value} '+$t('dateFormat.year')"
      :month-format="'{value} '+$t('dateFormat.month')"
      :date-format="'{value} '+$t('dateFormat.date')"
      :cancelText="$t('head.cancel')"
      :confirmText="$t('head.sure')"
      @confirm="onDateSelectEnd">
    </mt-datetime-picker>
  </div>
</template>

<script>
import Vue from "vue";
import { DatetimePicker } from "mint-ui";
Vue.component(DatetimePicker.name, DatetimePicker);

import mbItem from "../../components/mobile/items/index-item";
import {
  formatDate,
  addEvent,
  removeEvent,
  scrollDistance,
  getRect,
  messageTips
} from "../../assets/js/utils";
export default {
  components: {
    mbItem
  },
  data() {
    return {
      //滾動加載
      scrollLoad: {
        loading: '<i class="el-icon-loading"></i>' + this.$t("head.loading"), //请求指示
        allLoading: this.$t("head.allLoad"), //完成请求指示
        isShowLoad: false, //是否显示指示
        afterListen: false, //是否已经开始监听滚动条
        contentHeight: 0, //内容的高度
        canCallBack: false, //是否触发请求方法
        isComplete: false //是否已经完成
      },
      querySearch: this.$route.query.querySearch || "",
      //时间
      date: {
        selectDateStart: "",
        selectDateEnd: "",
        startGettime: "", //开始时间戳
        endGettime: "", //结束时间戳
        dateStart: "", //開始時間
        dateEnd: "" //開始日期
      },
      filterSelectSave: {
        0: "",
        1: "",
        2: ""
      },
      filterSelect: {
        0: this.$route.query.travelDays || "", //旅行天數
        1: this.$route.query.priceRange || "", //價格
        2: this.$route.query.place || "" //地區
      },
      screen: {
        show: false, //筛选是否顯示
        slide: false //筛选是否滑出
      },
      hasResult: false, //是否已经有结果了
      requestData: {
        isFirst: true, //是否第一次请求
        pageSize: 12, //每页的数量
        pageCount: 0, //总的页数
        currentPage: 1, //当前页数
        total: 0, //总数
        result: new Array()
      },
      filter: new Object() //过滤内容
    };
  },
  created() {
    this.setDate();
    this.search();
  },
  destroyed(){
    removeEvent(window, "scroll.search");
  },
  methods: {
    // 去url上面獲取時間
    setDate(){
      let route = this.$route;
      if(!route.query.timeStamp) return false;
      let date = route.query.timeStamp.split('-');
      this.date.dateStart = formatDate(date[0]/1000);
      this.date.dateEnd = formatDate(date[1]/1000);
      this.date.startGettime = date[0];
      this.date.endGettime = date[1];
      this.date.selectDateStart = new Date(date[0]);
      this.date.selectDateEnd = new Date(date[1]);
    },
    //打开时间选择picker
    openDatePicker(picker) {
      if (picker == "start") {
        this.$refs.start.open();
      } else if (picker == "end") {
        this.$refs.end.open();
      }
    },
    //当选择了开始的时间
    onDateSelectStart(date) {
      this.date.dateStart = formatDate(date, true);
      this.date.startGettime = date.getTime();
    },
    //当选择了结束的时间
    onDateSelectEnd(date) {
      this.date.dateEnd = formatDate(date, true);
      this.date.endGettime = date.getTime();
    },
    // 重置篩選
    screenReset() {
      for (var i in this.filterSelect) {
        this.filterSelect[i] = "";
      }
      this.date.dateStart = "";
      this.date.dateEnd = "";
      this.date.startGettime = "";
      this.date.endGettime = "";
    },
    //确认選擇筛选
    screenConfirm() {
      var startTime = this.date.startGettime;
      var endTime = this.date.endGettime;
      if (startTime != "" && endTime != "" && startTime > endTime) {
        messageTips(this.$t("head.dateError"));
        return false;
      } else {
        this.closeScreen(() => {
          this.resetSearch();
          this.search();
          this.saveScreenSearch();
        }, true);
      }
    },
    //存儲搜索的標籤到url上面
    saveScreenSearch(){
      let route = this.$route;
      let query = {
        querySearch : route.query.querySearch
      }
      let filterSelect = this.filterSelect;
      for(let i in filterSelect){
        if(filterSelect[i] != ''){
          if(i == 0){
            query.travelDays = filterSelect[i]
          }else if(i == 1){
            query.priceRange = filterSelect[i]
          }else if(i == 2){
            query.place = filterSelect[i]
          }
        }
      }
      if(this.date.startGettime != '' && this.date.endGettime != ''){
        query.timeStamp = this.date.startGettime + '-' + this.date.endGettime;
      }
      this.$router.replace({
        path : route.path,
        query : query
      })
    },
    //筛选的弹出
    showScreen() {
      this.screen.show = true;
      setTimeout(() => {
        this.screen.slide = true;
      }, 60);
      this.filterSelectSave[0] = this.filterSelect[0];
      this.filterSelectSave[1] = this.filterSelect[1];
      this.filterSelectSave[2] = this.filterSelect[2];
    },
    //筛选的关闭
    closeScreen(fn, isSure) {
      this.screen.slide = false;
      setTimeout(() => {
        this.screen.show = false;
        if (fn) {
          fn.call(this);
        }
      }, 200);
      if (isSure) return false;
      this.filterSelect[0] = this.filterSelectSave[0];
      this.filterSelect[1] = this.filterSelectSave[1];
      this.filterSelect[2] = this.filterSelectSave[2];
    },
    //重置加載
    resetSearch() {
      this.hasResult = false;
      this.requestData.isFirst = true;
      this.requestData.pageCount = 0;
      this.requestData.currentPage = 1;
      this.requestData.total = 0;
      this.scrollLoad.contentHeight = 0;
      this.scrollLoad.canCallBack = false;
      this.scrollLoad.isComplete = false;
      this.scrollLoad.isShowLoad = false;
      this.requestData.result.splice(0, this.requestData.result.length);
    },
    //请求搜索
    search() {
      this.scrollLoad.canCallBack = false;
      this.scrollLoad.isShowLoad = true;
      var page = this.requestData.currentPage;
      this.axios
        .get("/api/web/v1/searches", {
          params: {
            lang_id: this.lang_id,
            keyword: this.querySearch,
            "per-page": this.requestData.pageSize,
            page: page,
            filter_day: this.filterSelect[0], //筛选天数
            filter_price: this.filterSelect[1], //筛选价格
            filter_place: this.filterSelect[2], //筛选地方
            filter_departure_start_date:
              this.date.startGettime == "" ? "" : parseInt(this.date.startGettime / 1000), //筛选出发时间段
            filter_departure_end_date:
              this.date.endGettime == "" ? "" : parseInt(this.date.endGettime / 1000) //筛选結束时间段
          }
        })
        .then(res => {
          if (res.data.code != "1000") {
            messageTips(res.data.message);
            return false;
          }
          var data = res.data.data;
          if (page == 1) {
            if (data.items.length != 0) this.hasResult = true;
            this.requestData.total = parseInt(data._meta.totalCount);
            this.requestData.isFirst = false;
            this.requestData.pageCount = data._meta.pageCount;
            this.$set(
              this.filter,
              "result",
              Object.freeze(res.data.data.filter)
            );
            if (
              this.requestData.pageCount != 1 &&
              !this.scrollLoad.afterListen
            ) {
              this.scrollLoad.afterListen = true; //已经开始监听滚动条
              this.listenScroll(); //監聽滾動條
            }
          }
          data.items.forEach(element => {
            this.requestData.result.push(element);
          });
          this.requestData.currentPage++;
          //是否继续监听滚动条
          this.$nextTick(() => {
            this.scrollLoad.contentHeight = getRect(
              document.querySelector("#search-content")
            ).height;
            if (this.requestData.currentPage <= this.requestData.pageCount) {
              this.scrollLoad.canCallBack = true;
              this.scrollLoad.isShowLoad = false;
            } else {
              this.scrollLoad.isComplete = true;
            }
          });
        });
    },
    //監聽滾動條
    listenScroll() {
      var viewPortHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      addEvent(window, "scroll.search", () => {
        var contentHeight = this.scrollLoad.contentHeight;
        var canCallBack = this.scrollLoad.canCallBack;
        scrollDistance(viewPortHeight, contentHeight, () => {
          if (canCallBack) this.search();
        });
      });
    }
  }
};
</script>

<style scoped>
.mb-padding-content {
  padding-bottom: 0;
}
.fade-enter-active,
.fade-leave-active {
  -webkit-transition: all 0.15s;
  -moz-transition: all 0.15s;
  -ms-transition: all 0.15s;
  -o-transition: all 0.15s;
  transition: all 0.15s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.title {
  font-size: 0.373333rem;
  color: #888;
  line-height: 0.533333rem;
  white-space: normal;
  word-break: break-all;
}
.content {
  padding: 0.266667rem 0.506667rem;
}
.content .mb-item {
  float: left;
  width: 4.293333rem;
  margin-right: 0.4rem;
  margin-bottom: 0.346667rem;
}
.content .mb-item:nth-of-type(2n) {
  margin-right: 0;
}
.content > div:first-of-type {
  margin-bottom: 0.266667rem;
}
.screen {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 2;
}
.screen-box {
  position: absolute;
  top: 0;
  right: 0;
  width: 7.933333rem;
  height: 100%;
  background-color: #fff;
  transition: all 0.2s;
  transform: translate(100%, 0);
}
.screen-box.slide {
  transform: translate(0, 0);
}
.screen .box-title {
  background-color: #f8f4f5;
  color: #bbb;
  font-size: 0.36rem;
  height: 0.933333rem;
  line-height: 0.933333rem;
  padding: 0 0.266667rem;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
}
.screen .screen-content {
  height: 100%;
  padding-bottom: 1.366667rem;
  padding-top: 0.933333rem;
  overflow-x: hidden;
  overflow-y: scroll;
}
.screen .screen-item {
  padding: 0.333333rem 0.266667rem;
  border-bottom: 0.02rem solid #ddd;
}
.screen .screen-item:last-of-type {
  border-bottom: 0;
}
.screen .select-item {
  margin-top: 0.133333rem;
  display: flex;
  justify-content: flex-start;
  flex-flow: row wrap;
}
.screen .select-item li {
  background-color: #f5f5f5;
  margin-right: 2%;
  margin-bottom: 0.2rem;
  border-radius: 0.2rem;
  overflow: hidden;
  color: #222;
  word-break: break-all;
  white-space: nowrap;
  padding: 0.2rem 0.3rem;


}
.screen .select-item li.select {
  background-color: #2d9aff;
  color: #fff;
}
.screen .btn {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1.066667rem;
  line-height: 1.066667rem;
}
.screen .btn div {
  width: 50%;
  float: left;
  text-align: center;
  font-size: 0.426667rem;
}
.screen .btn div:first-of-type {
  background-color: #e6e6e6;
}
.screen .btn div:last-of-type {
  background-color: #2d9aff;
  color: #fff;
}
.departureDate .departureDate-content {
  height: 0.933333rem;
  background-color: #f4f4f4;
  position: relative;
  padding: 0.133333rem;
  margin-top: 0.1rem;
}
.departureDate .departureDate-content > div {
  background-color: #fff;
  height: 100%;
  line-height: 0.666667rem;
  width: 3.066667rem;
  text-align: center;
  font-size: 0.34rem;
}
.departureDate .departureDate-content > div:first-of-type {
  float: left;
}
.departureDate .departureDate-content > div:last-of-type {
  float: right;
}
.departureDate .departureDate-content span.line {
  display: block;
  width: 0.373333rem;
  height: 0.066667rem;
  background-color: #a9a9a9;
}
.loading {
  float: left;
}
</style>
