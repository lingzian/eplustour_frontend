<template>
  <div>
    <div class="pc_user_content min-width">
      <!-- 用戶的頭部 -->
      <div class="headuser min-width">
          <!-- 背景 -->
          <img class="headuser-bg" src="../../../assets/images/user-headbg.png">
          <!-- 行程跳转 -->
          <div class="body-user-box">
            <ul class="body-user cl col-width">
              <div class="cl">
                <router-link :to="{path:'/Trip'}">
                  <li>
                      <p><img src="../../../assets/images/13_07.png"/></p>
                      <p>{{$t('head.tripStatus.alls')}}</p>
                  </li>
                </router-link>
                <router-link :to="{path:'/Trip',query:{status:'1'}}">
                  <li>
                      <p><img src="../../../assets/images/13_08.png"/></p>
                      <p>{{$t('head.tripStatus.pending')}}</p>
                  </li>
                </router-link>
              </div>
              <div class="cl">
                <router-link :to="{path:'/Trip',query:{status:'2'}}">
                  <li>
                      <p><img src="../../../assets/images/13_09.png"/></p>
                      <p>{{$t('head.tripStatus.paid')}}</p>
                  </li>
                </router-link>
                <router-link :to="{path:'/Trip',query:{status:'4'}}">
                  <li>
                      <p><img src="../../../assets/images/13_10.png"/></p>
                      <p>{{$t('head.tripStatus.completed')}}</p>
                  </li>
                </router-link>
              </div>
            </ul>
          </div>
          <!-- 头像用户信息 -->
          <div class="portrait" v-if="items.thumb != undefined">
            <div class="head">
              <head-image class="user-head bg" :thumb="items.thumb"></head-image>
            </div>
            <div class="name">
              <img v-if="items.vip == '0' && lang_id != 3" @click="$router.push('/User/Vip')" src="../../../assets/images/vip1.png" alt="" class="vip">
              <img v-else-if="items.vip == '0' && lang_id == 3" @click="$router.push('/User/Vip')" src="../../../assets/images/vip1-e.png" alt="" class="vip">
              <img v-else-if="items.vip != '0' && lang_id != 3" @click="$router.push('/User/Vip')" src="../../../assets/images/vip2.png" alt="" class="vip">
              <img v-else-if="items.vip != '0' && lang_id == 3" @click="$router.push('/User/Vip')" src="../../../assets/images/vip2-e.png" alt="" class="vip">
              <!-- <img v-else-if="items.vip == '2'" @click="$router.push('/User/Vip')" src="../../../assets/images/vip3.png" alt="" class="vip"> -->
              <span>{{items.name || items.username}}</span>
            </div>
            <!-- <div class="integral">{{$t('user.integral')}}<img class="icon" src="../../../assets/images/13_11.png"><span>{{items.score || 0}}</span></div> -->
          </div>
      </div>
      <!-- 用戶信息導航 -->
      <div class="body-Collection col-width">
        <ul class="cl">
          <router-link to="/User">
            <li :class="{'select':this.$route.path == '/User'}"><span>{{$t('user.profile')}}</span></li>
          </router-link>
          <router-link to="/User/PassportDetail">
            <li :class="{'select':this.$route.path == '/User/PassportDetail'}"><span>{{$t('user.travelerManagement')}}</span></li>
          </router-link>
          <router-link to="/User/Collection">
            <li :class="{'select':this.$route.path == '/User/Collection'}"><span>{{$t('user.collection')}}</span></li>
          </router-link>
          <router-link to="/User/PointsRebate">
            <li :class="{'select':this.$route.path == '/User/PointsRebate'}"><span>{{$t('user.pointsRebate')}}</span></li>
          </router-link>
          <li @click="toStrategy" class="strategy" :class="{'select':this.$route.path == '/User/Strategy'}"><span>{{$t('head.menu.strategy')}}</span></li>
          <router-link to="/User/Vip">
            <li :class="{'select':this.$route.path == '/User/Vip'}"><span>{{$t('user.vipName')}}</span></li>
          </router-link>
          <router-link to="/User/AboutUs">
            <li :class="{'select':this.$route.path == '/User/AboutUs'}"><span>{{$t('head.aboutUs')}}</span></li>
          </router-link>
        </ul>
      </div>
      <div class="user col-width">
        <router-view ref="pcUser"/>
      </div>
    </div>
  </div>
