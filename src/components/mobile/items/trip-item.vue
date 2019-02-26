<template>
  <router-link :to="{path:'/OrderDetail',query:{id:itemData.order_id}}" class="item">
      <div class="title cl">
          <div>{{itemData.district_name}}</div>
          <div 
            :class="{
                'pending':itemData.order_status == '1',
                'paid':itemData.order_status == '2',
                'cancel':itemData.order_status == '3' || itemData.order_status == '0',
                'completed':itemData.order_status == '4'}">{{formatStatus(itemData.order_status,itemData.is_evaluation)}}</div>
      </div>
      <div>
          <div class="item-title">{{itemData.journey_name}}</div>
          <div class="item-time">{{formatDate(itemData.departure_date)}} ~ {{formatDate(itemData.return_date)}}</div>
          <div class="item-info cl">
              <div>{{$t('head.orderNumber')}} : {{itemData.number}}</div>
              <div>￥{{itemData.total_price}}</div>
          </div>
      </div>
  </router-link>
</template>

<script>
import { formatDate,formatStatus } from "../../../assets/js/utils";
export default {
  props : ['itemData'],
  methods : {
      formatDate : formatDate,
      formatStatus : formatStatus
  }
}
</script>

<style scoped>
.item{
    display: block;
    padding: 0 .3rem .16rem .3rem;
    background-color: #fff;
}
.item .title{
    height: .933333rem;
    line-height: .933333rem;
    border-bottom: .026667rem solid #ddd;
}
.item .title>div:first-of-type{
    float: left;
    color: #666;
    font-size: .346667rem;
    width: 7.2rem;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
.item .title>div:last-of-type{
    float: right;
    font-size: .32rem;
}
.item .title>div:last-of-type.pending{
    color: #f54304;
}
.item .title>div:last-of-type.paid{
    color: #2d9aff;
}
.item .title>div:last-of-type.cancel{
    color: #222;
}
.item .title>div:last-of-type.completed{
    color: #008743;
}
.item .item-title{
    color: #000;
    font-size: .373333rem;
    padding: .333333rem 0;
    line-height: .48rem;
}
.item .item-time{
    margin-top: .08rem;
}
.item .item-info{
    height: .933333rem;
    line-height: .933333rem;
}
.item .item-info>div:first-of-type{
    float: left;
    color: #aaa;
    font-size: .306667rem;
}
.item .item-info>div:last-of-type{
    float: right;
    color: #222;
    font-size: .36rem;
    font-weight: bold;
}
</style>