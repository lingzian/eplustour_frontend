<template>
    <div @click.stop="change" class="check_box" :class="{'disabled':disabled}">
        <div class="check_out" :class="{'select':val}">
            <i v-if="val" class="el-icon-check center"></i>
        </div>
        <div><slot/></div>
    </div>

</template>

<script>
export default {
    props:{
        value : Boolean,
        default : false,
        emitData : {
            type: Object,
            default(){
                return {}
            }
        },
        disabled:{
            type: Boolean,
            default : false
        }
    },
    watch: {
        value(){
            this.val = this.value;
        }
    },
    data(){
        return {
            val : this.value
        }
    },
    methods: {
        change(){
            if(this.disabled) return false;
            this.val = !this.val;
            this.$emit('input',this.val);
            this.$emit('change',{
                value : this.val,
                data : this.emitData
            });
        },
    }
}
</script>

<style scoped>
.check_box{
    display: flex;
    align-items: center;
}
.check_box.disabled .check_out{
    border: .03rem solid #ccc;
}
.check_out{
	width: .38rem;
	height: .38rem;
	display: inline-block;
	border: .03rem solid #2d9aff;
	vertical-align: middle;
	margin-top: -.03rem;
    border-radius: .08rem;
    position: relative;
    margin-right: .14rem;
    transition: all .15s;
}
.check_out.select{
    color: #fff;
    background-color: #2d9aff;
}
</style>