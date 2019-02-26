<template>
    <div>
        <div class="mb-padding-content">
            <!-- 头部 -->
            <div class="head bg cl">
                <!-- 用户信息 -->
                <div class="user-info" @click="$router.push({path:'/Profile'})">
                    <!-- 名字积分 -->
                    <div class="name">
                    <span v-if="token">{{items.name || items.username}}</span>
                    <span v-else>{{$t('sign.login') + '/' +$t('sign.register')}}</span>
                    <!-- 會員勛章 -->
                    <template v-if="token">
                      <img v-if="items.vip == '0' && lang_id != 3" src="../../assets/images/vip1.png" alt="" class="vip">
                      <img v-else-if="items.vip == '0' && lang_id == 3" src="../../assets/images/vip1-e.png" alt="" class="vip">
                      <img v-else-if="items.vip != '0' && lang_id != 3" src="../../assets/images/vip2.png" alt="" class="vip">
                      <img v-else-if="items.vip != '0' && lang_id == 3" src="../../assets/images/vip2-e.png" alt="" class="vip">
                    </template>
                    <!-- <img v-else-if="items.vip == '2'" src="../../assets/images/vip3.png" alt="" class="vip"> -->
                    </div>
                    <!-- <div v-if="token" class="score">{{$t('user.integral')}}：{{items.score || 0}}</div> -->
                </div>
                <!-- 头像 -->
                <div v-if="token" class="user-head" @click="$router.push({path:'/Profile'})">
                    <head-image v-if="items.thumb != undefined" class="bg" :thumb="items.thumb"></head-image>
                </div>
            </div>
            <!-- 內容 -->
            <div class="content">
                <!-- vip升級 -->
                <div v-if="token" class="vip cl">
                    <div class="member">
                        <img src="../../assets/images/membervip.png" alt="">
                        <div class="vip-name cl">
                          <span>{{$t('user.memberVip')}}</span>
                          <span
                            class="expire"
                            v-if="items.vip_expire_time != '' && items.vip_expire_time && items.vip == '1'">
                            {{$t('user.vipExpire')}}:{{formatDate(items.vip_expire_time,false)}}</span>
                        </div>
                        <div v-if="items.vip" class="btn" :class="{'gray':items.vip == '2'}" @click="openBox('member')">{{vipBtnText('member',items.vip,true)}}</div>
                    </div>
                    <!-- <div class="super">
                        <img src="../../assets/images/supervip.png" alt="">
                        <div class="vip-name">
                        <div>{{$t('user.superVip')}}</div>
                        <div class="expire" v-if="items.vip_expire_time != '' && items.vip_expire_time && items.vip == '2'">{{$t('user.vipExpire')}}:{{formatDate(items.vip_expire_time,false)}}</div>
                        </div>
                        <div v-if="items.vip" class="btn" @click="openBox('supers')">{{vipBtnText('super',items.vip,true)}}</div>
                    </div> -->
                </div>
                <div class="order-title">{{$t('head.trip')}}</div>
                <ul class="order-nav cl">
                    <li @click="$router.push({path:'/Trip'})">
                    <div><img src="../../assets/images/13_07_g.png" alt=""></div>
                    <div>{{$t('head.tripStatus.all')}}</div>
                    </li>
                    <li @click="$router.push({path:'/Trip',query:{status:'1'}})">
                    <div><img src="../../assets/images/13_08_g.png" alt=""></div>
                    <div>{{$t('head.tripStatus.pending')}}</div>
                    </li>
                    <li @click="$router.push({path:'/Trip',query:{status:'2'}})">
                    <div><img src="../../assets/images/13_09_g.png" alt=""></div>
                    <div>{{$t('head.tripStatus.paid')}}</div>
                    </li>
                    <li @click="$router.push({path:'/Trip',query:{status:'4'}})">
                    <div><img src="../../assets/images/13_10_g.png" alt=""></div>
                    <div>{{$t('head.tripStatus.completed')}}</div>
                    </li>
                </ul>
                <ul class="user-menu">
                    <li class="profile" @click="$router.push({path:'/Profile'})">{{$t('head.menu.profile')}}</li>
                    <li class="message" @click="$router.push({path:'/Message'})">
                    {{$t('head.menu.message')}}
                    <div v-if="token && items.unread_message && items.unread_message !='0'" class="point">
                      <span v-if="parseInt(items.unread_message) <= 99">{{items.unread_message}}</span>
                      <span v-if="parseInt(items.unread_message)>99">99+</span>
                    </div>
                    </li>
                    <li class="collection" @click="$router.push({path:'/Collection'})">{{$t('head.menu.collection')}}</li>
                    <li class="rebate" @click="$router.push({path:'/PointsRebate'})">{{$t('head.menu.rebate')}}</li>
                    <li class="strategy" @click="clickStrategy">{{$t('head.menu.strategy')}}</li>
                    <li class="qa" @click="$router.push({path:'/Qa'})">{{$t('head.menu.qa')}}</li>
                    <li class="aboutUs" @click="$router.push({path:'/AboutUs'})">{{$t('head.menu.aboutUs')}}</li>
                    <li class="language" @click="$router.push({path:'/Language'})">{{$t('head.menu.language')}}</li>
                </ul>
            </div>
        </div>
        <!-- 普通會員 -->
        <vip-member v-if="member" :vip="items.vip" :vipDescription="vipDescription.newBaseVip" :expire="items.vip_expire_time" @cancelBox="cancelBox"></vip-member>
        <!-- 超級會員 -->
        <!-- <vip-super v-if="supers" :vip="items.vip" :vipDescription="vipDescription" :expire="items.vip_expire_time" @cancelBox="cancelBox"></vip-super> -->
    </div>
