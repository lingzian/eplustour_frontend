<template>
    <div class="content col-width">
      <!-- 麵包屑 -->
      <div class="amount-nav-search">
          <el-breadcrumb separator="//">
              <el-breadcrumb-item :to="{ path: '/' }">{{$t('footer.home')}}</el-breadcrumb-item>
              <el-breadcrumb-item>{{$t('order.name')}}</el-breadcrumb-item>
          </el-breadcrumb>
      </div>
      <div class="detail-content">
        <!-- 基本信息 -->
        <div class="order_content">
          <div class="order_content_title cl">
            <div>{{items.journey_name}}</div>
            <div :class="'status'+items.order_status">{{formatStatus(items.order_status,items.is_evaluation)}}</div>
          </div>
          <div class="journey_info cl">
            <!-- 我的行程 -->
            <div class="my_travle">
              <div class="title">{{$t('head.trip')}}</div>

              <div class="middle">
                <div class="travle_day cl">
                  <div>{{$t('detail.productDays')}}：</div>
                  <div>{{items.total_day}} {{$t('buy.day')}}</div>
                </div>
                <div class="travle_date cl">
                  <div>{{$t('detail.travelTimes')}}：</div>
                  <div v-if="items.total_day != '1'">{{formatDate(items.departure_date,false)}}~{{formatDate(items.return_date,false)}}</div>
                  <div v-else>{{formatDate(items.departure_date,false)}}~{{formatDate(items.departure_date,false)}}</div>
                </div>
                <div class="travle_people cl">
                  <div>{{$t('buy.numberOfTravellers')}}：</div>
                  <div>{{(parseInt(items.adult) + parseInt(items.baby) + parseInt(items.child)) || 0}}</div>
                </div>
              </div>

              <div class="bottom cl">
                <div>{{$t('buy.totalPrice')}}</div>
                <div v-if="items.order_status == 1"> <span class="priceUnit">{{$t('money')}}</span>{{total_price}}</div>
                <div v-else>{{$t('money')}}{{items.total_price}}</div>
              </div>

            </div>
            <!-- 客戶信息 -->
            <div class="my_travle info">
              <div class="title">{{$t('order.orderInfo')}}</div>
              <div class="middle">
                <div class="cl">
                  <div>{{$t('info.contact')}} :</div>
                  <div>{{items.contact_real_name}}</div>
                </div>
                <div class="cl">
                  <div>{{$t('info.phone')}} :</div>
                  <div>{{items.contact_phone}}</div>
                </div>
                <div class="cl">
                  <div>{{$t('info.email')}} :</div>
                  <div>{{items.contact_email}}</div>
                </div>
                <div class="cl">
                  <div>{{$t('info.orderTime')}} :</div>
                  <div>{{formatDate(items.create_time,false,true)}}</div>
                </div>
                <div class="cl">
                  <div>{{$t('head.orderNumber')}} :</div>
                  <div>{{items.number}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 酒店信息 -->
        <div class="order_content">
          <div class="order_content_title">{{$t('buy.hotel')}}</div>

          <div class="hotel_item" v-for="(item,index) in items.hotel" :key="index">
            <!-- 房型 -->
            <div class="room_type cl">
              <div>
                <span class="item_title">{{$t('buy.roomType')}}：</span>
                <span class="title_val">{{item.room_name}}</span>
              </div>
              <div>{{$t('info.number')}}：{{item.quantity}}</div>
            </div>
            <!-- 房间 -->
            <ul class="room_list">
              <li v-for="(i,idx) in item.room" :key="idx">
                <div class="people_number">
                  <div class="item_title">{{$t('order.room')}}{{idx + 1}}：</div>
                  <div class="traveler_info">
                    <div class="traveler_count cl">
                      <div class="count_title">{{$t('buy.adult')}}：</div>
                      <div>{{i.adult}}</div>
                      <div class="count_title padding_left">{{$t('buy.childExtraBed')}}：</div>
                      <div>{{i.child_extra_bed}}</div>
                      <div class="count_title padding_left">{{$t('buy.childWithoutExtraBed')}}：</div>
                      <div>{{i.child_without_extra_bed}}</div>
                      <div class="count_title padding_left">{{$t('buy.baby')}}：</div>
                      <div>{{i.baby}}</div>
                    </div>
                    <div class="traveler_info_title">
                      <div>{{$t('info.passenger')}}：</div>
                      <div v-for="(data,i) in i.order_room_passport" :key="i" class="travler_item">
                        <span class="type" v-if="data.age_name == '1'">({{$t('buy.adult')}})</span>
                        <span class="type" v-else>({{data.age_name == '3' ? $t('buy.baby') : $t('buy.child')}})</span>
                        <span class="name">{{$t('user.name')}}：{{data.name}}</span>
                        <span class="card">{{data.certificate_type == '0' ? $t('user.idCard') : $t('user.passport')}}：{{data.certificate_number}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <!-- 评价按钮 -->
          <div v-if="items.order_status == '4' && items.ticket && items.ticket.length === 0" class="btn-box">
            <router-link v-if="items.order_status == '4' && items.is_evaluation == '0'" :to="{path:'/Evaluate',query:{id:id}}" class="btn">
              <el-button type="primary">{{$t('info.evaluate')}}</el-button>
            </router-link>
            <el-button v-else-if="items.order_status == '4' && items.is_evaluation != '0'" class="gray">{{$t('info.evaluate')}}</el-button>
          </div>

        </div>

        <!-- 附加项目 -->
        <div v-if="items.ticket && items.ticket.length != 0" class="order_content">
          <div class="order_content_title">{{$t('buy.additionalItems')}}</div>
          <div>
            <ticket-item v-for="(i,index) in items.ticket" :key="index" :itemData="i" class="ticket-item"></ticket-item>
          </div>
          <!-- 评价按钮 -->
          <div v-if="items.order_status == '4'" class="btn-box">
            <router-link v-if="items.order_status == '4' && items.is_evaluation == '0'" :to="{path:'/Evaluate',query:{id:id}}" class="btn">
              <el-button type="primary">{{$t('info.evaluate')}}</el-button>
            </router-link>
            <el-button v-else-if="items.order_status == '4' && items.is_evaluation != '0'" class="gray">{{$t('info.evaluate')}}</el-button>
          </div>
        </div>

        <!-- 填写联系人信息 -->
        <div v-if="items.order_status == '1'" class="order_content">
          <div class="order_content_title">{{$t('order.accountInfo')}}</div>
          <div class="order_content_info account_info cl">
            <span>
              <span>{{$t('user.name')}}：</span>
              <span :class="{'gray' : !items.name}">{{items.name || $t('null')}}</span>
            </span>
            <span>
              <span>{{$t('user.phone')}}：</span>
              <span :class="{'gray' : !items.mobile}">{{items.mobile || $t('null')}}</span>
            </span>
            <span>
              <span>{{$t('user.email')}}：</span>
              <span :class="{'gray' : !items.email}">{{items.email || $t('null')}}</span>
            </span>
            <span class="copy" @click="copy">{{$t('copy')}}</span>
          </div>
          <div class="order_content_title">{{$t('info.contactInfo')}}</div>
          <div class="order_content_info contact_info cl">
            <div>
              <div>{{$t('user.name')}}：</div>
              <el-input class="input" v-model="contact.name"></el-input>
            </div>
            <div>
              <div>{{$t('user.phone')}}：</div>
              <el-input class="input" v-model="contact.mobile"></el-input>
            </div>
            <div>
              <div>{{$t('user.email')}}：</div>
              <el-input class="input" v-model="contact.email"></el-input>
            </div>
          </div>
          <div class="order_content_title">{{$t('info.integralDeduction')}}</div>
          <div class="order_content_info integral_info cl">
            <el-input class="integral" v-model="e_dollar" @blur="formatIntegralDeduction(e_dollar)"></el-input>
            <span>{{$t('buy.integralDeduction',{
              integral : e_dollarMax,
              money :  $t('money')
            })}}</span>
          </div>
          <div class="btn-box">
            <div class="final_price">{{$t('buy.totalPrice')}}：<span class="orderPrice">{{$t('money')}}</span>{{total_price}}</div>
            <el-button type="primary" @click="pay">{{$t('info.pay')}}</el-button>
          </div>
        </div>

      </div>
    </div>
</template>

<script>
import detailInfo from "../../components/pc/detail-info";
import { formatDate, messageTips,formatStatus,createFormSubmit } from "../../assets/js/utils";
import ticketItem from "../../components/pc/items/ticket-item";
import { payment,wallets } from '../../assets/js/api';
export default {
  components: {
    detailInfo,
    ticketItem
  },
  data() {
    return {
      id: Object.freeze(this.$route.query.id),
      items: new Object(),
      e_dollar : 0,
      e_dollarMax : 0,
      total_price : 0,
      contact: {
        name : '',
        mobile : '',
        email : '',
      },
    };
  },
  created() {
    this.requestInfo();
  },
  methods: {
    //请求信息
    requestInfo() {
      this.axios.get(`api/web/v1/orders/${this.id}`, {
        params: {
          lang_id: this.lang_id
        }
      }).then(res => {
        if (res.data.code != "1000") {
          messageTips(res.data.message, "error");
          return false;
        }
        this.items = Object.freeze(res.data.data);
        if(this.items.order_status != 1) return false;
        this.contact.name = this.items.contact_real_name;
        this.contact.mobile = this.items.contact_phone;
        this.contact.email = this.items.contact_email;
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
          this.total_price = total_price;
        });
      });
    },
    //支付
    pay(){
      let name = this.contact.name;
      let mobile = this.contact.mobile;
      let email = this.contact.email;
      if(name == '' || mobile == '' || email == ''){
        messageTips(this.$t('sign.contactInfo'),'error');
        return false;
      }
      this.axios({
        method : 'post',
        url : `api/web/v1/orders/confirm?lang_id=${this.lang_id}`,
        data : {
          order_id : this.id,
          contact_real_name : name,
          contact_mobile : mobile,
          contact_email : email
        }
      }).then(res => {
        if(res.data.code != '1000'){
          messageTips(res.data.message,'error');
          return false;
        }
        let id = res.data.data.id;
        payment(id,'order','pc',this.e_dollar);
      });
    },
    //复制
    copy(){
      if(this.items.name) this.contact.name = this.items.name;
      if(this.items.mobile) this.contact.mobile = this.items.mobile;
      if(this.items.email) this.contact.email = this.items.email;
    },
    formatIntegralDeduction(integral){
      integral = Number(integral) || 0;
      integral = parseInt(integral);
      if(integral < 0) integral = 0;
      if(integral > this.e_dollarMax) integral = this.e_dollarMax;
      this.e_dollar = integral;
      this.total_price = (Number(this.items.total_price) - integral).toFixed(2);
    },
    formatDate: formatDate,
    formatStatus : formatStatus,
  },
  mounted() {
    document.body.style.backgroundColor = "#f5f5f5";
  },
  destroyed() {
    document.body.style.backgroundColor = "#fff";
  },
};
</script>

