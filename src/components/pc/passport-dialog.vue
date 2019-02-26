<template>
    <el-dialog @close="close" :title="id ? $t('info.editor') : $t('info.add')" :visible.sync="dialog" width="700px">
        <!-- 弹框 -->
        <div class="passPortPop">
            <div class="mustWirte">
                <div class="info_title">{{$t('info.required')}}</div>
                <ul>
                    <!-- 姓名 -->
                    <li class="info_name cl">
                        <span>{{$t('info.fullName')}}：</span>
                        <el-input class="commonInput" :placeholder="$t('sign.inputRealName')" v-model.trim="form.name" clearable maxlength="8"></el-input>
                    </li>
                    <!-- 选择证件及号码 -->
                    <li class="info_certificate cl">
                        <el-select v-model="form.certificate_type" :placeholder="$t('sign.chooseCertificateType')" class="select_types">
                            <el-option :label="$t('user.idCard')" :value="'0'"></el-option>
                            <el-option :label="$t('user.passport')" :value="'1'"></el-option>
                        </el-select>
                        <el-input :placeholder="$t('sign.inputNumber')" v-model.trim="form.certificate_number" class="input-with-select commonInput" maxlength="18"></el-input>
                    </li>
                    <!-- 证件到期日期 -->
                    <li class="info_date cl">
                        <span>{{$t('user.dueDate')}}：</span>
                        <el-date-picker
                            :editable="false"
                            v-model="form.certificate_expire_date"
                            type="date"
                            :picker-options="certificate_expire_dateOptions"
                            value-format="timestamp"
                            :placeholder="$t('sign.chooseCertificateExpireDate')">
                        </el-date-picker>
                    </li>
                    <!-- 性别 -->
                    <li class="info_sex cl">
                        <span>{{$t('user.sex')}}：</span>
                        <el-radio v-model="form.gender" label="male">{{$t('user.male')}}</el-radio>
                        <el-radio v-model="form.gender" label="female">{{$t('user.female')}}</el-radio>
                    </li>
                    <!-- 生日 -->
                    <li class="info_birthday cl">
                        <span>{{$t('user.birthday')}}：</span>
                        <el-date-picker
                            :editable="false"
                            v-model="form.birth"
                            type="date"
                            :picker-options="birthOptions"
                            value-format="timestamp"
                            :placeholder="$t('sign.inputBirth')">
                        </el-date-picker>
                    </li>
                </ul>
            </div>
            <div class="mustWirte">
                <div class="info_title">{{$t('info.optional')}}</div>
                <ul>
                    <!-- 国籍 -->
                    <li class="info_nationality cl">
                        <span>{{$t('info.nationality')}}：</span>
                        <el-select v-model="form.nationality" filterable :placeholder="$t('user.choose')" class="select_type">
                            <el-option
                                v-for="item in nationalityOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </li>
                </ul>
            </div>
        </div>
        <div class="btns">
            <el-button type="primary" @click="submit">{{$t('user.save')}}</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { messageTips } from '../../assets/js/utils';
