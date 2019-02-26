<template>
    <div class="item cl">
        <div>
            <div class="mark">{{itemData.remark}}</div>
            <div class="time">{{formatDate(itemData.date)}}</div>
        </div>
        <div>
            <img v-if="parseInt(itemData.integral)>=0" src="../../../assets/images/points.png" alt="">
            <img v-else src="../../../assets/images/points-g.png" alt="">
            <span v-if="parseInt(itemData.integral)>=0" class="add">+ {{itemData.integral}}</span>
            <span v-else class="reduce">- {{itemData.integral}}</span>
        </div>
    </div>
</template>

<script>
import { formatDate } from "../../../assets/js/utils";
export default {
  props: ["itemData"],
  methods: {
    formatDate: formatDate
  }
};
</script>

<style scoped>
.item {
  height: 120px;
  border-bottom: 1px solid #ddd;
  padding: 25px 0;
}
.item > div {
  float: left;
  height: 100%;
}
.item > div:first-of-type {
  width: 1100px;
  padding-right: 80px;
}
.item > div:last-of-type {
  width: 100px;
  line-height: 70px;
  text-align: center;
}
.item > div:last-of-type img {
  width: 20px;
  margin-top: -6px;
}
.item .mark {
  font-size: 18px;
  padding-top: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item .time {
  font-size: 14px;
  color: #aaa;
  padding-top: 20px;
}
.item .add {
  color: #2d9aff;
}
.item .reduce {
  color: #f00;
}
</style>