<template>
    <div class="trip col-width">
        <!-- 麵包屑 -->
        <div class="amount-nav-search">
            <el-breadcrumb separator="//">
                <el-breadcrumb-item :to="{ path: '/' }">{{$t('footer.home')}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{$t('head.trip')}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- nav -->
        <div class="trip-nav cl">
          <div :class="{'select':status == ''}" @click="selectStatus('')">{{$t('head.tripStatus.all')}}</div>
          <div :class="{'select':status == '1'}" @click="selectStatus('1')">{{$t('head.tripStatus.pending')}}</div>
          <div :class="{'select':status == '2'}" @click="selectStatus('2')">{{$t('head.tripStatus.paid')}}</div>
          <div :class="{'select':status == '4'}" @click="selectStatus('4')">{{$t('head.tripStatus.completed')}}</div>
        </div>
        <!-- 列表 -->
        <div class="trip-content">
            <div v-for="(item,key,index) in requestData.result" :key="index" v-if="requestData.currentPage == parseInt(key)" class="cl">
                <trip-item class="trip-item" v-for="(i,idx) in item" :key="idx" :itemData="i"></trip-item>
                <div v-if="!requestData.isFirst&&!hasResult" class="no-result">{{$t('head.nothing')}}</div>
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
import tripItem from '../../components/pc/items/trip-item'
import {scrollTop} from "../../assets/js/utils"
export default {
  components : {
    tripItem
  },
  data(){
    return {
      status : this.$route.query.status || '',
      requestData : {
          isFirst : true,
          pageSize : 12,
          total : 0,
          currentPage : 1,
          pageCount : 0,
          result : new Object()
      },
      hasResult : false
    }
  },
  created(){
    this.requestList(this.requestData.currentPage);
  },
  methods : {
    selectStatus(status){
      if(status == this.status) return false;
      this.status = status;
      this.listReset();
      this.requestList(this.requestData.currentPage);
    },
    listReset(){
      this.requestData.isFirst = true;
      this.requestData.total = 0;
      this.requestData.currentPage = 1;
      this.requestData.pageCount = 0;
      this.requestData.result = new Object();
      this.hasResult = false;
    },
    requestList(page){
      this.axios.get('api/web/v1/orders',{
          params : {
            lang_id : this.lang_id,
            page : page,
            'per-page':this.requestData.pageSize,
            status : this.status
          }
      }).then(res => {
        if(res.data.code != '1000'){
            messageTips(res.data.message,'error');
            return false;
        }
        var data = res.data.data;
        if(page == 1){
          if(data.items.length != 0) this.hasResult = true;
          this.requestData.total = parseInt(data._meta.totalCount);
          this.requestData.isFirst = false;
          this.requestData.pageCount = data._meta.pageCount;
        }
        this.$set(this.requestData.result,page.toString(),Object.freeze(data.items));
        this.requestData.currentPage = page;
        scrollTop();
      })
    },
    currentPageChange(idx){
      if(!this.requestData.result[idx]){
          this.requestList(idx);
      }else{
          this.requestData.currentPage = idx;
          scrollTop();
      }
    }
  }
}
</script>

<style scoped>
.trip{
    padding: 25px 0;
}
.trip-content{
    margin-top: 25px;
    min-height: 500px;
    position: relative;
}
.pagination {
  text-align: center;
  margin-top: 35px;
}
.trip-nav{
  margin-top: 20px;
}
.trip-nav>div{
  float: left;
  width: 200px;
  line-height: 50px;
  height: 50px;
  text-align: center;
  cursor: pointer;
}
.trip-nav>div.select{
  color: #2d9aff;
  border-bottom: 3px solid #2d9aff;
}
.trip-item{
  float: left;
  margin-right: 26px;
  margin-bottom: 26px;
}
.trip-item:nth-of-type(4n){
  margin-right: 0;
}
.no-result{
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%,-50%);
  -moz-transform: translate(-50%,-50%);
  -ms-transform: translate(-50%,-50%);
  -o-transform: translate(-50%,-50%);
  transform: translate(-50%,-50%);
}
</style>