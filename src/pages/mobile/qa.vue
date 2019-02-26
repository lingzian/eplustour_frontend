<template>
  <div>
    <div class="mb-padding-content">
      <div class="qa-content" id="qa-content">
        <qa-item v-for="(item,index) in requestData.result" :key="index" :itemData="item" class="qa-item"></qa-item>
        <div v-if="!requestData.isFirst&&!hasResult" class="no-result">{{$t('head.nothing')}}</div>
        <div v-else v-show="scrollLoad.isShowLoad" class="loading" v-html="scrollLoad.isComplete ? scrollLoad.allLoading : scrollLoad.loading"></div>
      </div>
    </div>
  </div>
</template>

<script>
import qaItem from "../../components/mobile/items/qa-item";
import { addEvent,removeEvent,scrollDistance,getRect,messageTips } from "../../assets/js/utils";
export default {
  components: {
    qaItem
  },
  data() {
    return {
      scrollLoad: {
        loading: '<i class="el-icon-loading"></i>' + this.$t("head.loading"), //请求指示
        allLoading: this.$t("head.allLoad"), //完成请求指示
        isShowLoad: false, //是否显示指示
        afterListen: false, //是否已经开始监听滚动条
        contentHeight: 0, //内容的高度
        canCallBack: false, //是否触发请求方法
        isComplete: false //是否已经完成
      },
      requestData: {
        isFirst: true,
        pageSize: 10,
        total: 0,
        currentPage: 1,
        pageCount: 0,
        result: new Array()
      },
      hasResult: false
    };
  },
  mounted() {
    document.body.style.backgroundColor = "#f5f5f5";
  },
  destroyed() {
    document.body.style.backgroundColor = "#fff";
    removeEvent(window,'scroll.qa');
  },
  created() {
    this.requestList();
  },
  methods: {
    requestList() {
      this.scrollLoad.canCallBack = false;
      this.scrollLoad.isShowLoad = true;
      var page = this.requestData.currentPage;
      this.axios
        .get("api/web/v1/questions", {
          params: {
            lang_id: this.lang_id,
            "per-page": this.requestData.pageSize,
            page: page
          }
        })
        .then(res => {
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
              this.listenScroll(); //監聽滾動條
            }
          }
          data.items.forEach(element => {
              this.requestData.result.push(element);
          });
          this.requestData.currentPage++;
          //是否继续监听滚动条
          this.$nextTick(() => {
              this.scrollLoad.contentHeight = getRect(document.querySelector('#qa-content')).height;
              if(this.requestData.currentPage <= this.requestData.pageCount){
                  this.scrollLoad.canCallBack = true;
                  this.scrollLoad.isShowLoad = false;
              }else{
                  this.scrollLoad.isComplete = true;
              }
          });

        });
    },
    //監聽滾動條
    listenScroll(){
      var viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      addEvent(window,'scroll.qa',() => {
          var contentHeight = this.scrollLoad.contentHeight;
          var canCallBack = this.scrollLoad.canCallBack;
          scrollDistance(viewPortHeight,contentHeight,() => {
              if(canCallBack) this.requestList();
          });
      });
    },
  }
};
</script>

<style scoped>
.mb-padding-content {
  padding-bottom: 0;
}
.qa-item {
  margin-top: .28rem;
}
.qa-item:last-of-type {
  margin-bottom: .28rem;
}
</style>