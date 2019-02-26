<template>
    <transition name="fade">
        <div v-if="isShow" class="atlas">
          <div class="close-btn" @click="$emit('closeAtlas')"><i class="el-icon-circle-close-outline"></i></div>
          <swiper :options="swiperOptions" ref="atlasSwiper" class="swiper">
            <swiper-slide v-for="(item,index) in thumb" :key="index" class="atlas-slide">
              <div class="atlas-slide-item" :style="`height:${height}px;line-height:${height}px;`">
                  <img :src="encodeURI(item)" alt="">
              </div>
            </swiper-slide>
          </swiper>
        </div>
    </transition>
</template>

<script>
import { getRect } from '../../assets/js/utils';
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
    props: ['isShow','thumb','activeIndex'],
    components: {
        swiper,
        swiperSlide
    },
    data(){
        return {
            swiperOptions : {
                initialSlide : this.activeIndex,
                zoom : true,
            },
            height : document.documentElement.clientHeight || document.body.clientHeight
        }
    },
    watch: {
        isShow(){
            this.swiperOptions.initialSlide = this.activeIndex;
        }
    }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .15s;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
.atlas{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    background-color: #000;
}
.close-btn{
    position: absolute;
    top: .5rem;
    left: .5rem;
    z-index: 2;
}
.close-btn i{
    color: #fff;
    font-size: .8rem;
}
</style>