</template>

<script>
import {
  cookie,
  messageTips,
  formatDate,
  vipBtnText,
} from "../../assets/js/utils";
import vipMember from "../../components/mobile/vip/member";
// import vipSuper from "../../components/mobile/vip/super";
import headImage from "../../components/common/headImage";
export default {
  components: {
    vipMember,
    // vipSuper,
    headImage
  },
  data() {
    return {
      items: new Object(),
      token: cookie.get("token"),
      member: false,
      // supers: false,
      token: cookie.get("token"),
      vipDescription: new Object()
    };
  },
  created() {
    if(this.token){
      let userinfo = cookie.get('userinfo');
      if(userinfo) this.items = JSON.parse(userinfo);
    }
    this.token && this.getUserInfo();
    this.token && this.getVipPrice();
  },
  methods: {
    vipBtnText: vipBtnText,
    formatDate: formatDate,
    //点击团队积分
    clickStrategy() {
      if (!this.token)
        this.$router.push({
          path: "/Sign",
          query: { redirect: this.$route.fullPath }
        });
      var vip = this.items.vip;
      if (vip == "0") {
        messageTips(this.$t("user.strategyTips"));
      } else {
        this.$router.push({ path: "/Strategy" });
      }
    },
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
    //請求用戶信息
    getUserInfo() {
      this.axios
        .get(`api/web/v1/users/profile?lang_id=${this.lang_id}`)
        .then(res => {
          if (res.data.code == "1000") {
            this.items = Object.freeze(res.data.data);
            cookie.set('userinfo',JSON.stringify(this.items),0.1);
            // 如果會員積分快過期了，就彈窗
            var vip = this.items.vip;
            if (vip == "0") return false;
            var expire_time = parseInt(this.items.vip_expire_time) * 1000;
            var this_time = new Date().getTime();
            var showVipWindow = sessionStorage.getItem("showVipWindow") == "true";
            if (
              expire_time - this_time <= 1000 * 60 * 60 * 24 * 60 &&
              !showVipWindow
            ) {
              if (vip == "1") this.openBox("member");
              if (vip == "2") this.openBox("supers");
              sessionStorage.setItem("showVipWindow", true);
            }
          } else {
            messageTips(res.data.message);
          }
        });
    },
    //打開會員彈窗
    openBox(type) {
      if (!this.token) {
        this.$router.push({
          path: "/Sign",
          query: { redirect: this.$route.fullPath }
        });
        return false;
      }
      var vip = this.items.vip;
      if (type == "member" && vip == "2") {
        return false;
      }
      this[type] = true;
    },
    //关闭会员升级弹窗
    cancelBox(type) {
      this[type] = false;
    },
  }
};
</script>

