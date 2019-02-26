<template>
    <div class="mb-padding-content" v-if="items.district_name">
      <!-- 订单状态 -->
      <div class="content">
        <div class="content_title between_sides_padding">
          <div>{{items.district_name}}</div>
          <div :class="'status'+items.order_status">{{formatStatus(items.order_status,items.is_evaluation)}}</div>
        </div>
        <div class="content_box between_sides_padding">
          <div class="journey_name">{{items.journey_name}}</div>
          <div class="travel_time" v-if="items.total_day != '1'">{{$t('detail.travelTime')}}：{{formatDate(items.departure_date,false)}}~{{formatDate(items.return_date,false)}}</div>
          <div class="travel_time" v-else>{{$t('detail.travelTime')}}：{{formatDate(items.departure_date,false)}}~{{formatDate(items.departure_date,false)}}</div>
          <div class="order_other">
            <div>{{$t('buy.adult')}}*{{items.adult}} {{$t('buy.child')}}*{{items.child}} {{$t('buy.baby')}}*{{items.baby}}</div>
            <div class="price">{{$t('money')}}{{items.total_price}}</div>
          </div>
          <ul class="btns">
            <router-link v-if="items.order_status == '1'" :to="{path:'/Info',query:{id:id}}">
              <li>{{$t('info.pay')}}</li>
            </router-link>
            <router-link v-if="items.order_status == '4' && items.is_evaluation == '0'" :to="{path:'/Evaluate',query:{id:id}}">
              <li>{{$t('info.evaluate')}}</li>
            </router-link>
            <li v-else-if="items.order_status == '4' && items.is_evaluation != '0'" class="gray">{{$t('info.evaluated')}}</li>
          </ul>
        </div>
      </div>
      <!-- 订单信息 -->
      <div class="content">
        <div class="content_title between_sides_padding">
          <div>{{$t('order.orderInfo')}}</div>
        </div>
        <div class="content_box between_sides_padding">
          <ul class="order_info">
            <li>
              <div>{{$t('info.contact')}} :</div>
              <div>{{items.contact_real_name}}</div>
            </li>
            <li>
              <div>{{$t('info.phone')}} :</div>
              <div>{{items.contact_phone}}</div>
            </li>
            <li>
              <div>{{$t('info.email')}} :</div>
              <div>{{items.contact_email}}</div>
            </li>
            <li>
              <div>{{$t('info.orderTime')}} :</div>
              <div>{{formatDate(items.create_time,false,true)}}</div>
            </li>
            <li>
              <div>{{$t('head.orderNumber')}} :</div>
              <div>{{items.number}}</div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 酒店 -->
      <div class="content">
        <div class="content_title between_sides_padding">
          <div>{{$t('buy.hotel')}}</div>
        </div>
        <div class="content_box between_sides_padding">
          <div class="hotel_item" v-for="(item,index) in items.hotel" :key="index">

            <div class="hotel_room radius_content">
              <div>
                <div>
                  <span>{{$t('buy.roomType')}}：</span>
                  <span class="title_val">{{item.room_name}}</span>
                </div>
              </div>
              <div>
                <div>
                  <span>{{$t('info.number')}}：</span>
                  <span class="title_val">{{item.quantity}}</span>
                </div>
              </div>
            </div>

            <div v-for="(i,idx) in item.room" :key="idx">
              <div class="hotel_room_number">
                <span>{{$t('order.room')}}：{{idx + 1}}</span>
              </div>

              <div class="hotel_people radius_content">
                <div>
                  <div>{{$t('buy.adult')}}：</div>
                  <div>{{i.adult}}</div>
                </div>
                <div>
                  <div>{{$t('buy.baby')}}：</div>
                  <div>{{i.baby}}</div>
                </div>
                <div>
                  <div>{{$t('buy.childExtraBed')}}：</div>
                  <div>{{i.child_extra_bed}}</div>
                </div>
                <div>
                  <div>{{$t('buy.childWithoutExtraBed')}}：</div>
                  <div>{{i.child_without_extra_bed}}</div>
                </div>
              </div>

              <div class="hotel_travel radius_content" @click="i.passenger_show = !i.passenger_show">
                <div>{{$t('info.passenger')}}</div>
                <div>
                  <i v-if="i.passenger_show" class="el-icon-arrow-up"></i>
                  <i v-else class="el-icon-arrow-down"></i>
                </div>
              </div>

              <ul v-if="i.passenger_show" class="hotel_travel_list">
                <li v-for="(data,i) in i.order_room_passport" :key="i">
                  <div v-if="data.age_name == '1'">({{$t('buy.adult')}})</div>
                  <div v-else>({{data.age_name == '3' ? $t('buy.baby') : $t('buy.child')}})</div>
                  <div>
                    <div class="name">{{data.name}}</div>
                    <div class="cardId">
                      <span>{{data.certificate_type == '0' ? $t('user.idCard') : $t('user.passport')}}：</span>
                      <span>{{data.certificate_number}}</span>
                    </div>
                  </div>
                </li>
              </ul>

            </div>

          </div>
        </div>
      </div>
      <!-- 附加项 -->
      <div class="content" v-if="items.ticket.length > 0">
        <div class="content_title between_sides_padding">
          <div>{{$t('buy.additionalItems')}}</div>
        </div>
        <div class="content_box between_sides_padding">
          <ul>
            <ticket-item class="ticket-item" v-for="(item,index) in items.ticket" :key="index" :itemData="item"></ticket-item>
          </ul>
        </div>
      </div>

    </div>
