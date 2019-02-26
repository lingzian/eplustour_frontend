<template>
    <div class="mb-padding-content">
      <div class="content">
        <div class="title">{{items.title}}</div>
        <div class="time">{{formatDate(items.send_time,false,true)}}</div>
        <div class="info" v-html="items.content"></div>
      </div>
    </div>
</template>

<script>
import { formatDate,messageTips } from '../../assets/js/utils'
export default {
  data(){
    return {
      items : new Object(),
      id : this.$route.query.id,
    }
  },
  created(){
    this.requestDetail();
  },
  methods : {
    formatDate: formatDate,
    requestDetail(){
      this.axios.get(`api/web/v1/messages/${this.id}`,{
        params : {
          lang_id : this.lang_id,
        }
      }).then(res => {
          if(res.data.code != '1000'){
              messageTips(res.data.message);
              return false;
          }
          var data = res.data.data;
          if(!data.id){
            this.$router.replace('/Index');
          }
          this.items = Object.freeze(data);
      })
    },
  }
}
</script>

<style scoped>
.mb-padding-content{
  padding-bottom: 0;
}
.content{
  text-align: center;
  padding: .266667rem;
}
.content .title{
  font-size: .373333rem;
  color: #000;
}
.content .time{
  margin: .533333rem 0;
  color: #aaa;
}
.content .info{
  text-align: left;
  font-size: .346667rem;
  color: #000;
}
</style>
