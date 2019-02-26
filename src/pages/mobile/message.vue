<template>
    <div class="mb-padding-content">
      <ul>
        <li v-for="(item,index) in items" :key="index" class="cl" @click="$router.push({path:'/MessageList',query:{id:item.id,name:item.name}})">
          <div>
            <img :src="item.icon" alt="">
            <div v-if="item.unread_message && item.unread_message != '0'">
              <span v-if="parseInt(item.unread_message)<=99">{{item.unread_message}}</span>
              <span v-if="parseInt(item.unread_message)>99" class="addIcon">99+</span>
            </div>
          </div>
          <div>{{item.name}}</div>
        </li>
      </ul>
      <div v-if="items.length == 0" class="no-result center">{{$t('head.noMessage')}}</div>
    </div>
</template>

<script>
import { messageTips } from '../../assets/js/utils'
export default {
    data(){
      return {
        items : new Object(),
      }
    },
    created(){
      this.requestNav();
    },
    methods: {
      requestNav(){
        this.axios.get('api/web/v1/messages/type',{
          params : {
            lang_id : this.lang_id
          }
        }).then(res => {
          if(res.data.code != '1000'){
            messageTips(res.data.message);
            return false;
          }
          res.data.data.items.forEach(ele => {
            ele.icon = require(`../../assets/images/message-icon${ele.id}.png`);
          })
          this.items = res.data.data.items;
        });
      }
    },
    mounted() {
      document.body.style.backgroundColor = "#f5f5f5";
    },
    destroyed(){
      document.body.style.backgroundColor = "#fff";
    }
}
</script>

<style scoped>
.addIcon{
  font-size: 0.24rem;
  color: white;
}
.mb-padding-content{
  padding-bottom: 0;
}
.mb-padding-content ul{
  padding: 0 .266667rem;
  background-color:#fff;
}
.mb-padding-content ul li{
  padding: .24rem 0;
  border-bottom: .026667rem solid #efefef;
}
.mb-padding-content ul li:last-of-type{
  border-bottom: 0;
}
.mb-padding-content ul li>div{
  height: 1.2rem;
  line-height: 1.2rem;
}
.mb-padding-content ul li>div:first-of-type{
  float: left;
  width: 1.2rem;
  position: relative;
}
.mb-padding-content ul li>div:first-of-type div{
  position: absolute;
  border-radius: 50px 50px 50px 50px;
  background-color: #f00;
  color: #fff;
  min-width: .4rem;
  height: .4rem;
  line-height: .4rem;
  text-align: center;
  font-size: .24rem;
  top: 0;
  right: 0;
  padding: 0 0.1rem;
}
.mb-padding-content ul li>div:last-of-type{
  float: right;
  width: 7.733333rem;
}
.no-result{
  top: 45%;
}
</style>
