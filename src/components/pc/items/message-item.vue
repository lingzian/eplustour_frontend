<template>
  <div class="item cl">
      <div class="info">
          <div class="title cl">
              <div :class="{'isUnread' : itemData.status == '1'}">{{itemData.title}}</div>
              <div>{{formatDate(itemData.send_time,false,true)}}</div>
          </div>
          <div class="content" v-text="filterHtml(itemData.content)"></div>
      </div>
      <div class="btn">
          <router-link :to="{path:'/MessageDetail',query:{id:itemData.id}}">
          <i class="el-icon-view"></i>
          </router-link>
          <i class="el-icon-close" @click="$emit('delMessage',itemData.id)"></i>
      </div>
  </div>
</template>

<script>
import { formatDate,filterHtml } from '../../../assets/js/utils'
export default {
  props : ['itemData'],
  methods :{
      formatDate : formatDate,
      filterHtml : filterHtml,
  },
}
</script>

                        
<style scoped>
.item{
    height: 50px;
}
.item>div{
    height: 100%;
    float: left;
}
.item .info{
    width: 935px;
    margin-left: 15px;
    padding-top: 4px;
}
.item .info .title>div{
    float: left;
}
.item .info .title>div:first-of-type{
    font-weight: bold;
    color: #000;
    font-size: 17px;
}
.item .info .title>div:last-of-type{
    margin-left: 30px;
    line-height: 17px;
    color: #aaa;
}
.item .info .title>div.isUnread{
    position: relative;
}
.item .info .title>div.isUnread:after{
    content: "";
    position: absolute;
    background-color: #f00;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    left: 0;
    top: 0;
    transform: translate(-100%,-50%);
}
.item .info .content{
    margin-top: 12px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    padding-right: 25px;
}
.item .btn{
    width: 200px;
    line-height: 50px;
}
.item .btn i{
    cursor: pointer;
    margin-right: 20px;
    font-size: 20px;
}
.item .btn i:hover{
    color: #2d9aff;
}
</style>