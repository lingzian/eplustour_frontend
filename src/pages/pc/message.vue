<template>
      <div class="message col-width">
            <!-- 麵包屑 -->
            <div class="amount-nav-search">
                <el-breadcrumb separator="//">
                    <el-breadcrumb-item :to="{ path: '/' }">{{$t('footer.home')}}</el-breadcrumb-item>
                    <el-breadcrumb-item>{{$t('head.message')}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <!-- nav -->
            <div class="message-nav cl" v-if="nav.length != 0">
                <div v-for="(item,index) in nav" :key="index" :class="{'select' : id == item.id}" @click="selectNav(item.id)">
                    <div class="redPoint">{{item.name}}
                      <div v-if="item.unread_message != '0'">
                        <span v-if="parseInt(item.unread_message) <= 99">{{item.unread_message}}</span>
                        <span v-if="parseInt(item.unread_message) > 99">99+</span>
                      </div>
                    </div>
                </div>
            </div>
            <div v-if="nav.length == 0" class="nav no-result center">{{$t('head.noMessage')}}</div>
            <!-- 内容 -->
            <div class="message-content">
                <div v-for="(item,key,index) in requestData.result" :key="index" v-if="requestData.currentPage == parseInt(key)">
                    <message-item class="message-item" v-for="(i,idx) in item" :key="idx" :itemData="i" @delMessage="delMessage"></message-item>
                    <div v-if="!requestData.isFirst&&!hasResult" class="no-result center">{{$t('head.noMessage')}}</div>
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
import { scrollTop, messageTips } from "../../assets/js/utils";
import messageItem from "../../components/pc/items/message-item";
export default {
  components: {
    messageItem
  },
  data() {
    return {
      nav: new Object(),
      id: this.$route.query.id || "",
      requestData: {
        isFirst: true,
        pageSize: 12,
        total: 0,
        currentPage: 1,
        pageCount: 0,
        result: new Object()
      },
      hasResult: false
    };
  },
  created() {
    this.request();
  },
  methods: {
    delMessage(id) {
      this.axios
        .delete(`api/web/v1/messages/${id}?lang_id=${this.lang_id}`)
        .then(res => {
          if (res.data.code != "1000") {
            messageTips(res.data.message, "error");
            return false;
          }
          messageTips(this.$t("user.deleteSuccess"));
          this.reset();
          this.request(true);
          this.$emit('handleHeaderEvent','getUserInfo');
        });
    },
    request(bol) {
      this.requestNav(() => {
        this.requestList(this.requestData.currentPage);
      }, bol);
    },
    selectNav(id) {
      if (id == this.id) return false;
      this.id = id;
      this.reset();
      this.requestList(this.requestData.currentPage);
    },
    reset() {
      this.hasResult = false;
      this.requestData.isFirst = true;
      this.requestData.total = 0;
      this.requestData.currentPage = 1;
      this.requestData.pageCount = 0;
      this.requestData.result = new Object();
    },
    requestNav(fn, bol) {
      this.axios
        .get("api/web/v1/messages/type", {
          params: {
            lang_id: this.lang_id
          }
        })
        .then(res => {
          if (res.data.code != "1000") {
            messageTips(res.data.message, "error");
            return false;
          }
          this.nav = Object.freeze(res.data.data.items);
          if (!bol && this.nav.length!=0) this.id = this.nav[0].id;
          fn.call(this);
        });
    },
    requestList(page) {
      this.axios
        .get("api/web/v1/messages", {
          params: {
            lang_id: this.lang_id,
            type_id: this.id,
            "per-page": this.requestData.pageSize,
            page: page
          }
        })
        .then(res => {
          if (res.data.code != "1000") {
            messageTips(res.data.message, "error");
            return false;
          }
          var data = res.data.data;
          if (page == 1) {
            if (data.items.length != 0) this.hasResult = true;
            this.requestData.total = parseInt(data._meta.totalCount);
            this.requestData.isFirst = false;
            this.requestData.pageCount = data._meta.pageCount;
          }
          this.$set(
            this.requestData.result,
            page.toString(),
            Object.freeze(data.items)
          );
          this.requestData.currentPage = page;
          scrollTop();
        });
    },
    currentPageChange(idx) {
      if (!this.requestData.result[idx]) {
        this.requestList(idx);
      } else {
        this.requestData.currentPage = idx;
        scrollTop();
      }
    },
  }
};
</script>

<style scoped>
.message-nav .redPoint {
  position: relative;
  display: inline-block;
  min-width: 40px;
}
.message-nav .redPoint > div {
  position: absolute;
  top: 3px;
  right: 0px;
  -webkit-transform: translate(100%, 0);
  -moz-transform: translate(100%, 0);
  -ms-transform: translate(100%, 0);
  -o-transform: translate(100%, 0);
  transform: translate(100%, 0);
  height: 18px;
  line-height: 18px;
  text-align: center;
  background-color: #f00;
  color: #fff;
  padding: 0 6px;
  border-radius: 10px;
  font-size: 14px;
}
.message-nav > div {
  float: left;
  width: 200px;
  line-height: 50px;
  height: 50px;
  text-align: center;
  cursor: pointer;
}







.message {
  padding: 25px 0;
  position: relative;
}
.message-content {
  margin-top: 25px;
  min-height: 400px;
  position: relative;
}
.message-nav {
  margin-top: 20px;
}
.message-nav span {
  position: relative;
}
.message-nav span > div {
  position: absolute;
  top: -10px;
  right: 0px;
  -webkit-transform: translate(100%, 0);
  -moz-transform: translate(100%, 0);
  -ms-transform: translate(100%, 0);
  -o-transform: translate(100%, 0);
  transform: translate(100%, 0);
  height: 18px;
  line-height: 18px;
  text-align: center;
  background-color: #f00;
  color: #fff;
  padding: 0 6px;
  border-radius: 10px;
  font-size: 14px;
}
.message-nav > div {
  float: left;
  width: 200px;
  line-height: 50px;
  height: 50px;
  text-align: center;
  cursor: pointer;
}
.message-nav > div.select {
  color: #2d9aff;
  border-bottom: 3px solid #2d9aff;
}
.pagination {
  text-align: center;
  margin-top: 35px;
}
.message-item {
  margin-top: 45px;
}
.nav.no-result{
  top: 50%;
}
</style>
