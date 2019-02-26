<template>
  <div>
    <div class="content">
      <div class="title">
        <div>{{allPoints}}</div>
      </div>
      <div class="pointsRecord"><img src="../../assets/images/points-record.png" alt="">{{$t('user.pointsRecord')}}</div>
      <div class="datePicker cl">
        <div @click="$refs.start.open()">
          <span>{{$t('head.startDate')}} :</span>
          <span>{{formatDate(date.startTime,true)}}</span>
        </div>
        <div @click="$refs.end.open()">
          <span>{{$t('head.endDate')}} :</span>
          <span>{{formatDate(date.endTime,true)}}</span>
        </div>
      </div>
    </div>
    <div class="list-content">
      <ul class="list-box" id="list-box">
        <li v-for="(item,index) in requestData.result" :key="index" class="cl">
          <div>
            <div>{{item.remark}}</div>
            <div>{{formatDate(item.date,false)}}</div>
          </div>
          <div :class="{'up':item.integral >=0}">{{item.integral >=0 ? '+'+item.integral : '-'+item.integral}}</div>
        </li>
        <div v-if="!requestData.isFirst&&!hasResult" class="no-result">{{$t('head.nothing')}}</div>
        <div v-else v-show="scrollLoad.isShowLoad" class="loading" v-html="scrollLoad.isComplete ? scrollLoad.allLoading : scrollLoad.loading"></div>
      </ul>
    </div>
    <!-- 开始时间选择器 -->
    <mt-datetime-picker
      ref="start"
      v-model="date.selectDateStart"
      type="date"
      :startDate="new Date('2017','0','1','0','0','0')"
      :endDate="new Date()"
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
      :startDate="date.selectDateStart || new Date('2017','0','1','0','0','0')"
      :endDate="new Date()"
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
import { formatDate,scrollDistance,getRect,addEvent,removeEvent,messageTips } from '../../assets/js/utils'
import { DatetimePicker } from 'mint-ui'
import Vue from 'vue'
Vue.component(DatetimePicker.name, DatetimePicker);
export default {
    data(){
      return {
        date:{
          startTime : '',
          endTime : '',
          selectDateStart : '',
          selectDateEnd : new Date(),
        },
        //滾動加載
        scrollLoad : {
          loading: '<i class="el-icon-loading"></i>' + this.$t('head.loading'), //请求指示
          allLoading : this.$t('head.allLoad'), //完成请求指示
          isShowLoad : false, //是否显示指示
          afterListen : false, //是否已经开始监听滚动条
          contentHeight : 0, //内容的高度
          canCallBack : false, //是否触发请求方法
          isComplete : false, //是否已经完成
        },
        requestData: {
          isFirst: true, //是否第一次请求
          pageSize: 12, //每页的数量
          pageCount : 0, //总的页数
          currentPage: 1, //当前页数
          total: 0, //总数
          result: new Array()
        },
        hasResult: false,  //是否已经有结果了
        allPoints : 0,
      }
    },
    created(){
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth();
      this.onDateSelectStart(new Date(year,month,'1','0','0','0'),true);
      this.onDateSelectEnd(new Date(),true);
      this.requestList();
    },
    methods: {
      formatDate:formatDate,
      reset(){
        this.hasResult = false;
        this.requestData.isFirst = true;
        this.requestData.pageCount = 0;
        this.requestData.currentPage = 1;
        this.requestData.total = 0;
        this.scrollLoad.contentHeight = 0;
        this.scrollLoad.canCallBack = false;
        this.scrollLoad.isComplete = false;
        this.scrollLoad.isShowLoad = false;
        this.requestData.result.splice(0,this.requestData.result.length);
      },
      onDateSelectStart(res,isOnload){
        this.date.startTime = res;
        this.date.selectDateStart = res;
        this.reset();
        if(!isOnload) this.requestList();
      },
      onDateSelectEnd(res,isOnload){
        //需要選擇日期的最後一秒
        var todayYear = res.getFullYear();
        var todayMonth = res.getMonth();
        var todayDay = res.getDate();
        this.date.endTime = new Date(todayYear,todayMonth,todayDay,'23','59','59');
        this.date.selectDateEnd = res;
        this.reset();
        if(!isOnload) this.requestList();
      },
      requestList(){
        var startTime = this.date.startTime == '' ? '' : parseInt(this.date.startTime.getTime()/1000);
        var endTime = this.date.endTime == '' ? '' : parseInt(this.date.endTime.getTime()/1000);
        if(startTime != '' && endTime != '' && startTime>endTime){
          messageTips(this.$t('head.dateError'));
          return false;
        }
        this.scrollLoad.canCallBack = false;
        this.scrollLoad.isShowLoad = true;
        var page = this.requestData.currentPage;
        var sendData = {
            lang_id : this.lang_id,
            'per-page':this.requestData.pageSize,
            page : page
        }
        if(startTime != '' && endTime != ''){
          sendData.start = startTime;
          sendData.end = endTime;
        }
        this.axios.get('api/web/v1/integrals',{
          params:sendData,
        }).then(res => {
          if(res.data.code != '1000'){
              messageTips(res.data.message);
              return false;
          }
          var data = res.data.data;
          if(!data._meta){
            data._meta = {
                currentPage : 1,
                pageCount : 1,
                totalCount : '0'
            }
          }
          if (page == 1) {
              if (data.items.integral_list.length != 0) this.hasResult = true;
              this.requestData.total = parseInt(data._meta.totalCount);
              this.requestData.isFirst = false;
              this.requestData.pageCount = data._meta.pageCount;
              this.allPoints = data.items.integral_total;
              if(this.requestData.pageCount != 1 && !this.scrollLoad.afterListen){
                  this.scrollLoad.afterListen = true; //已经开始监听滚动条
                  this.listenScroll(); //監聽滾動條
              }
          }
          data.items.integral_list.forEach(element => {
              this.requestData.result.push(element);
          });
          this.requestData.currentPage++;
          //是否继续监听滚动条
          this.$nextTick(() => {
              this.scrollLoad.contentHeight = getRect(document.querySelector('#list-box')).height;
              if(this.requestData.currentPage <= this.requestData.pageCount){
                  this.scrollLoad.canCallBack = true;
                  this.scrollLoad.isShowLoad = false;
              }else{
                  this.scrollLoad.isComplete = true;
              }
          });
        })
      },
      //監聽滾動條
      listenScroll(){
          var viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
          addEvent(window,'scroll.pointsRebate',() => {
              var contentHeight = this.scrollLoad.contentHeight;
              var canCallBack = this.scrollLoad.canCallBack;
              scrollDistance(viewPortHeight,contentHeight,() => {
                  if(canCallBack) this.requestList();
              });
          });
      },
    },
    mounted() {
      document.body.style.backgroundColor = "#f5f5f5";
    },
    destroyed(){
      document.body.style.backgroundColor = "#fff";
      removeEvent(window,'scroll.pointsRebate');
    },
}
</script>

