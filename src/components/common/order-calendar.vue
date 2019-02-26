<template>
    <div id="calendar" class="calendar">
        <!-- 年份月份 -->
        <div class="month">
            <ul>
                <li class="arrow" @click="prev">
                    <i class="el-icon-arrow-left"></i>
                </li>
                <li class="year-month center">
                    <span class="choose-year" v-if="lang_id != 3">{{`${getYear(today)}-${getMonth(today,true)}`}}</span>
                    <span class="choose-year" v-else>{{`${formatDateMonth(getMonth(today))}  ${getYear(today)}`}}</span>
                </li>
                <li class="arrow" @click="next">
                    <i class="el-icon-arrow-right"></i>
                </li>
            </ul>
        </div>
        <!-- 星期 -->
        <ul class="weekdays cl">
            <li v-for="(item,index) in textTop" :key="index">{{item}}</li>
        </ul>
        <!-- 日期 -->
        <ul class="days cl">
            <li v-for="(item,index) in dayList" :key="index" :class="{'lastLine':isLastLine(index),'select':selectDay == item.formatDate}">
                <div v-if="item.isCurrent" :class="{'inventory':item.inventory > 0}" @click="clickDate(item)">
                    <div class="day-item">{{item.day}}</div>
                    <div v-if="item.inventory > 0" class="inventory-item">{{lang_id == '3' ? item.inventory : $t('detail.amount')}} {{lang_id == '3' ? $t('detail.amount'): item.inventory}}</div>
                    <div v-if="item.inventory == 0" class="inventory-item soldOut">{{$t('detail.soldOutAbbr')}}</div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import { formatDateMonth } from "../../assets/js/utils";
