<template>
  <router-link :to="{path:'/OrderDetail',query:{id:itemData.order_id}}" class="item">
      <div class="title">{{itemData.district_name}}</div>
      <div class="describe">{{itemData.journey_name}}</div>
      <div class="time">{{formatDate(itemData.departure_date)}} ~ {{formatDate(itemData.return_date)}}</div>
      <div class="number">{{$t('head.orderNumber')}} : {{itemData.number}}</div>
      <div class="price"> <span class="orderPrice">{{$t('money')}}</span>{{itemData.total_price}}</div>
      <div class="status"
        :class="{
          'pending':itemData.order_status == '1',
          'paid':itemData.order_status == '2',
          'cancel':itemData.order_status == '3' || itemData.order_status == '0',
          'completed':itemData.order_status == '4'}">{{formatStatus(itemData.order_status,itemData.is_evaluation)}}</div>
  </router-link>
</template>

<script>
import { formatDate, formatStatus } from "../../../assets/js/utils";
export default {
  props: ["itemData"],
  methods: {
    formatDate: formatDate,
    formatStatus: formatStatus
  }
};
</script>

<style scoped>
.orderPrice{
  font-size: 28px;
}
.item {
  display: block;
  width: 280px;
  height: 300px;
  background-color: #2d9aff;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  padding: 16px;
}
.item .title {
  color: #fff;
  height: 40px;
  line-height: 20px;
  padding-right: 70px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-all;
}
.item .describe {
  color: #000;
  font-size: 18px;
  height: 60px;
  line-height: 20px;
  margin-top: 22px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.item .time {
  color: #fff;
  margin-top: 20px;
}
.item .number {
  color: #fff;
  margin-top: 12px;
}
.item .price {
  color: #fff;
  text-align: right;
  font-size: 38px;
  margin-top: 20px;
}
.status {
  position: absolute;
  width: 164px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  top: 28px;
  right: -30px;
  background-color: #fff;
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(38deg);
  -ms-transform: rotate(38deg);
  -o-transform: rotate(38deg);
  transform: rotate(38deg);
  font-size: 12px;
}
.status.pending {
  color: #f54304;
}
.status.paid {
  color: #2d9aff;
}
.status.cancel {
  color: #222;
}
.status.completed {
  color: #008743;
}
</style>
