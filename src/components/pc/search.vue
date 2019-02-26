<template>
    <div class="searchBox">
        <div class="want_to_go clearFloat">

            <!-- //左 -->
            <div class="search-left">
                <div class="searchText">
                    <div class="sub-title allText">{{$t('head.wantToGo')}}</div>
                    <el-input v-model="state1" :placeholder="searchInput.map ? searchInput.map(ele => ele.name).join(' ') : mySearchInput.map(ele => ele.name).join(' ')"></el-input>
                </div>
                <div class="theme_and_time clearFloat">
                    <div class="theme">
                        <div class="themeTitle allText">{{$t('detail.themeSelect')}}</div>
                        <el-select v-model="themeSelect" slot="prepend" :placeholder="$t('detail.unlimited')" class="second-input">
                            <el-option v-for="(ele, idx) in requestTheme" :key="idx" :label="ele.theme_name" :value="ele.theme_name" class="themesLi"></el-option>
                        </el-select>
                    </div>
                    <div class="time">
                        <div class="themeTitle allText">{{$t('detail.specificDate')}}</div>
                        <el-date-picker
                          v-model="dobuleDate"
                          type="daterange"
                          value-format="timestamp"
                          :picker-options="pickerOptions"
                          range-separator="-"
                          :start-placeholder="$t('head.startDate')"
                          :end-placeholder="$t('head.endDate')">
                        </el-date-picker>
                    </div>
                </div>
                <div class="tripMoment">
                    <div class="selectHowLong">
                        <div class="themeTitle allText">{{$t('detail.travelTime')}}</div>
                        <el-input v-model="longTime" :placeholder="$t('head.travelDays')" @blur="longTime = Number(longTime) || ''"></el-input>
                    </div>
                    <div class="selectPeople">
                        <div class="themeTitle allText">{{$t('buy.numberOfTravellers')}}</div>
                        <div class="adultsPeople">
                          <el-input v-model="adults" :placeholder="$t('buy.adult')" class="adults-input" @blur="adults = Number(adults) || ''"></el-input>
                        </div>
                        <div class="childPeople">
                            <el-input v-model="children" :placeholder="$t('buy.child')" class="child-input" @blur=" children = Number(children) || ''"></el-input>
                        </div>
                    </div>
                </div>
            </div>

            <!-- //右 -->
            <div class="search-right">
                <div class="last_search el-icon-search last_" @click="startSearch">{{$t('head.search')}}</div>
                <div class="last_refresh el-icon-refresh last_" @click="resetSearch">{{$t('screen.resetBtn')}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import { trimString } from "../../assets/js/utils.js";
export default {
  props:['searchInput'],
  data() {
    return {
      mySearchInput : [],
      placeHolder:'',
      state1: "", //想去哪
      themeSelect: "", //主题选择
      dobuleDate: "", //两个日期
      longTime: "", //旅行期间
      adults: "", //成人的人数
      children: "", //儿童的人数
      requestTheme: "", //返回的主題下拉列表
      searchRecommend: new Object(),//搜索placeholder
      pickerOptions: {//选择日期自带数据
        disabledDate(time) {
          return (
            time.getTime() < new Date(new Date().setHours(0, 0, 0, 0)).getTime() //只能选择今天之后的日期
          );
        }
      }
    };
  },
  watch: {
    searchInput(){
      sessionStorage.setItem('searchInput',JSON.stringify(this.searchInput));
    },
  },
  created(){
    let searchInput = sessionStorage.getItem('searchInput');
    if(searchInput) this.mySearchInput = JSON.parse(searchInput);
    this.getThemes(); //請求主題
  },
  mounted() {

    let searchInput = sessionStorage.getItem('searchInput');
    if(searchInput) this.mySearchInput = JSON.parse(searchInput);
    this.getThemes(); //請求主題
  },
  methods: {
    //請求主題
    getThemes() {
      this.axios
        .get("api/web/v1/themes", {
          params: {
            lang_id: this.lang_id
          }
        })
        .then(res => {
          this.requestTheme = res.data.data.items;
        });
    },
    resetSearch() {
      //点击重置
      this.state1 = "";
      this.themeSelect = "";
      this.firstDay = "";
      this.secondDay = "";
      this.longTime = "";
      this.adults = "";
      this.children = "";
      this.dobuleDate = "";
    },
    checkDate() {
      //搜索后传过去搜索页的日期
      if(!this.dobuleDate){
        this.dobuleDate = 0;
      }
      else{
        this.dobuleDate = parseInt(this.dobuleDate[0]) + "-" + parseInt(this.dobuleDate[1]);
        if (this.dobuleDate == "NaN-NaN" || !this.dobuleDate) {
          this.dobuleDate = 0;
        }
      }
    },
    startSearch() {
      //搜索请求
      this.checkDate();
      this.$router.push({
        path: "/Search",
        query: {
          querySearch: trimString(this.state1),
          theme: trimString(this.themeSelect),
          timeStamp: this.dobuleDate,
          travelDays: this.longTime,
          people: Math.floor(this.adults) + Math.floor(this.children)
        }
      });
    }
  }
};
</script>

<style scoped>
.el-input--prefix .el-input__inner {
  padding-left: 29px;
}
.el-input--suffix .el-input__inner {
  padding-right: 23px;
}
.clearFloat::after {
  content: "";
  display: block;
  clear: both;
  visibility: hidden;
  height: 0;
}
.clearFloat {
  zoom: 1;
}
.searchBox {
  width: 650px;
  top: 35%;
  left: 27%;
  position: absolute;
  transform: translateX(-50%);
  z-index: 10;
}
.want_to_go {
  width: 650px;
  height: 270px;
  z-index: 10;
  background: url(../../assets/images/search_left_right.png) no-repeat center
    center;
  background-size: contain;
  float: left;
  /* box-shadow: 1px 1px 1px #888888; */
}
.search-left {
  width: 75.8%;
  height: 100%;
  float: left;
  padding: 20px 20px 10px 20px;
}
.search-right {
  width: 24.2%;
  height: 100%;
  float: right;
  padding: 20px;
  position: relative;
}
.theme_and_time {
  width: 100%;
  margin-top: 20px;
}
.theme {
  float: left;
  width: 40%;
}
.allText {
  color: white;
  font-size: 16px;
  margin-bottom: 5px;
}
.time {
  float: right;
  width: 60%;
}
.first-input {
  width: 95%;
}
.second-input {
  width: 90%;
}
.firstDay {
  width: 50%;
  float: left;
}
.secondDay {
  width: 50%;
  float: left;
}
.first_year {
  width: 95%;
  float: left;
}
.second_hour {
  width: 95%;
  float: left;
}
.tripMoment {
  margin-top: 20px;
  width: 100%;
}
.selectHowLong {
  width: 40%;
  float: left;
}
.third-input {
  width: 90%;
}
.selectPeople {
  float: right;
  width: 60%;
}
.adultsPeople {
  width: 50%;
  float: left;
}
.childPeople {
  width: 50%;
  float: left;
}
.adults-input {
  width: 95%;
}
.child-input {
  width: 95%;
}
.last_ {
  height: 30px;
  width: 120px;
  background: #2d9aff;
  border-radius: 20px;
  color: white;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  position: absolute;
}
.last_:active {
  background: white;
  color: #2d9aff;
  border: 1px solid #2d9aff;
}
.last_search {
  bottom: 70px;
  right: 16px;
}
.last_refresh {
  bottom: 30px;
  right: 16px;
}
</style>
