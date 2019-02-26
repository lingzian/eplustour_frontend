<template>
    <div>
      <div class="mb-padding-content">
        <!-- 账户信息 -->
        <div class="order_info">
          <div class="order_info_title">
            <div>{{$t('order.accountInfo')}}</div>
            <div class="btns" @click="copy">{{$t('copy')}}</div>
          </div>
          <ul>
            <li class="cl">
              <div>{{$t('user.name')}}</div>
              <div :class="{'gray' : !items.name}">{{items.name || $t('null')}}</div>
            </li>
            <li class="cl">
              <div>{{$t('user.phone')}}</div>
              <div :class="{'gray' : !items.mobile}">{{items.mobile || $t('null')}}</div>
            </li>
            <li class="cl">
              <div>{{$t('user.email')}}</div>
              <div :class="{'gray' : !items.email}">{{items.email || $t('null')}}</div>
            </li>
          </ul>
        </div>
        <!-- 联系人信息 -->
        <div class="order_info">
          <div class="order_info_title">
            <div>{{$t('info.contactInfo')}}</div>
          </div>
          <ul>
            <li class="cl">
              <div>{{$t('user.name')}}</div>
              <div @click="changeSet('name',$t('user.name'),account.name)" :class="{'gray' : !account.name}">{{account.name || $t('null')}}</div>
            </li>
            <li class="cl">
              <div>{{$t('user.phone')}}</div>
              <div @click="changeSet('phone',$t('user.phone'),account.phone)" :class="{'gray' : !account.phone}">{{account.phone || $t('null')}}</div>
            </li>
            <li class="cl">
              <div>{{$t('user.email')}}</div>
              <div @click="changeSet('email',$t('user.email'),account.email)" :class="{'gray' : !account.email}">{{account.email || $t('null')}}</div>
            </li>
          </ul>
        </div>
        <!-- 積分抵扣 -->
        <div class="order_info">
          <div class="order_info_title">
            <div>{{$t('info.integralDeduction')}}</div>
          </div>
          <ul>
            <li class="cl">
              <div>{{$t('info.eDollar')}}</div>
              <div @click="changeSet('e_dollar',$t('info.eDollar'),e_dollar)" class="eDollars">{{e_dollar}}</div>
            </li>
            <div class="integral">{{$t('buy.integralDeduction',{
                integral : e_dollarMax,
                money : $t('money')
              })}}</div>
          </ul>
        </div>
      </div>
      <!-- 底部 -->
      <div id="buy-footer" class="buy-footer cl">
        <div>
          <div>{{$t('money')}}{{total_price}}</div>
          <div>{{$t('buy.totalPrice')}}</div>
        </div>
        <div>
          <span @click="isShowDetail = !isShowDetail">
            <span class="detail">{{$t('detail.theDetail')}}</span>
            <i v-if="isShowDetail" class="el-icon-arrow-up"></i>
            <i v-else class="el-icon-arrow-down"></i>
          </span>
          <span class="btn" @click="submit">{{$t('info.pay')}}</span>
        </div>
      </div>
      <!-- 詳情 -->
      <transition name="fade">
        <div v-if="isShowDetail" id="detail-box" class="detail-box">
          <div class="detail_box_inner">
            <div class="detail-title">{{$t('detail.theDetail')}}</div>

            <div class="detail-content">
              <div class="cl">
                <span class="total_price">{{$t('buy.travlerPrice')}}</span>
                <span>{{$t('money')}}{{total_price}}</span>
              </div>
              <div class="cl">
                <span>{{$t('buy.adult')}}</span>
                <span>{{items.adult}} {{$t('info.people')}}</span>
              </div>
              <div class="cl">
                <span>{{$t('buy.child')}}</span>
                <span>{{items.child}} {{$t('info.people')}}</span>
              </div>
              <div class="cl">
                <span>{{$t('buy.baby')}}</span>
                <span>{{items.baby}} {{$t('info.people')}}</span>
              </div>
            </div>

            <div class="detail-content">
              <div class="detail-content-title">{{$t('buy.hotel')}}</div>

              <div class="hotel_item" v-for="(item,index) in items.hotel" :key="index">
                <div class="hotel">
                  <div>{{item.room_name}}</div>
                  <div>{{item.quantity}}</div>
                </div>
                <div class="hotel_room" v-for="(i,idx) in item.room" :key="idx">
                  <div class="hotel_room_name">{{$t('order.room')}}：{{idx + 1}}</div>
                  <div v-if="i.adult !== '0'">
                    <div>{{$t('buy.adult')}}</div>
                    <div class="price">{{$t('money')}}{{items.is_vip == '1' ? i.adult_vip_price : i.adult_price}}/{{$t('info.people')}} * {{i.adult}}</div>
                  </div>
                  <div v-if="i.child_extra_bed !== '0'">
                    <div>{{$t('buy.childExtraBed')}}</div>
                    <div class="price">{{$t('money')}}{{items.is_vip == '1' ? i.child_extra_bed_vip_price : i.child_extra_bed_price}}/{{$t('info.people')}} * {{i.child_extra_bed}}</div>
                  </div>
                  <div v-if="i.child_without_extra_bed !== '0'">
                    <div>{{$t('buy.childWithoutExtraBed')}}</div>
                    <div class="price">{{$t('money')}}{{items.is_vip == '1' ? i.child_without_extra_bed_vip_price : i.child_without_extra_bed_price}}/{{$t('info.people')}} * {{i.child_without_extra_bed}}</div>
                  </div>
                  <div v-if="i.baby !== '0'">
                    <div>{{$t('buy.baby')}}</div>
                    <div class="price">{{$t('money')}}{{items.is_vip == '1' ? i.baby_vip_price : i.baby_price}}/{{$t('info.people')}} * {{i.baby}}</div>
                  </div>
                  <div v-if="i.single_occupancy_quantity !== '0'">
                    <div>{{$t('order.differencePrice')}}</div>
                    <div class="price">{{$t('money')}}{{i.single_occupancy}}/{{$t('info.people')}} * {{i.single_occupancy_quantity}}</div>
                  </div>
                </div>
              </div>

            </div>

            <div class="detail-content">
              <div class="detail-content-title">{{$t('buy.additionalItems')}}</div>
              <div class="ticket" v-for="(item,index) in items.ticket" :key="index">
                <span>{{`${item.ticket_name}(${item.ticket_type_name})`}}</span>
                <span>￥{{item.price}}/{{$t('info.people')}}*{{item.quantity}}</span>
              </div>
            </div>

          </div>
        </div>
      </transition>
    </div>
