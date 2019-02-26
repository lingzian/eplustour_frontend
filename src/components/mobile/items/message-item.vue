<template>
    <div class="item" @click="$router.push({path:'/MessageDetail',query:{id:itemData.id}})">
        <div class="item_date">{{formatDate(itemData.send_time,false,true)}}</div>
        <mt-cell-swipe
        title=""
        :right="cellRight"
        class="mt-cell">
            <div class="item_content">
                <div class="title">{{itemData.title}}</div>
                <div class="info" v-html="itemData.content"></div>
                <div v-if="itemData.status == '1'" class="point"></div>
            </div>
        </mt-cell-swipe>
    </div>
</template>

<script>
import { formatDate } from "../../../assets/js/utils";
import Vue from "vue";
import { CellSwipe } from "mint-ui";
Vue.component(CellSwipe.name, CellSwipe);
export default {
  props: ["itemData"],
  data() {
    return {
      cellRight: [
        {
          content: '<i class="el-icon-delete"><i>',
          style: {
            background: "#2d9aff",
            color: "#fff",
            fontSize: ".6rem",
            lineHeight: "1.6rem",
            width: "2rem",
            textAlign: "center"
          },
          handler: this.delMessage
        }
      ]
    };
  },
  methods: {
    formatDate: formatDate,
    delMessage() {
      this.$emit("delMessage", this.itemData.id);
    }
  }
};
</script>


<style scoped>
.item {
  text-align: center;
  margin-bottom: 0.8rem;
}
.item:last-of-type {
  margin-bottom: 0.2rem;
}

.item .item_date {
  margin-bottom: 0.2rem;
  font-size: 0.32rem;
  color: #aaa;
}
.item .item_content {
  padding: 0.3rem 0.266667rem;
  background-color: #fff;
  border-radius: 0.133333rem;
  text-align: left;
  position: relative;
}
.item .item_content .title {
  color: #000;
  margin-bottom: 0.3rem;
}
.item .item_content .title {
  width: 8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.373333rem;
  height: 0.373333rem;
}
.item .item_content .info {
  width: 8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.373333rem;
  height: 0.41rem;
}
.item .point {
  position: absolute;
  width: 0.28rem;
  height: 0.28rem;
  background-color: #f00;
  border-radius: 50%;
  top: 0;
  left: -0.106667rem;
}
.mt-cell {
  border-radius: 0.133333rem;
}
</style>