</template>

<script>
import headImage from '../../../components/common/headImage';
import { messageTips } from '../../../assets/js/utils';
export default {
  components: {
    headImage
  },
  data(){
    return {
      items : new Object(),
    }
  },
  methods : {
    getUserData(data){
      this.items = Object.freeze(data);
      //與子頁面通信
      let fn = this.$refs.pcUser.getUserData;
      if(typeof fn === 'function'){
        fn(data);
      }
    },
    //點擊團隊積分
    toStrategy(){
      if(!this.items.vip) return false;
      if(this.items.vip == '0'){
        messageTips(this.$t("user.strategyTips"),'error');
        this.$router.push({
          path : '/User/Vip'
        })
      }else{
        this.$router.push({
          path : '/User/Strategy',
        })
      }
    },
  }
};
</script>

<style scoped>
.headuser{
  position: relative;
}
.body-user-box{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.body-user{
  position: absolute;
  bottom: 20px;
  left: 50%;
  -webkit-transform: translate(-50%,0);
  -moz-transform: translate(-50%,0);
  -ms-transform: translate(-50%,0);
  -o-transform: translate(-50%,0);
  transform: translate(-50%,0);
}
.body-user>div{
  width: 410px;
}
.body-user>div:first-of-type{
  float: left;
}
.body-user>div:last-of-type{
  float: right;
}
.body-user li{
  width: 50%;
  float: left;
  text-align: center;
}
.body-user p:first-of-type{
  width: 40px;
  height: 40px;
  line-height: 40px;
  margin: 0 auto;
}
.body-user p:first-of-type img{
  width: 30px;
}
.body-user>div:first-of-type li:first-of-type>p:first-of-type img{
  width: 24px;
}
.body-user>div:first-of-type li:last-of-type>p:first-of-type img{
  width: 26px;
}
.body-user p:last-of-type{
  color: #fff;
  margin-top: 10px;
  font-size: 22px;
}
.portrait{
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%,50%);
  text-align: center;
}
.portrait .head{
  width: 118px;
  height: 118px;
  border-radius: 50%;
  background-color: #fff;
  overflow: hidden;
  margin: 0 auto;
}
.portrait .head .user-head{
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border:6px solid #fff;
}
.portrait .name{
  margin-top: 12px;
  color: #000;
  font-size: 20px;
}
.portrait .name img{
  width: 22px;
  cursor: pointer;
}
.portrait .integral{
  margin-top: 10px;
  color: #ffbb01;
}
.portrait .integral img{
  margin: -2px 8px 0 4px;
}
.portrait .integral span{
  color: #000;
}
.portrait .icon{
  width: 12px;
  margin-top: -3px;
  margin-right: 4px;
}
.body-Collection{
  text-align: center;
  margin-top: 150px;
}
.body-Collection ul{
  width: 100%;
  display: inline-block;
  vertical-align: middle;
}
.body-Collection ul li{
  float: left;
  color: #888;
  font-size: 17px;
  width: 14.28%;
}
.body-Collection ul li.strategy{
  cursor:pointer;
}
.body-Collection ul li span{
  padding-bottom: 6px;
  border-bottom: 2px solid transparent;
}
.body-Collection ul li.select span{
  border-color: #000;
  color: #000;
}
.body-Collection ul a:last-of-type li{
  margin-right: 0;
}
.user{
  padding:80px 0px 40px 0px;
  min-height: 800px;
}
.pc_user_content{
  background-color: #eff9ff;
  background-image: url(../../../assets/images/pc-user-bg.png);
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: contain;
}
</style>