export default {
    data () {
        return {
            certificate_expire_dateOptions : {
                disabledDate(d){
                    let timestamp = d.getTime();
                    let date = new Date();
                    let year = date.getFullYear();
                    let month = date.getMonth();
                    let day = date.getDate();
                    if(timestamp < new Date(year,month,day).getTime()) return true;
                }
            },
            birthOptions : {
                disabledDate(d){
                    let timestamp = d.getTime();
                    let date = new Date(1900,0,1);
                    if(timestamp < date.getTime() || timestamp >= new Date().getTime()) return true;
                }
            },
            id : '',
            dialog : false,
            form : {
                certificate_type : '',
                certificate_number : '',
                certificate_expire_date : '',
                birth : '',
                name : '',
                gender : '',
                nationality : '',
            },
            nationalityOptions : [],
            departure_date : '',
        }
    },
    created(){
        this.getNationality();
    },
    methods: {
        submit(){
            let form = this.form;
            if(form.name == '' || !form.name){
                messageTips(this.$t('sign.inputRealName'),'error');
                return false;
            }
            if(form.certificate_number == '' || !form.certificate_number){
                messageTips(this.$t('sign.inputNumber'),'error');
                return false;
            }
            if(form.certificate_type == '' || !form.certificate_type){
                messageTips(this.$t('sign.chooseCertificateType'),'error');
                return false;
            }
            if(form.certificate_expire_date == '' || !form.certificate_expire_date){
                messageTips(this.$t('sign.chooseCertificateExpireDate'),'error');
                return false;
            }
            if(form.gender == '' || !form.gender){
                messageTips(this.$t('sign.inputSex'),'error');
                return false;
            }
            if(form.birth == '' || !form.birth){
                messageTips(this.$t('sign.inputBirth'),'error');
                return false;
            }
            if(form.certificate_expire_date == '' || !form.certificate_expire_date){
                messageTips(this.$t('user.dueDate'),'error');
                return false;
            }
            let sendData = {
                name : form.name,
                certificate_type : form.certificate_type,
                certificate_number : form.certificate_number,
                certificate_expire_date : parseInt(form.certificate_expire_date / 1000),
                birth : parseInt(form.birth / 1000),
                gender : form.gender,
                nationality : form.nationality,
            }
            if(this.departure_date) sendData.departure_date = this.departure_date;
            this.axios({
                method : this.id ? 'patch' : 'post',
                url : this.id ? `api/web/v1/passports/${this.id}` : 'api/web/v1/passports',
                data : sendData
            }).then(res => {
                if(res.data.code != '1000'){
                    messageTips(res.data.message,'error');
                    return false;
                }
                messageTips(this.id ? this.$t('sign.editSuccess') : this.$t('sign.createSuccess'));
                this.close();
                this.$emit('success',this.id ? 'edit' : 'add',res.data.data);
            });
        },
        open(id,departure_date){
            this.form = {
                certificate_type : '',
                certificate_number : '',
                certificate_expire_date : '',
                birth : '',
                name : '',
                gender : '',
                nationality : '',
            }
            this.departure_date = departure_date;
            this.id = id;
            this.dialog = true;
            this.$nextTick(() => {
                this.form.certificate_type = '0';
            });
            if(id) this.getDetial(id);
        },
        close(){
            this.dialog = false;
            this.$emit('close');
        },
        getDetial(id){
            this.axios.get(`api/web/v1/passports/${id}?lang_id=${this.lang_id}`).then(res => {
                if(res.data.code != '1000'){
                    messageTips(res.data.messageTips,'error');
                    return false;
                }
                let data = res.data.data;
                data.certificate_expire_date = parseInt(data.certificate_expire_date * 1000);
                data.birth = parseInt(data.birth * 1000);
                this.form = data;
            });
        },
        getNationality(){
            this.axios.get(`api/web/v1/nationalities?lang_id=${this.lang_id}`).then(res => {
                if(res.data.code != '1000'){
                    messageTips(res.data.messageTips,'error');
                    return false;
                }
                this.nationalityOptions = res.data.data.items.map(ele => {
                    return {
                        value : ele.name,
                        label : ele.nationality_desc_name
                    }
                });
            });
        },
    },
}
</script>
<style scoped>

.passPortPop {
  width: 100%;
  background: white;
}

.mustWirte {
  height: auto;
}

.info_title {
  width: 100%;
  height: 30px;
  color: #409eff;
  font-size: 15px;
  line-height: 30px;
}

.mustWirte ul li,
.optional ul li {
  height: 60px;
  border-bottom: 1px solid #dfdfdf;
  line-height: 60px;
  padding: 0 20px;
}
.mustWirte ul li:last-of-type{
    border-bottom: 0;
}
.mustWirte ul li span {
  width: 25%;
  height: 100%;
  display: block;
  text-align: left;
  float: left;
}

.optional ul li span {
  width: 10%;
  height: 100%;
  display: block;
  text-align: center;
  float: left;
  line-height: 50px;
}

.info_title {
  padding: 0 20px;
  font-size: 14px;
  width: 100%;
  height: 30px;
  background: #dfdfdf;
  line-height: 30px;
}
.commonInput{
    float: left;
    width: 300px;
    border: white;
}
.select_types{
    float: left;
    width: 155px;
}
.btns{
    margin-top: 20px;
    text-align: center;
}
</style>
