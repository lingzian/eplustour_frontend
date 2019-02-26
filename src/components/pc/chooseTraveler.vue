<template>
    <el-dialog
        class="choose_dialog"
        width="600px"
        :close-on-click-modal="false"
        :title="$t('info.passengerSelect')" 
        :visible.sync="dialog">
        <ul class="list">
            <el-scrollbar class="min_height scroll_y_bar">
                <li 
                    v-for="(item,index) in items" 
                    :key="index" 
                    class="cl" 
                    :class="{
                        'select':selectList.map(ele => ele.id).indexOf(item.id) != -1,
                        'is_select':item.is_select
                    }">
                    <div class="checkbox">
                        <div @click="select(index)" :style="item.is_select ? 'visibility:hidden' : ''"><i class="el-icon-check center"></i></div>
                    </div>
                    <div @click="select(index)">
                        <div class="name">
                            <span>{{item.name}}</span>
                            <span class="age_type" v-if="item.age_name == '1'">({{$t('buy.adult')}})</span>
                            <span class="age_type" v-else>({{item.age_name == '3' ? $t('buy.baby') : $t('buy.child')}})</span>
                        </div>
                        <div>
                            <span>{{item.certificate_type == '0' ? $t('user.idCard') : $t('user.passport')}}：</span>
                            <span>{{item.certificate_number}}</span>
                        </div>
                    </div>
                    <div>
                        <i class="el-icon-edit" @click="edit(index)"></i>
                    </div>
                </li>
            </el-scrollbar>
            <div v-if="items.length == 0" class="center">{{$t('noResult')}}</div>
        </ul>
        <div class="btns">
            <div @click="submit">{{
                needNumber == 0 ? 
                $t('info.sure') : 
                $t('sign.chooseTravelerTips',{adult:need.adult,child:need.child,baby:need.baby})
            }}</div>
            <div @click="add">{{$t('info.add')}}</div>
        </div>
    </el-dialog>
</template>

<script>
import { messageTips } from '../../assets/js/utils'
export default {
    props:['selectedId'],
    data(){
        return {
            dialog : false,
            selectList : [],
            items : new Object(),
            need : {
                adult : 1,
                child : 0,
                baby : 0,
            },
        }
    },
    computed : {
        needNumber(){
            return this.need.adult + this.need.child + this.need.baby;
        }
    },
    methods: {
        open(params){
            let need = params.need;
            let currentSelectId = params.currentSelectId;
            if(need){
                this.clear();
                this.need.adult = need.adult;
                this.need.child = need.child;
                this.need.baby = need.baby;
            }
            this.items.forEach(ele => {
                let id = ele.id;
                let idx = this.selectedId.indexOf(id);
                let currentIdx = currentSelectId.indexOf(id);
                if(idx != -1 && currentIdx == -1){
                    ele.is_select = true;
                } else{
                    ele.is_select = false;
                }
            });
            this.dialog = true;
        },
        show(type,data){
            if(type == 'add'){
                data.is_select = false;
                this.items.unshift(data);
            }else if(type == 'edit'){
                let id = data.id;
                let selectIdx = this.selectList.map(ele => ele.id).indexOf(id)
                if(selectIdx != -1){
                    let age_name = this.selectList[selectIdx].age_name
                    if(age_name == '1'){
                        this.need.adult++;
                    }else if(age_name == '2'){
                        this.need.child++;
                    }else if(age_name == '3'){
                        this.need.baby++;
                    }
                    this.selectList.splice(selectIdx,1)
                }
                let idx = this.items.map(ele => ele.id).indexOf(id);
                if(idx != -1){
                    this.items[idx] = Object.assign(this.items[idx],data);
                }
            }
            this.dialog = true;
        },
        close(){
            this.dialog = false;
        },
        clear(){
            this.selectList.splice(0,this.selectList.length);
        },
        submit(){
            if(this.needNumber != 0){
                messageTips(this.$t('sign.chooseTravelerTips',{adult:this.need.adult,child:this.need.child,baby:this.need.baby}),'error');
                return false;
            }
            this.$emit('submit',this.selectList);
            this.close();
        },
        select(index){
            let data = this.items[index];
            if(data.is_select) return false;
            let idx = this.selectList.map(ele => ele.id).indexOf(data.id);
            let clickType = idx == -1;
            if(data.age_name == '1'){
                if(clickType){
                    if(this.need.adult == 1 && this.selectList.map(ele => ele.is_adult).indexOf('true') == -1 && data.is_adult == 'false'){
                        messageTips(this.$t('sign.chooseTravelerTipsAdult18'),'error');
                        this.$nextTick(() => {
                            data.isSelect = false;
                        });
                        return false;
                    }
                    if(this.need.adult == 0){
                        messageTips(this.$t('sign.chooseTravelerTipsAdult'),'error');
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
                if(clickType){
                    if(this.need.child == 0){
                        messageTips(this.$t('sign.chooseTravelerTipsChild'),'error');
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
                if(clickType){
                    if(this.need.baby == 0){
                       messageTips(this.$t('sign.chooseTravelerTipsBaby'),'error');
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
            if(clickType){
                this.selectList.push(data);
            }else{
                this.selectList.splice(idx,1);
            }
        },
        edit(index){
            let data = this.items[index];
            if(data.is_select) return false;
            this.$emit('edit',data.id);
            this.close();
        },
        add(){
            this.$emit('add');
            this.close();
        },
        requestList(departure_date){
            this.axios.get('api/web/v1/passports',{
                params: {
                    lang_id : this.lang_id,
                    departure_date : departure_date,
                }
            }).then(res => {
                if(res.data.code != '1000'){
                    messageTips(res.data.message);
                    return false;
                }
                res.data.data.items.forEach(ele => {
                    ele.is_select = false;
                })
                this.items = res.data.data.items;
            });
        },
    }
}
</script>

<style scoped>
.list{
    position: relative;
}
.list li{
    border-bottom: 1px dashed #ddd;
    padding: 15px 0;
}
.list li:last-of-type{
    border-bottom: 0;
}
.list li>div{
    float: left;
}
.list li>div:last-of-type,
.list li>div:first-of-type{
    width: 50px;
    text-align: center;
    line-height: 44px;
    vertical-align: middle;
}
.list li>div:nth-of-type(2){
    width: 450px;
    cursor: pointer;
}
.list li.is_select>div:last-of-type i,
.list li.is_select>div:nth-of-type(2){
    cursor: default;
}
.list li.is_select>div:last-of-type i:hover,
.list li.is_select{
    color: #ddd !important;
}
.list li>div:last-of-type i{
    font-size: 20px;
    cursor: pointer;
    transition: all .15s;
}
.list li>div:last-of-type i:hover{
    color: #2d9aff;
}
.list li .name{
    margin-bottom: 15px;
}
.age_type{
    font-size: 14px;
    color: #ccc;
    padding-left: 5px;
}
.min_height{
    height: 460px;
}
.min_height>div{
    overflow-x: hidden;
    overflow-y: scroll;
}
.checkbox>div{
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 1px solid #2d9aff;
    position: relative;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    vertical-align: middle;
}
.list li.select .checkbox>div{
    background-color: #2d9aff;
}
.btns{
    text-align: center;
    margin-top: 30px;
}
.btns>div{
    display: inline-block;
    background-color: #2d9aff;
    color: #fff;
    padding: 10px 40px;
    border-radius: 8px;
    cursor: pointer;
}
</style>