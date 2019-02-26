<template>
    <li class="item cl">
        <bg-image class="bg" :thumb="itemData.thumb"></bg-image>
        <div>
          <div class="ticket_name">{{itemData.ticket_name}} ({{itemData.ticket_type_name}})</div>
          <div class="ticket_description">{{itemData.ticket_description}}</div>
          <div class="ticket_price">
              <span>￥{{itemData.price}}</span>
              <span>{{$t('info.number')}}:{{itemData.quantity}}</span>
          </div>
        </div>
    </li>
</template>

<script>
import bgImage from "../../common/bgImage";
export default {
  components: {
    bgImage
  },
  props: ["itemData"]
};
</script>

<style scoped>
.item > div:first-of-type {
  float: left;
  width: 2.4rem;
  height: 2.4rem;
  border: 0.026667rem solid #ccc;
  border-radius: 0.133333rem;
}
.item > div:last-of-type {
  float: left;
  width: 7rem;
  padding-left: 0.24rem;
}
.item .ticket_name {
  line-height: 0.373333rem;
  font-weight: bold;
}
.item .ticket_price {
  padding: 0.3rem 0 0.12rem 0;
  display: flex;
  justify-content: space-between;
}
.item .ticket_price > span:first-of-type {
  color: #f00;
}
.item .ticket_description {
  margin-top: 0.1rem;
  line-height: 0.373333rem;
  color: #888;
}
</style>