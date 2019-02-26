<template>
    <div class="evaluate">
      <div class="mb-padding-content">
        <div class="content">
          <div class="title">{{items.journey_name}}</div>
          <div class="time">{{$t('detail.departureTime')}} : {{formatDate(items.departure_date,false)}}~{{formatDate(items.return_date,false)}}</div>
          <div class="time">{{$t('info.numberPeople')}} : {{$t('buy.adult')}}*{{items.adult}} {{$t('buy.child')}}*{{items.child}} {{$t('buy.baby')}}*{{items.baby}}</div>
        </div>
        <div class="rate content cl">
          <span>{{$t('info.rateTips')}}</span>
          <span>
            <el-rate v-model="rate"></el-rate>
          </span>
        </div>
        <div class="suggestion content">
          <textarea v-model="suggestion" :placeholder="$t('info.suggestion')"></textarea>
        </div>
        <div class="btn" @click="submitEvaluations">{{$t('info.submit')}}</div>
      </div>
    </div>
</template>

<script>
import { formatDate,messageTips } from '../../assets/js/utils'
export default {
    data(){
        return {
            id : this.$route.query.id,
            items : new Object(),
            rate : 0,
            suggestion : '',
        }
    },
    created(){
      this.requestInfo();
    },
    methods: {
        formatDate : formatDate,
        //提交評分
        submitEvaluations(){
            if(this.rate == 0){
                messageTips(this.$t('info.chooseRate'));
                return false;
            }
            this.axios.post(`api/web/v1/evaluations?lang_id=${this.lang_id}`,{
                order_id : this.id,
                score : this.rate,
                suggest : this.suggestion
            }).then(res => {
                if(res.data.code != '1000'){
                    messageTips(res.data.message);
                    return false;
                }
                messageTips(this.$t('info.evaluateSuccess'));
                setTimeout(() => {
                    this.$router.replace({path:'/Trip',query:{status:4}})
                },1000)
            });
        },
        //请求信息
        requestInfo(){
            this.axios.get(`api/web/v1/orders/${this.id}`,{
                params : {
                    lang_id : this.lang_id
                }
            }).then(res => {
                if(res.data.code != '1000'){
                    messageTips(res.data.message);
                    return false;
                }
                this.items = Object.freeze(res.data.data);
            })
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
  padding: .266667rem;
  margin-bottom: .4rem;
}
.btn{
  color: #fff;
  background-color: #2d9aff;
  width: 80%;
  margin: 0 auto;
  text-align: center;
  padding: .266667rem;
  font-size: .4rem;
  border-radius: .666667rem;
}
.suggestion{
  height: 4rem;
}
.suggestion textarea{
  width: 100%;
  height: 100%;
  display: block;
  outline: 0;
  border: 0;
  resize: none;
  font-size: .38rem;
}
.title{
  color: #000;
  font-size: .4rem;
  line-height: .44rem;
  margin-bottom: .2rem;
}
.time{
  font-size: .36rem;
  color: #aaa;
  line-height: .8rem;
}
.rate{
  font-size: .36rem;
}
.rate>span:first-of-type{
  float: left;
  padding-top: .133333rem;
  padding-bottom: .133333rem;
  color: #aaa;
}
.rate>span:last-of-type{
  float: right;
}
</style>
