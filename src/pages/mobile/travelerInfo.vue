<template>
    <div>
        <div class="mb-padding-content">
            <ul class="travel">
                <div class="info_title">{{$t('info.required')}}</div>
                <!-- 姓名 -->
                <li class="border_top">
                    <div>
                        <div class="title">{{$t('user.name')}}</div>
                        <div class="info" :class="{'gray':!name}" @click="changeSet('name',$t('user.name'),name)">{{name || $t('sign.inputName')}}</div>
                    </div>
                </li>
                <!-- 证件 -->
                <li>
                    <div>
                        <div class="title" @click="changeCertificateType">
                            <span>{{certificate_type == 0 ? $t('user.idCard') : $t('user.passport')}}</span>
                            <i class="el-icon-arrow-right"></i>
                        </div>
                        <div
                            class="info"
                            :class="{'gray':!certificate_number}"
                            @click="changeSet('certificate_number',certificate_type == 0 ? $t('user.idCard') : $t('user.passport'),certificate_number)">{{certificate_number || $t('sign.inputNumber')}}</div>
                    </div>
                </li>
                <!-- 到期日期 -->
                <li>
                    <div>
                        <div class="title">{{$t('user.dueDate')}}</div>
                        <div
                            class="info"
                            @click="$refs.duedate.open()"
                            :class="{'gray':!certificate_expire_date}">{{certificate_expire_date || $t('sign.inputDueDate')}}</div>
                    </div>
                </li>
                <!-- 性别 -->
                <li>
                    <div>
                        <div class="title">{{$t('user.sex')}}</div>
                        <el-radio-group v-model="gender">
                            <el-radio :label="'male'">{{$t('user.male')}}</el-radio>
                            <el-radio :label="'female'">{{$t('user.female')}}</el-radio>
                        </el-radio-group>
                    </div>
                </li>
                <!-- 出生日期 -->
                <li class="border_bottom">
                    <div>
                        <div class="title">{{$t('user.birthday')}}</div>
                        <div
                            class="info"
                            @click="$refs.birthday.open()"
                            :class="{'gray':!birth}">{{birth || $t('sign.inputBirth')}}</div>
                    </div>
                </li>
                <div class="info_title">{{$t('info.optional')}}</div>
                <!-- 国籍 -->
                <li class="border_top border_bottom">
                    <div>
                        <div class="title">{{$t('user.nationality')}}</div>
                        <div
                            class="info"
                            :class="{'gray':!nationality.nationality_desc_name}"
                            @click="isShowNational = true">{{nationality.nationality_desc_name || $t('sign.inputNationality')}}</div>
                    </div>
                </li>
            </ul>
            <div class="btn" @click="submit">{{$t('user.save')}}</div>
        </div>
        <!-- 选择证件类型 -->
        <mt-actionsheet
            :actions="certificate_type_actions"
            v-model="certificate_type_show"
            :cancelText="$t('head.cancel')">
        </mt-actionsheet>
        <!-- 到期日期 -->
        <mt-datetime-picker
            ref="duedate"
            v-model="certificate_expire_date_picker"
            type="date"
            :startDate="new Date()"
            :year-format="'{value} '+$t('dateFormat.year')"
            :month-format="'{value} '+$t('dateFormat.month')"
            :date-format="'{value} '+$t('dateFormat.date')"
            :cancelText="$t('head.cancel')"
            :confirmText="$t('head.sure')"
            @confirm="chooseDuedate">
        </mt-datetime-picker>
        <!-- 出生日期 -->
        <mt-datetime-picker
            ref="birthday"
            v-model="birth_picker"
            type="date"
            :startDate="new Date(1900,0,1)"
            :endDate="new Date()"
            :year-format="'{value} '+$t('dateFormat.year')"
            :month-format="'{value} '+$t('dateFormat.month')"
            :date-format="'{value} '+$t('dateFormat.date')"
            :cancelText="$t('head.cancel')"
            :confirmText="$t('head.sure')"
            @confirm="chooseBirthday">
        </mt-datetime-picker>
        <!-- 国籍 -->
        <national-select
            v-if="isShowNational"
            :nationaOptions="nationalOptions"
            @afterSelect="selectNational"
            @closeSelect="closeSelectNational">
        </national-select>
    </div>
