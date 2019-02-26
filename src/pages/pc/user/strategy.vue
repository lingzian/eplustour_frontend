<template>
    <div class="cl">
        <!-- 圖表 -->
        <div class="strategy_table">
          <div class="nothing" v-if="!items.team_list || items.team_list.length == 0">{{$t('head.nothing')}}</div>
          <el-scrollbar view-style="max-height: 480px;">
            <ul class="head">
                <li v-if="items.team_list" v-for="(item,index) in items.team_list" :key="index" class="cl">
                    <div class="item-head">
                        <img v-if="index == 0" class="item-head-rank" src="../../../assets/images/strategy1.png" alt="">
                        <img v-if="index == 1" class="item-head-rank" src="../../../assets/images/strategy2.png" alt="">
                        <img v-if="index == 2" class="item-head-rank" src="../../../assets/images/strategy3.png" alt="">
                        <head-image class="item-head-box" :thumb="item.thumb"></head-image>
                        <div class="item-head-name">{{item.username}}</div>
                    </div>
                    <div class="item-line">

                        <div class="item-score-line" :style="'width:'+setPercent(item.ePoint,items.current_ePoint)+'%'">
                            <div class="item-score-number">
                                <img class="item-score-number-icon" src="../../../assets/images/strategy-points.png" alt="">
                                <img class="item-score-number-arrow" src="../../../assets/images/score-arrow.png" alt="">
                                <span>{{item.ePoint}}</span>
                            </div>
                            <div class="item-score-line-radius" :style="'background-position-x:'+setPercent(item.ePoint,items.current_ePoint)+'%'"></div>
                        </div>

                        <div class="item-score-line other" :style="'width:'+setPercent(item.other_ePoint,items.current_ePoint)+'%'">
                            <div class="item-score-number">
                                <img class="item-score-number-icon" src="../../../assets/images/strategy-points.png" alt="">
                                <img class="item-score-number-arrow" src="../../../assets/images/score-arrow.png" alt="">
                                <span>{{item.other_ePoint}}</span>
                            </div>
                            <div class="item-score-line-radius" :style="'background-position-x:'+setPercent(item.other_ePoint,items.current_ePoint)+'%'"></div>
                        </div>

                    </div>
                </li>
            </ul>
          </el-scrollbar>
        </div>
        <!-- 信息 -->
        <div class="strategy_info">
            <!-- 日期 -->
            <div class="strategy_date info_model">
                <div class="title">{{$t('user.selectTime')}}</div>
                <el-date-picker
                    v-model="time"
                    type="month"
                    :picker-options="dateOptions"
                    :clearable="false"
                    :editable="false"
                    :placeholder="$t('user.choose')"
                    @change="change">
                </el-date-picker>
            </div>
            <!-- 分紅金額 -->
            <div class="strategy_price info_model">
                <div class="title">{{$t('user.amountBonus')}}</div>
                <div class="price" v-if="items.personal && items.personal.eDollar !='0'">{{$t('money')}}<span>{{Number(items.personal.eDollar).toFixed(2)}}</span></div>
                <div class="price" v-else>{{$t('money')}}<span>0</span></div>
            </div>
            <!-- 该月总积分 -->
            <div class="strategy_price info_model">
                <div class="title">{{$t('user.currentTotalIntegral')}}</div>
                <div class="price" v-if="items.current_ePoint"><span>{{Number(items.current_ePoint).toFixed(2)}}</span></div>
                <div class="price" v-else><span>0</span></div>
            </div>
            <!-- 分紅大佬title -->
            <div class="strategy_title">
                <img src="../../../assets/images/strategy-title.png" alt="">
                <span>{{items.current_title}}</span>
            </div>
            <!-- 總積分 -->
            <div class="strategy_score">
                <div>
                    <div class="score_number" v-if="items.personal">{{items.personal.ePoint}}</div>
                    <div class="score_number" v-else>0</div>
                    <div class="score_name">{{$t('user.totalIntegral')}}</div>
                </div>
            </div>
            <!-- 距離升級 -->
            <!-- <div class="level_up">距離升級還需<span>355</span>積分</div> -->
        </div>
    </div>
</template>

<script>
import headImage from "../../../components/common/headImage";
import { messageTips,getLastMonth } from '../../../assets/js/utils';
export default {
    components:{
        headImage
    },
    data(){
        return {
            dateOptions: {
                disabledDate(date){
                    let oldDate = getLastMonth().getTime();
                    if(date.getTime() > oldDate){
                        return true;
                    }else{
                        return false;
                    }
                }
            },
            time : '',
            items: new Object(),
        }
    },
    created(){
        this.time = getLastMonth();
        this.requestData();
    },
    methods: {
        change(e){
            this.requestData();
        },
        setPercent(score,total){
            var score = parseInt(score);
            var total = parseInt(total);
            if(score == 0 && total == 0) return 0;
            return score/total * 100;
        },
        requestData(){
            let year = this.time.getFullYear();
            let month = this.time.getMonth() + 1;
            this.axios.get('api/web/v1/integrals/team',{
                params : {
                    lang_id: this.lang_id,
                    year : year,
                    month : month
                }
            }).then(res => {
                if(res.data.code != '1000'){
                    messageTips(res.data.message);
                    return false;
                }
                this.items = res.data.data;
            });
        },
    }
}
</script>