</template>

<script>
import { formatDate, formatStatus, messageTips } from "../../assets/js/utils";
import ticketItem from "../../components/mobile/items/ticket-item";
export default {
  components: {
    ticketItem
  },
  data() {
    return {
      id: this.$route.query.id,
      items: new Object()
    };
  },
  created() {
    this.requestInfo();
  },
  methods: {
    formatDate: formatDate,
    formatStatus: formatStatus,
    //请求信息
    requestInfo() {
      this.axios.get(`api/web/v1/orders/${this.id}`, {
          params: {
            lang_id: this.lang_id
          }
      }).then(res => {
        if (res.data.code != "1000") {
          messageTips(res.data.message);
          return false;
        }
        res.data.data.hotel.forEach(ele => {
          ele.room.forEach(e => {
            e.passenger_show = true;
          });
        });
        this.items = res.data.data;
      });
    }
  },
  mounted() {
    document.body.style.backgroundColor = "#f5f5f5";
  },
  destroyed() {
    document.body.style.backgroundColor = "#fff";
  }
};
</script>

<style scoped>
.mb-padding-content {
  padding-bottom: 0;
}
.between_sides_padding {
  padding-left: 0.3rem;
  padding-right: 0.3rem;
}
.content {
  background-color: #fff;
  margin: 0.3rem 0;
}
.content .content_title {
  height: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.4rem;
  border-bottom: 0.03rem solid #ddd;
  color: #000;
}
.content .content_box {
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
}
.journey_name {
  color: #000;
  font-size: 0.42rem;
  line-height: 0.5rem;
  margin-top: 0.24rem;
}
.travel_time {
  margin-top: 0.4rem;
}
.order_other {
  margin-top: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.order_other .price {
  font-size: 0.4rem;
  color: #f00;
}
.btns {
  margin-top: 0.5rem;
  display: flex;
  justify-content: flex-end;
}
.btns li {
  border-radius: 0.133333rem;
  background-color: #2d9aff;
  color: #fff;
  height: 0.72rem;
  line-height: 0.72rem;
  padding: 0 0.6rem;
  font-size: 0.36rem;
}
.btns li.gray {
  background-color: #ddd;
}
.order_info li {
  display: flex;
  margin-bottom: 0.48rem;
  font-size: 0.35rem;
  align-items: center;
}
.order_info li:last-of-type {
  margin-bottom: 0.14rem;
}
.order_info li > div:last-of-type {
  color: #000;
  padding-left: 0.6rem;
}
.ticket-item {
  border-bottom: 0.03rem solid #ddd;
  padding-bottom: 0.266667rem;
  margin-bottom: 0.266667rem;
}
.ticket-item:last-of-type {
  border-bottom: 0;
  padding-bottom: 0;
  margin-bottom: 0;
}
/* 酒店 */
.radius_content {
  background-color: #f8f8f8;
  border-radius: 0.18rem;
  padding: 0.3rem;
}
.hotel_item {
  font-size: 0.34rem;
  color: #888;
  margin-bottom: 0.3rem;
}
.hotel_item .icon {
  width: 0.4rem;
  margin-left: 0.14rem;
  margin-top: -0.06rem;
  margin-right: 0.06rem;
}
.hotel_item .hotel_travel,
.hotel_item .hotel_room > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.38rem;
}
.hotel_item .hotel_people {
  margin-bottom: 0.38rem;
  display: flex;
  justify-content: space-between;
  align-content: space-between;
  flex-wrap: wrap;
  height: 1.8rem;
}
.hotel_item .hotel_people > div {
  width: 50%;
  margin-bottom: 0;
  display: flex;
}
.hotel_item .hotel_room > div:last-of-type {
  margin-bottom: 0;
}
.hotel_item .hotel_room .title_val {
  color: #000;
}
.hotel_item .hotel_room_number {
  padding: 0.3rem 0;
}
.hotel_item .hotel_travel {
  color: #444;
  margin-bottom: 0;
}
.hotel_item .hotel_travel i {
  color: #000;
  margin-left: 0.2rem;
}
.hotel_item .hotel_travel span {
  color: #2d9aff;
  border: 0.04rem solid #2d9aff;
  border-radius: 0.1rem;
  padding: 0.06rem 0.08rem;
  font-size: 0.3rem;
}
.hotel_item .hotel_travel_list {
  padding: 0 0.3rem;
}
.hotel_item .hotel_travel_list li {
  display: flex;
  padding: 0.36rem 0;
  border-bottom: 0.03rem solid #ddd;
}
.hotel_item .hotel_travel_list li > div:first-of-type {
  width: 1.6rem;
  color: #2d9aff;
}
.hotel_item .hotel_travel_list li > div:last-of-type {
  flex: 1;
  color: #000;
}
.hotel_item .hotel_travel_list .name {
  margin-bottom: 0.4rem;
}
</style>