</template>

<script>
import { formatDate, messageTips, trimString } from '../../assets/js/utils'
import { MessageBox } from "mint-ui";
import { payment,wallets } from '../../assets/js/api';
export default {
    data(){
      return {
        isShowDetail : false, //是否顯示訂單詳情
        id : Object.freeze(this.$route.query.id),
        items : new Object(),
        e_dollar : 0,
        e_dollarMax : 0,
        account : {
          name : '',
          phone : '',
          email : '',
        },
      }
    },
    computed : {
      total_price(){
        if(this.items.total_price !== undefined){
          let totalPrice = Number(this.items.total_price)
          return (totalPrice - this.e_dollar).toFixed(2)
        }else{
          return 0
        }
      },
    },
    created(){
      this.requestInfo();
    },
    methods: {
      //提交
      submit() {
        let name = this.account.name;
        let phone = this.account.phone;
        let email = this.account.email;
        if(!trimString(name)){
          messageTips(this.$t('sign.inputName'));
          return false;
        }
        if(!trimString(phone)){
          messageTips(this.$t('sign.tips.phoneCheck'));
          return false;
        }
        if(name == '' || phone == '' || email == ''){
          messageTips(this.$t('sign.contactInfo'));
          return false;
        }
        this.axios({
          method : 'post',
          url : `api/web/v1/orders/confirm?lang_id=${this.lang_id}`,
          data : {
            order_id : this.id,
            contact_real_name : name,
            contact_mobile : phone,
            contact_email : email
          }
        }).then(res => {
          if(res.data.code != '1000'){
            messageTips(res.data.message);
            return false;
          }
          let id = res.data.data.id;
          payment(id,'order','webMobile',this.e_dollar);
        });
      },
      //複製
      copy(){
        if(this.items.name) this.account.name = this.items.name;
        if(this.items.mobile) this.account.phone = this.items.mobile;
        if(this.items.email) this.account.email = this.items.email;
      },
      //请求信息
      requestInfo() {
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
            this.account.name = res.data.data.contact_real_name;
            this.account.phone = res.data.data.contact_phone;
            this.account.email = res.data.data.contact_email;

            //請求錢包
            wallets().then(res => {
              let integral_deduction = Number(this.items.integral_deduction);
              let eDollar = Number(res.data.data.eDollar);
              let total_price = Number(this.items.total_price).toFixed(2);
              let e_dollarMax = 0;
              if(eDollar > integral_deduction){
                e_dollarMax = Math.floor(integral_deduction);
              }else {
                e_dollarMax = Math.floor(eDollar);
              }
              if(e_dollarMax > total_price){
                e_dollarMax = Math.floor(total_price)
              }
              this.e_dollarMax = e_dollarMax
            });

        });
      },
      //填寫信息
      changeSet(inp, title, value) {
        MessageBox.prompt(title, {
          confirmButtonText: this.$t("head.sure"),
          cancelButtonText: this.$t("head.cancel"),
          closeOnClickModal: false,
          inputValue: value
        }).then(res => {
            if(inp == 'e_dollar'){
              let val = Number(res.value) || 0;
              if(val < 0) val = 0;
              if(val > this.e_dollarMax) val = this.e_dollarMax;
              val = parseInt(val);
              this[inp] = val;
            }else{
              this.account[inp] = res.value;
            }
        }).catch(res => {
            //nothing to do
        });
      },
      formatDate : formatDate,
    },
    beforeRouteLeave(to,from,next){
      if(to.name == 'Buy'){
        next({
          path : '/Trip',
          query : {
            status : 1
          },
          replace : true,
        });
      }else{
        next();
      }
    },
    mounted() {
      document.body.style.backgroundColor = "#f5f5f5";
    },
    destroyed() {
      document.body.style.backgroundColor = "#fff";
    },
}
</script>

