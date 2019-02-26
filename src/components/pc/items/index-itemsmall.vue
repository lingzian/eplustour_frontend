<template>
  <router-link :to="{path:'/Detail',query:{id:itemData.journey_id}}" class="item cl" :class="direction" @mouseover="rateColor = '#fff'" @mouseout="rateColor = '#979797'">
      <bg-image class="bg" :thumb="itemData.thumb[0]"></bg-image>
      <div>
            <div v-if="direction == 'transverse'" class="title">{{itemData.district_name}}</div>
            <div v-else class="title">{{itemData.name}}</div>
            <div class="rate">
                <el-rate
                    v-model="value"
                    disabled
                    :text-color="rateColor">
                </el-rate>
            </div>
            <div v-if="direction == 'transverse'" class="describe">{{itemData.name}}</div>
            <div class="price">
                <span>USD</span>
                <span>{{itemData.sale_price}}+</span>
            </div>
            <div class="more">
                <span>{{$t('item.viewMore')}}</span>
            </div>
      </div>
      <div v-if="direction == 'transverse'" class="hot">
          <img v-if="this.lang_id == 3" src="../../../assets/images/hot.png" alt="">
          <img v-else-if="this.lang_id == 2" src="../../../assets/images/hot1.png" alt="">
          <img v-else src="../../../assets/images/hot2.png" alt="">
      </div>
  </router-link>
</template>

<script>
import bgImage from '../../common/bgImage';
export default {
  components: {
    bgImage
  },
  props: ["direction", "itemData"],
  data() {
    return {
      value: parseInt(this.itemData.score),
      rateColor: "#979797"
    };
  }
};
</script>

<style scoped>
.item {
  display: block;
  -webkit-transition: all 0.15s;
  -moz-transition: all 0.15s;
  -ms-transition: all 0.15s;
  -o-transition: all 0.15s;
  transition: all 0.15s;
  overflow: hidden;
  padding: 12px;
  border-radius: 10px;
  color: #444;
}
.item > div:first-of-type {
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #fff;
}
.item .title {
  font-size: 20px;
  font-weight: bold;
}
.item .describe {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 16px;
  line-height: 24px;
  height: 46px;
}
.item .price {
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  text-align: center;
  padding: 10px 0;
  margin: 9px 0px;
}
.item .price span:first-of-type {
  font-size: 20px;
}
.item .price span:last-of-type {
  font-size: 28px;
  color: #2d9aff;
  font-weight: bold;
  padding-left: 10px;
}
.item .more {
  text-align: center;
}
.item .more span {
  font-size: 19px;
  padding-right: 20px;
  background-size: 15px;
  background-position: right 7px;
  background-repeat: no-repeat;
  background-image: url(../../../assets/images/tuu6.png);
}
.item .hot {
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0;
  filter: alpha(opacity=0);
  -webkit-transition: all 0.15s;
  -moz-transition: all 0.15s;
  -ms-transition: all 0.15s;
  -o-transition: all 0.15s;
  transition: all 0.15s;
}
.item .hot img {
  border-radius: 0 10px 0 0;
}
/*横向样式*/
.transverse.item .title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.transverse.item .rate {
  margin: 11px 0 8px 0;
}
.transverse.item > div:first-of-type {
  width: 42%;
}
.transverse.item > div:nth-of-type(2) {
  width: 58%;
  padding: 6px 20px;
}
.transverse.item {
  width: 570px;
  height: 230px;
  position: relative;
}
.transverse.item > div {
  float: left;
  height: 100%;
}
/*纵向样式*/
.vertical.item .rate {
  margin: 8px 0;
}
.vertical.item {
  width: 260px;
  height: 370px;
}
.vertical.item > div:first-of-type {
  height: 170px;
}
.vertical.item .title {
  margin-top: 6px;
  font-size: 18px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  height: 48px;
  line-height: 24px;
}
/*
    hover 样式
*/
.item:hover {
  color: #fff;
  background-color: #3893fa;
}
.item:hover .price span:last-of-type {
  color: #fff;
}
.item:hover .more span {
  background-image: url(../../../assets/images/tuu5.png);
}
.item:hover .hot {
  opacity: 1;
  filter: alpha(opacity=100);
}
</style>