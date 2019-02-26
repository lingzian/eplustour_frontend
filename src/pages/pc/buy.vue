<template>
  <div class="content col-width">
    <!-- 麵包屑 -->
    <div class="amount-nav-search">
        <el-breadcrumb separator="//">
            <el-breadcrumb-item :to="{ path: '/' }">{{$t('footer.home')}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{$t('buy.buy')}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <!-- 內容 -->
    <div class="detail-content">
      <!-- 基本信息 -->
      <div class="order_content">
        <div class="order_content_title">{{items.journey_name}}</div>
        <div class="journey_info cl">
          <!-- 我的行程 -->
          <div class="my_travle">
            <div class="title">{{$t('head.trip')}}</div>

            <div class="middle">
              <div class="travle_day cl">
                <div>{{$t('detail.productDays')}}：</div>
                <div>{{items.total_day}} {{$t('buy.day')}}</div>
              </div>
              <div class="travle_people cl">
                <div>{{$t('buy.numberOfTravellers')}}：</div>
                <div>{{ allPeople }}</div>
              </div>
            </div>

            <div class="bottom cl">
              <div>{{$t('buy.totalPrice')}}</div>
              <div><span class="priceUnit">{{$t('money')}}</span>{{totalPrice.toFixed(2)}}</div>
            </div>

          </div>
          <!-- 出行时间 -->
          <div>
            <order-calendar v-if="items.sale_date" ref="date" :saleDate="items.sale_date" @selectDate="selectDate"></order-calendar>
          </div>

        </div>
      </div>
      <!-- 酒店房间 -->
      <div class="order_content">
        <div class="order_content_title">{{$t('buy.hotel')}}</div>
        <div class="hotel_item" v-for="(item,index) in items.room" :key="index">
          <!-- 房型 -->
          <div class="room_type cl">
            <div>
              <span class="item_title">{{$t('buy.roomType')}}：</span>
              <span class="title_val">{{item.room_name}}</span>
              <span class="room_tips">({{roomExplain(item.max_people)}})</span>
            </div>
            <div>
              <count :min="0" :max="parseInt(item.inventory)" :emitData="{index : index}" v-model="room[index].number" @change="countChange"></count>
            </div>
          </div>
          <!-- 库存 -->
          <div class="inventory cl">
            <div>
              <span class="item_title">{{$t('detail.inventory')}}：</span>
              <span class="title_val">{{item.inventory}}</span>
            </div>
            <div>
              <el-tooltip class="item" effect="dark" :content="$t('order.differenceTips')" placement="bottom">
                <span>{{$t('order.differencePrice')}}<img src="../../assets/images/exclamatory-mark.png" alt="" class="icon"></span>
              </el-tooltip>
            </div>
          </div>
          <!-- 房间 -->
          <ul class="room_list">
            <li v-for="(i,idx) in room[index].list" :key="idx">
              <div class="people_number">
                <div class="item_title">{{$t('order.room')}}{{idx + 1}}：</div>
                <div class="traveler_info">
                  <div class="traveler_count cl">
                    <div class="count_title">{{$t('buy.adult')}}：</div>
                    <count
                      :min="1"
                      :max="i.adult_maxNum"
                      :emitData="{index:index,roomIdx:idx,key:'adult'}"
                      v-model="i.adult"
                      @change="countPeopleChange"></count>
                    <div class="count_title padding_left">{{$t('buy.childExtraBed')}}：</div>
                    <count
                      :min="0"
                      :max="i.child_extra_bed_maxNum"
                      :emitData="{index:index,roomIdx:idx,key:'child_extra_bed'}"
                      v-model="i.child_extra_bed"
                      @change="countPeopleChange"></count>
                    <div class="count_title padding_left">{{$t('buy.childWithoutExtraBed')}}：</div>
                    <count
                      :min="0"
                      :max="i.child_without_extra_bed_maxNum"
                      :emitData="{index:index,roomIdx:idx,key:'child_without_extra_bed'}"
                      v-model="i.child_without_extra_bed"
                      @change="countPeopleChange"></count>
                    <div class="count_title padding_left">{{$t('buy.baby')}}：</div>
                    <count
                      :min="0"
                      :max="i.baby_maxNum"
                      :emitData="{index:index,roomIdx:idx,key:'baby'}"
                      v-model="i.baby"
                      @change="countPeopleChange"></count>
                  </div>
                  <div class="traveler_info_title">
                    <div>
                      <span @click="chooseTraveler(index,idx,i)" class="select_traveler">{{$t('info.passengerSelect')}}</span>
                    </div>
                    <div v-for="(data,i) in i.passenger_List" :key="i" class="travler_item">
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
        <div class="btns" v-if="items.ticket && items.ticket.length == 0">
          <div>
            <el-checkbox v-model="proflieChecked">{{$t('buy.profile')}}</el-checkbox>
          </div>
          <el-button type="primary" @click="submit">{{$t('buy.confirm')}}</el-button>
        </div>
      </div>
      <!-- 附加项目 -->
      <div class="order_content" v-if="items.ticket && items.ticket.length != 0">
        <div v-if="items.ticket && items.ticket.length != 0" class="order_content_title">{{$t('buy.additionalItems')}}</div>
        <ul class="ticket_list">

          <li class="cl" v-for="(item,index) in items.ticket" :key="index">
            <bg-image class="ticket_thumb bg" :thumb="item.ticket_thumb"></bg-image>
            <div class="ticket_info">
              <div class="ticket_title">{{item.ticket_name}}({{item.ticket_type_name}})</div>
              <div class="ticket_description">{{item.description}}</div>
              <div class="ticket_other cl">
                <div>{{$t('detail.price')}}:<span> <span class="orderPrice">{{$t('money')}}</span>{{item.price}}</span></div>
                <div>
                  <count v-model="item.number"
                          :min="item.is_required == '1' ? 1 : 0"
                          :emitData="{index:index}"
                          @change="countTicketChange"
                          :disabled="item.is_required == '1' && item.match_type != '0'">
                  </count>
                </div>
              </div>
            </div>
          </li>

        </ul>
        <div class="btns">
          <div>
            <el-checkbox v-model="proflieChecked">{{$t('buy.profile')}}</el-checkbox>
          </div>
          <el-button type="primary" @click="submit">{{$t('buy.confirm')}}</el-button>
        </div>
      </div>
    </div>
    <!-- 选择出行旅客 -->
    <choose-traveler ref="chooseTraveler" @submit="onChooseTraveler" :selectedId="selectedId" @add="add" @edit="edit"></choose-traveler>
    <!-- 新增編輯 -->
    <passport-dialog ref="passportDialog" @success="chagnePassport" @close="$refs.chooseTraveler.show()"></passport-dialog>
  </div>
</template>

<script>
import orderCalendar from '../../components/common/order-calendar'
import chooseTraveler from '../../components/pc/chooseTraveler'
import count from '../../components/common/count'
import bgImage from "../../components/common/bgImage";
import { messageTips,formatDate } from '../../assets/js/utils';
import passportDialog from '../../components/pc/passport-dialog';
export default {
  components: {
    orderCalendar,
    count,
    bgImage,
    chooseTraveler,
    passportDialog
  },
  data() {
    return {
      id: this.$route.query.id,
      totalPrice : 0,
      items: new Object(),
      room: [],
      proflieChecked : false,
      choose: {
        index : -1,
        idx : -1
      },
      selectedId : [], // 已選擇的旅客
    };
  },
  computed:{
    allPeople(){
      let people = 0;
      this.room.forEach(e => {
        e.list.forEach(ele => {
          people += (ele.adult + ele.child_extra_bed + ele.child_without_extra_bed + ele.baby);
        });
      });
      return people;
    },
  },
  created(){
    this.getDetail();
  },
  methods: {
    //新增出行人
    add(){
      this.$refs.passportDialog.open('',this.items.departure_date);
    },
    //編輯出行人
    edit(id){
      this.$refs.passportDialog.open(id,this.items.departure_date);
    },
    //修改了出行人
    chagnePassport(type,data){
      if(type == 'edit'){
        let list = this.room[this.choose.index].list[this.choose.idx].passenger_List;
        list.forEach(e => {
          let id = e.id;
          let idx = this.selectedId.indexOf(id);
          if(idx != -1) this.selectedId.splice(idx,1);
        });
        list.splice(0,list.length);
      }
      this.$refs.chooseTraveler.show(type,data);
    },
    // 提交訂單
    submit(){
      //验证酒店数量
      let roomsNumber = 0;
      this.room.forEach(ele => {
        roomsNumber += ele.number;
      });
      if(roomsNumber == 0){
        messageTips(this.$t('sign.chooseHotel'),'error');
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
            messageTips(this.$t('sign.choosePeopleNumber'),'error');
            flag = false;
          }
        });
      });
      if(!flag) return false;
      //验证条款
      if(!this.proflieChecked){
        messageTips(this.$t('sign.chooseProfile'),'error');
        return false;
      }
      // 整理數據
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
          messageTips(res.data.message,'error');
          return false;
        }
        messageTips(this.$t('info.checkOutSuccess'));
        this.$router.replace({
          path : '/OrderDetail',
          query : {
            id : res.data.data.id
          }
        });
      });
    },
    // 获取详情
    getDetail(timestamp){
      let sendData = {
          lang_id: this.lang_id,
          journey_id : this.id,
      }
      if(timestamp){
        sendData.departure_date = timestamp;
        this.$refs.chooseTraveler.requestList(timestamp);
      }
      this.axios.get(`api/web/v1/orders/info`,{
        params: sendData
      }).then(res => {
        if (res.data.code != "1000") {
          messageTips(res.data.message,'error');
          return false;
        }
        let data = res.data.data;
        this.items = data;
        // 選擇時間
        if(!timestamp){
          this.$nextTick(() => {
            this.$refs.date.changeDate(parseInt(data.departure_date) * 1000);
          });
          this.$refs.chooseTraveler.requestList(parseInt(data.departure_date));
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
      // if(key == 'adult'){
      //   room.adult_maxNum = params.type == 'add' ? room.adult_maxNum : room.adult_maxNum + 1;
      // }else{
      //   room.adult_maxNum = max_people - without_adult_num > max_adult ? max_adult : max_people - without_adult_num;
      // }
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
    //选择日期
    selectDate(date){
      this.getDetail(parseInt(date.timestamp/1000));
    },
    //選擇出行旅客
    chooseTraveler(index,idx,data){
      this.choose.index = index;
      this.choose.idx = idx;
      this.$refs.chooseTraveler.open({
        need : {
          adult : data.adult,
          child : data.child_extra_bed + data.child_without_extra_bed,
          baby : data.baby
        },
        currentSelectId : this.room[index].list[idx].passenger_List.map(ele => ele.id)
      });
    },
    //當選擇出行了旅客
    onChooseTraveler(list){
      this.room[this.choose.index].list[this.choose.idx].passenger_List.forEach(ele => {
        let id = ele.id;
        let idx = this.selectedId.indexOf(id);
        if(idx != -1) this.selectedId.splice(idx,1);
      });
      this.room[this.choose.index].list[this.choose.idx].passenger_List = JSON.parse(JSON.stringify(list));
      list.forEach(ele => {
        let id = ele.id;
        let idx = this.selectedId.indexOf(id);
        if(idx == -1) this.selectedId.push(id);
      });
    },
    //房间说明
    roomExplain(max_people){
      return this.$t('order.maxPeopleTips',{max_people : max_people});
    },
    formatDate : formatDate,
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

.journey_info>div{
  float: left;
}
.journey_info .my_travle{
  width: 550px;
  margin-right: 20px;
}
.journey_info .my_travle>div{
  padding: 0 10px;
}
.journey_info .my_travle .title{
  background-color: #2d9aff;
  color: #fff;
  height: 80px;
  line-height: 80px;
}
.journey_info .my_travle .middle{
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
}
.journey_info .my_travle .middle .cl>div:first-of-type{
  float: left;
}
.journey_info .my_travle .middle .cl>div:last-of-type{
  float: right;
}
.journey_info .my_travle .middle .travle_day{
  border-bottom: 1px solid #ddd;
}
.journey_info .my_travle .middle .travle_day,
.journey_info .my_travle .middle .travle_people{
  height: 75px;
  line-height: 75px;
}
.journey_info .my_travle .middle .travle_people>div:last-of-type{
  color: #000;
}
.journey_info .my_travle .bottom{
  color: #fff;
  background-image: url(../../assets/images/detail-bg.png);
  height: 80px;
  line-height: 80px;
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
  /* margin: 15px 0 18px 0; */
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
  padding-left: 20px;
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
/*额外项目*/
.ticket_list li{
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
}
.ticket_list li:last-of-type{
  margin-bottom: 0px;
  border-bottom: 0;
}
.ticket_list li .ticket_thumb{
  float: left;
  width: 130px;
  height: 130px;
  border-radius: 10px;
}
.ticket_list li .ticket_info{
  float: right;
  width: 1020px;
}
.ticket_list li .ticket_title{
  color: 000;
  font-weight: bold;
  margin-bottom: 10px;
}
.ticket_list li .ticket_description{
  line-height: 18px;
}
.ticket_list li .ticket_other{
  margin-top: 15px;
}
.ticket_list li .ticket_other>div:first-of-type{
  float: left;
}
.ticket_list li .ticket_other>div:first-of-type span{
  color: #f00;
}
.ticket_list li .ticket_other>div:last-of-type{
  float: right;
}
.btns{
  text-align: center;
  margin-top: 40px;
}
.btns>div{
  margin-bottom: 20px;
}
</style>
