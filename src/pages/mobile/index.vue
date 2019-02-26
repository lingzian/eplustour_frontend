<template>
    <div>
        <banner></banner>
        
        <div class="mb-content" v-if="items.list">
            <div class="mb-content-box mb-col" v-for="(box,index) in items.list" :key="index">
                <div class="content-head cl">
                    <div class="cl">
                        <div>
                            <div class="icon center">
                                <div></div>
                            </div>
                        </div>
                        <div class="title">{{box.name}}</div>
                    </div>
                    <div @click="$router.push({path:'/Hot',query:{id:box.template_id}})">{{$t('info.more')}}<i class="el-icon-arrow-right"></i></div>
                </div>
                <swiper v-if="box.type != '3'" :options="box.type == '1' ? swiperOption : swiperOptionTwo" class="mb-content-swiper" :class="{'no-swiper':box.type == '3','cl':box.type != '1'}">
                    <swiper-slide v-for="(item,idx) in box.journeys" :key="idx">
                        <index-item class="index-item" :class="{'small':box.type != '1'}" :itemData="item"></index-item>
                    </swiper-slide>
                </swiper>
                <div v-else class="mb-content-swiper" :class="{'no-swiper':box.type == '3','cl':box.type != '1'}">
                    <index-item v-for="(item,idx) in box.journeys" :key="idx" class="index-item" :class="{'small':box.type != '1'}" :itemData="item"></index-item>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import banner from "../../components/mobile/banner";
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import indexItem from "../../components/mobile/items/index-item";
import { messageTips,cookie } from "../../assets/js/utils";
export default {
  components: {
    banner,
    indexItem,
    swiper,
    swiperSlide
  },
  data() {
    return {
      items: new Object(),
      swiperOption: Object.freeze({
        spaceBetween: 20
      }),
      swiperOptionTwo: Object.freeze({
        slidesPerView: 2
      }),
      token : cookie.get('token'),
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
            is_home: 1,
            is_login : this.token ? 1 : 0
          }
        })
        .then(res => {
          if (res.data.code != "1000") {
            messageTips(res.data.message);
            return false;
          }
          this.$set(this.items, "list", Object.freeze(res.data.data.items));
          localStorage.setItem("index_list", JSON.stringify(this.items));
          if(this.token){
            this.$emit("setHeaderData", {
              unReadMessage: res.data.data.unread_message
            });
          }
        });
    },
  }
};
</script>

<style scoped>
.mb-col {
  padding: 0 0.506667rem;
}
.mb-content {
  padding-bottom: 1.266667rem;
}
.mb-content-box {
  padding-top: 0.533333rem;
}
.content-head {
  height: 0.533333rem;
  line-height: 0.533333rem;
  margin-bottom: 0.3rem;
}
.content-head > div:first-of-type {
  float: left;
}
.content-head > div:first-of-type > div {
  float: left;
}
.content-head > div:last-of-type {
  float: right;
}
.content-head > div:first-of-type > div:first-of-type {
  width: 0.346667rem;
  height: 0.533333rem;
  position: relative;
}
.content-head .icon {
  width: 0.346667rem;
  height: 0.346667rem;
  border-radius: 50%;
  border: 0.066667rem solid #54b5ff;
  padding: 0.053333rem;
}
.content-head .icon > div {
  background-color: #54b5ff;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.content-head .title {
  font-size: 0.453333rem;
  color: #000;
  padding-left: 0.106667rem;
  font-weight: 600;
  overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
  max-width: 6.4rem;
}
.content-head > div:last-of-type {
  color: #999999;
  font-size: 0.346667rem;
  padding-top: 0.053333rem;
}
.content-head > div:last-of-type i {
  color: #ffc935;
}
.mb-content-swiper {
  padding-bottom: 0.4rem;
  border-bottom: 0.013333rem solid #ccc;
}
.mb-content-box:last-of-type .mb-content-swiper {
  border-bottom: 0;
}
.index-item.small {
  float: left;
  width: 4.293333rem;
  margin-right: 0.4rem;
}
.index-item.small:last-of-type,
.no-swiper .index-item.small:nth-of-type(2n) {
  margin-right: 0;
}
.no-swiper .index-item.small:nth-of-type(2n) {
  margin-bottom: 0.346667rem;
}
</style>