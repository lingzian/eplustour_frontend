<template>
    <div>
        <div class="strategy_head">
            <div v-if="items.personal">{{$t('user.amountBonus')}}({{$t('money') +  items.personal.eDollar}})</div>
            <div v-else>{{$t('user.amountBonus')}}(0)</div>
            <div @click="change">
                <span>{{`${year}-${month}`}}</span>
                <span class="change">切換</span>
            </div>
        </div>
        <div class="content">
            <!-- 頭像 -->
            <ul class="head">
                <div class="nothing" v-if="!items.team_list || items.team_list.length == 0">{{$t('head.nothing')}}</div>
                <li v-if="items.team_list" v-for="(item,index) in items.team_list" :key="index" class="cl">
                    <div class="item-head">
                        <img v-if="index == 0" class="item-head-rank" src="../../assets/images/strategy1.png" alt="">
                        <img v-if="index == 1" class="item-head-rank" src="../../assets/images/strategy2.png" alt="">
                        <img v-if="index == 2" class="item-head-rank" src="../../assets/images/strategy3.png" alt="">
                        <head-image class="item-head-box" :thumb="item.thumb"></head-image>
                        <div class="item-head-name">{{item.username}}</div>
                    </div>
                    <div class="item-line">

                        <div class="item-score-line" :style="'width:'+setPercent(item.ePoint,items.current_ePoint)+'%'">
                            <div class="item-score-number">
                                <img class="item-score-number-icon" src="../../assets/images/strategy-points.png" alt="">
                                <img class="item-score-number-arrow" src="../../assets/images/score-arrow.png" alt="">
                                <span>{{item.ePoint}}</span>
                            </div>
                            <div class="item-score-line-radius" :style="'background-position-x:'+setPercent(item.ePoint,items.current_ePoint)+'%'"></div>
                        </div>

                        <div class="item-score-line other" :style="'width:'+setPercent(item.other_ePoint,items.current_ePoint)+'%'">
                            <div class="item-score-number">
                                <img class="item-score-number-icon" src="../../assets/images/strategy-points.png" alt="">
                                <img class="item-score-number-arrow" src="../../assets/images/score-arrow.png" alt="">
                                <span>{{item.other_ePoint}}</span>
                            </div>
                            <div class="item-score-line-radius" :style="'background-position-x:'+setPercent(item.other_ePoint,items.current_ePoint)+'%'"></div>
                        </div>

                    </div>
                </li>
            </ul>
            <div class="title">
                <img class="radius" src="../../assets/images/strategy-radius.png" alt="">
                <img class="strategy-title" src="../../assets/images/strategy-title.png" alt="">
                <span class="strategy-name">{{items.current_title}}</span>
            </div>
            <div class="current_total_ePoint">
                <span class="current_total_ePoint_title">{{$t('user.currentTotalIntegral')}}：</span>
                <span class="current_total_ePoint_title_price" v-if="items.current_ePoint"><span>{{Number(items.current_ePoint).toFixed(2)}}</span></span>
                <span class="current_total_ePoint_title_price" v-else>0</span>
            </div>
            <div class="score">
                <div>
                    <div class="score-number" v-if="items.personal">{{items.personal.ePoint}}</div>
                    <div class="score-number" v-else>0</div>
                    <div class="score-name">{{$t('user.totalIntegral')}}</div>
                </div>
            </div>
        </div>
        <mt-datetime-picker
            class="noDate"
            ref="datePicker"
            v-model="date"
            type="date"
            :endDate="getLastMonth()"
            :year-format="'{value} '+$t('dateFormat.year')"
            :month-format="'{value} '+$t('dateFormat.month')"
            :date-format="'{value} '+$t('dateFormat.date')"
            :cancelText="$t('head.cancel')"
            :confirmText="$t('head.sure')"
            @confirm="dateSelect">
        </mt-datetime-picker>
    </div>
</template>

