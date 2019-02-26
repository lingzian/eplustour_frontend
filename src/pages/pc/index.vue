<template>
  <div>
    <div class="min-width">
        <banner :searchInput="searchInput"></banner>
        <div class="content">
          <div class="tripBox">
            <index-elevator ref="elevator" :itemArr="this.items.list"></index-elevator>
            <index-firstitem v-for="(ele, idx) in this.items.list" :key="idx" :itemData="ele" :index="idx"></index-firstitem>
          </div>
        </div>
    </div>
    <right-navigation></right-navigation>
  </div>
</template>

<script>
import banner from "../../components/pc/banner";
import indexFirstitem from '../../components/pc/items/index-firstitem';
import indexElevator from '../../components/pc/indexElevator';
import rightNavigation from '../../components/pc/rightNavigation'
export default {
  components: {
    banner,
    indexFirstitem,
    indexElevator,
    rightNavigation
  },
  data() {
    return {
      items: new Object(),
      searchInput: new Object(),
    };
  },
  created() {
    let index_list = localStorage.getItem("index_list");
    if (index_list) this.items = JSON.parse(index_list);
    this.getContent(); //获取页面内容
  },
  methods: {
    //获取页面内容
    getContent() {
      this.axios
        .get("api/web/v1/templates", {
          params: {
            lang_id: this.lang_id,
            is_home: 1
          }
        })
        .then(res => {
          if (res.data.code != "1000") {
            messageTips(res.data.message, "error");
            return false;
          }
          if(this.$route.path == '/'){
             this.$nextTick(() => {
              this.$refs.elevator.getOffsettop();
            });
          }
          this.$set(this.items, "list", Object.freeze(res.data.data.items));

          localStorage.setItem("index_list", JSON.stringify(this.items));
        });
    },
    getSearchPlaceholder(val) {
      this.searchInput = val;
    },
  }
};
</script>

<style scoped>
.content {
  min-height: 800px;
  background: #f5f5f5 url('../../assets/images/waterBackground.png');
}
.itemBox{
  padding-top: 60px;
}
.itemBox:first-child {
  margin-top: 0;
}
.content > div {
  margin-bottom: 60px;
}
.content > div:last-of-type {
  margin-bottom: 0px;
}
.content .title {
  height: 5px;
  background-color: #3893fa;
}
.content .title .title-col {
  position: relative;
  height: 100%;
}
.content .title .title-col div {
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
  color: #3893fa;
}
.content-box {
  margin: 30px auto;
}
.content-box.border {
  border: 1px solid #ddd;
  padding: 14px;
}
.content-box .content-item-1 {
  margin-bottom: 30px;
}
.content-box .content-item-1:last-of-type {
  margin-bottom: 0;
}
.content-box .content-item-2 {
  float: left;
  margin-right: 30px;
  margin-top: 30px;
}
.content-box .content-item-2:first-of-type,
.content-box .content-item-2:nth-of-type(2) {
  margin-top: 0;
}
.content-box .content-item-2:nth-of-type(2n) {
  margin-right: 0px;
}
.content-box .content-item-4 {
  float: left;
  margin-right: 30px;
  margin-top: 30px;
}
.content-box .content-item-4:first-of-type,
.content-box .content-item-4:nth-of-type(2),
.content-box .content-item-4:nth-of-type(3),
.content-box .content-item-4:nth-of-type(4) {
  margin-top: 0;
}
.content-box .content-item-4:nth-of-type(4n) {
  margin-right: 0px;
}






.tripBox{
  width: 1200px;
  height: auto;
  margin: 0 auto;
}
</style>