export default {
  props: {
    textTop: {
        type : Array,
        default(){
            return [
                this.$t('date.sun'),
                this.$t('date.mon'),
                this.$t('date.tue'),
                this.$t('date.wed'),
                this.$t('date.thu'),
                this.$t('date.fri'),
                this.$t('date.sat'),
            ]
        }
    },
    saleDate: {
        type : Array,
        default(){
            return []
        }
    },
  },
  data() {
    return {
      dayList: [],
      today: new Date(),
      selectDay: ""
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //返回对象填充
    returnNeedObj(newDate, state) {
      let formatDate = this.formatDate(newDate);
      let idx = -1;
      let inventory = -1;
      idx = this.saleDate.map(ele => ele.date).indexOf(formatDate);
      if(idx != -1) inventory = this.saleDate[idx].inventory;
      return {
        date: newDate,
        formatDate: formatDate,
        timestamp: newDate.getTime(),
        day: this.getDate(newDate),
        month: this.getMonth(newDate, true),
        year: this.getYear(newDate, true),
        isCurrent: state == "current" ? true : false,
        inventory: inventory
      };
    },
    //選擇日期
    clickDate(date) {
      if (date.inventory <= 0 || this.selectDay == date.formatDate) return false;
      this.$emit("selectDate", date);
      this.selectDay = date.formatDate;
    },
    //改变日期
    changeDate(timestamp){
        this.today = new Date(timestamp);
        this.selectDay = this.formatDate(new Date(timestamp));
        this.getList();
    },
    //上个月
    prev() {
      this.today = this.getPrevMonth(this.today);
      this.getList();
    },
    //下个月
    next() {
      this.today = this.getNextMonth(this.today);
      this.getList();
    },
    //重新计算数组
    getList() {
      var array = [];
      var arrayPrev = [];
      var arrayNext = [];
      var today = this.today;
      var todayYear = this.getYear(today);
      var todayMonth = this.getMonth(today);
      //获取上个月要显示多少天，先获取这个月第一天是星期几
      var firstDay = new Date(todayYear, todayMonth - 1, 1).getDay();
      var prevMonthDay = firstDay == 0 ? 0 : firstDay;
      //获取下个月要显示多少天，获取这个月最后一天是星期几
      var lastDay = new Date(
        todayYear,
        todayMonth - 1,
        this.getMonthDay(today)
      ).getDay();
      var nextMonthDay = lastDay == 0 ? 6 : 6 - lastDay;
      arrayPrev = this.getPrevArray(today, prevMonthDay); //上个月要显示的数组
      array = this.getArray(today); //本月显示的数组
      arrayNext = this.getNextArray(today, nextMonthDay); //下个月显示的数组
      this.dayList = arrayPrev.concat(array).concat(arrayNext);
    },
    //获取年份
    getYear(date) {
      return date.getFullYear();
    },
    //获取月份
    getMonth(date, isShow) {
      var month = date.getMonth() + 1;
      if (!isShow) {
        return month;
      } else {
        return month < 10 ? "0" + month : month;
      }
    },
    //获取天数
    getDate(date, isShow) {
      var day = date.getDate();
      if (!isShow) {
        return day;
      } else {
        return day < 10 ? "0" + day : day;
      }
    },
    //获取星期几
    getDay(date) {
      return date.getDay();
    },
    //获取当月有多少天
    getMonthDay(date) {
      var year = this.getYear(date);
      var month = this.getMonth(date);
      return new Date(year, month, 0).getDate();
    },
    //获取下个月多少天
    getNextMonthDay(date) {
      var year = this.getYear(date);
      var month = this.getMonth(date);
      if (month + 1 == 13) {
        year++;
        month = 1;
      } else {
        month++;
      }
      return new Date(year, month, 0).getDate();
    },
    //获取上个月有多少天
    getPrevMonthDay(date) {
      var year = this.getYear(date);
      var month = this.getMonth(date);
      if (month - 1 == 0) {
        year--;
        month = 12;
      } else {
        month--;
      }
      return new Date(year, month, 0).getDate();
    },
    //获取下个月的时间对象
    getNextMonth(oldToday) {
      var date;
      var year = this.getYear(oldToday);
      var month = this.getMonth(oldToday);
      var day = this.getDate(oldToday); //目前的日期
      var nextMonthDay = this.getNextMonthDay(oldToday); // 下个月一共有多少天
      day = day > nextMonthDay ? nextMonthDay : day;
      if (month + 1 == 13) {
        year++;
        month = 1;
      } else {
        month++;
      }
      date = new Date(year, month - 1, day);
      return date;
    },
    //获取上个月的时间对象
    getPrevMonth(oldToday) {
      var date;
      var year = this.getYear(oldToday);
      var month = this.getMonth(oldToday);
      var day = this.getDate(oldToday); //目前的日期
      var nextMonthDay = this.getPrevMonthDay(oldToday); // 上个月一共有多少天
      day = day > nextMonthDay ? nextMonthDay : day;
      if (month - 1 == 0) {
        year--;
        month = 12;
      } else {
        month--;
      }
      date = new Date(year, month - 1, day);
      return date;
    },
    //获取该月的时间对象
    getArray(today) {
      var arr = [];
      var day = this.getMonthDay(today);
      var year = this.getYear(today);
      var month = this.getMonth(today);
      for (var i = 0; i < day; i++) {
        var newDate = new Date(year, month - 1, i + 1);
        arr.push(this.returnNeedObj(newDate, "current"));
      }
      return arr;
    },
    //获取上个月最后几天的时间数组
    getPrevArray(today, length) {
      var arr = [];
      if (length == 0) return arr;
      var prevMonth = this.getPrevMonth(today);
      var prevMonthDay = this.getPrevMonthDay(today);
      var year = this.getYear(prevMonth);
      var month = this.getMonth(prevMonth);
      for (var i = 0; i < length; i++) {
        var newDate = new Date(year, month - 1, prevMonthDay - i);
        arr.push(this.returnNeedObj(newDate, "prev"));
      }
      return arr.reverse();
    },
    //获取下个月前几天的时间数组
    getNextArray(today, length) {
      var arr = [];
      if (length == 0) return arr;
      var nextMonth = this.getNextMonth(today);
      var year = this.getYear(nextMonth);
      var month = this.getMonth(nextMonth);
      for (var i = 0; i < length; i++) {
        var newDate = new Date(year, month - 1, i + 1);
        arr.push(this.returnNeedObj(newDate, "next"));
      }
      return arr;
    },
    //时间对象转换格式
    formatDate(date) {
      var year = this.getYear(date);
      var month = this.getMonth(date, true);
      var day = this.getDate(date, true);
      return `${year}-${month}-${day}`;
    },
    //是否在最后一行
    isLastLine(idx) {
      var len = this.dayList.length;
      if (len % 7 == 0) {
        return idx >= len - 7;
      } else {
        return len - idx <= len % 7;
      }
    },
    formatDateMonth: formatDateMonth
  }
};
</script>

<style scoped>
.pc .calendar {
  width: 600px;
  border: 1px solid #2d9aff;
}
.mobile .calendar {
  width: 100%;
  border: 0.04rem solid #2d9aff;
}
.pc .calendar .month ul,
.pc .calendar .weekdays {
  height: 30px;
  line-height: 30px;
}
.mobile .calendar .month ul {
  height: 0.866667rem;
  line-height: 0.866667rem;
}
.mobile .calendar .weekdays {
  height: 0.666667rem;
  line-height: 0.666667rem;
}
.pc .calendar .days li {
  height: 50px;
  font-size: 14px;
}
.mobile .calendar .days li {
  height: 0.8rem;
}
.calendar .month {
  position: relative;
}
.calendar .month ul li:first-of-type {
  float: left;
}
.calendar .month ul li:last-of-type {
  float: right;
}
.calendar .month ul li.arrow {
  width: 10%;
  cursor: pointer;
  text-align: center;
}
.calendar .month ul li.arrow:hover {
  color: #2d9aff;
}
.calendar .weekdays {
  background-color: #2d9aff;
}
.calendar .weekdays li {
  float: left;
  width: 14.28%;
  text-align: center;
  color: #fff;
}
.calendar .days li {
  width: 14.28%;
  float: left;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  color: #ccc;
}
.mobile .calendar .days li {
  border-width: 0.04rem;
}
.calendar .days li.select > div {
  background-color: #2d9aff;
}
.calendar .days li.select .inventory,
.calendar .days li.select .inventory-item {
  color: #fff;
}
.calendar .days li.select{
  color: #fff;
}
.calendar .days li:nth-of-type(7n) {
  border-right: 0;
}
.calendar .days li.lastLine {
  border-bottom: 0;
}
.calendar .days li > div {
  height: 100%;
  position: relative;
  padding: .2em;
}
.calendar .days li .inventory {
  cursor: pointer;
  color: #000;
}
.calendar .days li .inventory-item {
  position: absolute;
  bottom: 0.3em;
  color: #2d9aff;
  font-size: 13px;
  text-align: right;
}
.mobile .calendar .days li .inventory-item {
  font-size: 0.213333rem;
}
.mobile .calendar .days li .inventory-item.soldOut {
  font-size: 0.26rem;
}
.calendar .days li .inventory-item.soldOut {
  color: #da6d6d;
}
.pc .calendar .days li .inventory-item.soldOut{
  white-space:nowrap;
}
</style>