<style scoped>
.content{
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
}
.list-content{
  padding-top: 5.7rem;
  overflow: hidden;
}
.title{
  height: 3.333333rem;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-image: url(../../assets/images/points-bg.png);
  color: #fff;
  text-align: center;
  font-size: .666667rem;
  padding-top: 2.133333rem;
}
.pointsRecord{
  font-size: .426667rem;
  background-color: #fff;
  color: #000;
  height: 1.366667rem;
  line-height: 1.066667rem;
  padding: 0 .533333rem;
  border-bottom: .04rem solid #eee;
  border-top: .3rem solid #f5f5f5;
}
.pointsRecord img{
  width: .4rem;
  margin-right: .4rem;
}
.datePicker{
  background-color: #fff;
  padding: 0 .4rem;
  border-bottom: .04rem solid #eee;
}
.datePicker>div{
  width: 48%;
  float: left;
  height: 1rem;
  line-height: 1rem;
  padding-right: .4rem;
  background-image: url(../../assets/images/points-date.png);
  background-repeat: no-repeat;
  background-size: .45rem;
  background-position: right center;
}
.datePicker>div:first-of-type{
  margin-right: 4%;
}
.list-box{
  background-color: #fff;
}
.list-box li{
  padding: 0 .533333rem;
  height: 1.5rem;
  border-bottom: .04rem solid #eee;
}
.list-box li:last-of-type{
  border-bottom: 0;
}
.list-box li>div:first-of-type{
  float: left;
  line-height: .6rem;
  padding-top: .16rem;
}
.list-box li>div:first-of-type>div:first-of-type{
  color: #000;
  font-size: .36rem;
}
.list-box li>div:first-of-type>div:last-of-type{
  color: #aaa;
}
.list-box li>div:last-of-type{
  float: right;
  height: 100%;
  line-height: 1.5rem;
  font-size: .4rem;
}
.list-box li>div:last-of-type.up{
  color: #ff840c;
}
.loading{
  background-color: #f5f5f5;
}
</style>
