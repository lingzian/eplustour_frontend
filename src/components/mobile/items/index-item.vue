<template>
    <router-link :to="{path:'/Detail',query:{id:itemData.journey_id}}" class="item">
      <div class="tripPicBox">
        <bg-image class="bg" :thumb="itemData.thumb[0]"></bg-image>
        <div class="orangeTips">
          <span v-if="itemData.integral_deduction !=0">{{$t('info.integralUseDeduction',{integral:itemData.integral_deduction})}}</span>
          <span v-if="itemData.integral !=0">{{$t('info.canGetIntegral',{integral:itemData.integral})}}</span>
        </div>
      </div>
        <div>
            <div class="title">{{itemData.district_name}}</div>
            <div class="describe">{{itemData.name}}</div>
            <div class="tripActiveItem cl">
              <!-- 小icon -->
              <div>
                <bg-image v-for="(item, i) in itemData.theme" :key="i" v-if="item.theme_thumb" class="tai_icon" :thumb="item.theme_thumb"></bg-image>
              </div>
              <div>
                <bg-image v-for="(item, i) in itemData.label" :key="i" v-if="item.label_thumb" class="tai_icon" :thumb="item.label_thumb"></bg-image>
              </div>
              <span class="tai_item" v-for="(lable, i) in itemData.lable" :key="i">{{lable.lable_name}}</span>
            </div>
            <div class="newPrice">
              <div v-if="this.$route.path != '/'">
                <div class="beforePrice">{{$t('user.price')}}: {{$t('moneys')}}<span>{{itemData.price || 0}}</span></div>
                <div class="vipPrice">{{$t('buy.vip')}}: {{$t('moneys')}}<span>{{itemData.vip_price || 0}}</span></div>
              </div>
            </div>
            <div class="rate">
                <rate-star
                :scopes="Number(itemData.score).toFixed(1)"
                :starCount="5"
                :color="`rgb(247, 212, 33)`"
                :bgColor="`rgb(247, 212, 33)`"
                ></rate-star>
            </div>
            <div class="tripDate">{{formatDate(itemData.start_sale_date)}} ~ {{formatDate(itemData.end_sale_date)}}</div>
        </div>
    </router-link>
</template>

<script>
import bgImage from "../../common/bgImage";
import rateStar from '../../common/star';
import {formatDate} from '../../../assets/js/utils.js'
export default {
  components: {
    bgImage,
    rateStar
  },
  props: ["itemData"],
  data() {
    return {
      value: parseInt(this.itemData.score)
    };
  },
  methods: {
    formatDate: formatDate,
  }
};
</script>

<style scoped>
.tripPicBox{
  position: relative;
}
.tripPicBox .bg{
  height: 100%;
}
.orangeTips{
  position: absolute;
  left: 0;
  top: 8%;
  display: flex;
  align-items:flex-start;
  box-align:flex-start;
  flex-flow: column;
}
.orangeTips span{
  padding: 0.15rem;
  color: white;
  margin-bottom: 0.1rem;
  border-radius: 0 10px 10px 0;
  font-size: 0.35rem;
  background-color: rgba(243, 78, 27, 0.8)
}
.small .orangeTips span{
  padding: 0.1rem 0.15rem;
  color: white;
  margin-bottom: 0.1rem;
  border-radius: 0 15px 15px 0;
  font-size: 0.25rem;
  background-color: rgba(243, 78, 27, 0.8)
}
.small .tripActiveItem{
  width: 100%;
  height: 0.5rem;
  line-height: 0.45rem;
  margin: 0.1rem 0;
}
.small .tai_icon{
  width: 0.45rem;
  height: 0.45rem;
  background-position: center bottom;
  background-size: cover;
  background-repeat: no-repeat;
  float: left;
  margin-right: 0.2rem;
}
.small .tai_item{
  padding: 0.02rem 0.15rem;
  background: #f55d2f;
  color: white;
  font-size: 0.25rem;
}
.small .newPrice{
  width: 100%;
  font-size: 0.35rem;
}
.small .beforePrice{
  color: black;
  margin-bottom: 0.1rem;
}
.small .beforePrice span{
  font-size: 0.4rem;
}
.small .vipPrice{
  color: #f55d2f;
  margin-bottom: 0.1rem;
}
.small .vipPrice span{
  font-size: 0.42rem;
}
.small .tripDate{
 font-size: 0.25rem;
 height: 0.3rem;
 line-height: 0.3rem;
 color: #aaa;
}

.tripActiveItem{
  width: 100%;
  height: 0.5rem;
  line-height: 0.45rem;
  margin: 0.15rem 0;
}
.tai_icon{
  width: 0.5rem;
  height: 0.5rem;
  background-position: center bottom;
  background-size: cover;
  background-repeat: no-repeat;
  float: left;
  margin-right: 0.2rem;
}
.tai_item{
  padding: 0.06rem 0.15rem;
  background: #f55d2f;
  color: white;
  font-size: 0.28rem;
  vertical-align: -0.02rem;
}
.newPrice{
  width: 100%;
  font-size: 0.38rem;
  margin-top: 0.1rem;
}
.beforePrice{
  color: black;
  margin-bottom: 0.1rem;
}
.beforePrice span{
  font-size: 0.42rem;
}
.vipPrice{
  color: #f55d2f;
  margin-bottom: 0.15rem;
}
.vipPrice span{
  font-size: 0.44rem;
}
.tripDate{
  height: 0.3rem;
  margin-bottom: 0.1rem;
  color: #aaa;
  font-size: 0.28rem;
}
.item {
  display: block;
  color: #444;
}
.item > div:first-of-type {
  height: 6rem;
  border-radius: 8px;
  background-color: #fff;
  border: 1px solid #ddd;
}
.item .title {
  color: #54b5ff;
  padding: 0.2rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.32rem;
}
.item .describe {
  font-weight: bold;
  font-size: 0.373333rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  line-height: 0.42rem;
  height: 0.82rem;
}
.item .price {
  font-size: 0.32rem;
  padding: 0.133333rem 0;
  color: #aaa;
}
.item .price span {
  font-size: 0.4rem;
}
.item .rate {
  height: 0.45rem;
}
.item.small .title {
  padding: 0.08rem 0;
  font-size: 0.28rem;
}
.item.small > div:first-of-type {
  height: 2.866667rem;
}
.item.small .describe {
  font-size: 0.32rem;
  height: 0.86rem;
}
.item.small .price,
.item.small .price span {
  font-size: 0.346667rem;
}
</style>
