<template>
    <div class="trip-detail" :class="{'border':hasBorder}">
        <div class="content-title name cl">
            <div>{{items.district_name}}</div>
            <div>
                <span v-if="$route.name == 'OrderDetail'">{{formatStatus(items.order_status,items.is_evaluation)}}</span>
            </div>
        </div>
        <div class="content-title">{{items.journey_name}}</div>
        <div class="trip-detail-box cl">
            <!-- 我的行程 -->
            <div class="my-trip">
                <div class="title">{{$t('head.trip')}}</div>
                <div class="content">
                    <div>
                        <div>{{ itemsDetail.total_day == undefined ? ' ' : itemsDetail.total_day + $t('buy.day')}}</div>
                        <div class="cl">
                            <div>{{$t('detail.meetingPoint')}}</div>
                            <div class="meetingPoint">{{itemsDetail.meeting_place}}</div>
                        </div>
                    </div>
                    <div>
                        <div class="cl">
                            <div>{{$t('buy.numberOfTravellers')}}</div>
                            <div class="numberOfTravellers">{{numberTravelTotal || ''}}</div>
                        </div>
                        <div v-if="$route.name != 'Buy'" class="people">
                            <span>{{$t('buy.adult')}}*{{items.adult}}</span>
                            <span>{{$t('buy.child')}}*{{items.child}}</span>
                        </div>
                    </div>
                </div>
                <div class="my-trip-bottom cl bg">
                    <div>{{$t('buy.totalPrice')}}</div>
                    <div class="totalPrice" v-if="totalPrice">USD${{ totalPrice }}</div>
                    <div class="totalPrice" v-else></div>
                </div>
            </div>
            <!-- 出发日期 -->
            <div class="departure-date">
                <div class="title">{{$t('detail.departureTime')}}</div>
                <div class="content">
                    <div>{{formatTimeStamp(timeStamp)}}</div>
                    <div class="change" v-if="$route.name == 'Buy'">
                        <span @click="$router.push({path:'/Detail',query:{id:items.journey_id}})">{{$t('buy.changeDate')}}</span>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import { formatDate,formatStatus,formatDateEn } from '../../assets/js/utils'
export default {
    props : ['items','itemsDetail','timeStamp','totalPrice','numberTravelTotal','hasBorder'],
    methods : {
        formatStatus : formatStatus,
        formatTimeStamp(time){
            if(this.lang_id != 3){
                return formatDate(time,false);
            }else{
                return formatDateEn(time);
            }
        },
    },
}
</script>

<style scoped>
.trip-detail{
    margin-bottom: 30px;
    padding: 20px;
}
.trip-detail.border{
    border: 1px solid #2d9aff;
}
.trip-detail .content-title{
    font-size: 18px;
    font-weight: bold;
    color: #000;
    line-height: 23px;
}
.trip-detail .content-title.name{
    color: #2d9aff;
    margin-bottom: 15px;
}
.trip-detail .content-title.name>div:first-of-type{
    float: left;
    word-break: break-all;
    width: 1000px;
}
.trip-detail .content-title.name>div:last-of-type{
    float: right;
    color: #000;
    font-weight: bold;
}
.trip-detail .trip-detail-box{
    margin-top: 15px;
}
.trip-detail .trip-detail-box>div{
    border: 1px solid #eee;
    float: left;
    margin-right: 20px;
}
.trip-detail .trip-detail-box>div.my-trip{
    width: 360px;
}
.trip-detail .trip-detail-box>div.my-trip .content>div{
    border-bottom: 1px solid #eee;
    padding: 15px 0;
}
.trip-detail .trip-detail-box>div.my-trip .content>div:last-of-type{
    border-bottom: 0;
}
.trip-detail .trip-detail-box>div.my-trip .my-trip-bottom>div:first-of-type,
.trip-detail .trip-detail-box>div.my-trip .content .cl>div:first-of-type{
    float: left;
}
.trip-detail .trip-detail-box>div.my-trip .my-trip-bottom>div:last-of-type,
.trip-detail .trip-detail-box>div.my-trip .content .cl>div:last-of-type{
    float: right;
}
.trip-detail .trip-detail-box>div.departure-date .content>div,
.trip-detail .trip-detail-box>div.my-trip .content>div>div{
    margin-bottom: 15px;
}
.trip-detail .trip-detail-box>div.departure-date .content>div:last-of-type,
.trip-detail .trip-detail-box>div.my-trip .content>div:last-of-type>div,
.trip-detail .trip-detail-box>div.my-trip .content>div>div:last-of-type{
    margin-bottom: 0;
}
.trip-detail .trip-detail-box>div.my-trip .my-trip-bottom{
    height: 50px;
    line-height: 50px;
    color: #fff;
    font-weight: bold;
    background-image:url(../../assets/images/detail-bg.png);
}
.trip-detail .trip-detail-box>div.my-trip .numberOfTravellers,
.trip-detail .trip-detail-box>div.my-trip .meetingPoint{
    color: #000;
    font-weight: bold;
}
.trip-detail .trip-detail-box>div.my-trip .pricePerTraveller{
    color: #2d9aff;
}
.trip-detail .trip-detail-box>div.my-trip .pricePerTraveller-price{
    color: #f00;
    font-weight: bold;
}
.trip-detail .trip-detail-box>div.my-trip .totalPrice{
    font-size: 20px;
}
.trip-detail .trip-detail-box>div.departure-date{
    width: 275px;
}
.trip-detail .trip-detail-box>div.departure-date .content{
    padding-top: 15px;
    padding-bottom: 15px;
}
.trip-detail .trip-detail-box>div.departure-date .content .change span{
    color: #2d9aff;
    font-size: 14px;
    cursor: pointer;
    border-bottom: 1px solid #2d9aff;
}
.trip-detail .trip-detail-box>div>div{
    padding: 10px;
}
.trip-detail .trip-detail-box>div.my-trip .my-trip-bottom,
.trip-detail .trip-detail-box>div>div:nth-of-type(2){
    padding-top: 0;
    padding-bottom: 0;
}
.trip-detail .trip-detail-box>div .title{
    background-color: #2d9aff;
    font-size: 18px;
    color: #fff;
}
.people{
    color: #aaa;
    margin-top: 10px;
}
.people>span:first-of-type{
    padding-right: 20px;
    font-size: 14px;
}
.meetingPoint{
    max-width: 220px;
    line-height: 22px;
}
</style>