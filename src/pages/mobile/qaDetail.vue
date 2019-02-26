<template>
  <div>
      <div class="mb-padding-content">
          <div class="title">{{result.question}}</div>
          <div class="answer" v-html="result.answer"></div>
      </div>
  </div>
</template>

<script>
import { messageTips } from '../../assets/js/utils'
export default {
  data(){
      return {
          result : new Object()
      }
  },
  created(){
      this.requestDetail();
  },
  methods:{
      requestDetail(){
            this.axios.get(`api/web/v1/questions/${this.$route.query.id}`,{
                params : {
                    lang_id : this.lang_id
                }
            }).then(res => {
                if(res.data.code != '1000'){
                    messageTips(res.data.message);
                    return false;
                }
                this.result = Object.freeze(res.data.data);
            });
      }
  }
}
</script>

<style scoped>
.mb-padding-content {
  padding-bottom: 0;
  padding-left: .333333rem;
  padding-right: .333333rem;
}
.title{
    padding: .6rem 0;
    color: #000;
    font-weight: bold;
    font-size: .4rem;
}
.answer{
    line-height: .4rem;
}
</style>