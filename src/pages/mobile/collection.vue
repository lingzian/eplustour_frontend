<template>
    <div class="mb-padding-content">
        <div class="content">
            <div id="collection-content"><collection-item v-for="(item,index) in requestData.result" :key="index" :itemData="item" class="collection-item" @cancelCollection="cancelCollection(item.favourite_id
)"></collection-item></div>
            <div v-if="!requestData.isFirst&&!hasResult" class="no-result">{{$t('head.nothing')}}</div>
            <div v-else v-show="scrollLoad.isShowLoad" class="loading" v-html="scrollLoad.isComplete ? scrollLoad.allLoading : scrollLoad.loading"></div>
        </div>
    </div>
</template>

<script>
import collectionItem from '../../components/mobile/items/collection-item'
import { addEvent,removeEvent,scrollDistance,getRect,messageTips } from "../../assets/js/utils";
export default {
    components : {
        collectionItem
    },
    data(){
        return {
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
            hasResult: false,  //是否已经有结果了
            requestData: {
                isFirst: true, //是否第一次请求
                pageSize: 12, //每页的数量
                pageCount : 0, //总的页数
                currentPage: 1, //当前页数
                total: 0, //总数
                result: new Array()
            },
        }
    },
    created(){
        this.requestList();
    },
    destroyed(){
        removeEvent(window,'scroll.collection');
    },
    methods: {
        cancelCollection(id){
          console.log(id);
            this.axios.delete(`api/web/v1/favourites/${id}?lang_id=${this.lang_id}`).then(res => {
                if(res.data.code != '1000'){
                    messageTips(res.data.message);
                    return false;
                }
                messageTips(this.$t('user.deleteSuccess'));
                this.reset();
                this.requestList();
            })
        },
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
          this.requestData.result.splice(0,this.requestData.result.length)
        },
        requestList(){
            this.scrollLoad.canCallBack = false;
            this.scrollLoad.isShowLoad = true;
            var page = this.requestData.currentPage;
            this.axios.get('api/web/v1/favourites',{
                params : {
                    lang_id : this.lang_id,
                    'per-page':this.requestData.pageSize,
                    page : page
                }
            }).then(res => {
                if(res.data.code != '1000'){
                    messageTips(res.data.message);
                    return false;
                }
                var data = res.data.data;
                if (page == 1) {
                    if (data.items.length != 0) this.hasResult = true;
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
                    this.scrollLoad.contentHeight = getRect(document.querySelector('#collection-content')).height;
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
            addEvent(window,'scroll.collection',() => {
                var contentHeight = this.scrollLoad.contentHeight;
                var canCallBack = this.scrollLoad.canCallBack;
                scrollDistance(viewPortHeight,contentHeight,() => {
                    if(canCallBack) this.requestList();
                });
            });
        },
    }
}
</script>

<style scoped>
.mb-padding-content{
    padding-bottom: 0;
}
.collection-item{
    border-bottom: .04rem solid #eee;
}
.collection-item:last-of-type{
    border-bottom: 0;
}
</style>
