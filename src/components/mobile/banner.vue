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
        </swiper>
    </div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import bgImage from '../common/bgImage';
export default {
  components: {
    swiper,
    swiperSlide,
    bgImage
  },
  data() {
    return {
      items: [],
      afterRequest: false,
      swiperOption: Object.freeze({
        pagination: {
          el: ".swiper-pagination"
        },
        autoplay : {
          delay : 2000,
          disableOnInteraction : false
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
  methods: {
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
  }
};
</script>

<style scoped>
.banner-item {
  overflow: hidden;
}
.mobile .banner-box,
.mobile .banner{
  width: 100%;
  height: 4.8rem;
}
.mobile .banner-item{
  height: 4.8rem;
}
.defaultImg{
  height: 100%;
}
</style>