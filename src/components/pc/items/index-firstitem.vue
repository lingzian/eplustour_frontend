<template>
    <div class="itemBox" :id="'first'+(index+1)">

        <!-- 标题 -->
        <div class="itemTop" :style="`border-bottom: 4px solid ${color[index%4]};`">
            <!-- <bg-image class="describeText_icon" :thumb="itemData.theme_thumb"></bg-image> -->
            <div class="boxTitle" :style="`color:${color[index%4]};`">{{itemData.name}}</div>
            <bg-image v-if="index != 0" class="trip_icon" :thumb="require(`../../../assets/images/trip${index%4}.png`)"></bg-image>
        </div>

        <!-- 更多 -->
        <div class="somethElse cl" >
          <div>
            <span class="label_name" v-for="(element, indexs) in itemData.labels" :key="indexs" :class="{orange: index%4==0,yellow:index%4==1,purple:index%4==2,blue:index%4==3}">
              <router-link :to="{path:'/Search',query:{querySearch:element.label_name}}">{{element.label_name}}</router-link>
            </span>
          </div>

          <div>
            <span class="label_name" v-for="(element, indexs) in itemData.themes" :key="indexs" :class="{orange: index%4==0,yellow:index%4==1,purple:index%4==2,blue:index%4==3}">
                <router-link :to="{path:'/Search',query:{querySearch:element.theme_name}}">{{element.theme_name}}</router-link>
            </span>
          </div>



          <router-link :to="{path:'/Search', query:{querySearch:itemData.name}}">
            <div class="enterMore cl"><span class="aaa">></span><span>{{$t('info.more')}}</span></div>
          </router-link>
        </div>

        <!-- 旅游item -->
        <div class="tripWrap cl" :class="{cursor: itemData.is_ad == 1 && itemData.ad_position == 0}" :style="controlBg(itemData.is_ad, itemData.ad_position, itemData.advertising)" @click="bgJump(itemData.is_ad, itemData.ad_position,itemData.advertising)">
            <div class="tripItemBox" :class="{floatLeft:itemData.ad_position == 2 && itemData.is_ad == 1, floatRight:itemData.ad_position == 1 || itemData.ad_position == 0 && itemData.is_ad == 1}">
              <div class="tripItem" v-for="(ele, idx) in itemData.journeys" :key="idx" v-if="idx<6" :class="{padding:index%4 == 0, noFirst:index%4 == 0, marginbottom:index%4 !=0}">
                <div @click.stop="whereJump('', '', ele.journey_id)">
                  <div class="tripHeader">
                      <bg-image class="item_trip_pic" :thumb="`${ele.thumb[0]}`"></bg-image>
                      <div class="tipsBox" v-if="ele.integral_deduction || ele.integral">
                          <span class="tripTips" v-if="ele.integral_deduction && ele.integral_deduction!=0">{{$t('info.integralUseDeduction',{integral:ele.integral_deduction})}}</span>
                          <span class="tripTips" v-if="ele.integral && ele.integral!=0">{{$t('info.canGetIntegral',{integral:ele.integral})}}</span>
                      </div>
                  </div>
                  <div class="tripFoot" :class="{padding:index%4 != 0}">
                    <div class="tripIntroduction">{{ele.name}}</div>
                      <div class="trip_star">
                          <rate-Star
                          :scopes="Number(ele.score).toFixed(1)"
                          :color="`rgb(247, 212, 33)`"
                          :bgColor="`rgb(247, 212, 33)`"
                          :template="`${Number(ele.score).toFixed(1)}${$t('detail.score')}`"
                          ></rate-Star>
                      </div>

                      <div class="tripDescribe cl">
                        <!-- 小icon -->
                          <div v-for="(item, i) in ele.theme" :key="i" v-if="item.theme_thumb" :title="item.theme_name">
                            <bg-image  class="describeIcon" :thumb="item.theme_thumb"></bg-image>
                          </div>
                          <div>
                            <div v-for="(item, i) in ele.label" :key="i" v-if="item.label_thumb" :title="item.label_name">
                              <bg-image  class="describeIcon" :thumb="item.label_thumb"></bg-image>
                            </div>
                          </div>

                          <span class="describeLabel" v-for="(item, i) in ele.lable" :key="i">{{lable.lable_name}}</span>
                      </div>
                      <!-- 价钱暂时去掉 -->
                      <!-- <div class="commomPrice">{{$t('user.price')}}：<span>{{$t('money')}}{{ele.price || 0}}/{{$t('info.people')}}</span></div>
                      <div class="memberPrice">{{$t('buy.vip')}}：<span>{{$t('money')}}{{ele.vip_price || 0}}/{{$t('info.people')}}</span></div> -->
                      <div :class="{lets_go:index%4!=0,lets_gos:index%4==0}">{{$t('item.departureDate')}}：{{formatDate(ele.start_sale_date)}}~{{formatDate(ele.end_sale_date)}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="advertising" v-if="(itemData.is_ad == 1 && itemData.ad_position !=0 && (itemData.advertising && itemData.advertising.length!=0)) && (itemData.advertising && itemData.advertising.length !=0)" :class="{floatRight:itemData.ad_position == 2, floatLeft:itemData.ad_position == 1, marginstop: index%4==0, rightMargin:itemData.ad_position == 2}">
               <bg-image v-for="(ele,idx) in itemData.advertising" :key="idx" :thumb="ele.thumb" @click="whereJump(ele.type,ele.target)"></bg-image>
            </div>
        </div>

    </div>
</template>
<script>
import bgImage from "../../common/bgImage";
import rateStar from "../../common/star";
import { formatDate } from "../../../assets/js/utils";
export default {
  components: {
    bgImage,
    rateStar
  },
  props: ["itemData", "index"],
  data() {
    return {
      journey : [],
      color: ["#df502c", "#fcc74c", "#c0afce", "#3fc0c5"],
      ractColor:['#ffcc01','#ffcc01','#ffcc01'],
    };
  },
  methods: {
    formatDate: formatDate,
    controlBg (isBackground, advDerection, backgroundStyle) {//控制广告背景
      if(backgroundStyle && backgroundStyle.length!=0){
        backgroundStyle = backgroundStyle[0].thumb;
      }
      if(isBackground == 1){
        if(advDerection == 0){
          if(backgroundStyle){
            return 'background:white url('+backgroundStyle+') no-repeat;'
          }
          else{
            return 'background:white no-repeat;'
          }
        }
        else{
          return 'background:white;'
        }
      }
      else{
        return 'background:white;'
      }
    },
    bgJump(is_ad, is_position, type_target) {
      if(type_target && type_target.length !=0){
        var type = type_target[0].type;
        var target = type_target[0].target
      }
      if(is_ad == 1 && is_position == 0){
        this.whereJump(type, target);
      }
      else{
        return false;
      }
    },
    whereJump(type, target, detail_id) {//点击广告跳去哪里
      if(detail_id){
          this.$router.push({
            path: "Detail",
            query:{
              id: detail_id
            }
          })
        }
      if (type == 0) {
        return false;
      }
      if (type == 1) {
        if (target) {
          this.$router.push({ path: "Detail", query: { id: target } });
        } else {
          return false;
        }
      }
      if (type == 2) {
        if (target) {
          window.location.href = target;
        } else {
          return false;
        }
      }
    },
    searchItem(val) {
      this.$router.push({
        path: "/Search",
        query:{
          theme: val
        }
      })
    }
  }
};
</script>
<style scoped>
.cursor{
  cursor: pointer;
}
.marginstop {
  margin-top: 20px;
}
.floatRight {
  float: right;
}
.rightMargin {
  margin-right: 15px;
}
.floatLeft {
  float: left;
}
.advertising {
  width: 260px;
  height: 100%;
}
.advertising div {
  width: 260px;
  height: 336px;
  margin-bottom: 20px;
  cursor: pointer;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center top;
}
.advertising div:last-child{
  margin-bottom: 0;
}
.label_name {
  margin-right: 10px;
  font-size: 16px;
  line-height: 24px;
  float: left;
  height: 24px;
  margin-top: 13px;
  padding: 0 10px;
  cursor: pointer;
}
.describeText_icon {
  width: 20px;
  height: 20px;
  float: left;
  margin-right: 5px;
  background-position: top center;
  background-size: cover;
  background-repeat: no-repeat;
}
.somethElse {
  width: 100%;
  height: 50px;
  background: white;
  padding: 0 15px;
}
.tripDescribe {
  width: 100%;
  height: 30px;
}
.describeIcon {
  float: left;
  margin-top: 5px;
  margin-right: 5px;
  width: 20px;
  height: 20px;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
}
.describeLabel {
  padding: 2px 5px;
  color: white;
  background: #ff5501;
  font-size: 12px;
  line-height: 30px;
}
.padding {
  padding: 10px;
}
.paddings {
  padding: 0 10px;
}
.itemBox {
  width: 100%;
}
.itemBox:last-child{
  padding-bottom: 50px;
}
.itemTop {
  width: 100%;
  height: 38px;
  padding: 0 20px;
}
.boxTitle {
  font-size: 22px;
  float: left;
}
.enterMore {
  height: 50px;
  text-align: right;
  font-size: 16px;
  line-height: 50px;
  width: 85px;
  float: right;
  cursor: pointer;
}
.enterMore span {
  display: inline-block;
  height: 50px;
  font-size: 16px;
  float: right;
}
.enterMore .aaa {
  font-size: 25px;
  line-height: 50px;
}
.trip_icon {
  width: 150px;
  height: 35px;
  float: right;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center bottom;
}
.boxTitle {
  font-size: 20px;
}
.tripItemBox {
  width: 910px;
  height: 100%;
}
.tripWrap {
  width: 100%;
  min-height: 648px;
  padding: 0 0px 15px 15px;
  background: white;
  background-size: cover !important;
  background-repeat: no-repeat !important;
}
.tripItem {
  width: 284px;
  margin: 0px 15px 0px 4px;
  background: white;
  float: left;
  box-shadow: 0px 0px 7px 0px #9c9999;
}
.tripItem>div{
  cursor: pointer;
}
.tripItem:nth-of-type(3n){
  margin-right: 0;
}
.noFirst {
  margin-top: 20px;
}

.tripHeader {
  width: 100%;
  height: 180px;
  position: relative;
  overflow: hidden;
}
.item_trip_pic {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}

.tipsBox {
  width: auto;
  height: auto;
  position: absolute;
  top: 2%;
  display: flex;
  align-items: flex-start;
  box-align: flex-start;
  flex-flow: column;
}
.tripTips {
  padding: 0 10px 0 5px;
  border-radius: 0 20px 20px 0;
  background-color: #ff5501;
  height: 25px;
  line-height: 25px;
  margin-top: 5px;
  font-size: 14px;
  color: white;
}
.tripIntroductions {
  width: 100%;
  height: 70px;
  color: white;
  font-size: 13px;
  position: absolute;
  bottom: 0;
  padding: 10px 5px;
  line-height: initial;
  opacity: 0;
  transition: all 0.6s ease;
  background-color: rgba(10, 10, 10, 0.5);
}
.tripItem:hover .tripIntroductions {
  opacity: 1;
}
.tIs{
  width: 100%;
  height: 100%;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.trip_star {
  width: 100%;
  height: 30px;
  line-height: 30px;
}
.tripIntroduction {
  width: 100%;
  height: 40px;
  color: black;
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: initial;
  margin: 3px 0;
}
.rate-star i {
  font-size: 15px;
}
.commomPrice {
  width: 100%;
  height: 25px;
  font-size: 15px;
  color: black;
  line-height: 25px;
}
.commomPrice span {
  font-weight: bold;
  font-size: 15px;
}
.memberPrice {
  width: 100%;
  height: 25px;
  font-size: 15px;
  color: black;
  line-height: 25px;
}
.memberPrice span {
  font-weight: bold;
  font-size: 17px;
  color: #ff5501;
}
.lets_go {
  line-height: 30px;
  font-size: 13px;
  color: #999;
}
.lets_gos {
  line-height: 30px;
  font-size: 13px;
  color: #999;
}
.marginbottom{
  margin-bottom: 20px;
}
.marginbottom:nth-of-type(4){
  margin-bottom: 0px;
}
.marginbottom:nth-of-type(5){
  margin-bottom: 0px;
}
.marginbottom:nth-of-type(6){
  margin-bottom: 0px;
}
.orange:hover a{
  background: #ff5501;
  color: white;
}
.orange:hover {
  background: #ff5501;
  color: white;
}
.yellow:hover a{
  background: rgb(252, 199, 76);
  color: white;
}
.yellow:hover {
  background: rgb(252, 199, 76);
  color: white;
}
.purple:hover a{
  background: rgb(192, 175, 206);
  color: white;
}
.purple:hover {
  background: rgb(192, 175, 206);
  color: white;
}
.blue:hover a{
  background: rgb(63, 192, 197);
  color: white;
}
.blue:hover {
  background: rgb(63, 192, 197);
  color: white;
}
</style>

