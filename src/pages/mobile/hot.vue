<template>
    <div>
        <div class="template-list">
            <swiper :options="swiperOption" ref="mySwiper">
                <swiper-slide v-for="(item,index) in items.items" :key="index" class="template-item" :class="{'select':templateId == item.template_id}">
                    <div @click="selectTemplate(item.template_id)">{{item.name}}</div>
                </swiper-slide>
            </swiper>
        </div>
        <div class="mb-padding-content">
            <div class="cl" id="hot-content">
                <index-item v-for="(item,index) in requestData.result" :key="index" :itemData="item" class="mb-item small"></index-item>
                <div v-show="scrollLoad.isShowLoad" class="loading" v-html="scrollLoad.isComplete ? scrollLoad.allLoading : scrollLoad.loading"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { addEvent,removeEvent,scrollDistance,getRect,messageTips } from "../../assets/js/utils";
import indexItem from "../../components/mobile/items/index-item"
export default {
    components : {
        swiper,
        swiperSlide,
        indexItem
    },
    data(){
        return {
            scrollLoad:{
                loading: '<i class="el-icon-loading"></i>' + this.$t('head.loading'), //请求指示
                allLoading : this.$t('head.allLoad'), //完成请求指示
                isShowLoad : false, //是否显示指示
                afterListen : false, //是否已经开始监听滚动条
                contentHeight : 0, //内容的高度
                canCallBack : false, //是否触发请求方法
                isComplete : false, //是否已经完成
            },
            items : new Object(), //模块数据
            swiperOption: {
                slidesPerView: 'auto'
            },
            templateId : this.$route.query.id || '', //模块ID
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
        //获取行程模块列表
        this.getTemplateList(() => {
            this.getList(); //获取行程模块
        });
    },
    destroyed(){
        removeEvent(window,'scroll.hot');
    },
    methods:{
        //获取行程模块列表
        getTemplateList(fn){
            this.axios.get('api/web/v1/templates/list',{
                params : {
                    lang_id : this.lang_id
                }
            }).then(res => {
                if(res.data.code != '1000'){
                    messageTips(res.data.message);
                    return false;
                }
                var data = res.data.data;
                this.$set(this.items,'items',Object.freeze(data.items));
                var idx = 0;
                data.items.forEach((ele,index) => {
                    if(ele.template_id == this.templateId) idx = index;
                });
                this.$refs.mySwiper.swiper.slideTo(parseInt(idx),0,false);
                if(this.templateId == '' && data.items.length != 0) this.templateId = data.items[0].template_id;
                if(data.items.length != 0) fn.call(this);
            })
        },
        //选择行程列表
        selectTemplate(templateId){
            this.templateId = templateId;
            this.listReset();
            this.getList();
        },
        //重置数据啊
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
        //监听滚动条
        listenScroll(){
            var viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            addEvent(window,'scroll.hot',() => {
                var contentHeight = this.scrollLoad.contentHeight;
                var canCallBack = this.scrollLoad.canCallBack;
                scrollDistance(viewPortHeight,contentHeight,() => {
                    if(canCallBack){
                        this.getList();
                    }
                });
            });
        },
        //获取行程模块
        getList(){
            this.scrollLoad.canCallBack = false;
            this.scrollLoad.isShowLoad = true;
            var page = this.requestData.currentPage;
            this.axios.get(`api/web/v1/templates/${this.templateId}`,{
                params : {
                    lang_id : this.lang_id,
                    'per-page' : this.requestData.pageSize,
                    page : page
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
                    this.scrollLoad.contentHeight = getRect(document.querySelector('#hot-content')).height;
                    if(this.requestData.currentPage <= this.requestData.pageCount){
                        this.scrollLoad.canCallBack = true;
                        this.scrollLoad.isShowLoad = false;
                    }else{
                        this.scrollLoad.isComplete = true;
                    }
                });
            })
        }
    }
}
</script>

<style scoped>
.template-list{
    position: fixed;
    top: 1.333333rem;
    left: 0;
    right: 0;
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    border-bottom: 0.013333rem solid #efefef;
    box-shadow: 0px 0px 5px #ccc;
    background-color: #fff;
    z-index: 1;
}
.template-list>div{
    height: 100%;
}
.template-list .template-item{
    width: auto;
    height: 1.066667rem;
    line-height: 1.066667rem;
    float: left;
    text-align: center;
    padding: 0 .6rem;
}
.template-list .template-item.select{
    color: #2d9aff;
}
.template-list .template-item div{
    height: 100%;
    border-bottom: .15rem solid transparent;
    padding: 0 .106667rem;
}
.template-list .template-item.select div{
    border-color:#2d9aff;
}
.mb-padding-content{
    margin-top: .533333rem;
    padding-top: 2.333333rem;
    padding-left: .506667rem;
    padding-right: .506667rem;
}
.loading{
    float: left;
}
.mb-item{
  float: left;
  width: 4.293333rem;
  margin-right: 0.4rem;
  margin-bottom: 0.346667rem;
}
.mb-item:nth-of-type(2n){
    margin-right: 0;
}
</style>
