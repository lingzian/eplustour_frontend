<template>
    <div class="item">
        <div class="box cl">
            <div class="boxLeft">
              <bg-image class="bg" :thumb="itemData.thumb[0]"></bg-image>
              <div class="tipsBox" v-if="itemData.integral_deduction || itemData.integral">
                  <span class="tripTips" v-if="itemData.integral_deduction !=0 && itemData.integral_deduction">{{$t('info.integralUseDeduction',{integral:itemData.integral_deduction})}}</span>
                  <span class="tripTips" v-if="itemData.integral !=0 && itemData.integral ">{{$t('info.canGetIntegral',{integral:itemData.integral})}}</span>
              </div>
            </div>
            <div>
                <div class="describe">{{itemData.name}}</div>
                 <div class="tripDescribe cl">
                   <!-- 小icon -->
                    <div v-for="(item, i) in itemData.theme" :key="i" v-if="item.theme_thumb" :title="item.theme_name">
                      <bg-image  class="describeIcon" :thumb="item.theme_thumb"></bg-image>
                    </div>

                    <div>
                      <div v-for="(item, i) in itemData.label" :key="i" v-if="item.label_thumb" :title="item.label_name">
                        <bg-image  class="describeIcon" :thumb="item.label_thumb"></bg-image>
                      </div>
                    </div>

                    <span class="describeLabel" v-for="(lable, lableIdx) in itemData.lable" :key="lableIdx">{{lable.lable_name}}</span>
                </div>
                <div class="rate">
                    <rate-star
                    :scopes="Number(value).toFixed(1)"
                    :color="`rgb(247, 212, 33)`"
                    :bgColor="`rgb(247, 212, 33)`"
                    ></rate-star>
                </div>
                <div class="lets_go" v-if="itemData.start_sale_date">{{$t('item.departureDate')}}：{{formatDate(itemData.start_sale_date)}}~{{formatDate(itemData.end_sale_date)}}</div>
                <div class="btn cl">
                    <div>
                        <div @click="jumpRouter(itemData.is_expire, itemData.journey_id)">{{$t('item.viewMore')}}</div>
                    </div>
                    <div @click="del(itemData.favourite_id)">{{$t('user.delete')}}</div>
                </div>
                <div class="invalid" v-if="itemData.is_expire == 1">{{$t('detail.invalidated')}}</div>
            </div>
        </div>
    </div>
</template>


<script>
import bgImage from "../../common/bgImage";
import rateStar from "../../common/star";
import { messageTips, formatDate } from '../../../assets/js/utils';
export default {
  components: {
    bgImage,
    rateStar
  },
  props: ["itemData"],
  data() {
    return {
      value: parseInt(this.itemData.score)
    };
  },
  methods: {
    formatDate: formatDate,
    del(id) {
      this.$emit("deleteCollection", id);
    },
    jumpRouter (isInvalid, id) {
      if(isInvalid == 1){
        messageTips(this.$t('detail.invalidated'), 'error');
      }
      else{
        this.$router.replace({
          path: '/Detail',
          query: {
            id: id,
          }
        })
      }
    }
  }
};
</script>


<style scoped>
.lets_go {
  height: 30px;
  line-height: 30px;
  font-size: 15px;
  color: #999;
}
.boxLeft .bg{
  height: 100%;
}
.item {
  border: 1px solid #2d9aff;
  padding: 13px;
  background-color: #fff;
}
.tipsBox {
  width: auto;
  height: auto;
  position: absolute;
  top: 2%;
  display: flex;
  align-items: flex-start;
  box-align: flex-start;
  flex-flow: column;
}
.tripTips {
  padding: 0 10px;
  height: 25px;
  line-height: 25px;
  border-radius: 0 20px 20px 0;
  background-color: #ff5501;
  margin-top: 5px;
  font-size: 12px;
  color: white;
}
.tripDescribe {
  width: 100%;
  height: 30px;
  margin-top: 20px;
}
.describeIcon {
  float: left;
  margin-top: 5px;
  margin-right: 5px;
  width: 20px;
  height: 20px;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
}
.describeLabel {
  padding: 2px 5px;
  color: white;
  background: #ff5501;
  font-size: 12px;
  line-height: 30px;
}
.item .title {
  color: #000;
  font-weight: bold;
  color: #3893fa;
  border-bottom: 1px dashed #3893fa;
  height: 50px;
  line-height: 50px;
  margin-bottom: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
}
.item .box > div {
  float: left;
}
.item .box > div:first-of-type {
  width: 285px;
  height: 200px;
  margin-right: 20px;
  border: 1px solid #ddd;
  position: relative;
}
.item .box > div:last-of-type {
  width: 867px;
}
.item .describe {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 16px;
  line-height: 24px;
  height: 46px;
}
.rate {
  height: 20px;
}
.item .rate {
  margin: 6px 0;
}
.item .price {
  margin-top: 15px;
}
.item .price span:last-of-type {
  color: #ff362b;
  font-size: 40px;
  font-weight: 700;
}
.item .price span:first-of-type {
  font-size: 20px;
  padding-left: 5px;
}
.item .btn {
  float: left;
  width: 60%;
}
.item .invalid{
  float: right;
  text-align: center;
  font-size: 14px;
  padding: 0 15px;
  height: 40px;
  background: #ddd;
  line-height: 40px;
  color: white;
  border-radius: 8px;
}
.item .btn > div {
  float: left;
  height: 40px;
  line-height: 40px;
  border: 1px solid #2d9aff;
  text-align: center;
  cursor: pointer;
  -webkit-transition: all 0.15s;
  -moz-transition: all 0.15s;
  -ms-transition: all 0.15s;
  -o-transition: all 0.15s;
  transition: all 0.15s;
  margin-left: 25px;
}
.item .btn > div:first-of-type {
  width: 200px;
  background-color: #2d9aff;
  margin-left: 0;
  color: white;
}
.item .btn > div:first-of-type a {
  display: block;
  color: #fff;
}
.item .btn > div:first-of-type:hover {
  background-color: #53a3ee;
}
.item .btn > div:last-of-type {
  width: 160px;
  color: #f00;
  border-color: #f00;
}
.item .btn > div:last-of-type:hover {
  color: #e50000;
  border-color: #e50000;
}
</style>
