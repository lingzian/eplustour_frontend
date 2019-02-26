<template>
    <div>
        <div class="content center">
            <div class="logo"><img src="../../assets/images/1_02.png" alt=""></div>
            <div class="name">{{$t('eplus')}}</div>
            <div class="version">V1.0</div>
        </div>
    </div>
</template>

<script>
export default {
    mounted() {
        document.body.style.backgroundColor = "#f0eff5";
    },
    destroyed(){
        document.body.style.backgroundColor = "#fff";
    },
}
</script>

<style scoped>
.content{
    top: 40%;
    text-align: center;
}
.logo img{
    width: 3rem;
}
.name{
    margin-top: .333333rem;
    font-size: .4rem;
}
.version{
  font-size: .36rem;
  margin-top: .266667rem;
}
</style>