<template>
    <div>
      <div class="status cl">
        <div :class="{'select':status == ''}" @click="selectStatus('')"><span>{{$t('head.tripStatus.all')}}</span></div>
        <div :class="{'select':status == '1'}" @click="selectStatus('1')"><span>{{$t('head.tripStatus.pending')}}</span></div>
        <div :class="{'select':status == '2'}" @click="selectStatus('2')"><span>{{$t('head.tripStatus.paid')}}</span></div>
        <div :class="{'select':status == '4'}" @click="selectStatus('4')"><span>{{$t('head.tripStatus.completed')}}</span></div>
      </div>
      <div class="mb-padding-content">
        <div id="trip-content">
          <trip-item v-for="(item,index) in requestData.result" :key="index" :itemData="item" class="trip-item"></trip-item>
          <div v-if="!requestData.isFirst&&!hasResult" class="no-result">{{$t('head.nothing')}}</div>
          <div v-else v-show="scrollLoad.isShowLoad" class="loading" v-html="scrollLoad.isComplete ? scrollLoad.allLoading : scrollLoad.loading"></div>
        </div>
      </div>
    </div>
</template>

<script>
import tripItem from '../../components/mobile/items/trip-item'
import { addEvent,removeEvent,scrollDistance,getRect,messageTips } from "../../assets/js/utils";
export default {
    components : {
      tripItem
    },
    data(){
      return {
        status : this.$route.query.status || '',
        scrollLoad:{
            loading: '<i class="el-icon-loading"></i>' + this.$t('head.loading'), //请求指示
            allLoading : this.$t('head.allLoad'), //完成请求指示
            isShowLoad : false, //是否显示指示
            afterListen : false, //是否已经开始监听滚动条
            contentHeight : 0, //内容的高度
            canCallBack : false, //是否触发请求方法
            isComplete : false, //是否已经完成
        },
        requestData: {
            isFirst: true, //是否第一次加载
            pageSize: 12, //每页的数量
            pageCount : 0, //总的页数
            currentPage: 1, //当前页数
            total: 0, //总数量
            result: new Array(), //结果
        },
        hasResult : false, //是否有数据
      }
    },
    created(){
      this.requestList();
    },
    mounted() {
      document.body.style.backgroundColor = "#f5f5f5";
    },
    destroyed() {
      document.body.style.backgroundColor = "#fff";
      removeEvent(window,'scroll.trip');
    },
    methods : {
      selectStatus(status){
        if(status == this.status) return false;
        this.status = status;
        this.$router.replace({
          path : this.$route.path,
          query : {
            status : status
          }
        });
        this.listReset();
        this.requestList();
      },
      listReset(){
          this.hasResult = false;
          this.requestData.isFirst = true;
          this.requestData.pageCount = 0;
          this.requestData.currentPage = 1;
          this.requestData.total = 0;
          this.scrollLoad.contentHeight = 0;
          this.scrollLoad.canCallBack = false;
          this.scrollLoad.isComplete = false;
          this.scrollLoad.isShowLoad = false;
          this.requestData.result.splice(0,this.requestData.result.length)
      },
      //请求列表
      requestList(){
        this.scrollLoad.canCallBack = false;
        this.scrollLoad.isShowLoad = true;
        var page = this.requestData.currentPage;
        this.axios.get('api/web/v1/orders',{
          params : {
            lang_id : this.lang_id,
            page : page,
            'per-page':this.requestData.pageSize,
            status : this.status
          }
        }).then(res => {
          if(res.data.code != '1000'){
              messageTips(res.data.message);
              return false;
          }
          var data = res.data.data;
          if(page == 1){
            if(data.items.length != 0) this.hasResult = true;
            this.requestData.total = parseInt(data._meta.totalCount);
            this.requestData.isFirst = false;
            this.requestData.pageCount = data._meta.pageCount;
            if(this.requestData.pageCount != 1 && !this.scrollLoad.afterListen){
                this.scrollLoad.afterListen = true; //已经开始监听滚动条
                this.listenScroll(); //监听滚动条
            }
          }
          data.items.forEach(element => {
            this.requestData.result.push(element);
          });
          this.requestData.currentPage++;
          //是否继续监听滚动条
          this.$nextTick(() => {
            this.scrollLoad.contentHeight = getRect(document.querySelector('#trip-content')).height;
            if(this.requestData.currentPage <= this.requestData.pageCount){
                this.scrollLoad.canCallBack = true;
                this.scrollLoad.isShowLoad = false;
            }else{
                this.scrollLoad.isComplete = true;
            }
          });
        })
      },
      //监听滚动条
      listenScroll(){
          var viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
          addEvent(window,'scroll.trip',() => {
              var contentHeight = this.scrollLoad.contentHeight;
              var canCallBack = this.scrollLoad.canCallBack;
              scrollDistance(viewPortHeight,contentHeight,() => {
                  if(canCallBack){
                      this.requestList();
                  }
              });
          });
      },
    }
}
</script>

<style scoped>
.status{
  position: fixed;
  top: 1.333333rem;
  left: 0;
  right: 0;
  height: 1.066667rem;
  line-height: 1.066667rem;
  border-bottom: 0.013333rem solid #efefef;
  box-shadow: 0px 0px 5px #ccc;
}
.status>div{
  width: 25%;
  float: left;
  background-color: #fff;
  text-align: center;
  color: #000;
  font-size: .346667rem;
}
.status>div.select{
  color: #2d9aff;
}
.status>div span{
  display: inline-block;
  height: 1.05rem;
  border-bottom: .066667rem solid transparent;
  padding: 0 .2rem;
}
.status>div.select span{
  border-color: #2d9aff;
}
.mb-padding-content{
    padding-top: 2.666666rem;
    padding-bottom: 0;
}
.trip-item,
.loading{
  margin-bottom: .266667rem;
}
</style>