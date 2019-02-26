//吸顶导航
/*
    vue实例里面必须有一个obj
    obj = {
        minTop : 0, //吸顶导航的最小筏值
        maxTop : 0, //吸顶导航的最大筏值
        boxLeft : 0, //盒子的距离可视窗口左侧的距离
        isFixed : flase, //盒子是否fixed状态
        isBottom : flase, //盒子是否已经到底部状态
        flagHeight : 0, //盒子fixed状态距离顶部的距离
        boxWidth ： 0， //盒子的宽度
        boxId : 'aaa', //盒子的ID
        referenceBoxId: 'bbb', //参照物盒子的ID（左右参照物）
        styleId: 'aaa-style', //该吸顶实例的ID（必须是唯一的）
        right : 35, //盒子fixed状态位移（微调盒子的位置）
    }
    对象必须绑定 isFixed 跟 isBottom 两个class，根据obj里面的isFixed，isBottom相对应，如果是true则添加class，如果是flase，则移除class
    
    scrollBox
    第一个参数 vue的实例对象
    第二个参数是obj的对象名字（string类型）

    如果文档的高度变更了，必须调用resetScrollTopMenu方法，重新计算高度
    resetScrollTopMenu
    第一个参数 vue的实例对象
    第二个参数是obj的对象名字（string类型）

*/
import {getRect,addEvent,removeEvent,getScroll,getPositionTop} from './utils'
export default {
    // 重新設置吸頂的筏值
    resetScrollTopMenu : function(self,dataKey,bol,fn){
        var boxId = self[dataKey].boxId;
        var referenceBoxId = self[dataKey].referenceBoxId;
        var styleId = self[dataKey].styleId;
        var box = document.getElementById(boxId);
        var boxRes = getRect(box);
        var boxHeight = boxRes.height;
        var rightBox = document.getElementById(referenceBoxId);
        var rightBoxHeight = getRect(rightBox).height;
        self[dataKey].boxLeft = boxRes.left;
        if(bol){
            self[dataKey].minTop = getPositionTop(box) - self[dataKey].flagHeight + self[dataKey].minTopHeight - getPositionTop(document.getElementById('detail_content')); //设置最小高度
        }
        self[dataKey].maxTop = rightBoxHeight + self[dataKey].minTop - boxHeight - self[dataKey].maxTopHeightTop;
        var selecterStyle = document.getElementById(styleId);
        if(selecterStyle != null) selecterStyle.parentNode.removeChild(selecterStyle);
        var style = document.createElement('style');
        style.id=styleId;
        style.innerHTML = '#'+boxId+'.isBottom{padding-top:'+(rightBoxHeight - boxHeight - self[dataKey].maxTopHeight)+'px;}#'+boxId+'.isFixed{position: fixed;top: '+self[dataKey].flagHeight+'px;}';
        document.getElementsByTagName('head')[0].appendChild(style);
        this.recalculationScrollBox(self,box,self[dataKey],rightBox);
        fn&&fn();
    },
    //吸頂信息欄
    scrollBox : function(self,dataKey){
        var that = this;
        var box = document.getElementById(self[dataKey].boxId);
        var rightBox = document.getElementById(self[dataKey].referenceBoxId);
        var boxRes = getRect(box);
        self[dataKey].boxWidth = boxRes.width;
        //重新設置左側吸頂的筏值
        this.resetScrollTopMenu(self,dataKey,true,function(){
             //计算滚动条高度，改变状态
            that.recalculationScrollBox(self,box,self[dataKey],rightBox);
            addEvent(window,'scroll.scrollBox',function scrollFn(){
                that.recalculationScrollBox(self,box,self[dataKey],rightBox);
            });
            //监听浏览器的尺寸变换
            addEvent(window,'resize.scrollBox',function resizeFn(){
                self[dataKey].boxLeft = getRect(rightBox).left - boxRes.width - self[dataKey].right;
                box.style.left = self[dataKey].boxLeft + 'px';
            });
        });
    },
    // 解除事件
    removeEvent : function(){
        removeEvent(window,'scroll.scrollBox');
        removeEvent(window,'resize.scrollBox');
    },
    //重新計算吸頂盒子的位置
    recalculationScrollBox : function(self,box,data,rightBox){
        var scrollTop = getScroll().top;
        if(scrollTop < data.minTop){
            data.isFixed = false;
            data.isBottom = false;
        }else if(scrollTop >= data.minTop && scrollTop < data.maxTop){
            data.isFixed = true;
            data.isBottom = false;
            data.boxLeft = getRect(rightBox).left - data.boxWidth - data.right;
            box.style.left = data.boxLeft + 'px';
        }else if(scrollTop >= data.maxTop){
            data.isFixed = false;
            data.isBottom = true;
        }
    }
}