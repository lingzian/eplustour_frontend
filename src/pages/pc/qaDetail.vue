<template>
    <div class="qa col-width">
        <!-- 麵包屑 -->
        <div class="amount-nav-search">
            <el-breadcrumb separator="//">
                <el-breadcrumb-item :to="{ path: '/' }">{{$t('footer.home')}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{$t('head.qa')}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="qa-content">
            <div class="title">{{result.question}}</div>
            <div class="answer" v-html="result.answer"></div>
        </div>
    </div>
</template>

<script>
import { messageTips } from '../../assets/js/utils'
export default {
    data(){
        return {
            result : new Object()
        }
    },
    created(){
        this.requestDetail();
    },
    methods:{
        requestDetail(){
            this.axios.get(`api/web/v1/questions/${this.$route.query.id}`,{
                params : {
                    lang_id : this.lang_id
                }
            }).then(res => {
                if(res.data.code != '1000'){
                    messageTips(res.data.message,'error');
                    return false;
                }
                this.result = Object.freeze(res.data.data);
            });
        }
    }
}
</script>

<style scoped>
.qa{
    padding: 25px 0;
}
.qa-content{
    margin-top: 35px;
    min-height: 450px;
}
.qa-content .title{
    font-size: 30px;
    color: #000;
}
.qa-content .answer{
    margin-top: 20px;
    line-height: 28px;
    overflow: hidden;
}
</style>