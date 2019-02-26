<template>
    <div @click="$router.push({path:'/Detail',query:{id:itemData.journey_id}})" class="item">
        <div class="title">{{itemData.district_name}}</div>
        <div class="box cl">
            <bg-image class="bg" :thumb="itemData.thumb[0]"></bg-image>
            <div>
                <div class="describe">{{itemData.name}}</div>
                <!-- 小icon -->
                  <div class="tripDescribe cl">
                    <!-- 小icon -->
                      <div v-for="(item, i) in itemData.theme" :key="i" v-if="item.theme_thumb" :title="item.theme_name">
                        <bg-image  class="describeIcon" :thumb="item.theme_thumb"></bg-image>
                      </div>
                      <div>
                        <div v-for="(item, i) in itemData.label" :key="i" v-if="item.label_thumb" :title="item.label_name">
                          <bg-image  class="describeIcon" :thumb="item.label_thumb"></bg-image>
                        </div>
                      </div>
                  </div>
                <div class="trip_star">
                    <rate-star
                    :scopes="Number(itemData.score).toFixed(1)"
                    :starCount="5"
                    :color="`rgb(247, 212, 33)`"
                    :bgColor="`rgb(247, 212, 33)`"
                    :template="`${Number(itemData.score).toFixed(1)}${$t('detail.score')}`"
                    ></rate-star>
                </div>
                <div class="prices">
                  <div class="originalPrice">
                    <span>{{$t('user.price')}}:</span>
                    <span class="firstPrice"><span class="common_unit">{{$t('moneys')}}</span>{{itemData.price}}</span>
                  </div>
                  <div class="vipPricce">
                    <span>{{$t('buy.vip')}}:</span>
                    <span class="secondPrice"><span class="vip_unit">{{$t('moneys')}}</span>{{itemData.vip_price}}</span>
                  </div>
                </div>
                <div class="tripDate">
                  <div class="tripNow">{{$t('item.departureDate')}}：{{formatDate(itemData.start_sale_date)}} ~ {{formatDate(itemData.end_sale_date)}}</div>
                </div>
                <div class="more">
                    <span>{{$t('item.viewMore')}}</span>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import rateStar from '../../common/star';
import bgImage from "../../common/bgImage";
import { formatDate } from '../../../assets/js/utils.js'
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
    getThemes () {
      this.axios.get('api/web/v1/themes', {
        params: {
          lang_id: this.lang_id,
        }
      })
      .then(res => {
        console.log(res);
      })
    }
  }
};
</script>

<style scoped>
.tripDescribe {
  width: 100%;
  height: 30px;
}
.describeIcon {
  float: left;
  margin-top: 5px;
  margin-right: 5px;
  width: 22px;
  height: 22px;
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
.tripDate{
  width: 100%;
}
.tripNow{
  color: #cccccc;
  font-size: 14px;
  height: 20px;
  line-height: 25px;
}
.prices{
  width: 100%;
  /* margin-top: 33px; */
}
.originalPrice{
  height: 30px;
  width: 100%;
  margin: 10px 0 0px 0;
}
.originalPrice span:first-child{
  color: #000;
  font-size: 20px;
}
.originalPrice span:last-child {
  color: black;
  font-weight: bold;
  font-size: 22px;
}
.vipPricce{
  height: 40px;
  width: 100%;
  margin: 0px 0 20px 0;
}
.vipPricce span:first-child{
  color: #000;
  font-size: 20px;
}
.vipPricce span:last-child{
  font-weight: bold;
  color: #f8422a;
  font-size: 28px;
  height: 100%;
  display: inline-block;
}
.secondPrice{
  vertical-align: -2px;
}
.common_unit{
  color: #000;
  font-size: 18px !important;
}
.vip_unit{
  color: #f8422a;
  font-size: 22px !important;
}
.firstPrice{
  vertical-align: -1px;
}
.trip_star{
  width: 100%;
  height: 30px;
}
.item {
  border: 1px solid #ddd;
  padding: 0px 13px 18px 13px;
  cursor: pointer;
  transition: all .15s;
}
.item:hover{
  box-shadow: 0px 0px 20px 0px #3893fa;
  border-color: #2d9aff;
}
.item .title {
  color: #000;
  font-weight: bold;
  color: #3893fa;
  border-bottom: 1px dashed #ddd;
  height: 50px;
  line-height: 50px;
  margin-bottom: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
}
.item .box > div {
  float: left;
}
.item .box > div:first-of-type {
  width: 285px;
  height: 230px;
  margin-right: 20px;
  border: 1px solid #ddd;
}
.item .box > div:last-of-type {
  width: 867px;
  height: 200px;
  position: relative;
}
.item .describe {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 18px;
  line-height: 24px;
  height: 50px;
}
.item .rate {
  margin-top: 10px;
}
.item .price {
  position: absolute;
  left: 0;
  bottom: 8px;
}
.item .price span:last-of-type {
  color: #ff362b;
  font-size: 40px;
  font-weight: 700;
}
.item .price span:first-of-type {
  font-size: 20px;
  padding-left: 5px;
}
.item .btn {
  margin-top: 27px;
}
.item .btn > div {
  float: left;
  height: 40px;
  line-height: 40px;
  border: 1px solid #2d9aff;
  text-align: center;
  cursor: pointer;
  -webkit-transition: all 0.15s;
  -moz-transition: all 0.15s;
  -ms-transition: all 0.15s;
  -o-transition: all 0.15s;
  transition: all 0.15s;
}
.item .btn > div:first-of-type {
  width: 200px;
  color: #fff;
  background-color: #2d9aff;
}
.item .btn > div:first-of-type:hover {
  background-color: #53a3ee;
}
.item .more{
  position: absolute;
  bottom: 10px;
  right: 20px;
  opacity: 0;
  transition: all .15s;
}
.item:hover .more{
  opacity: 1;
}
.item .more span {
  font-size: 25px;
  padding-right: 24px;
  background-size: 18px;
  background-position: right center;
  background-repeat: no-repeat;
  background-image: url(../../../assets/images/tuu6.png);
}
</style>