</template>

<script>
import Vue from 'vue'
import { formatDate,messageTips,trimString } from '../../assets/js/utils'
import { Actionsheet,MessageBox,DatetimePicker } from 'mint-ui'
Vue.component(Actionsheet.name, Actionsheet)
Vue.component(DatetimePicker.name, DatetimePicker);
import nationalSelect from '../../components/mobile/nationalSelect'
export default {
    components: {
        nationalSelect
    },
    data(){
        return {
            name : '', //姓名
            certificate_number : '', //证件号码
            certificate_expire_date : '', //证件过期时间
            certificate_expire_date_picker : '',//证件过期时间控件
            birth : '', //出生日期
            birth_picker : new Date(), //出生日期时间控件
            gender : '', //男:male, 女:female
            nationality : '', //国籍
            certificate_type : 0,
            certificate_type_show : false,
            certificate_type_actions : [
                {
                    name : this.$t('user.idCard'),
                    method: () => {
                        this.certificate_type = 0;
                    }
                },
                {
                    name : this.$t('user.passport'),
                    method: () => {
                        this.certificate_type = 1;
                    }
                }
            ],
            isShowNational :false,
            nationalOptions : new Array(),
            id : this.$route.query.id,
            isFromChoose : !!this.$route.params.flag
        }
    },
    created(){
        if(this.id) this.getDetail();
        this.requestNationalities();
    },
    methods: {
        // 獲取詳情
        getDetail(){
            this.axios.get(`api/web/v1/passports/${this.id}`,{
                params : {
                    lang_id : this.lang_id
                }
            }).then(res => {
                if(res.data.code != '1000'){
                    messageTips(res.data.message);
                    return false;
                }
                let items = res.data.data;
                this.name = items.name;
                this.certificate_number = items.certificate_number,
                this.certificate_expire_date = formatDate(items.certificate_expire_date,false);
                this.certificate_expire_date_picker = new Date(parseInt(items.certificate_expire_date) * 1000);
                this.gender = items.gender;
                this.birth = formatDate(items.birth,false);
                this.birth_picker = new Date(parseInt(items.birth) * 1000);
                this.nationality = {
                    name : items.nationality,
                    nationality_desc_name : items. nationality_name
                }
            });
        },
        // 提交
        submit(){
            if(this.name.length>8){
              messageTips(this.$t('sign.userLength'));
              return false;
            }
            if(this.certificate_number.length>18){
              messageTips(this.$t('sign.idCardLength'));
              return false;
            }
            if(trimString(this.name) == '' || !trimString(this.name) ){
                messageTips(this.$t('sign.inputName'));
                return false;
            }
            if(trimString(this.certificate_number) == '' || !trimString(this.certificate_number)){
                messageTips(this.$t('sign.inputNumber'));
                return false;
            }
            if(this.certificate_expire_date == '' || !this.certificate_expire_date){
                messageTips(this.$t('sign.inputDueDate'));
                return false;
            }
            if(this.gender == '' || !this.gender){
                messageTips(this.$t('sign.inputSex'));
                return false;
            }
            if(this.birth == '' || !this.birth){
                messageTips(this.$t('sign.inputBirth'));
                return false;
            }
            this.axios({
                method : this.id ? 'patch' : 'post',
                url : this.id ? `api/web/v1/passports/${this.id}?lang_id=${this.lang_id}` : `api/web/v1/passports?lang_id=${this.lang_id}`,
                data: {
                    name : this.name,
                    certificate_type : this.certificate_type,
                    certificate_number : this.certificate_number,
                    certificate_expire_date : parseInt(this.certificate_expire_date_picker.getTime() / 1000),
                    birth : parseInt(this.birth_picker.getTime() / 1000),
                    gender : this.gender,
                    nationality : this.nationality.name,
                }
            }).then(res => {
                if(res.data.code != '1000'){
                    messageTips(res.data.message);
                    return false;
                }
                messageTips(this.id ? this.$t('sign.editSuccess') : this.$t('sign.createSuccess'));
                if(this.isFromChoose){
                    this.$router.replace({
                        path: '/ChooseTraveler',
                        name : 'ChooseTraveler',
                        params : {
                            flag : true,
                            type : this.id ? 'edit' : 'add',
                            editId : this.id || '',
                        }
                    });
                }else{
                    this.$router.replace({
                        path: '/TravelerList'
                    });
                }
            });
        },
        //选择到期时间
        chooseDuedate(res){
            this.certificate_expire_date_picker = res;
            this.certificate_expire_date = formatDate(res,true);
        },
        //选择出生日期
        chooseBirthday(res){
            this.birth_picker = res;
            this.birth = formatDate(res,true);
        },
        //改变名字或者邮箱
        changeSet(inp, title, value) {
            MessageBox.prompt(title, {
                confirmButtonText: this.$t("head.sure"),
                cancelButtonText: this.$t("head.cancel"),
                closeOnClickModal: false,
                inputValue: value
            }).then(res => {
                if (this[inp] != res.value) this.isChange = true;
                this[inp] = res.value;
            }).catch(res => {});
        },
        //修改證件類型
        changeCertificateType(){
            this.certificate_type_show = true;
        },
        //关闭国籍选择
        closeSelectNational(){
            this.isShowNational = false;
        },
        //打开国籍选择
        selectNational(res){
            this.nationality = res;
            this.closeSelectNational();
        },
        //获取国籍列表
        requestNationalities(){
            this.axios.get('api/web/v1/nationalities',{
                params : {
                    lang_id : this.lang_id
                }
            }).then(res => {
                var data = res.data.data.items;
                var arr = [];
                data.forEach((ele,index) => {
                    if(index == 0){
                        arr.push([ele]);
                    }else{
                        if(ele.letter == data[index-1].letter){
                            arr[arr.length-1].push(ele);
                        }else{
                            arr.push([ele])
                        }
                    }
                })
                this.nationalOptions = Object.freeze(arr);
            });
        },
    },
    mounted() {
        document.body.style.backgroundColor = "#f5f5f5";
    },
    destroyed() {
        document.body.style.backgroundColor = "#fff";
    },
}
</script>


<style scoped>
.travel .info_title,
.travel>li{
    padding: 0 .4rem;
}
.travel>li{
    background-color: #fff;
}
.travel>li>div{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 1.2rem;
}
.travel>li.border_top{
    border-top: 0.03rem solid #ddd;
}
.travel>li>div,
.travel>li.border_bottom{
    border-bottom: 0.03rem solid #ddd;
}
.travel>li.border_bottom>div{
    border-bottom: 0;
}
.travel>li .title{
    color: #000;
    font-size: .38rem;
}
.travel>li .info{
    /* display: -webkit-box; */
    max-width: 7rem;
    min-width:3rem;
    height: 100%;
    /* justify-content: flex-end; */
    /* align-items: center; */
    font-size: .38rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.2rem;
    text-align: right;
}
.travel .info_title{
    height: 1rem;
    line-height: 1rem;
    color: #888;
}
.btn {
  width: 80%;
  background-color: #2d9aff;
  color: #fff;
  text-align: center;
  margin: 0 auto;
  padding: 0.266667rem 0;
  border-radius: 0.4rem;
  font-size: 0.373333rem;
  margin-top: 1rem;
}
.gray{
  color: #ccc;
}
</style>
