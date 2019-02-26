<template>
    <div v-if="itemArr.length != 0" id="elevatorBox" :class="{elevatorBoxFix: noOverScroll, elevatorBoxMar: isOverScroll, elevatorBoxAb: commomScroll}">
        <ul>
            <li v-for="(ele, idx) in itemArr" :key="idx" :class="{active: idx == activeIdx}" @click="jumpScroll(idx)"><span>{{ele.name}}</span></li>
        </ul>
    </div>
</template>
<script>
import {getPositionTop,getScroll,addEvent,removeEvent,getRect,back_topTop} from '../../assets/js/utils.js'
export default {
    props: {
        //电梯数组
        itemArr: {
            type: [Array, Object],
            default: () =>{
                return [

            ]
        }
    },
},
    data () {
        return {
            activeIdx: '0',//第一层（第几层亮）
            offsetTopArr: [],//节点offsetTop数组
            windowHeight: '',//窗口高度
            isOverScroll: false,//是否超过
            noOverScroll: false,//没有超过
            commomScroll: true,//正常没有进入旅游
            eleOffsetTop: '',//电梯off
            tripBoxHeight: '',//最大盒子高度
            tripBoxOffsetTop: '',//最大盒子off
            eleHeight: '',//电梯高度
        }
    },
    methods :{
        getPositionTop: getPositionTop,
        stratScroll () {//开始滚动监听
            addEvent(window, 'scroll.Elevator', this.scrollMethod);
        },
        scrollMethod () {//监听函数
            let documentScroll = getScroll().top;
            this.itemArr.forEach((element, index) => {
                if(documentScroll >= (this.offsetTopArr[index] - this.windowHeight / 2)) {
                    this.activeIdx = index;
                }
            });
            if(this.eleOffsetTop + 60 <= documentScroll < this.tripBoxOffsetTop + this.tripBoxHeight - this.eleHeight*2){
                this.noOverScroll = true;
                this.isOverScroll = false;
                this.commomScroll = false;
            }
            if(documentScroll >= this.tripBoxOffsetTop + this.tripBoxHeight - this.eleHeight*2){
                this.commomScroll = false;
                this.noOverScroll = false;
                this.isOverScroll = true;
            }
            if(documentScroll < this.eleOffsetTop + 60){
                this.commomScroll = true;
                this.noOverScroll = false;
                this.isOverScroll = false;
            }
        },
        getOffsettop () {//获取对应数据回来的节点offsetTop
              this.$nextTick(()=>{
                for(let i =0; i<this.itemArr.length; i++){
                      let ele = document.querySelector('#first'+`${i+1}`);
                      let itemBox = getPositionTop(ele);
                      this.offsetTopArr.push(itemBox);
                  }
              })
        },
        endView () {//电梯到旅游区时
            let elevatorDom = document.querySelector('#elevatorBox');
            let tripBoxDom = document.querySelector('.tripBox');
            this.eleHeight =  getRect(elevatorDom).height;
            this.tripBoxHeight = getRect(tripBoxDom).height;
            this.eleOffsetTop = getPositionTop(elevatorDom);
            this.tripBoxOffsetTop = getPositionTop(tripBoxDom);
            let style = document.createElement('style');
            style.id = "appendStyle";
            style.innerHTML = '.elevatorBoxFix{position: fixed; top:0%; right: 50%; margin-right:655px}'+'.elevatorBoxMar{position: absolute;margin-top: '+(this.tripBoxHeight - this.eleHeight *2)+'px;right: 50%; margin-right:655px}'+'.elevatorBoxAb{position:absolute;right: 50%; margin-right:655px;margin-top:60px;}';
            document.getElementsByTagName('head')[0].appendChild(style);
        },
        onResize () {//窗口改变是重改窗口高度值
            this.windowHeight = window.innerHeight;
            addEvent(window, 'onresize.Elevator', () => {
                this.windowHeight = window.innerHeight;
            })
        },
        jumpScroll (idx) {//点击电梯跳转scrollTop
            let scroll =  this.offsetTopArr[idx];
            // window.scrollTo(0,scroll);
            back_topTop(scroll,30);
        }
    },
    created () {
        this.onResize();//改变窗口大小做出处理
    },
    mounted () {
        this.endView();//進入旅游項目
        this.stratScroll();//开始执行
    },
    destroyed () {//銷毀監控
        removeEvent(window, 'scroll.Elevator');
        removeEvent(window, 'onresize.Elevator');
    },
}
</script>
<style scoped>
    #elevatorBox{
        width: 70px;
        background: white;
        z-index: 100;

    }
    #elevatorBox ul{
        width: 100%;
        height: 100%;
        border: 2px solid #f5f5f5;
    }
    #elevatorBox ul li{
        width: 100%;
        min-height: 50px;
        padding: 3px;
        border-bottom: 2px solid #f5f5f5;
        text-align: center;
        font-size: 14px;
        cursor: pointer;
        position: relative;
    }
    #elevatorBox ul li span {
        width: 100%;
        left: 50%;
        top: 50%;
        position: absolute;
        transform: translate(-50%,-50%);
    }
    #elevatorBox ul li:last-child{
        border-bottom: none;
    }
    .active{
        background: #2d9aff;
        color: white;
    }
</style>
