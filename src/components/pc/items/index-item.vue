<template>
    <router-link :to="{path:'/Detail',query:{id:itemData.journey_id}}" class="item cl">
        <bg-image class="bg" :thumb="itemData.thumb[0]"></bg-image>
        <div>
            <div class="title">{{itemData.district_name}}</div>
            <div class="rate">
                <el-rate
                    v-model="value"
                    disabled
                    text-color="#979797">
                </el-rate>
            </div>
            <div class="describe">{{itemData.name}}</div>
            <div class="price">
                <span>{{$t('item.promotionalPrice')}} : </span>
                <span>${{itemData.sale_price}}</span>
            </div>
            <div class="time">{{itemData.total_day}} {{$t('item.day')}}</div>
            <div class="date cl">
                <span>{{$t('item.departureDate')}}：{{formatDate(itemData.start_sale_date)}} ~ {{formatDate(itemData.end_sale_date)}}</span>
                <span>{{$t('item.more')}}</span>
            </div>
        </div>
    </router-link>
</template>

<script>
import { formatDate } from "../../../assets/js/utils"
import bgImage from '../../common/bgImage';
export default {
    components: {
        bgImage
    },
   props:['itemData'],
   data(){
       return {
           value : parseInt(this.itemData.score),
       }
   },
   methods : {
       formatDate : formatDate
   }
};
</script>

<style scoped>
.item {
  border: 1px solid #d2d2d2;
  padding: 14px;
  height: 400px;
  display: block;
  transition: all .15s;
  color: #222;
}
.item:hover{
    box-shadow: 0px 0px 15px 0px #ccc;
}
.item > div {
  float: left;
  height: 100%;
}
.item > div:first-of-type {
  width: 42%;
  margin-right: 1.5%;
  border: 1px solid #ddd;
  background-color: #fff;
}
.item > div:last-of-type {
  width: 55.5%;
}
.item .title {
  padding-top: 12px;
  font-size: 22px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item .rate {
  margin: 13px 0 10px 0;
}
.item .describe {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  font-size: 18px;
  line-height: 28px;
  height: 84px;
}
.item .price{
    margin-top: 30px;
}
.item .price span:last-of-type{
    color: #ff362b;
    font-size: 40px;
    font-weight: 700;
}
.item .price span:first-of-type{
    font-size: 20px;
    padding-left: 5px;
}
.item .time{
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    text-align: center;
    width: 60%;
    font-size: 28px;
    padding: 20px 0;
    margin-top: 20px;
}
.item .date{
    margin-top: 20px;
}
.item .date span:first-of-type{
    float: left;
    color: #979797;
    font-size: 18px;
}
.item .date span:last-of-type{
    font-size: 25px;
    float: right;
    color: #68acfb;
    padding-right: 25px;
    background-image: url(../../../assets/images/more.png);
    background-repeat: no-repeat;
    background-position: right center;
    background-size: 20px;
    cursor: pointer;
}
</style>