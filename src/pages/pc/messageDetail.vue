<template>
    <div class="message col-width">
      <!-- 麵包屑 -->
      <div class="amount-nav-search">
          <el-breadcrumb separator="//">
              <el-breadcrumb-item :to="{ path: '/' }">{{$t('footer.home')}}</el-breadcrumb-item>
              <el-breadcrumb-item>{{$t('head.message')}}</el-breadcrumb-item>
          </el-breadcrumb>
      </div>
      <!-- 內容 -->
      <div class="message-content">
        <div class="title">{{items.title}}</div>
        <div class="time">{{formatDate(items.send_time,false,true)}}</div>
        <div class="info cl">
          <div class="message-info" v-html="items.content"></div>
        </div>
      </div>
    </div>
</template>

<script>
import { formatDate, messageTips } from "../../assets/js/utils";
export default {
  data() {
    return {
      items: new Object(),
      id: this.$route.query.id
    };
  },
  created() {
    this.requestDetail();
  },
  methods: {
    formatDate: formatDate,
    requestDetail() {
      this.axios
        .get(`api/web/v1/messages/${this.id}`, {
          params: {
            lang_id: this.lang_id
          }
        })
        .then(res => {
          if (res.data.code != "1000") {
            messageTips(res.data.message, "error");
            return false;
          }
          var data = res.data.data;
          if (!data.id) {
            this.$router.replace("/Index");
          }
          this.items = Object.freeze(data);
        });
    }
  }
};
</script>

<style scoped>
.message-info{
  line-height: 30px;
}
.message-info img{
  width: auto;
}
.message {
  padding: 25px 0;
}
.message-content {
  margin-top: 25px;
  min-height: 400px;
  position: relative;
}
.message-content .title {
  font-size: 28px;
  height: 28px;
  color: #000;
  text-align: center;
}
.message-content .time {
  color: #aaa;
  text-align: center;
  margin-top: 40px;
  height: 16px;
}
.message-content .info {
  margin-top: 20px;
}
.message-content .info > div {
  float: left;
}
.message-content .info .head {
  width: 50px;
  height: 50px;
}
.message-content .info .head img {
  border-radius: 50%;
  border: 1px solid #efefef;
}
.message-content .info .message-info {
  color: #000;
}
</style>