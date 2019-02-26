<template>
  <div>
    <div class="passport_list">
      <el-button class="addButton" v-show="addBtn" type="primary" @click="add">{{$t('info.add')}}</el-button>
      <passport-item v-for="(i,idx) in requestData.result" :key="idx" :itemData="i" @del="del" @edit="edit"></passport-item>
      <div v-if="!requestData.isFirst && requestData.result.length == 0" class="no-result center">{{$t('head.nothing')}}</div>
    </div>

    <!-- 编辑、新增 -->
    <passport-dialog ref="dialog" @success="passportSuccess"></passport-dialog>
    <!-- 分頁器 -->
    <div class="pagination" v-show="hasResult && requestData.result.length != 0">
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
import passportItem from "../../../components/pc/items/passport-item";
import passportDialog from "../../../components/pc/passport-dialog";
import { messageTips } from "../../../assets/js/utils";
export default {
  components: {
    passportItem,
    passportDialog
  },
  data() {
    return {
      requestData: {
        isFirst: true,
        pageSize: 8,
        total: 12,
        currentPage: 1,
        result: new Object()
      },
      hasResult: false,
      addBtn: false
    };
  },
  created() {
    this.requestList();
  },
  methods: {
    requestList() {
      this.axios
        .get("api/web/v1/passports", {
          params: {
            lang_id: this.lang_id,
            "per-page": this.requestData.pageSize,
            page: this.requestData.currentPage,
          }
        })
        .then(res => {
          if (res.data.code != "1000") {
            messageTips(res.data.message);
            return false;
          }
          let data = res.data.data;
          let totalCount = parseInt(data._meta.totalCount);
          this.requestData.isFirst = false;
          if (totalCount > 0) {
            this.hasResult = true;
          }
          this.requestData.total = totalCount;
          this.requestData.result = data.items;
          this.$nextTick(() => {
            this.addBtn = true;
          });
          console.log(this.requestData.result)
        });
    },
    del(id) {
      this.$confirm(this.$t('user.deleteTravelerInformationTips'), this.$t("user.tips"), {
        confirmButtonText: this.$t("info.sure"),
        cancelButtonText: this.$t("head.cancel"),
        type: "warning"
      }).then(config => {
        if (config != "confirm") return false;
        this.axios({
          method: "delete",
          url: `api/web/v1/passports/${id}?lang_id=${this.lang_id}`
        }).then(res => {
          console.log(this.requestData)
          if (res.data.code != "1000") {
            messageTips(res.data.message);
            return false;
          }
          messageTips(this.$t("user.deleteSuccess"));
          if(this.requestData.result.length == this.requestData.pageSize){
             this.requestList();
          }else{
            let idx = this.requestData.result.map(ele => ele.id).indexOf(id);
            this.requestData.result.splice(idx,1);
            if(this.requestData.result.length == 0 && this.requestData.currentPage != 1){
              this.requestData.currentPage  = this.requestData.currentPage - 1
              this.requestList();
            }
          }
        });
      });
    },
    add() {
      this.$refs.dialog.open();
    },
    edit(id) {
      this.$refs.dialog.open(id);
    },
    passportSuccess(type) {
      if(type == 'add') this.requestData.currentPage = 1;
      this.requestList();
    },
    currentPageChange(res) {
      this.requestData.currentPage = res;
      this.requestList();
    },
  }
};
</script>

<style scoped>
.addButton{
  margin-bottom: 10px;
}
.passport_list {
  min-height: 400px;
  position: relative;
}
.pagination {
  text-align: center;
  margin-top: 35px;
}
</style>
