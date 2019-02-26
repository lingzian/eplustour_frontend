<template>
  <div>
    <div class="mb-padding-content">
      <div class="content">
        <div>
          <img v-if="type == '1'" src="../../assets/images/checkout-success.png" alt="">
          <img v-else src="../../assets/images/checkout-failure.png" alt="">
        </div>
        <div class="title">{{type == '1' ? $t('info.checkOutSuccessTitle') : $t('info.checkOutFailureTitle')}}</div>
        <div class="describe">{{type == '1' ? $t('info.checkOutSuccessContent') : $t('info.checkOutFailureContent')}}</div>
      </div>
      <div class="btn" @click="clickBtn">{{type == '1' ? $t('info.checkTheOrder') : $t('info.returnTheOrder')}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      type : this.$route.query.type, // 1成功 0失敗
      id : this.$route.query.id //訂單id
    }
  },
  created(){
      this.$emit('setHeaderData',{type:this.type});
  },
  methods: {
    clickBtn(){
      if(this.type == '1'){
        this.$router.replace({
          path : '/OrderDetail',
          query : {
            id : this.id
          }
        })
      }else{
        this.$router.go(-1);
      }
    },
  },
  mounted() {
    document.body.style.backgroundColor = "#f5f5f5";
  },
  destroyed(){
    document.body.style.backgroundColor = "#fff";
  },
}
</script>

<style scoped>
.mb-padding-content{
  padding-bottom: 0;
}
.content{
  background-color: #fff;
  margin: .266667rem 0 1.066667rem 0;
  text-align: center;
  padding: 1.066667rem 0;
}
.content img{
  width: 1.866667rem;
}
.content .title{
  color: #000;
  font-size: .4rem;
  margin-top: .4rem;
}
.content .describe{
  font-size: .373333rem;
  margin-top: .4rem;
  color: #aaa;
}
.btn{
  background-color: #2d9aff;
  color: #fff;
  width: 80%;
  padding: .266667rem;
  border-radius: .666667rem;
  text-align: center;
  margin: 0 auto;
  margin-top: 1.066667rem;
  font-size: .4rem;
}
</style>