<style scoped>
.orderPrice{
  font-size: 13px;
}
.priceUnit{
  font-size: 18px;
}
.content {
  padding: 25px 0;
}
.detail-content {
  margin-top: 25px;
}
.order_content{
  background-color: #fff;
  padding: 20px 15px;
  margin-bottom: 35px;
}
.order_content .order_content_title{
  color: #000;
  font-weight: bold;
  margin-bottom: 25px;
  line-height: 24px;
}
.order_content .order_content_title div:first-of-type{
  font-weight: bold;
  float: left;
  width: 1050px;
}
.order_content .order_content_title div:last-of-type{
  font-weight: bold;
  float: right;
  padding-right: 10px;
}

/*行程详情*/
.journey_info>div{
  float: left;
}
.journey_info .my_travle{
  width: 370px;
  margin-right: 20px;
}
.journey_info .my_travle>div{
  padding: 0 10px;
}
.journey_info .my_travle .title{
  background-color: #2d9aff;
  color: #fff;
  height: 40px;
  line-height: 40px;
}
.journey_info .my_travle .middle{
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  min-height: 180px;
}
.journey_info .my_travle.info .middle{
  line-height: 46px;
  border-bottom: 1px solid #ccc;
}
.journey_info .my_travle .middle .cl>div:first-of-type{
  float: left;
}
.journey_info .my_travle .middle .cl>div:last-of-type{
  float: right;
}
.journey_info .my_travle .middle .travle_day{
  padding: 18px 0;
}
.journey_info .my_travle .middle .travle_people,
.journey_info .my_travle .middle .travle_place,
.journey_info .my_travle .middle .travle_date{
  padding-bottom: 18px;
}
.journey_info .my_travle .middle .travle_place{
  border-bottom: 1px solid #ddd;
}
.journey_info .my_travle .middle .travle_place>div:last-of-type{
  max-width: 220px;
  color: #000;
}
.journey_info .my_travle .middle .travle_people>div:last-of-type{
  color: #000;
}
.journey_info .my_travle .bottom{
  color: #fff;
  background-image: url(../../assets/images/detail-bg.png);
  height: 50px;
  line-height: 50px;
}
.journey_info .my_travle .bottom>div:first-of-type{
  float: left;
}
.journey_info .my_travle .bottom>div:last-of-type{
  float: right;
  font-size: 24px;
}

