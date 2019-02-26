<template>
    <transition name="fade">
    <div class="box">
        <div class="inner-box center">
            <div class="bg">
                <div class="center">
                    <img src="../../assets/images/success-purchase.png" alt="">
                </div>
            </div>
            <div class="text title">{{$t('buy.purchaseSuccess')}}</div>
            <div class="text content">{{$t('buy.purchaseSuccessTips')}}</div>
            <router-link :to="{path:'/OrderDetail',query:{id:detailId}}" class="text btn">{{$t('buy.checkOrderbtn')}}</router-link>
        </div>
    </div>
    </transition>
</template>
<script>
export default {
  props: ["detailId"]
};
</script>

<style scoped>
.box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}
.inner-box {
  width: 800px;
  height: 400px;
  background-color: #fff;
  border-radius: 15px;
  overflow: hidden;
  text-align: center;
}
.inner-box .bg {
  height: 170px;
  background-color: #2d9aff;
  position: relative;
}
.inner-box .bg > div {
  width: 200px;
  height: 200px;
  line-height: 140px;
  text-align: center;
  border-radius: 50%;
  background-color: #fff;
  bottom: 0;
  overflow: hidden;
  top: 100%;
}
.inner-box .bg > div img {
  width: 80px;
}
.inner-box .text {
  position: relative;
  z-index: 1;
}
.inner-box .title {
  color: #000;
  font-size: 30px;
  padding: 24px 0;
}
.inner-box .content {
  font-size: 18px;
  color: #aaa;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  line-height: 24px;
  height: 72px;
  padding: 0 40px;
}
.inner-box .btn {
  margin-top: 18px;
  color: #fff;
  background-color: #2d9aff;
  display: inline-block;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  border-radius: 8px;
}
</style>