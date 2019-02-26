<template>
    <div class="mobile">
        <header-top :headerData="headerData" @modelEvent="getModelEvent"></header-top>
        <router-view ref="mobile" @setHeaderData="setHeaderData"/>
        <footer-bottom></footer-bottom>
    </div>
</template>

<script>
/*
    頁面中可以使用 $emit('setHeaderData',data); 給頭部傳遞信息
    頭部中可以使用 $emit('modelEvent',eventName); 來執行頁面中的方法
*/
import HeaderTop from '../components/mobile/header';
import FooterBottom from '../components/mobile/footer';
export default {
    components:{
        HeaderTop,
        FooterBottom
    },
    data(){
        return {
            headerData: new Object()
        }
    },
    methods:{
        setHeaderData(data){
            this.headerData = data;
        },
        getModelEvent(eventName){
            let fn = this.$refs.mobile[eventName];
            if(typeof fn === 'function'){
                fn();
            }
        }
    },
}
</script>

<style>
@import url("../assets/css/mobile.css");
@import url("mint-ui/lib/style.css");
</style>