/*酒店*/
.hotel_item{
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 15px;
}
.hotel_item .item_title{
  color: #999;
}
.hotel_item .inventory>div:first-of-type,
.hotel_item .room_type>div:first-of-type{
  float: left;
}
.hotel_item .inventory>div:last-of-type,
.hotel_item .room_type>div:last-of-type{
  float: right;
}
.hotel_item .inventory>div:last-of-type{
  cursor: pointer;
  color: #999;
}
.hotel_item .inventory{
  margin-top: 15px;
}
.hotel_item .inventory .icon{
  width: 15px;
  margin-top: -3px;
  margin-left: 5px;
}
.hotel_item .room_type .room_tips{
  color: #2d9aff;
  font-size: 14px;
}
.hotel_item .room_list li{
  margin-top: 15px;
}
.hotel_item .room_list li .people_number{
  display: table;
}
.hotel_item .room_list li .people_number .padding_left{
  padding-left: 80px;
}
.hotel_item .room_list li .people_number .item_title{
  padding-top: 5px;
}
.hotel_item .room_list li .people_number .count_title{
  color: #999;
}
.hotel_item .room_list li .people_number .traveler_info{
  display: table-cell;
  vertical-align: top;
}
.hotel_item .room_list li .people_number .traveler_info .traveler_info_title{
  color: #000;
  display: table;
}
.hotel_item .room_list li .people_number .traveler_info .traveler_info_title>div:first-of-type{
  display: table-cell;
}
.hotel_item .room_list li .people_number .traveler_info .traveler_count{
  margin-bottom: 18px;
}
.hotel_item .room_list li .people_number .traveler_info .traveler_count>div{
  float: left;
  line-height: 25px;
}
.hotel_item .room_list li .people_number .traveler_info .select_traveler{
  color: #2d9aff;
  padding: 3px 10px;
  border-radius: 8px;
  border: 1px solid #2d9aff;
  cursor: pointer;
  font-size: 14px;
}
/*旅客*/
.travler_item{
  margin-bottom: 14px;
}
.travler_item:last-of-type{
  margin-bottom: 8px;
}
.travler_item .type{
  color: #ffa601;
}
.travler_item .name{
  padding-left: 15px;
  padding-right: 30px;
}
/*票券*/
.ticket-item{
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
  margin-bottom: 20px;
}
.ticket-item:last-of-type{
  border-bottom: 0;
  margin-bottom: 0;
}

