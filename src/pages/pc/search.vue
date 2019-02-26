<template>
    <div class="search col-width">
        <!-- 麵包屑 -->
        <div class="amount-nav-search">
            <el-breadcrumb separator="//">
                <el-breadcrumb-item :to="{ path: '/' }">{{$t('footer.home')}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{$t('head.search')}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 篩選 -->
        <div class="screen" v-if="filter.result">
            <div v-for="(item,key,index) in filter.result" :key="index">
                <span v-if="key == 'filter_days'" class="screen-title">{{$t('screen.travelDays')}} :</span>
                <span v-else-if="key == 'filter_price'" class="screen-title">{{$t('screen.priceRange')}} :</span>
                <span v-else-if="key == 'filter_place'" class="screen-title">{{$t('screen.place')}} :</span>
                <span v-for="(i,idx) in item" :key="idx" class="screen-item" :class="{'select':filterSelect[index] == i.key}" @click="filterSelect[index] = i.key">
                  <span>{{i.name}}</span>
                </span>
            </div>
            <div class="departureDate">
                <span class="screen-title">{{$t('item.departureDate')}} :</span>
                <el-date-picker
                v-model="dateModel"
                :editable="false"
                :clearable="false"
                type="daterange"
                range-separator="-"
                size="small"
                :picker-options="pickerOptions"
                :start-placeholder="$t('user.choose')"
                :end-placeholder="$t('user.choose')"
                value-format="timestamp">
                </el-date-picker>
                <span class="screen-btn" @click="screenReset">{{$t('screen.resetBtn')}}</span>
                <span class="screen-btn" @click="screenConfirm">{{$t('screen.confirmBtn')}}</span>
            </div>
        </div>
        <!-- 標題 -->
        <div class="title" v-if="filter.result">
            <div>{{$t('head.searchResult')}}</div>
        </div>
        <!-- 沒有搜索結果提示 -->
        <div v-if="!requestData.isFirst&&!hasResult" class="no-result">{{$t('noResult')}}</div>
        <!-- 列表 -->
        <div v-else class="lister">
            <div v-for="(item,key,index) in requestData.result" :key="index" v-if="requestData.currentPage == parseInt(key)">
                <search-item class="search-item" v-for="(i,idx) in item" :key="idx" :itemData="i"></search-item>
            </div>
        </div>
        <!-- 分頁器 -->
        <div class="pagination" v-show="hasResult">
            <el-pagination
                background
                :page-size="requestData.pageSize"
                layout="prev, pager, next"
                @current-change="currentPageChange"
                :total="requestData.total">
            </el-pagination>
        </div>
        <div class="el-icon-loading loading" v-show="loading"></div>
    </div>
</template>

<script>
import { formatDate, scrollTop, messageTips } from "../../assets/js/utils";
import searchItem from "../../components/pc/items/search-item";
export default {
  components: {
    searchItem
  },
  data() {
    return {
      querySearch: this.$route.query.querySearch || "",
      //篩選的選擇
      filterSelect: {
        0: this.$route.query.travelDays || "", //旅行天數
        1: this.$route.query.priceRange || "", //價格
        2: this.$route.query.place || "", //地區
        3: this.$route.query.theme || "",//主题
        4: this.$route.query.people || "",//人数
      },
      dateModel: new Array(),
      hasResult: false,
      requestData: {
        isFirst: true,
        pageSize: 12,
        currentPage: 1,
        total: 0,
        pageCount: 0, //总的页数
        result: new Object()
      },
      filter: new Object(), //過濾內容
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() < new Date(new Date().setHours(0, 0, 0, 0)).getTime()
          );
        }
      },
      loading: true,
    };
  },
  created() {
    if (this.$route.query.timeStamp) {
      this.dateModel = [
        this.$route.query.timeStamp.split("-")[0],
        this.$route.query.timeStamp.split("-")[1]
      ];
    }
    this.search(this.requestData.currentPage);
  },
  methods: {
    // 改變語言清空搜索
    changeLanguage() {
      this.$router.replace({
        path: "/Search"
      });
    },
    // 頭部搜索
    headerSearch(queryString) {
      let route = this.$route;
      this.$router.replace({
        path: route.path,
        query: {
          querySearch: queryString
        }
      });
      this.querySearch = queryString;
      this.screenReset();
      this.resetSearch();
      this.search(this.requestData.currentPage);
    },
    // 重置篩選
    screenReset() {
      for (var i in this.filterSelect) {
        this.filterSelect[i] = "";
      }
      let route = this.$route;
      this.$router.replace({
        path: route.path,
        query: {
          querySearch: route.query.querySearch
        }
      });
      this.dateModel = new Array();
    },
    //确认筛选
    screenConfirm() {
      this.resetSearch();
      this.search(this.requestData.currentPage);
    },
    //重置加载
    resetSearch() {
      this.hasResult = false;
      this.requestData.isFirst = true;
      this.requestData.currentPage = 1;
      this.requestData.total = 0;
      this.requestData.pageCount = 0;
      this.requestData.result = new Object();
    },
    //存儲篩選
    saveScreen() {
      let route = this.$route;
      let query = {
        querySearch: route.query.querySearch
      };
      for (let i in this.filterSelect) {
        if (this.filterSelect[i] != "") {
          if (i == 0) {
            query.travelDays = this.filterSelect[i];
          } else if (i == 1) {
            query.priceRange = this.filterSelect[i];
          } else if (i == 2) {
            query.place = this.filterSelect[i];
          }else if(i == 3){
            query.theme = this.filterSelect[i]
          }else if(i == 4){
            query.people = this.filterSelect[i]
          }
        }
      }
      
      if (this.dateModel.length != 0) {
        query.timeStamp = this.dateModel[0] + "-" + this.dateModel[1];
      }
      this.$router.replace({
        path: route.path,
        query: query
      });
    },
    //搜索
    search(page) {
      this.loading = true;
      this.saveScreen();
      this.axios
        .get("/api/web/v1/searches", {
          params: {
            lang_id: this.lang_id,
            keyword: this.querySearch,
            "per-page": this.requestData.pageSize,
            page: page,
            filter_day: this.filterSelect[0], //筛选天数
            filter_price: this.filterSelect[1], //筛选价格
            filter_place: this.filterSelect[2], //筛选地方
            filter_departure_start_date:
              this.dateModel.length == 0 ? "" : this.dateModel[0] / 1000, //筛选出发时间段
            filter_departure_end_date:
              this.dateModel.length == 0 ? "" : this.dateModel[1] / 1000, //筛选結束时间段
            theme: this.filterSelect[3],//主题
            people: this.filterSelect[4],//旅游人数
          }
        })
        .then(res => {
          if (res.data.code != "1000") {
            messageTips(res.data.message, "error");
            // this.loading = false;
            return false;
          }
          var data = res.data.data;
          if (page == 1) {
            if (data.items.length != 0) this.hasResult = true;
            this.requestData.total = parseInt(data._meta.totalCount);
            this.requestData.isFirst = false;
            this.requestData.pageCount = data._meta.pageCount;
            this.$set(
              this.filter,
              "result",
              Object.freeze(res.data.data.filter)
            );
          }
          this.$set(
            this.requestData.result,
            page.toString(),
            Object.freeze(data.items)
          );
          this.requestData.currentPage = page;
          scrollTop();
          this.loading = false;
        });
    },
    //当页数改变的时候
    currentPageChange(idx) {
      if (!this.requestData.result[idx]) {
        this.search(idx);
      } else {
        this.requestData.currentPage = idx;
        scrollTop();
      }
    }
  }
};
</script>

