<template>
  <div>
    <!-- 內容 -->
    <div class="mb-padding-content">
      <!-- 頂部 -->
      <div class="content between_sides_padding">
        <div class="journey_name">{{items.journey_name}}</div>
        <div class="departure_date">{{$t('detail.departureTime')}}：{{formatDate(items.departure_date,false)}}</div>
        <order-calendar ref="date" v-if="items.sale_date" :saleDate="items.sale_date" @selectDate="selectDate"></order-calendar>
      </div>
      <!-- 酒店 -->
      <div class="content">
        <div class="content_title between_sides_padding">{{$t('buy.hotel')}}</div>
        <div class="hotel_content between_sides_padding">

          <!-- 酒店项目 -->
          <div class="hotel_item" v-for="(item,index) in items.room" :key="index">

            <div class="hotel_room radius_content">
              <div>
                <div>
                  <span>{{$t('buy.roomType')}}：</span>
                  <span class="title_val">{{item.room_name}}</span>
                </div>
                <count :min="0" :max="parseInt(item.inventory)" :emitData="{index : index}" v-model="room[index].number" @change="countChange"></count>
              </div>
              <div>
                <div>
                  <span>{{$t('detail.inventory')}}：</span>
                  <span class="title_val">{{item.inventory}}</span>
                </div>
                <div @click="differencePriceExplain">
                  <span>{{$t('order.differencePrice')}}</span>
                  <img src="../../assets/images/exclamatory-mark.png" alt="" class="icon">
                </div>
              </div>
            </div>

            <div v-for="(i,idx) in room[index].list" :key="idx">

              <div class="hotel_room_number">
                <span @click="roomExplain(item.max_people)">{{$t('order.room')}}：{{idx + 1}}<img src="../../assets/images/exclamatory-mark.png" alt="" class="icon"></span>
              </div>

              <div class="hotel_people radius_content">
                <div>
                  <div>{{$t('buy.adult')}}</div>
                  <count
                    :min="1"
                    :max="i.adult_maxNum"
                    :emitData="{index:index,roomIdx:idx,key:'adult'}"
                    v-model="i.adult"
                    @change="countPeopleChange"></count>
                </div>
                <div>
                  <div>{{$t('buy.childExtraBed')}}</div>
                  <count
                    :min="0"
                    :max="i.child_extra_bed_maxNum"
                    :emitData="{index:index,roomIdx:idx,key:'child_extra_bed'}"
                    v-model="i.child_extra_bed"
                    @change="countPeopleChange"></count>
                </div>
                <div>
                  <div>{{$t('buy.childWithoutExtraBed')}}</div>
                  <count
                    :min="0"
                    :max="i.child_without_extra_bed_maxNum"
                    :emitData="{index:index,roomIdx:idx,key:'child_without_extra_bed'}"
                    v-model="i.child_without_extra_bed"
                    @change="countPeopleChange"></count>
                </div>
                <div>
                  <div>{{$t('buy.baby')}}</div>
                  <count
                    :min="0"
                    :max="i.baby_maxNum"
                    :emitData="{index:index,roomIdx:idx,key:'baby'}"
                    v-model="i.baby"
                    @change="countPeopleChange"></count>
                </div>
              </div>

              <div class="hotel_travel radius_content">
                <div>{{$t('info.passenger')}}</div>
                <div>
                  <span @click="chooseTraveler(index,idx)">{{$t('info.passengerSelect')}}</span>
                  <i v-if="i.passenger_show" class="el-icon-arrow-up" @click="i.passenger_show = false"></i>
                  <i v-else class="el-icon-arrow-down" @click="i.passenger_show = true"></i>
                </div>
              </div>
              <ul v-if="i.passenger_show" class="hotel_travel_list">
                <li v-for="(data,i) in i.passenger_List" :key="i">
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
      <!-- 附加項目 -->
      <ul class="content content-ticket" v-if="items.ticket && items.ticket.length !=0">
        <div class="content_title between_sides_padding">{{$t('buy.additionalItems')}}</div>
        <div class="between_sides_padding">
          <li v-for="(item,index) in items.ticket" :key="index">

            <div>
              <bg-image class="ticket_image bg" :thumb="item.ticket_thumb"></bg-image>

              <div class="ticket_info">
                <div class="ticket_name">{{item.ticket_name}}({{item.ticket_type_name}})</div>
                <div class="description">{{item.description}}</div>
              </div>
            </div>


            <div class="price">
              <div class="ticket_price">
                <span>{{$t('detail.price')}}: ￥{{item.price}}</span>
              </div>
              <div>
                  <count v-model="item.number"
                          :min="item.is_required == '1' ? 1 : 0"
                          :emitData="{index:index}"
                          @change="countTicketChange"
                          :disabled="item.is_required == '1' && item.match_type != '0'">
                  </count>
              </div>
            </div>

          </li>
        </div>
      </ul>

      <!-- 承諾 -->
      <div class="content proflie between_sides_padding">
        <check-out v-model="proflieChecked">{{$t('buy.profile')}}</check-out>
      </div>
    </div>


    <!-- 底部 -->
    <div id="buy-footer" class="buy-footer cl">
      <div>
        <div>￥{{totalPrice.toFixed(2)}}</div>
        <div>{{$t('buy.totalPrice')}}</div>
      </div>
      <div>
        <span class="btn" @click="submit">{{$t('buy.confirm')}}</span>
      </div>
    </div>


  </div>
