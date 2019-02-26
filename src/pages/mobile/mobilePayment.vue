<template>
    <div></div>
</template>

<script>
import { Indicator } from 'mint-ui';
import { payment } from '../../assets/js/api';
export default {
    data(){
        return {
            token : this.$route.query.token || '',
            pay_id : this.$route.query.pay_id || '',
            type : this.$route.query.type || '',
            device : 'appMobile',
            e_dollar : this.$route.query.e_dollar || '',
        }
    },
    created(){
        Indicator.open();
        payment(this.pay_id,this.type,this.device,this.e_dollar,this.token);
    },
    destroyed(){
        Indicator.close();
    },
}
</script>