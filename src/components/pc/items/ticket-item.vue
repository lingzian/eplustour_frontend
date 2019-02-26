<template>
    <div class="item cl">
        <bg-image class="bg" :thumb="itemData.thumb"></bg-image>
        <div>
            <div class="item-title">{{itemData.ticket_name}}  ({{itemData.ticket_type_name}})</div>
            <div class="item-content">{{itemData.ticket_description}}</div>
            <div class="cl">
                <div>
                    <span>{{$t('detail.price')}} : </span>
                    <span class="money"> <span class="orderPrice">{{$t('money')}}</span>{{itemData.price}}</span>
                </div>
                <div>
                    <span>{{$t('info.number')}} : </span>
                    <span>{{itemData.quantity}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import bgImage from "../../common/bgImage";
export default {
  components: {
    bgImage
  },
  props: ["itemData"]
};
</script>

<style scoped>
.orderPrice{
  font-size: 13px;
}
.item>div{
    float: left;
}
.item>div:first-of-type{
    width: 130px;
    height: 130px;
    border-radius: 10px;
}
.item>div:last-of-type{
    width: 1020px;
    margin-left: 20px;
}
.item>div:last-of-type>div:last-of-type{
    height: 40px;
    line-height: 40px;
}
.item>div:last-of-type>div:last-of-type>div:first-of-type{
    float: left;
}
.item>div:last-of-type>div:last-of-type>div:last-of-type{
    float: right;
}
.item .item-title{
    color: #000;
    line-height: 20px;
}
.item .item-content{
    font-size: 14px;
    line-height: 20px;
    margin-top: 7px;
    margin-bottom: 4px;
    color: #888;
}
.item .money{
    color: #f00;
}
</style>
