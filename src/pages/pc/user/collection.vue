<template>
  <div>
    <!-- 收藏列表 -->
    <div class="collection-content">
        <div v-for="(item,key,index) in requestData.result" :key="index" v-if="requestData.currentPage == parseInt(key)">
          <collection-item class="collection-item" v-for="(i,idx) in item" :key="idx" :itemData="i" @deleteCollection="deleteCollection"></collection-item>
          <div v-if="!requestData.isFirst&&!hasResult" class="no-result center">{{$t('head.nothing')}}</div>
        </div>
    </div>
    <!-- 分頁器 -->
    <div class="pagination" v-show="hasResult">
        <el-pagination
            background
            :page-size="requestData.pageSize"
            layout="prev, pager, next"
            :current-page="requestData.currentPage"
            @current-change="currentPageChange"
            :total="requestData.total">
        </el-pagination>
    </div>

  </div>
</template>

<script>
import collectionItem from "../../../components/pc/items/collection-item"
import { scrollTop,messageTips } from '../../../assets/js/utils'
export default {
    components : {
      collectionItem
    },
    data(){
      return {
        requestData : {
            isFirst : true,
            pageSize : 6,
            total : 0,
            currentPage : 1,
            result : new Object()
        },
        hasResult : false,
        del : {
          isRequestDel : false
        }
      }
    },
    created(){
      this.requestList(this.requestData.currentPage);
    },
    methods:{
      //重置列表
      reset(){
        this.requestData.total--;
        this.requestData.result = new Object();
        if(this.requestData.total == 0) this.hasResult = false;
      },
      //删除
      deleteCollection(id){
        console.log(id);
        if(this.del.isRequestDel) return false;
        this.del.isRequestDel = true;
        this.axios.delete(`api/web/v1/favourites/${id}?lang_id=${this.lang_id}`).then(res => {
          if(res.data.code != '1000'){
              messageTips(res.data.message,'error');
              return false;
          }
          this.del.isRequestDel = false;
          messageTips(this.$t('user.deleteSuccess'));
          if(this.requestData.result[this.requestData.currentPage].length == 1) this.requestData.currentPage--;
          this.reset();
          this.requestList(this.requestData.currentPage);
        }).catch(error => {
          messageTips(this.$t('error'),'error');
        });
      },
      //请求列表
      requestList(page){
        this.axios.get('api/web/v1/favourites',{
          params : {
            lang_id : this.lang_id,
            'per-page' : this.requestData.pageSize,
            page : page
          }
        }).then(res => {
          if(res.data.code != '1000'){
              messageTips(res.data.message,'error');
              return false;
          }
          let data = res.data.data;

          let totalCount = parseInt(data._meta.totalCount);
          this.requestData.isFirst = false;
          if(totalCount > 0){
            this.hasResult = true;
          }
          this.requestData.total = totalCount;
          this.$set(this.requestData.result,page.toString(),Object.freeze(data.items));
          this.requestData.currentPage = page;
        });
      },
      currentPageChange(idx){
          if(!this.requestData.result[idx]){
              this.requestList(idx);
          }else{
              this.requestData.currentPage = idx;
          }
      },
    }
}
</script>
<style scoped>
.collection-content{
  min-height:400px;
  position: relative;
}
.collection-item{
  margin-bottom: 35px;
}
.pagination {
  text-align: center;
  margin-top: 35px;
}
</style>
