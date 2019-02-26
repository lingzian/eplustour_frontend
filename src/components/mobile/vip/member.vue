<template>
    <transition name="fade">
    <div class="vip" @click="$emit('cancelBox','member')">
        <div>
            <div class="content" @click.stop>
                <img class="icon" src="../../../assets/images/membervip.png" alt="">
                <div class="name">{{$t('user.memberVip')}}</div>
                <div v-if="expire != '' && expire && vip == '1'" class="expire">{{$t('user.vipExpire')}} : {{formatDate(expire,false)}}</div>
                <div class="title">{{$t('user.vip.title')}}</div>
                <ul class="list">
                    <li v-for="(item,index) in vipDescription.description" :key="index">{{item}}</li>
                </ul>
                <div class="sure" @click="submit">{{vipBtnText('member',vip)}}</div>
            </div>
            <div class="btn"><i class="el-icon-circle-close-outline"></i></div>
        </div>
    </div>
    </transition>
</template>

<script>
import { messageTips, formatDate, vipBtnText } from "../../../assets/js/utils";
import { payment } from '../../../assets/js/api';
export default {
  props: ["vip", "expire", "vipDescription"],
  data() {
    return {
      isRequest: false
    };
  },
  methods: {
    formatDate: formatDate,
    vipBtnText: vipBtnText,
    submit() {
      if (this.isRequest) return false;
      this.isRequest = true;
      this.axios
        .post(`api/web/v1/users/vip?lang_id=${this.lang_id}`, {
          level: "1"
        })
        .then(res => {
          if (res.data.code != "1000") {
            messageTips(res.data.code);
            this.isRequest = false;
            return false;
          } else {
            let id = res.data.data.id;
            payment(id,'member','webMobile');
          }
        });
    },
  }
};
</script>

<style scoped>
@import "../../../assets/css/vip.css";
.list li::before {
  background-color: #2d9aff;
}
.name {
  color: #2d9aff;
}
.sure {
  background-color: #2d9aff;
}
</style>
