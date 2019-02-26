<template>
    <div class="content col-width">
        <!-- 麵包屑 -->
        <div class="amount-nav-search">
            <el-breadcrumb separator="//">
                <el-breadcrumb-item :to="{ path: '/' }">{{$t('footer.home')}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{$t('info.evaluate')}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="detail-content">
            <div class="title">{{items.journey_name}}</div>
            <div class="item">{{$t('item.departureDate')}} : {{formatDate(items.departure_date,false)}}</div>
            <div class="item">{{$t('info.numberPeople')}} : {{$t('buy.adult')}}*{{items.adult}}，{{$t('buy.child')}}*{{items.child}}，{{$t('buy.baby')}}*{{items.baby}}</div>
            <div class="rateTips">{{$t('info.rateTips')}}</div>
            <div class="evaluate rate">
                <el-rate v-model="rate"></el-rate>
            </div>
            <div class="suggestionTips">{{$t('info.suggestion')}}</div>
            <div class="suggestion">
                <el-input
                    type="textarea"
                    :rows="8"
                    :placeholder="$t('info.suggestion')"
                    v-model="suggestion"
                    :resize="'none'"
                    spellcheck="false">
                </el-input>
            </div>
            <div class="submit-btn" @click="submitEvaluations">{{$t('info.submit')}}</div>
        </div>
    </div>
</template>

<script>
import { formatDate, messageTips } from "../../assets/js/utils";
export default {
  data() {
    return {
      id: this.$route.query.id,
      items: new Object(),
      rate: 0,
      suggestion: ""
    };
  },
  created() {
    this.requestInfo(); //请求信息
  },
  methods: {
    formatDate: formatDate,
    //提交評分
    submitEvaluations() {
      if (this.rate == 0) {
        messageTips(this.$t("info.chooseRate"), "error");
        return false;
      }
      this.axios
        .post(`api/web/v1/evaluations?lang_id=${this.lang_id}`, {
          order_id: this.id,
          score: this.rate,
          suggest: this.suggestion
        })
        .then(res => {
          if (res.data.code != "1000") {
            messageTips(res.data.message, "error");
            return false;
          }
          messageTips(this.$t("info.evaluateSuccess"));
          setTimeout(() => {
            this.$router.replace({ path: "/Trip", query: { status: 4 } });
          }, 1000);
        });
    },
    //请求信息
    requestInfo() {
      this.axios
        .get(`api/web/v1/orders/${this.id}`, {
          params: {
            lang_id: this.lang_id
          }
        })
        .then(res => {
          if (res.data.code != "1000") {
            messageTips(res.data.message, "error");
            return false;
          }
          this.items = Object.freeze(res.data.data);
        });
    }
  }
};
</script>

<style scoped>
.content {
  padding: 25px 0;
}
.detail-content {
  margin-top: 30px;
  text-align: center;
}
.detail-content .title {
  color: #000;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 25px;
}
.detail-content .item {
  color: #888;
  margin-bottom: 10px;
}
.detail-content .suggestionTips,
.detail-content .rateTips {
  margin-top: 40px;
  color: #2d9aff;
}
.detail-content .rate {
  height: 40px;
  margin-top: 20px;
  margin-bottom: 40px;
}
.detail-content .suggestion {
  width: 680px;
  margin: 20px auto 80px auto;
}
.detail-content .submit-btn {
  color: #fff;
  background-color: #2d9aff;
  width: 200px;
  height: 55px;
  text-align: center;
  line-height: 55px;
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;
  margin: 0 auto;
  border-radius: 40px;
  transition: all 0.15s;
}
.detail-content .submit-btn:hover {
  background-color: #1d88ff;
}
</style>