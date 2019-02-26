<template>
    <router-link :to="{path:'/QaDetail',query:{id:itemData.question_id}}" class="item">
        <img class="qa-icon" src="../../../assets/images/qa.png" alt="">
        <div class="title">{{itemData.question}}</div>
        <div class="content" v-html="filterHtml(itemData.answer)"></div>
    </router-link>
</template>

<script>
import { filterHtml } from "../../../assets/js/utils"
export default {
  props : ['itemData'],
  methods : {
      filterHtml : filterHtml
  }
}
</script>

<style scoped>
.item{
    margin: 0 auto;
    width: 93.2%;
    height: 150px;
    background-color: #2d9aff;
    position: relative;
    padding: 0 90px;
    display: block;
}
.item .qa-icon{
    width: 90px;
    border: 10px solid #fff;
    border-radius: 50%;
    position: absolute;
    top: 50%;
}
.item.left .qa-icon{
    left: 0;
    transform: translate(-50%,-50%);
}
.item.right .qa-icon{
    right: 0;
    transform: translate(50%,-50%);
}
.item>div{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
.item>div.title{
    font-size: 28px;
    color: #fff;
    padding-top: 30px;
    height: 65px;
}
.item>div.content{
    font-size: 22px;
    color: #000;
    margin-top: 30px;
    height: 26px;
}
</style>