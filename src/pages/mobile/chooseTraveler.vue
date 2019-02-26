<template>
    <div>
        <div class="traveler mb-padding-content">
            <div class="traveler_item" :class="{'gray':item.is_select}" v-for="(item,index) in items" :key="index" @click="clickItem($event,item.is_select)">
                <div class="info">
                    <check-out v-model="item.isSelect" :emitData="{index : index}" @change="select" :disabled="item.is_select"></check-out>
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
                </div>
                <div class="btns" @click.stop>
                    <i class="el-icon-edit" @click="edit(item,index)"></i>
                </div>
            </div>
            <div v-if="items.length == 0" class="no-result">{{$t('noResult')}}</div>
        </div>
        <div class="traveler_footer">
            <div class="btns" @click="submit">{{
                needNumber == 0 ? $t('info.sure') : $t('sign.chooseTravelerTips',{adult:need.adult,child:need.child,baby:need.baby})
            }}</div>
        </div>
    </div>
</template>

<script>
import { messageTips } from '../../assets/js/utils'
import checkOut from '../../components/mobile/checkOut'
export default {
    components: {
        checkOut
    },
    data(){
        return {
            items : new Object(),
            selectList : [],
            need : {
                adult : 1,
                child : 0,
                baby : 0,
            },
            position : {
                index : -1,
                idx : -1
            },
            departure_date : '',
            currentSelectId : [],
            selectedId : [],
            type : null,
        }
    },
    computed : {
        needNumber(){
            return this.need.adult + this.need.child + this.need.baby;
        }
    },
    created(){
        let route = this.$route;
        if(!route.params.need && !route.params.flag) this.$router.replace('/');
        if(route.params.need){
            this.need.adult = route.params.need.adult;
            this.need.child = route.params.need.child;
            this.need.baby = route.params.need.baby;
            this.position.index = route.params.position.index;
            this.position.idx = route.params.position.idx;
            this.departure_date = route.params.departure_date;
            this.currentSelectId = route.params.currentSelectId;
            this.selectedId = route.params.selectedId;
        }
        if(route.params.flag){
            this.restoreData();
            if(route.params.type == 'edit'){
                this.type = 'edit';
                let id = route.params.editId;
                let selectListIdx = this.selectList.map(ele => ele.id).indexOf(id)
                if(selectListIdx != -1){
                    let age_name = this.selectList[selectListIdx].age_name
                    if(age_name == '1'){
                        this.need.adult++;
                    }else if(age_name == '2'){
                        this.need.child++;
                    }else if(age_name == '3'){
                        this.need.baby++;
                    }
                    this.selectList.splice(selectListIdx,1)
                }
                let selectIdx = this.selectedId.indexOf(id)
                selectIdx != -1 && this.selectedId.splice(selectIdx,1)
            }
        }
        this.requestList();
    },
    methods: {
        select(params){
            let idx = params.data.index;
            let data = this.items[idx];
            if(data.is_select){
                this.$nextTick(() => {
                    data.isSelect = false;
                });
                return false;
            }
            if(data.age_name == '1'){
                if(params.value){
                    if(this.need.adult == 1 && this.selectList.map(ele => ele.is_adult).indexOf('true') == -1 && data.is_adult == 'false'){
                        messageTips(this.$t('sign.chooseTravelerTipsAdult18'));
                        this.$nextTick(() => {
                            data.isSelect = false;
                        });
                        return false;
                    }
                    if(this.need.adult == 0){
                        messageTips(this.$t('sign.chooseTravelerTipsAdult'));
                        this.$nextTick(() => {
                            data.isSelect = false;
                        });
                        return false;
                    }
                    this.need.adult = this.need.adult - 1
                }else{
                    this.need.adult = this.need.adult + 1;
                }
            }else if(data.age_name == '2'){
                if(params.value){
                    if(this.need.child == 0){
                        messageTips(this.$t('sign.chooseTravelerTipsChild'));
                        this.$nextTick(() => {
                            data.isSelect = false;
                        });
                        return false;
                    }
                    this.need.child = this.need.child - 1
                }else{
                    this.need.child = this.need.child + 1;
                }
            }else if(data.age_name == '3'){
                if(params.value){
                    if(this.need.baby == 0){
                       messageTips(this.$t('sign.chooseTravelerTipsBaby'));
                        this.$nextTick(() => {
                            data.isSelect = false;
                        });
                        return false;
                    }
                    this.need.baby = this.need.baby - 1
                }else{
                    this.need.baby = this.need.baby + 1;
                }
            }
            if(params.value){
                this.selectList.push(data);
            }else{
                let id = data.id;
                let delIdx = this.selectList.map(ele => ele.id).indexOf(id);
                this.selectList.splice(delIdx,1);
            }
        },
        requestList(){
            this.axios.get('api/web/v1/passports',{
                params: {
                    lang_id : this.lang_id,
                    departure_date : this.departure_date,
                }
            }).then(res => {
                if(res.data.code != '1000'){
                    messageTips(res.data.message);
                    return false;
                }
                let selectListLength = this.selectList.length;
                let arr = this.selectList.map(ele => ele.id);
                res.data.data.items.forEach(ele => {
                    if(selectListLength != 0){
                        ele.isSelect = arr.indexOf(ele.id) != -1;
                    }else{
                        ele.isSelect = false;
                    }
                    let idx = this.selectedId.indexOf(ele.id);
                    let currentIdx = this.currentSelectId.indexOf(ele.id);
                    if(idx != -1 && currentIdx == -1){
                        ele.is_select = true;
                    } else{
                        ele.is_select = false;
                    }
                });
                this.items = res.data.data.items;
            });
        },
        edit(data,idx){
            if(data.is_select) return false;
            let id = data.id;
            this.$router.push({
                path: '/TravelerInfo',
                name : 'TravelerInfo',
                query : {
                    id : id,
                },
                params : {
                    flag : true
                }
            });
        },
        submit(){
            if(this.needNumber != 0) {
                messageTips(this.$t('sign.chooseTravelerTips',{adult:this.need.adult,child:this.need.child,baby:this.need.baby}))
                return false;
            }
            this.$router.replace({
                name : 'Buy',
                params: {
                    type : 'sure',
                    position : this.position,
                    list : this.selectList,
                }
            })
            localStorage.removeItem('choose');
        },
        back(){
            this.$router.replace({
                name : 'Buy',
                params : {
                    type : 'back',
                    isEdit : this.type === 'edit',
                    position : this.position,
                }
            });
        },
        clickItem(event,type){
            if(type) return false;
            let target = event.target;
            let getItem = (el) => {
                if(el.getAttribute('class') == 'traveler_item'){
                    target = el;
                }else{
                    getItem(el.parentNode);
                }
            }
            getItem(target);
            target.getElementsByClassName('check_box')[0].click();
        },
        restoreData(){
            let data = JSON.parse(localStorage.getItem('choose'));
            localStorage.removeItem('choose');
            this.need.adult = data.need.adult;
            this.need.child = data.need.child;
            this.need.baby = data.need.baby;
            this.position.index = data.position.index;
            this.position.idx = data.position.idx;
            this.selectList = data.selectList;
            this.departure_date = data.departure_date;
            this.currentSelectId = data.currentSelectId;
            this.selectedId = data.selectedId;
        },
    },
    destroyed(){
        let obj = {
            selectList : this.selectList,
            need : this.need,
            position : this.position,
            departure_date : this.departure_date,
            currentSelectId : this.currentSelectId,
            selectedId : this.selectedId
        }
        localStorage.setItem('choose',JSON.stringify(obj));
    },
}
</script>

<style scoped>
.traveler{
    padding-left:.3rem;
    padding-right: .3rem;
    padding-bottom: 1.6rem;
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
.traveler_item .info{
    display: flex;
    align-items: center;
}
.traveler_item .info>div:first-of-type{
    width: 1.2rem;
    padding-left: .34rem;
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
.traveler_footer{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: .3rem;
    background-color: #fff;
    box-shadow: 0 0 .3rem 0 #ccc;
}
.traveler_footer .btns{
    background-color: #2d9aff;
    height: 1rem;
    line-height: 1rem;
    color: #fff;
    text-align: center;
    font-size: .38rem;
    border-radius: .6rem;
}
.traveler_item.gray i,
.traveler_item.gray .name,
.traveler_item.gray .card{
    color: #ccc;
}
</style>
