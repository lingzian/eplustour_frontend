<template>
  <div>
    <!-- 积分明细 -->
    <div class="bg-info">
      <img src="../../../assets/images/point-bg.png" alt="">
      <div class="bg-info-inner center">
          <div>{{$t('user.myPoint')}}</div>
          <div>{{allPoints}}</div>
      </div>
    </div>
    <div class="datepicker">
      <span>{{$t('user.selectTime')}}：</span>
      <el-date-picker
        :default-time="defaultTime"
        v-model="dateModel"
        :editable="false"
        :clearable="false"
        type="daterange"
        range-separator="-"
        size="small"
        :picker-options="pickerOptions"
        :start-placeholder="$t('user.choose')"
        :end-placeholder="$t('user.choose')"
        value-format="timestamp"
        @change="pickerChange">
      </el-date-picker>
    </div>
    <!-- 积分列表 -->
    <div class="list">
      <div v-for="(item,key,index) in requestData.result" :key="index" v-if="requestData.currentPage == parseInt(key)">
        <point-item class="point-item" v-for="(i,idx) in item" :key="idx" :itemData="i"></point-item>
        <div v-if="!requestData.isFirst&&!hasResult" class="no-result center">{{$t('head.nothing')}}</div>
      </div>
    </div>
    <!-- 分頁器 -->
    <div class="pagination" v-show="hasResult">
        <el-pagination
            background
            :page-size="requestData.pageSize"
            layout="prev, pager, next"
            @current-change="currentPageChange"
            :total="requestData.total">
        </el-pagination>
    </div>
  </div>
</template>

<script>
import pointItem from '../../../components/pc/items/pointsRebate-item'
import { scrollTop,messageTips } from '../../../assets/js/utils'
let date = new Date();
export default {
  components : {
    pointItem
  },
  data(){
    return {
      isFirstSelectDate : true,
      defaultTime: ['00:00:00','23:59:59'],
      //默認是這個月
      dateModel : [new Date(date.getFullYear(),date.getMonth(),'1','0','0','0').getTime(),new Date().getTime()],
      allPoints : 0,
      requestData : {
          isFirst : true,
          pageSize : 8,
          total : 0,
          currentPage : 1,
          pageCount : 0,
          result : new Object()
      },
      hasResult : false,
      pickerOptions : {
        disabledDate(time) {
          return time.getTime() > new Date(new Date().setHours(0,0,0,0)).getTime();
        }
      },
    }
  },
  created(){
    this.requestList(this.requestData.currentPage);
  },
  methods: {
    //重置列表
    reset(){
      this.requestData.isFirst = true;
      this.requestData.total = 0;
      this.requestData.pageCount = 0;
      this.requestData.result = new Object();
      this.hasResult = false;
    },
    pickerChange(res){
      if(this.isFirstSelectDate){
        this.isFirstSelectDate = false;
        return false;
      }
      this.reset();
      this.requestList(this.requestData.currentPage);
    },
    requestList(page){
      this.axios.get('api/web/v1/integrals',{
        params : {
          lang_id : this.lang_id,
          'per-page' : this.requestData.pageSize,
          page : page,
          start: parseInt(this.dateModel[0]/1000),
          end: parseInt(this.dateModel[1]/1000)
        }
      }).then(res => {
          if(res.data.code != '1000'){
              messageTips(res.data.message,'error');
              return false;
          }
          var data = res.data.data;
          if(page == 1){
              if(data.items.integral_list.length != 0) this.hasResult = true;
              this.requestData.total = parseInt(data._meta.totalCount);
              this.requestData.isFirst = false;
              this.requestData.pageCount = data._meta.pageCount;
              this.allPoints = data.items.integral_total;
          }
          this.$set(this.requestData.result,page.toString(),Object.freeze(data.items.integral_list));
          this.requestData.currentPage = page;
          if(page != 1) scrollTop();
      });
    },
    currentPageChange(idx){
        if(!this.requestData.result[idx]){
            this.requestList(idx);
        }else{
            this.requestData.currentPage = idx;
            scrollTop();
        }
    },
  }
}
</script>

<style scoped>
.bg-info{
  position: relative;
}
.bg-info-inner{
  text-align: center;
  color: #fff;
}
.bg-info-inner>div:first-of-type{
  font-size: 18px;
}
.bg-info-inner>div:nth-of-type(2){
  font-size: 30px;
  margin-top: 15px;
}
.pagination {
  text-align: center;
  margin-top: 35px;
}
.list{
  margin-top: 20px;
  min-height:400px;
  position: relative;
}
.datepicker{
  text-align: center;
  padding: 35px 0 10px 0;
}
</style>