<template>
  <div>
    <div class="mb-padding-content">
      <div class="title">{{$t('head.recommend')}}</div>
      <ul class="recommend-item cl">
        <li v-for="(item,index) in searchRecommend.items" :key="index"><router-link :to="{path:'/Search',query:{'querySearch':item.name}}">{{item.name}}</router-link></li>
      </ul>
    </div>
  </div>
</template>

<script>
import { messageTips } from '../../assets/js/utils'
export default {
  data(){
    return {
      searchRecommend: new Object()
    }
  },
  created(){
    this.getRecommends();
  },
  mounted(){
    this.$nextTick(() => {
      document.querySelector('#mb-head input').focus();
    })
  },
  methods:{
    //推薦熱標籤
    getRecommends(){
      this.axios.get('/api/web/v1/recommends',{
        params : {
          lang_id: this.lang_id
        }
      }).then(res => {
        if(res.data.code != '1000'){
            messageTips(res.data.message);
            return false;
        }
        if(res.data.code == "1000"){
            this.$set(this.searchRecommend,'items',Object.freeze(res.data.data.items));
        }
      });
    },
  }
}
</script>

<style scoped>
.title{
  padding: .3rem .4rem;
  border-bottom: .018rem solid #ccc;
  font-size: .4rem;
  color: #000;
}
.recommend-item{
  padding: .2rem .4rem;
}
.recommend-item li{
  float: left;
  margin-right: .346667rem;
  margin-bottom: .266667rem;
  background-color:#DDF0F5;
  padding: .2rem .4rem;
  border-radius: .266667rem;
}
.recommend-item li a{
  display: block;
  color: #000;
  font-size: .32rem;
  word-break: break-all;
}
</style>