<style scoped>
.loading{
  position: fixed;
  bottom: 30%;
  left: 49.2%;
  transform: translateX(-50%);
  -moz-transform: translateX(-50%);
  -webkit-transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  -o-transform: translateX(-50%);
}
.search {
  padding: 25px 0;
}
.pagination {
  text-align: center;
  margin-top: 35px;
}
.search-item {
  margin-bottom: 20px;
}
.search-item:last-of-type {
  margin-bottom: 0;
}
.title {
  height: 5px;
  background-color: #f14385;
  margin: 40px 0;
  position: relative;
}
.title div {
  position: absolute;
  top: 50%;
  left: 2%;
  -webkit-transform: translate(0, -50%);
  -moz-transform: translate(0, -50%);
  -ms-transform: translate(0, -50%);
  -o-transform: translate(0, -50%);
  transform: translate(0, -50%);
  background-color: #fff;
  padding: 0 20px;
  font-size: 25px;
  color: #f14385;
}
.lister,
.no-result {
  min-height: 800px;
}
.no-result {
  text-align: center;
  font-size: 18px;
  padding-top: 150px;
  word-break: break-all;
}
.screen {
  border: 1px solid #ccc;
  margin-top: 20px;
}
.screen > div {
  border-bottom: 1px solid #ccc;
  padding: 15px 20px;
  line-height: 24px;
}
.screen > div:last-of-type {
  border-bottom: 0;
}
.screen > div span.screen-title {
  color: #888;
}
.screen > div.departureDate span.screen-title {
  padding-right: 18px;
}
.screen > div span.screen-item {
  padding: 0 18px;
  cursor: pointer;
  color: #111;
  font-size: 14px;
  transition: all 0.15s;
}
.screen > div span.screen-item:hover {
  color: #3d8acc;
}
.screen > div span.screen-item.select span {
  color: #2d9aff;
  border-bottom: 2px solid #2d9aff;
}
.screen > div.departureDate span.screen-btn {
  display: inline-block;
  padding: 5px 20px;
  border: 1px solid #2d9aff;
  border-radius: 4px;
  vertical-align: middle;
  margin-left: 30px;
  color: #fff;
  background-color: #2d9aff;
  cursor: pointer;
}
.screen > div.departureDate span.screen-btn:hover {
  background-color: #53a3ee;
}
.screen > div.departureDate span.screen-btn:last-of-type {
  margin-left: 8px;
  color: #2d9aff;
  background-color: #fff;
}
.screen > div.departureDate span.screen-btn:last-of-type:hover {
  color: #086bc6;
  border-color: #086bc6;
}
</style>