</template>

<script>
import orderCalendar from '../../components/common/order-calendar'
import checkOut from '../../components/mobile/checkOut'
import count from '../../components/common/count'
import { MessageBox } from 'mint-ui';
import bgImage from "../../components/common/bgImage";
import { messageTips,formatDate } from '../../assets/js/utils';
export default {
  components: {
    orderCalendar,
    count,
    checkOut,
    bgImage
  },
  data() {
    return {
      id: this.$route.query.id,
      totalPrice : 0,
      items: new Object(),
      room: [],
      proflieChecked : false,
      selectedId : [],
    };
  },
  created(){
    let $route = this.$route;
    if($route.params.type == 'back'){
      //直接回復數據
      this.restoreData();
      if($route.params.isEdit){
        let position = $route.params.position;
        let list = this.room[position.index].list[position.idx].passenger_List;
        list.forEach(e => {
          let id = e.id;
          let idx = this.selectedId.indexOf(id);
          if(idx != -1) this.selectedId.splice(idx,1);
        });
        list.splice(0,list.length);
      }
    }else if($route.params.type == 'sure'){
      // 選擇完出行人
      this.restoreData();
      let position = $route.params.position;
      let list = $route.params.list;
      this.room[position.index].list[position.idx].passenger_List.forEach(ele => {
        let id = ele.id;
        let idx = this.selectedId.indexOf(id);
        if(idx != -1) this.selectedId.splice(idx,1);
      });
      list.forEach(ele => {
        let id = ele.id;
        let idx = this.selectedId.indexOf(id);
        if(idx == -1) this.selectedId.push(id);
      });
      this.room[position.index].list[position.idx].passenger_List = list;
    }else{
      this.getDetail();
    }
  },
  methods: {
    // 提交訂單
    submit(){
      //验证酒店数量
      let roomsNumber = 0;
      this.room.forEach(ele => {
        roomsNumber += ele.number;
      });
      if(roomsNumber == 0){
        messageTips(this.$t('sign.chooseHotel'));
        return false;
      }
      //验证酒店人数
      let flag = true;
      this.room.forEach(e => {
        e.list.forEach(ele => {
          let adultNumber = 0;
          let childNumber = 0;
          let babyNumber = 0;
          ele.passenger_List.forEach(i => {
            if(i.age_name == '1'){
              adultNumber++;
            }else if(i.age_name == '2'){
              childNumber++;
            }else if(i.age_name == '3'){
              babyNumber++;
            }
          });
          if(adultNumber != ele.adult || childNumber != ele.child_extra_bed + ele.child_without_extra_bed || babyNumber != ele.baby){
            messageTips(this.$t('sign.choosePeopleNumber'));
            flag = false;
          }
        });
      });
      if(!flag) return false;
      //验证条款
      if(!this.proflieChecked){
        messageTips(this.$t('sign.chooseProfile'));
        return false;
      }
      let ticket = this.items.ticket.map(ele => {
        return {
          ticket_type_id : ele.ticket_type_id,
          quantity : ele.number,
          price : ele.price
        }
      });
      let room = [];
      this.room.forEach(ele => {
        let inputData = {
          journey_room_id : ele.id,
          quantity : ele.number,
          room_type: []
        }
        ele.list.forEach(e => {
          inputData.room_type.push({
            adult : e.adult,
            child_extra_bed : e.child_extra_bed,
            child_without_extra_bed : e.child_without_extra_bed,
            baby : e.baby,
            contact : e.passenger_List.map(i => {
              return {
                member_passport_id : i.id
              }
            })
          })
        });
        room.push(inputData);
      });

      this.axios({
        method : 'post',
        url : `api/web/v1/orders?lang_id=${this.lang_id}`,
        data : {
          journey_id : this.id,
          total_price : this.totalPrice,
          departure_date : this.items.departure_date,
          order_time : parseInt(Date.now() / 1000),
          ticket : JSON.stringify(ticket),
          room : JSON.stringify(room),
        }
      }).then(res => {
        if (res.data.code != "1000") {
          messageTips(res.data.message);
          return false;
        }
        messageTips(this.$t('info.checkOutSuccess'));
        this.$router.replace({
          path : '/Info',
          query : {
            id : res.data.data.id
          }
        });
      });
    },
    //计算价格
    countPrice(){
      let price = 0;
      this.room.map(e => {
        e.list.forEach(ele => {
          let adultTotalPrice = ele.adult_price * ele.adult; // 成人总价格
          let addBedTotalPrice = ele.child_extra_bed_price * ele.child_extra_bed; //占床小孩总价格
          let noBedTotalPrice = ele.child_without_extra_bed_price * ele.child_without_extra_bed; //不占床小孩总价格
          let babyTotalPrice = ele.baby_price * ele.baby; //婴儿价格
          let singleCount = ele.min_people - ele.adult - ele.child_extra_bed; //单房差数量
          singleCount = singleCount < 0 ? 0 : singleCount;
          let singleOccupancyTotalPrice = ele.single_occupancy * singleCount; //单房差总价
          price += (adultTotalPrice + addBedTotalPrice + noBedTotalPrice + babyTotalPrice + singleOccupancyTotalPrice);
        })
      });
      this.items.ticket.forEach(ele => {
        price += (ele.number * Number(ele.price));
      });
      this.totalPrice = price;
    },
    // 改變房型數量
    countChange(params){
      let idx = params.data.index;
      let type = params.type;
      let is_vip = parseInt(this.items.is_vip) != 0;
      if(type == 'add'){
        let data = this.items.room[idx]
        let max_people = parseInt(data.max_people);
        let max_adult = parseInt(data.max_adult);
        let default_people = 1; //默認入住人數（最少一個成人）
        this.room[idx].list.push({
          adult : default_people, //成人人數
          child_extra_bed : 0, //小孩加床
          child_without_extra_bed : 0, //小孩不加床
          baby : 0, //嬰兒
          adult_maxNum : max_adult, //成人人數最大值
          child_extra_bed_maxNum : max_people - default_people, //小孩加床人數最大值
          child_without_extra_bed_maxNum : max_people - default_people, //小孩不加床人數最大值
          baby_maxNum : max_people - default_people, //嬰兒最大值
          adult_price : Number(is_vip ? data.adult_vip_price : data.adult_price), //成人价格
          child_extra_bed_price : Number(is_vip ? data.child_extra_bed_vip_price : data.child_extra_bed_price), //小孩加床价格
          child_without_extra_bed_price : Number(is_vip ? data.child_without_extra_bed_vip_price : data.child_without_extra_bed_price), //小孩不加床价格
          baby_price : Number(is_vip ? data.baby_vip_price : data.baby_price), //婴儿价格
          single_occupancy : Number(data.single_occupancy), //单房差总价
          min_people : Number(data.min_people), //最小入住人数(用来计算单房差总价)
          passenger_show : true,
          passenger_List : [],
        });
      }else if(type == 'reduce'){
        this.room[idx].list.forEach(ele => {
          ele.passenger_List.forEach(e => {
            let id = e.id;
            let idx = this.selectedId.indexOf(id);
            if(idx != -1) this.selectedId.splice(idx,1);
          })
        });
        this.room[idx].list.pop();
      }
      this.listenPeopleChangeTicketNumber();
      this.countPrice();
    },
    //改變人數
    countPeopleChange(params){
      let room = this.room[params.data.index].list[params.data.roomIdx];
      if(room.passenger_List.length != 0){
        room.passenger_List.forEach(ele => {
          let id = ele.id;
          let idx = this.selectedId.indexOf(id);
          if(idx != -1) this.selectedId.splice(idx,1);
        });
        room.passenger_List.splice(0,room.passenger_List.length);
      }
      let key = params.data.key; //改變的key
      let max_people = parseInt(this.items.room[params.data.index].max_people); //最大入住人數
      let min_people = parseInt(this.items.room[params.data.index].min_people); //最小入住人數
      let max_adult = parseInt(this.items.room[params.data.index].max_adult); //最大入住成人數
      let adult_num = room.adult; //成人目前的人數
      let without_adult_num = room.child_extra_bed + room.child_without_extra_bed + room.baby; //成人以外目前的人數
      let all_num = adult_num + without_adult_num; //已選目前的人數
      if(key !== 'adult'){
        room.adult_maxNum = max_people - without_adult_num > max_adult ? max_adult : max_people - without_adult_num;
      }
      room.child_extra_bed_maxNum = max_people - all_num + room.child_extra_bed;
      room.child_without_extra_bed_maxNum = max_people - all_num + room.child_without_extra_bed;
      room.baby_maxNum = max_people - all_num + room.baby;
      this.listenPeopleChangeTicketNumber();
      this.countPrice();
    },
    //票券数量变化
    countTicketChange(params){
      this.countPrice();
    },
    //监听人数的变化改变票券的数量
    listenPeopleChangeTicketNumber(){
      let adult = 0;
      let child = 0;
      let baby = 0;
      this.room.forEach(ele => {
        ele.list.forEach(e => {
          adult += e.adult;
          child += (e.child_extra_bed + e.child_without_extra_bed);
          baby += e.baby;
        });
      });
      let all = adult + child + baby;
      this.items.ticket.forEach(ele => {
        if(ele.is_required == '1'){
          if(ele.match_type == '1'){
            ele.number = all;
          }else if(ele.match_type == '2'){
            ele.number = adult;
          }else if(ele.match_type == '3'){
            ele.number = child;
          }else if(ele.match_type == '4'){
            ele.number = baby;
          }
        }
      });
    },
    //选择日期
    selectDate(date){
      this.getDetail(parseInt(date.timestamp/1000));
    },
    // 获取详情
    getDetail(timestamp){
      if(!this.id) this.$router.go(-1);
      let sendData = {
          lang_id: this.lang_id,
          journey_id : this.id,
      }
      if(timestamp) sendData.departure_date = timestamp;
      this.axios.get(`api/web/v1/orders/info`,{
        params: sendData
      }).then(res => {
        if(res.data.code == '1004'){
          this.$router.replace('/');
          return false;
        }
        if (res.data.code != "1000") {
          messageTips(res.data.message);
          return false;
        }
        let data = res.data.data;
        this.items = data;
        // 選擇時間
        if(!timestamp){
          this.$nextTick(() => {
            this.$refs.date.changeDate(parseInt(data.departure_date) * 1000);
          });
        }
        this.selectedId.splice(0,this.selectedId.length);
        this.room.splice(0,this.room.length);
        //房型數據
        data.room.forEach(ele => {
          this.room.push({
            id: ele.journey_room_id,
            number : 0,
            list : [],
          });
        });
        //附加项
        this.items.ticket.forEach(ele => {
          this.$set(ele,'number',ele.is_required == '1' ? 1 : 0)
        });
        this.listenPeopleChangeTicketNumber();
        this.countPrice();
      });
    },
    //单房差说明
    differencePriceExplain(){
      MessageBox({
        title : this.$t('user.tips'),
        message : this.$t('order.differenceTips'),
        confirmButtonText : this.$t('screen.confirmBtn'),
      });
    },
    //房間說明
    roomExplain(max_people){
      MessageBox({
        title : this.$t('user.tips'),
        message : this.$t('order.maxPeopleTips',{max_people : max_people}),
        confirmButtonText : this.$t('screen.confirmBtn'),
      });
    },
    //選擇出行旅客
    chooseTraveler(index,idx){
      this.saveData();
      // Index 房型下標，idx房間下標
      let data = this.room[index].list[idx];
      this.$router.push({
        name : 'ChooseTraveler',
        params:{
          need : {
            adult : data.adult,
            child : data.child_extra_bed + data.child_without_extra_bed,
            baby : data.baby
          },
          position : {
            index : index,
            idx : idx
          },
          currentSelectId : data.passenger_List.map(ele => ele.id),
          selectedId : this.selectedId,
          departure_date : this.items.departure_date,
        }
      });
    },
    //保存數據
    saveData(){
      localStorage.setItem('buy',JSON.stringify(this.$data));
    },
    //回復數據
    restoreData(){
      let data = JSON.parse(localStorage.getItem('buy'));
      localStorage.removeItem('buy');
      if(!data){
        this.$router.go(-1);
        return false;
      }
      this.id = data.id;
      this.items = data.items;
      this.proflieChecked = data.proflieChecked;
      this.room = data.room;
      this.totalPrice = data.totalPrice;
      this.selectedId = data.selectedId;
      this.$nextTick(() => {
        this.$refs.date.changeDate(parseInt(this.items.departure_date) * 1000);
      });
    },
    formatDate : formatDate,
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
/* 內容 */
.between_sides_padding{
  padding: 0 .4rem;
}
.content{
  background-color: #fff;
  margin-bottom: .4rem;
  padding-top: .4rem;
  padding-bottom: .3rem;
}
.content_title{
  font-size: .4rem;
  padding-bottom: .3rem;
  border-bottom: 0.04rem solid #eee;
}
.hotel_content{
  padding-top: .3rem;
}
.radius_content{
  background-color: #f8f8f8;
  border-radius: 0.18rem;
  padding: .3rem;
}
.journey_name{
  font-size: .4rem;
  font-weight: bold;
  padding-bottom: .3rem;
  line-height: .48rem;
}
.departure_date{
  padding-bottom: .3rem;
  color: #555;
  font-size: .34rem;
}
/* 酒店 */
.hotel_item{
  font-size: .34rem;
  color: #888;
  margin-bottom: .3rem;
}
.hotel_item .icon{
  width: .4rem;
  margin-left: .14rem;
  margin-top: -.06rem;
  margin-right: .06rem;
}
.hotel_item .hotel_travel,
.hotel_item .hotel_people>div,
.hotel_item .hotel_room>div{
  display: flex;
  justify-content:space-between;
  align-items: center;
  margin-bottom: .38rem;
}
.hotel_item .hotel_people{
  margin-bottom: .38rem;
}
.hotel_item .hotel_people>div{
  margin-bottom: .6rem;
}
.hotel_item .hotel_people>div:last-of-type,
.hotel_item .hotel_room>div:last-of-type{
  margin-bottom: 0;
}
.hotel_item .hotel_room .title_val{
  color: #000;
}
.hotel_item .hotel_room_number{
  padding: .3rem 0;
}
.hotel_item .hotel_travel{
  color: #444;
  margin-bottom: 0;
}
.hotel_item .hotel_travel i{
  color: #000;
  margin-left: 0.2rem;
}
.hotel_item .hotel_travel span{
  color: #2d9aff;
  border: 0.04rem solid #2d9aff;
  border-radius: 0.1rem;
  padding: 0.06rem 0.08rem;
  font-size: .3rem;
}
.hotel_item .hotel_travel_list{
  padding: 0 .3rem;
}
.hotel_item .hotel_travel_list li{
  display: flex;
  padding: .36rem 0;
  border-bottom: 0.03rem solid #ddd;
}
.hotel_item .hotel_travel_list li>div:first-of-type{
  width: 1.6rem;
  color: #2d9aff;
}
.hotel_item .hotel_travel_list li>div:last-of-type{
  flex: 1;
  color: #000;
}
.hotel_item .hotel_travel_list .name{
  margin-bottom: .4rem;
}

/*附加项*/
.content-ticket li {
  margin-top: 0.3rem;
  padding-bottom: .3rem;
  border-bottom: 0.02rem solid #eee;
}
.content-ticket li:last-of-type{
  border-bottom: 0;
  padding-bottom: 0;
}
.content-ticket li > div{
  display: flex;
  justify-content: space-between;
}
.content-ticket li > div:last-of-type{
  align-items: center;
}
.content-ticket li .ticket_image{
  width: 2.4rem;
  height: 2.4rem;
  border: 0.026667rem solid #ccc;
  border-radius: 0.133333rem;
}
.content-ticket li .ticket_info{
  width: 6.6rem;
}
.content-ticket li .ticket_info .ticket_name{
  color: #000;
  font-size: .36rem;
  line-height: .5rem;
}
.content-ticket li .ticket_info .description{
  margin-top: .1rem;
  line-height: .4rem;
}
.content-ticket li .price{
  margin-top: .14rem;
}
.content-ticket li .ticket_price{
  font-size: .4rem;
}
/* 底部 */
.proflie{
  margin-bottom: 0;
}
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
</style>
