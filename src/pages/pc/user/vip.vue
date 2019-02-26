<template>
    <div class="vip_content_box">
        <div class="vip-content cl" v-if="vipDescription.newBaseVip">

            <div class="member">
                <div class="head">
                    <img src="../../../assets/images/vip-head.png" alt="">
                    <div></div>
                </div>
                <div class="content">
                    <div>
                        <img src="../../../assets/images/membervip.png" alt="">
                    </div>
                    <div class="vipName">{{$t('user.memberVip')}}</div>
                    <div v-if="items.vip_expire_time" class="expire">{{$t('user.vipExpire')}} ：{{items.vip == '1' && formatDate(items.vip_expire_time,false) ? formatDate(items.vip_expire_time,false) : '----'}}</div>
                    <div class="viptitle">{{$t('user.vip.title')}}</div>
                    <ul class="list">
                        <li v-for="(item,index) in vipDescription.newBaseVip.description" :key="index">{{item}}</li>
                    </ul>
                    <div class="sure" :class="{'gray':items.vip == '2'}" @click="submit('member')">{{vipBtnText('member',items.vip)}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
  messageTips,
  formatDate,
  vipBtnText,
} from "../../../assets/js/utils";
import { payment } from '../../../assets/js/api';
export default {
  props: ["userData"],
  data() {
    return {
      items: new Object(),
      vipDescription: new Object()
    };
  },
  created() {
    this.getVipPrice();
  },
  methods: {
    vipBtnText: vipBtnText,
    formatDate: formatDate,
    //獲取評分價格
    getVipPrice() {
      this.axios
        .get("api/web/v1/users/vip-price", {
          params: {
            lang_id: this.lang_id
          }
        })
        .then(res => {
          if (res.data.code != "1000") {
            messageTips(res.data.code, "error");
            return false;
          }
          this.vipDescription = Object.freeze(res.data.data);
        });
    },
    //提交支付
    submit(type) {
      var vip = this.vip;
      if (type == "member" && vip == "2") return false;
      this.axios
        .post(`api/web/v1/users/vip?lang_id=${this.lang_id}`, {
          level: type == "member" ? "1" : "2"
        })
        .then(res => {
          if (res.data.code != "1000") {
            messageTips(res.data.code, "error");
            return false;
          }
          let id = res.data.data.id;
          payment(id,'member','pc');
        });
    },
    //獲取用戶信息
    getUserData(data) {
      this.items = data;
    },
  }
};
</script>

<style scoped>
.vip_content_box {
  min-height: 600px;
}
.vip-content {
  padding-bottom: 60px;
}
.vip-content > div {
  /* float: left; */
  width: 48%;
  border-radius: 10px;
  text-align: center;
  padding-bottom: 60px;
  margin: 0 auto;
}
.member {
  margin-right: 4%;
  background-color: #d5ebff;
  color: #0078ff;
}
.vip {
  background-color: #fdf4d3;
  color: #ffb400;
}
.vip-content .head {
  width: 100px;
  height: 35px;
  margin: 0 auto;
  position: relative;
}
.vip-content .head div {
  position: absolute;
  width: 100%;
  height: 70%;
  background-color: #fff;
  top: 100%;
  transform: translate(0, -50%);
  border-radius: 50%;
}
.vip-content .head img {
  width: 22px;
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}
.member .head,
.member .head div {
  background-color: #0078ff;
}
.vip .head,
.vip .head div {
  background-color: #ffb400;
}
.content img {
  width: 75px;
  margin-top: 50px;
}
.vipName {
  margin-top: 40px;
  font-size: 26px;
  font-weight: bold;
}
.viptitle {
  margin-top: 20px;
  font-size: 20px;
}
.list {
  width: 64%;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 10px;
  text-align: left;
  color: #000;
  padding: 10px 30px;
  margin-top: 30px;
}
.list li {
  position: relative;
  margin: 24px 0;
  line-height: 24px;
}
.list li:before {
  content: "";
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-180%, -50%);
}
.member .list {
  border: 1px solid #0078ff;
}
.member .sure,
.member .list li:before {
  background-color: #0078ff;
}
.vip .list {
  border: 1px solid #ffb400;
}
.vip .sure,
.vip .list li:before {
  background-color: #ffb400;
}
.sure {
  margin-top: 30px;
  color: #fff;
  display: inline-block;
  padding: 10px 50px;
  border-radius: 40px;
  cursor: pointer;
}
.sure.gray {
  background-color: #ccc;
  cursor: default;
}
.expire {
  font-size: 18px;
  margin-top: 20px;
}
</style>