<style scoped>
.order_info{
  font-size: .38rem;
  color: #444;
}
.order_info .gray{
  color: #ccc;
}
.order_info .btns{
  background-color: #2d9aff;
  color: #fff;
  padding: .1rem .2rem;
  border-radius: .14rem;
  font-size: .34rem;
}
.order_info .order_info_title{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 .4rem;
  height: 1rem;
}
.order_info ul{
  background-color: #fff;
  padding: 0 .4rem;
  padding-bottom: .05rem;
}
.order_info ul li{
  height: .9rem;
  line-height: .9rem;
  margin-bottom: .2rem;
}
.order_info ul li div:first-of-type{
  float: left;
}
.order_info ul li div:last-of-type{
  float: right;
  width: 6.4rem;
  border-bottom: 0.02rem solid #ddd;
  padding-left: .1rem;
  height: 100%;
}
/* .order_info ul li:last-of-type div:last-of-type{
  border-bottom: 0;
} */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.detail-box {
  position: fixed;
  top: 0;
  bottom: 1.266667rem;
  left: 0;
  right: 0;
  z-index: 3;
  padding-top: 0;
  background-color: rgba(0,0,0,.4);
}
.detail_box_inner{
  background-color: #fff;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
.detail-box .detail-title {
  height: 1.333333rem;
  border-bottom: 0.04rem solid #ccc;
  text-align: center;
  line-height: 1.333333rem;
  color: #000;
  font-size: 0.453333rem;
}
.detail-box .detail-content {
  padding: 0.3rem;
  font-size: 0.373333rem;
  border-bottom: 0.04rem dashed #eee;
}
.detail-box .detail-content:last-of-type {
  border-bottom: 0;
}
.detail-box .detail-content > div {
  margin-bottom: 0.28rem;
  font-size: .34rem;
}
.detail-box .detail-content > div:last-of-type {
  margin-bottom: 0;
}
.detail-box .detail-content > div > span:first-of-type {
  float: left;
  color: #666;
}
.detail-box .detail-content > div > span:last-of-type {
  float: right;
  color: #000;
}
.detail-box .detail-content > div .total_price,
.detail-box .detail-content .detail-content-title {
  color: #000 !important;
  font-size: 0.426667rem;
}
.detail-box .ticket{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.detail-box .ticket>span:first-of-type{
  flex: 1;
}
.detail-box .hotel_item .hotel{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.detail-box .hotel_item .hotel>div:first-of-type{
  color: #2d9aff;
}
.detail-box .hotel_item .hotel_room{
  padding-left: .3rem;
  padding-top: .3rem;
  padding-bottom: .3rem;
  font-size: .34rem;
}
.detail-box .hotel_item .hotel_room>div{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: .3rem;
}
.detail-box .hotel_item .hotel_room>div:last-of-type{
  margin-bottom: 0;
}
.detail-box .hotel_item .hotel_room .hotel_room_name{
  color: #ff9901;
}
.detail-box .hotel_item .hotel_room .price{
  color: #000;
}
/*底部*/
.buy-footer {
  height: 1.266667rem;
  line-height: 1.266667rem;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  box-shadow: 0px -1px 6px 0px #ccc;
  border-top: 0.026667rem solid #eee;
  padding: 0 0.5rem;
  z-index: 1;
}
.buy-footer > div:first-of-type {
  float: left;
  line-height: normal;
}
.buy-footer > div:first-of-type > div:first-of-type {
  color: #f00;
  font-size: 0.453333rem;
  margin-top: 0.053333rem;
}
.buy-footer > div:first-of-type > div:last-of-type {
  font-size: 0.373333rem;
}
.buy-footer > div:last-of-type {
  float: right;
}
.buy-footer .btn {
  color: #000;
  background-color: #ffcc01;
  border-radius: 0.133333rem;
  padding: 0.2rem 0.8rem;
  font-size: 0.373333rem;
}
.buy-footer i {
  color: #ffcc01;
  font-size: 0.44rem;
  vertical-align: middle;
  padding: 0 0.4rem 0 0.1rem;
}
.buy-footer .detail {
  color: #000;
  font-size: 0.36rem;
}
.integral{
  font-size: .3rem;
  color: #2d9aff;
}
</style>