<script>
import { messageTips,getLastMonth } from '../../assets/js/utils'
import headImage from "../../components/common/headImage";
export default {
    components:{
        headImage
    },
    data(){
        return {
            items: new Object(),
            date : getLastMonth(),
            year : '',
            month : '',
        }
    },
    created(){
        this.dateSelect(this.date);
    },
    methods: {
        getLastMonth : getLastMonth,
        change(){
            this.$refs.datePicker.open();
        },
        dateSelect(res){
            let year = res.getFullYear();
            let month = res.getMonth() + 1;
            month = month < 10 ? '0' + month : month;
            this.year = year;
            this.month = month;
            this.requestData();
        },
        setPercent(score,total){
            var score = parseInt(score);
            var total = parseInt(total);
            if(score == 0 && total == 0) return 0;
            return score/total * 100;
        },
        requestData(){
            this.axios.get('api/web/v1/integrals/team',{
                params : {
                    lang_id: this.lang_id,
                    year : this.year,
                    month : parseInt(this.month)
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
.content{
    background-image: url(../../assets/images/strategy-bg.png);
    background-repeat: repeat-y;
    background-position: top center;
    background-size: contain;
    height: 60vh;
    background-color: #2d9aff;
}
.head{
    padding: 0 .48rem;
    height: 52.5vh;
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
}
.head li{
    height: 2.25rem;
}
.head li>div{
    height: 100%;
    position: relative;
}
.head li>div:first-of-type{
    float: left;
    width: 1.5rem;
    text-align: center;
    padding-top: .55rem;
}
.head li>div:last-of-type{
    float: right;
    width: 7.47rem;
    padding-right: 1rem;
}
.head li .item-head-box{
    width: .9rem;
    height: .9rem;
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
    margin-top: .06rem;
}
.head li .item-head-rank{
    position: absolute;
    width: .9rem;
    top: .14rem;
    left: 50%;
    transform: translate(-50%,0);
    z-index: 1;
}
.head li .item-score-line{
    height: .12rem;
    background-color: #ccc;
    position: absolute;
    top: 35%;
    left: 0;
    transform: translate(0,-50%);
    background-image: url(../../assets/images/gradient-bg.png);
    background-repeat: repeat-y;
    background-size: contain;
    position: relative;
    border-radius: .2rem;
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
    width: .32rem;
    height: .32rem;
    border-radius: 50%;
    transform: translate(80%,-50%);
    background-image: url(../../assets/images/gradient-bg.png);
    background-repeat: repeat-y;
    background-position-y: center;
}
.head li .item-score-line .item-score-number{
    background-color: #32485c;
    display: inline-block;
    color: #fff;
    position: absolute;
    padding: 0 .1rem;
    border-radius: .106667rem;
    right: 0;
    top: 0;
    transform: translate(160%,-45%);
    line-height: .54rem;
    white-space:nowrap;
}
.head li .item-score-line .item-score-number img.item-score-number-icon{
    width: .26rem;
    margin-top: -0.053333rem;
}
.head li .item-score-line .item-score-number img.item-score-number-arrow{
    position: absolute;
    width: .32rem;
    top: 50%;
    left: 0;
    transform: translate(-70%,-45%) rotate(90deg);
}
.title{
    position: relative;
}
span.strategy-name,
img.strategy-title{
    position: absolute;
    top: 1.093333rem;
    left: 50%;
    transform: translate(-50%,0);
}
img.strategy-title{
    width: 6.133333rem;
}
span.strategy-name{
    line-height: 1rem;
    color: #000;
    font-size: .426667rem;
    padding-left: 7%;
}
.score{
    height: 1.733333rem;
    background-image: url(../../assets/images/strategy-star.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    position: relative;
    color: #2d9aff;
    text-align: center;
}
.score>div{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
.score .score-number{
    font-size: .8rem;
    background-image: url(../../assets/images/13_11.png);
    background-repeat: no-repeat;
    background-position: left center;
    background-size: .4rem;
    padding-left: .43rem;
}
.score .score-name{
    font-size: .5rem;
    margin-top: .266667rem;
}
.nothing{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    font-size: .4rem;
    color: #fff;
}

.strategy_head{
    background-color: #2d9aff;
    margin-top: 1.333333rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 1.2rem;
    color: #fff;
    font-size: .35rem;
    padding: 0 .5rem;
}
.strategy_head .change{
    color: #ccc;
    border-bottom: 0.03rem solid #ccc;
}

.current_total_ePoint{
    text-align: center;
    position: relative;
    top: -0.5rem;
    color: #2d9aff;
    font-size: .4rem;
}
</style>