<style scoped>
.point {
  position: absolute;
  min-width: 0.36rem;
  height: 0.36rem;
  line-height: 0.36rem;
  text-align: center;
  background-color: #f00;
  padding: 0 0.1rem;
  color: #fff;
  font-size: 0.3rem;
  border-radius: 50px 50px 50px 50px;
  top: 0.08rem;
  right: -0.2rem;
}
.mb-padding-content {
  padding-top: 0;
}
.head {
  height: 3.133333rem;
  background-image: url(../../assets/images/mb-user-bg.png);
  padding: 0.426667rem 0.933333rem;
}
.head .user-info {
  float: left;
}
.head .user-info .name {
  font-size: 0.633333rem;
  height: 2.1rem;
  line-height: 2.1rem;
  color: #fff;
}
.head .user-info .name span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  vertical-align: middle;
  max-width: 5rem;
}
.head .user-info .score {
  color: #ffdc1c;
  font-size: 0.46rem;
  background-image: url(../../assets/images/13_11.png);
  background-repeat: no-repeat;
  background-position: left .1rem;
  background-size: 0.28rem;
  padding-left: 0.44rem;
  max-width: 6rem;
}
.head .user-info .vip {
  width: 0.7rem;
  margin-left: 0.2rem;
}
.head .user-head {
  float: right;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
  overflow: hidden;
  margin-top: 0.4rem;
}
.head .user-head > div {
  height: 100%;
  border-radius: 50%;
  border: 0.066667rem solid #fff;
}
.content {
  padding: 0 0.466667rem;
}
.vip {
  padding: 0.293333rem 0;
}
.vip > div {
  float: left;
  /* width: 49%; */
  width: 100%;
  height: 1.2rem;
  line-height: 1.1rem;
  /* border: 0.026667rem solid #ddd; */
  border-bottom: 0.026667rem solid #ddd;
  /* border-radius: 0.533333rem; */
  padding: 0 0.1rem;
  font-weight: bold;
  position: relative;
}
.vip > div.member {
  /* margin-right: 2%; */
  color: #2d9aff;
}
.vip > div.super {
  color: #f3c61c;
}
.vip > div > img {
  width: 0.7rem;
}
.vip .vip-name {
  position: absolute;
  top: 50%;
  left: 0.9rem;
  transform: translate(0, -50%);
  line-height: normal;
  width: 70%;
  display: flex;
  align-items: center;
}
.vip .vip-name .expire {
  padding-left: .3rem;
  color: #aaa;
}
.vip .btn {
  position: absolute;
  top: 50%;
  right: 0.08rem;
  transform: translate(0, -50%);
  color: #fff;
  height: 0.56rem;
  line-height: 0.56rem;
  text-align: center;
  border-radius: 0.533333rem;
  padding: 0 0.24rem;
  font-size: 0.28rem;
}
.vip > div.member .btn {
  background-color: #2d9aff;
}
.vip > div.super .btn {
  background-color: #f3c61c;
}
.vip > div.super .btn.gray {
  background-color: #ccc;
}
.order-title {
  font-size: 0.346667rem;
  background-image: url(../../assets/images/mb-user-order.png);
  background-repeat: no-repeat;
  background-size: 0.45rem;
  background-position: left center;
  padding-left: 0.6rem;
  padding-top: 0.266667rem;
  padding-bottom: 0.266667rem;
  color: #888;
}
.order-nav li {
  float: left;
  width: 25%;
  text-align: center;
  font-size: 0.346667rem;
  color: #888;
}
.order-nav li > div:first-of-type {
  height: 0.8rem;
  line-height: 0.8rem;
  margin: 0 auto;
}
.order-nav li > div:first-of-type img {
  width: 0.5rem;
}
.order-nav li:first-of-type > div:first-of-type img {
  width: 0.38rem;
}
.order-nav li > div:last-of-type {
  margin-top: 0.08rem;
}
.user-menu {
  margin-top: 0.4rem;
}
.user-menu li:first-of-type {
  border-top: 0.026667rem solid #ddd;
}
.user-menu li {
  font-size: 0.373333rem;
  padding: 0.3rem 0;
  border-bottom: 0.026667rem solid #ddd;
  background-repeat: no-repeat;
  background-position: right center;
  background-size: 0.5rem;
}
.user-menu li:last-of-type {
  border-bottom: 0;
}
.user-menu li.profile {
  background-image: url(../../assets/images/mb-user1.png);
}
.user-menu li.message {
  background-image: url(../../assets/images/mb-user2.png);
  position: relative;
}
/* .user-menu li.message .point {
  font-size: 0.293333rem;
  color: #ffffff;
  background-color: #f00;
  border-radius: 50%;
  position: absolute;
  right: -0.14rem;
  top: 0.08rem;
  width: 0.38rem;
  height: 0.38rem;
  text-align: center;
  line-height: 0.38rem;
} */
.user-menu li.collection {
  background-image: url(../../assets/images/mb-user3.png);
}
.user-menu li.rebate {
  background-image: url(../../assets/images/mb-user4.png);
}
.user-menu li.strategy {
  background-image: url(../../assets/images/mb-user5.png);
}
.user-menu li.qa {
  background-image: url(../../assets/images/mb-user6.png);
}
.user-menu li.aboutUs {
  background-image: url(../../assets/images/mb-user7.png);
}
.user-menu li.language {
  background-image: url(../../assets/images/mb-user8.png);
}
</style>