/*按钮*/
.btn-box{
  text-align: center;
}
.btn-box .gray{
  background-color: #ccc;
  color: #fff;
  cursor: default;
}
.btn-box .gray:focus,
.btn-box .gray:active,
.btn-box .gray:hover{
  color: #fff;
  border-color: #ccc;
}

/*联系人信息*/
.order_content_info{
  padding-bottom: 25px;
  margin-bottom: 25px;
}
.order_content_info>div>div{
  float: left;
  height: 40px;
  line-height: 40px;
}
.order_content_info>div>div.input{
  width: 250px;
  margin-right: 40px;
}
.order_content_info.contact_info,
.order_content_info.account_info{
  border-bottom: 1px dashed #ccc;
}
.order_content_info.account_info>span{
  padding-right: 40px;
}
.order_content_info.account_info>span .gray{
  color: #ccc;
}
.order_content_info.account_info .copy{
  background-color: #2d9aff;
  padding-right: 0;
  color: #fff;
  padding: 3px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all .15s;
}
.order_content_info.account_info .copy:hover{
  background-color: #0a80ee;
}
.order_content_info.integral_info .integral{
  width: 200px;
}
.order_content_info.integral_info>span{
  color: #aaa;
  font-size: 14px;
}
.final_price{
  margin-bottom: 20px;
  color: #f00;
}
</style>
