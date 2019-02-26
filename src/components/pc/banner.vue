<template>
    <div class="banner-box">
        <div v-if="items.length == 0 && afterRequest" class="defaultImg banner-item bg" :style="`background-image:url(${errorImageUrl})`"></div>
        <swiper v-else :options="swiperOption" class="banner">
            <swiper-slide v-for="(items,index) in items" :key="index">
                <bg-image v-if="items.type == '0'" class="banner-item bg" :thumb="items.thumb"></bg-image>
                <bg-image v-if="items.type == '1'" @click="hrefDetail(items.target)" class="banner-item bg cursor" :thumb="items.thumb"></bg-image>
                <bg-image v-if="items.type == '2'" @click="hrefGo(items.target)" class="banner-item bg cursor" :thumb="items.thumb"></bg-image>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
            <div class="swiper-button-prev" slot="button-prev"></div>
            <div class="swiper-button-next" slot="button-next"></div>
        </swiper>
        <w-search :searchInput="searchInput"></w-search>
    </div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import bgImage from '../common/bgImage';
import wSearch from '../../components/pc/search'
export default {
  components: {
    swiper,
    swiperSlide,
    bgImage,
    wSearch
  },
  props:['searchInput'],
  data() {
    return {
      restaurants: [],
      state1: '',
      state2: '',
      items: [],
      afterRequest: false,
      swiperOption: Object.freeze({
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        simulateTouch: false,
        autoplay: {
          delay: 2000,
          disableOnInteraction: false
        }
      })
    };
  },
  created() {
    let banner_list = localStorage.getItem("banner_list");
    if (banner_list){
      this.afterRequest = true;
      this.items = JSON.parse(banner_list);
    }
    this.axios.get(`api/web/v1/banners?lang_id=${this.lang_id}`).then(res => {
      this.items = res.data.data.items;
      localStorage.setItem("banner_list", JSON.stringify(this.items));
    });
  },
  mounted() {
    this.restaurants = this.loadAll();
  },
  methods: {
    //推薦熱標籤
    querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      loadAll() {
        return [

        ];
      },
       handleSelect(item) {
        console.log(item);
      },
    // 跳轉詳情頁
    hrefDetail(id) {
      if (id) {
        this.$router.push({ path: "/Detail", query: { id: id } });
      }
    },
    //跳轉
    hrefGo(href) {
      window.location.href = href;
    },
  },
};
</script>

<style scoped>
.banner-item {
  overflow: hidden;
  z-index: 3;
}
.pc .banner {
  min-width: 1200px;
  margin: 0 auto;
}
.pc .banner-box,
.pc .banner-item{
  height: 500px;
  position: relative;
}
.pc .banner-item.cursor{
  cursor: pointer;
}
.defaultImg{
  height: 100%;
  background-size: contain;
  background-color: #efefef;
}
</style>
