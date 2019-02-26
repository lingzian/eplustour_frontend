<template>
    <div>
        <div class="passportMannager cl">
            <ul class="passportBox">
                <li class="passportItem cl">
                    <span v-if="itemData.certificate_type == '0'" class="passportNum">{{$t('user.idCard')}} : </span>
                    <span v-else class="passportNum">{{$t('user.passport')}} : </span>
                    <span class="value">{{itemData.certificate_number}}</span>
                    <span class="passportName">{{$t('user.name')}} : </span>
                    <span class="value">{{itemData.name}}</span>
                    <div class="btns">
                        <el-button class="btn" type="primary" size="mini" @click="$emit('del',itemData.id)">{{$t('user.delete')}}</el-button>
                        <el-button class="btn" type="info" size="mini" @click="$emit('edit',itemData.id)">{{$t('info.editor')}}</el-button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props: ['itemData'],
}
</script>

<style scoped>
.passportMannager ul li {
  background: white;
  height: 50px;
  border-radius: 5px;
  line-height: 50px;
  padding: 0 20px;
  margin-bottom: 20px;
}
.passportMannager ul li>span{
    display: inline-block;
    vertical-align: middle;
}
.passportMannager ul li span.passportNum{
    width: 150px;
    text-align: right;
}
.passportMannager ul li span.value{
    margin-left: 10px;
    width: 300px;
    color: #666666;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
.btns{
    float: right;
}
.btns .btn:first-of-type{
    margin-right: 10px;
}

</style>