<style scoped>
.head{
    padding: 0px 10px;
}
.head li{
    width: 100%;
    height: 125px;
    overflow: hidden;
}
.head li>div{
    height: 100%;
    position: relative;
}
.head li>div:first-of-type{
    float: left;
    width: 140px;
    text-align: center;
    padding-top: 40px;
}
.head li>div:last-of-type{
    float: left;
    width: 500px;
    margin-left: 10px;
}
.head li .item-head-box{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    margin: 0 auto;
    position: relative;
    z-index: 2;
}
.head li .item-head-name{
    color: #fff;
    margin-top: 10px;
}
.head li .item-head-rank{
    position: absolute;
    width: 40px;
    top: 21px;
    left:50%;
    transform: translate(-50%,0);
    z-index: 1;
}
.head li .item-score-line{
    height: 6px;
    background-color: #ccc;
    position: absolute;
    top: 40%;
    left: 0;
    transform: translate(0,-50%);
    background-image: url(../../../assets/images/gradient-bg.png);
    background-repeat: repeat-y;
    background-size: contain;
    position: relative;
    border-radius: 10px;
    transition: all .15s;
}
.head li .item-score-line.other{
    top: 60%;
}
.head li .item-score-line.other,
.head li .item-score-line.other .item-score-line-radius{
    background-image: none;
    background-color: #08ffe5;
}
.head li .item-score-line .item-score-line-radius{
    position: absolute;
    top: 50%;
    right: 0;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    transform: translate(50%,-50%);
    background-image: url(../../../assets/images/gradient-bg.png);
    background-repeat: repeat-y;
    background-position-y: center;
}
.head li .item-score-line .item-score-number{
    background-color: #32485c;
    display: inline-block;
    color: #fff;
    position: absolute;
    padding: 6px 10px 4px 10px;
    border-radius: 6px;
    right: 0;
    top: 0;
    transform: translate(140%,-45%);
    line-height: 10px;
    white-space:nowrap;
}
.head li .item-score-line .item-score-number img.item-score-number-icon{
    width: 10px;
    margin-bottom: 2px;
}
.head li .item-score-line .item-score-number img.item-score-number-arrow{
    position: absolute;
    width: 15px;
    top: 50%;
    left: 0px;
    transform: translate(-70%,-45%) rotate(90deg);
}


.strategy_table{
    width: 825px;
    height: 490px;
    float: left;
    background-image: url(../../../assets/images/pc-strategy-bg.png);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    position: relative;
}
.strategy_table .nothing{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    color: #fff;
    font-size: 20px;
}
.strategy_info{
    float: left;
    width: 375px;
    padding-left: 50px;
}
.strategy_info>div{
    margin-bottom: 40px;
}
.strategy_info>div:last-of-type{
    margin-bottom: 0;
}
.strategy_info>div.strategy_date,
.strategy_info>div.strategy_price{
    border-left: 4px solid #2d9aff;
    height: 65px;
    padding-left: 18px;
}
.strategy_info>div.info_model .title{
    margin-bottom: 4px;
}
.strategy_info>div.info_model .price{
    color: #f00;
    font-size: 16px;
    padding-top: 8px;
}
.strategy_info>div.info_model .price span{
    font-size: 30px;
}
.strategy_info>div.strategy_title{
    position: relative;
}
.strategy_info>div.strategy_title span{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    font-weight: bold;
    color: #666;
    font-size: 22px;
    white-space : nowrap;
}
.strategy_info>div.strategy_score{
    height: 140px;
    background-image: url(../../../assets/images/strategy-star.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    position: relative;
    text-align: center;
    color: #2d9aff;
    margin-bottom: 0;
}
.strategy_info>div.strategy_score>div{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
.strategy_info>div.strategy_score .score_number{
    padding-left: 20px;
    background-image: url(../../../assets/images/13_11.png);
    background-repeat: no-repeat;
    background-position: left center;
    font-size: 38px;
    white-space:nowrap;
}
.strategy_info>div.strategy_score .score_name{
    margin-top: 10px;
    font-size: 20px;
}
.strategy_info>div.level_up{
    text-align: center;
    margin-top: 10px;
}
.strategy_info>div.level_up span{
    color: orange;
    padding: 0 6px;
}
</style>
