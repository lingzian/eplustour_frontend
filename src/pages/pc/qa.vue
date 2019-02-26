<template>
    <div class="qa col-width">
        <!-- 麵包屑 -->
        <div class="amount-nav-search">
            <el-breadcrumb separator="//">
                <el-breadcrumb-item :to="{ path: '/' }">{{$t('footer.home')}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{$t('head.qa')}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 列表 -->
        <div class="qa-content">
            <div v-for="(item,key,index) in requestData.result" :key="index" v-if="requestData.currentPage == parseInt(key)">
                <qa-item class="qa-item" v-for="(i,idx) in item" :key="idx" :class="{'left':idx%2 == 0,'right':idx%2 != 0}" :itemData="i"></qa-item>
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
import { scrollTop,messageTips } from "../../assets/js/utils";
import qaItem from "../../components/pc/items/qa-item"
export default {
    components : {
        qaItem
    },
    data(){
        return {
            requestData : {
                isFirst : true,
                pageSize : 8,
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
        requestList(page){
            this.axios.get('api/web/v1/questions',{
                params : {
                    lang_id : this.lang_id,
                    "per-page" : this.requestData.pageSize,
                    page : page
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
.qa{
    padding: 25px 0;
}
.qa-content{
    margin-top: 25px;
}
.pagination {
  text-align: center;
  margin-top: 35px;
}
.qa-item{
    margin-bottom: 25px !important;
}
</style>