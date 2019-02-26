<template>
    <div class="traveler mb-padding-content">
        <div class="traveler_item" v-for="(item,index) in items" :key="index">
            <div>
                <div class="name">
                    <span>{{item.name}}</span>
                    <span class="age_type" v-if="item.age_name == '1'">({{$t('buy.adult')}})</span>
                    <span class="age_type" v-else>({{item.age_name == '3' ? $t('buy.baby') : $t('buy.child')}})</span>
                </div>
                <div class="card">
                    <span>{{item.certificate_type == '0' ? $t('user.idCard') : $t('user.passport')}}：</span>
                    <span>{{item.certificate_number}}</span>
                </div>
            </div>
            <div class="btns">
                <i class="el-icon-edit" @click="edit(item,index)"></i>
                <i class="el-icon-delete" @click="del(item,index)"></i>
            </div>
        </div>
        <div v-if="items.length == 0" class="no-result">{{$t('noResult')}}</div>
    </div>
</template>

<script>
import { messageTips } from '../../assets/js/utils'
import { MessageBox } from 'mint-ui'
export default {
    data(){
        return {
            items: new Object(),
        }
    },
    created(){
        this.requestList();
    },
    methods: {
        requestList(){
            this.axios.get('api/web/v1/passports',{
                params: {
                    lang_id : this.lang_id,
                }
            }).then(res => {
                if(res.data.code != '1000'){
                    messageTips(res.data.message);
                    return false;
                }
                this.items = res.data.data.items;
            });
        },
        edit(data,idx){
            let id = data.id;
            this.$router.push({
                path: '/TravelerInfo',
                query : {
                    id : id,
                }
            });
        },
        del(data,idx){
            let id = data.id;
            MessageBox({
                title: '',
                message: this.$t('user.deleteTravelerInformationTips'),
                showCancelButton: true,
                confirmButtonText : this.$t('head.sure'),
                cancelButtonText : this.$t('head.cancel'),
            }).then(val => {
                if(val != 'confirm') return false;
                this.axios({
                    method : 'delete',
                    url : `api/web/v1/passports/${id}?lang_id=${this.lang_id}`,
                }).then(res => {
                    if(res.data.code != '1000'){
                        messageTips(res.data.message);
                        return false;
                    }
                    messageTips(this.$t('user.deleteSuccess'));
                    this.items.splice(idx,1);
                });
            });
        },
    }
}
</script>

<style scoped>
.traveler{
    padding-left:.3rem;
    padding-right: .3rem;
    padding-bottom: 0;
}
.traveler_item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 1.7rem;
    border-bottom: 0.03rem solid #ccc;
}
.traveler_item:last-of-type{
    border-bottom: 0;
}
.traveler_item .name{
    margin-bottom: .26rem;
    font-size: .38rem;
    display: flex;
    align-items: center;
}
.traveler_item .name span:first-child{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 55vw;
}
.card{
  display: flex;
}
.card span:last-child{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 55vw;
  display: inline-block;
}
.traveler_item .name .age_type{
    color: #ccc;
    font-size: .3rem;
    padding-left: .3rem;
}
.traveler_item .btns i{
    color: #2d9aff;
    padding: .3rem;
    font-size: .5rem;
}
</style>
