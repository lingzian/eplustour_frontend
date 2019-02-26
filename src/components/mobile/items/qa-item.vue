<template>
  <router-link :to="{path:'/QaDetail',query:{id:itemData.question_id}}" class="item cl">
      <div>
          <img src="../../../assets/images/mb-qa.png" alt="">
      </div>
      <div>
          <div class="title">{{itemData.question}}</div>
          <div class="content" v-html="filterHtml(itemData.answer)"></div>
      </div>
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
    width: 100%;
    display: block;
    height: 2.666667rem;
    background-color: #fff;
    padding: .4rem .666667rem;
}
.item>div{
    float: left;
    height: 100%;
}
.item>div:first-of-type{
    width: 10%;
}
.item>div:first-of-type img{
    width: .493333rem;
}
.item>div:last-of-type{
    width: 90%;
}
.item>div:last-of-type .title{
    color: #000;
    font-size: .373333rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    line-height: .453333rem;
    height: .906667rem;
}
.item>div:last-of-type .content{
    margin-top: 20px;
    font-size: .346667rem;
    color: #aaa;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
</style>