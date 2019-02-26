<template>
    <div class="content">
        <div>
            <img src="../../assets/images/checkout-success.png" alt="">
        </div>
        <div class="title">{{$t('buy.paySuccess')}}</div>
    </div>
</template>

<style scoped>
.content{
  background-color: #fff;
  margin: .266667rem 0 1.066667rem 0;
  text-align: center;
  padding: 1.066667rem 0;
  padding-top: 4rem;
}
.content img{
  width: 1.866667rem;
}
.content .title{
  color: #2d9aff;
  font-size: .6rem;
  margin-top: .4rem;
  font-weight: bold;
}
</style>
