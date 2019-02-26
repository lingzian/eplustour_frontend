<template>
    <div>
        <mt-cell-swipe
        title=""
        :right="cellRight">
            <div class="item content cl" @click="jumpRouter(itemData.journey_id, itemData.is_expire)">
                <div class="tripPicBox">
                    <bg-image class="bg" :thumb="itemData.thumb[0]"></bg-image>
                    <div class="orangeTips" v-if="itemData.integral_deduction || itemData.integral">
                      <span v-if="itemData.integral_deduction && itemData.integral_deduction !=0">{{$t('info.integralUseDeduction',{integral:itemData.integral_deduction})}}</span>
                      <span v-if="itemData.integral && itemData.integral !=0">{{$t('info.canGetIntegral',{integral:itemData.integral})}}</span>
                    </div>
                </div>
                <div>
                    <div class="title">{{itemData.district_name}}</div>
                    <div class="describe">{{itemData.name}}</div>
                    <div class="tripActiveItem cl">
                        <div>
                            <bg-image v-for="(item, i) in itemData.theme" :key="i" v-if="item.theme_thumb" class="tai_icon" :thumb="item.theme_thumb"></bg-image>
                        </div>
                        <div>
                            <bg-image v-for="(item, i) in itemData.label" :key="i" v-if="item.label_thumb" class="tai_icon" :thumb="item.label_thumb"></bg-image>
                        </div>
                        <span class="tai_item" v-for="(lable, i) in itemData.lable" :key="i">{{lable.lable_name}}</span>
                    </div>
                    <div class="rate">
                        <rate-star
                        :scopes="Number(value).toFixed(1)"
                        :starCount="5"
                        :color="`rgb(247, 212, 33)`"
                        :bgColor="`rgb(247, 212, 33)`"
                        ></rate-star>
                    </div>
                    <div class="bottom_rate_but cl">
                        <div class="tripDate" v-if="itemData.start_sale_date">{{formatDate(itemData.start_sale_date)}} ~ {{formatDate(itemData.end_sale_date)}}</div>

                        <div class="invalid_btn" v-if="itemData.is_expire == 1">{{$t('detail.invalidated')}}</div>
                    </div>

                </div>
            </div>
        </mt-cell-swipe>
    </div>

</template>

<script>
import Vue from 'vue'
import { CellSwipe } from 'mint-ui';
import bgImage from '../../common/bgImage';
import rateStar from '../../common/star';
import { messageTips, formatDate } from '../../../assets/js/utils';
Vue.component(CellSwipe.name, CellSwipe);
export default {
    components: {
        bgImage,
        rateStar
    },
    props : ['itemData'],
    data(){
        return {
            value : this.itemData.score,
            cellRight : [
                {
                    content: '<i class="el-icon-delete"><i>',
                    style: { background: '#2d9aff', color: '#fff', fontSize:'.6rem',lineHeight:"2.88rem",width:'2rem',textAlign: 'center' },
                    handler: this.delCollection
                }
            ]
        }
    },
    methods: {
        formatDate: formatDate,
        delCollection () {
            this.$emit('cancelCollection',this.itemData.id);
        },
        jumpRouter (id, invalid) {
            if(invalid == 1){
                messageTips(this.$t('detail.invalidated'), 'falie');
            }
            else{
                this.$router.push({
                    path: '/Detail',
                    query: {
                        id: id
                    }
                })
            }
        }
    }
}
</script>

<style scoped>
.tripDate{
  width: 70%;
  float: left;
  height: 0.3rem;
  margin-top: 0.2rem;
  color: #aaa;
  font-size: 0.28rem;
}
.tripPicBox{
  position: relative;
}
.tripPicBox .bg{
  height: 100%;
}
.orangeTips{
  position: absolute;
  left: 0;
  top: 8%;
  display: flex;
  align-items:flex-start;
  box-align:flex-start;
  flex-flow: column;
}
.orangeTips span{
  padding: 0 0.1rem;
  height: 0.5rem;
  line-height: 0.5rem;
  color: white;
  margin-bottom: 0.1rem;
  border-radius: 0 15px 15px 0;
  font-size: 0.2rem;
  background-color: rgba(243, 78, 27, 0.8)
}
.bottom_rate_but{
    width: 100%;
    height: .45rem;
}
.rate{
    width: 100%;
}
.invalid_btn{
    margin-top: 0.1rem;
    line-height: 0.45rem;
    padding: 0 0.15rem;
    float: right;
    background: #cccccc;
    text-align: center;
    border-radius: 8px;
    font-size: 0.25rem;
    color: white;
    height: 0.45rem;
    transform: scale(0.9);
}
.item{
    padding: .2rem 0;
    display: block;
    padding-left: .2rem;
}
.item>div{
    height: 3rem;
}
.item>div:first-of-type{
    float: left;
    width: 3.7rem;
}
.item>div:last-of-type{
    float: right;
    width: 5.5rem;
    padding-left: .2rem;
}
.item .title{
    color: #2d9aff;
    font-size: .4rem;
}
.item .describe{
    font-size: .34rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    line-height: .426667rem;
    height: .866667rem;
    margin: .18rem 0;
}
.item .price{
    color: #f00;
    font-size: .426667rem;
}
.rate{
  height: 0.4rem;
}
.item .rate{
    margin-top: .106667rem;
}
.tripActiveItem{
  width: 100%;
  height: 0.4rem;
  line-height: 0.45rem;
  margin: 0.1rem 0;
}
.tai_icon{
  width: 0.4rem;
  height: 0.4rem;
  background-position: center bottom;
  background-size: cover;
  background-repeat: no-repeat;
  float: left;
  margin-right: 0.2rem;
  margin-top: 0.05rem;
}
.tai_item{
  padding: 0.06rem 0.15rem;
  background: #f55d2f;
  color: white;
  font-size: 0.15rem;
  vertical-align: -0.02rem;
}
</style>
