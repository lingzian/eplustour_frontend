<template>
    <div class="pc">
        <header-top ref="pc_header" v-if="showHeader" :headerData="headerData" @modelEvent="getModelEvent"></header-top>
        <router-view ref="pc" @setHeaderData="setHeaderData" @handleHeaderEvent="handleHeaderEvent"/>
        <footer-bottom></footer-bottom>
    </div>
</template>

<script>
/*
    頁面中可以使用 $emit('setHeaderData',data); 給頭部傳遞信息
                  $emit('handleHeaderEvent',eventName) 触发头部的函数
    頭部中可以使用 $emit('modelEvent',eventName); 來執行頁面中的方法
*/
import HeaderTop from '../components/pc/header';
import FooterBottom from '../components/pc/footer'
export default {
    components:{
        HeaderTop,
        FooterBottom
    },
    data(){
        return{
            showHeader : true,
            headerData : new Object()
        }
    },
    watch:{
        $route(){
            this.signHideHeader();
        }
    },
    created(){
        this.signHideHeader();
    },
    methods: {
        handleHeaderEvent(eventName){
            this.$refs.pc_header[eventName]();
        },
        setHeaderData(data){
            this.headerData = data;
        },
        getModelEvent(eventName,data){
            let fn = this.$refs.pc[eventName];
            if(typeof fn === 'function'){
                fn(data);
            }
        },
        signHideHeader(){
            let name = this.$route.name;
            if(name == 'SignUp' || name == 'SignIn' || name == 'Forgot' || name == 'PreviewDetail'){
                this.showHeader = false;
            }else{
                if(!this.showHeader) this.showHeader = true;
            }
        },
    }
}
</script>
<style>
@import url("../assets/css/pc.css");
@import url("../assets/iconFont/style.css");
</style>
