<template>
    <transition name="fade">
        <div class="index-list">
            <div class="index-list-box">
                <div @click="$emit('closeSelect')"><i class="el-icon-arrow-left"></i></div>
                <div class="index-list-box-title">{{$t('user.nationality')}}</div>
            </div>
            <div class="index-list-content" id="nationalSelecter">
                <ul class="list">
                    <li v-for="(item,index) in nationaOptions" :key="index">
                        <div class="title" :id="item[0].letter+'title'">{{item[0].letter}}</div>
                        <ul>
                            <li v-for="(i,idx) in item" :key="idx" class="index-list-item">
                                <div @click="$emit('afterSelect',i)">{{i.nationality_desc_name}}</div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <ul class="menu">
                <li v-for="(item,index) in nationaOptions" :key="index" :style="`height:${100/nationaOptions.length}%;`" @click="selectMenu(index,item[0].letter)">
                    <div class="center">{{item[0].letter}}</div>
                </li>
            </ul>
        </div>
    </transition>
</template>

<script>
import { messageTips } from '../../assets/js/utils'
export default {
    props : ['nationaOptions'],
    data(){
        return {
            box : null,
        }
    },
    methods: {
        selectMenu(index,title){
            var box;
            if(this.box == null) this.box = document.getElementById('nationalSelecter');
            box = this.box;
            box.scrollTo(0,document.getElementById(title+'title').offsetTop);
            messageTips(title);
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
.index-list{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    background-color: #fff;
}
.index-list-item{
    background-color: #fff;
    border-bottom: .026667rem solid #eee;
    padding: .266667rem .5rem;
}
.index-list-item>div{
    width: 90%;
}
.title{
    padding: .266667rem .3rem;
    border-bottom: .026667rem solid #eee;
    font-weight: bold;
    background-color: #efefef;
    color: #000;
}
/*内容*/
.index-list-content{
    position: absolute;
    top: 1.066667rem;
    left: 0;
    width: 94%;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: auto;
}
/*头部*/
.index-list-box{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 1.066667rem;
    line-height: 1.066667rem;
    z-index: 2;
    background-color: #fff;
    box-shadow: 0px 1px .05rem 0px #ccc;
}
.index-list-box>div:first-of-type{
    height: 100%;
    vertical-align: middle;
    width: 1.066667rem;
    text-align: center;
    font-size: .533333rem;
}
.index-list-box>div:last-of-type{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    font-size: .4rem;
}
.menu{
    position: absolute;
    top: 1.066667rem;
    right: 0;
    width: 6%;
    bottom: 0;
    border-left: .04rem solid #efefef;
    text-align: center;
    z-index: 3;
    padding-bottom: 1rem;
    padding-top: .5rem;
}
.menu li{
    position: relative;
}
</style>