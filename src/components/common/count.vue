<template>
    <div class="count">
        <div class="left" :class="{'mark':countValue > min && !disabled}" @click="reduce"><i class="el-icon-minus"></i></div>
        <div class="view">{{ countValue }}</div>
        <div class="right" :class="{'mark':countValue < max && !disabled}" @click="add"><i class="el-icon-plus"></i></div>
    </div>
</template>

<script>
export default {
    props: {
        max : {
            type : Number,
            default : 999
        },
        min : {
            type: Number,
            default: 0
        },
        value : {
            type: Number,
            default: 0,
        },
        emitData : {
            type: Object,
            default(){
                return {}
            }
        },
        disabled: {
            type: Boolean,
            default : false,
        }
    },
    watch : {
        value(){
            this.countValue = this.value;
        }
    },
    data() {
        return {
            countValue : this.value,
        }
    },
    methods: {
        add(){
            if(this.countValue >= this.max) return false;
            if(this.disabled) return false;
            this.countValue++;
            this.$emit('input',this.countValue);
            this.$emit('change',{
                value : this.countValue,
                type : 'add',
                data : this.emitData
            });
        },
        reduce(){
            if(this.countValue <= this.min) return false;
            if(this.disabled) return false;
            this.countValue--;
            this.$emit('input',this.countValue);
            this.$emit('change',{
                value : this.countValue,
                type : 'reduce',
                data : this.emitData
            });
        },
    },
}
</script>


<style scoped>
.pc .count{
    height: 25px;
    line-height: 23px;
    text-align: center;
}
.pc .count>div{
    float: left;
}
.pc .count .view{
    width: 35px;
    user-select: none;
}
.pc .count .right,
.pc .count .left{
    width: 25px;
    height: 25px;
    border-radius: 50%;
    font-size: 14px;
    border:1px solid #bbb;
    color: #bbb;
}
.pc .count .right.mark,
.pc .count .left.mark{
    border:1px solid #2d9aff;
    color: #2d9aff;
    cursor: pointer;
}
.mobile .count{
    display: flex;
}
.mobile .count>div{
    display: flex;
    justify-content: center;
    align-items: center;
}
.mobile .count .left.mark,
.mobile .count .right.mark{
    background-color: #2d9aff;
    color: #fff;
}
.mobile .count .left,
.mobile .count .right{
    background-color: #dbdbdb;
}
.mobile .count{
    height: .7rem;
}
.mobile .count .view{
    width: .95rem;
}
.mobile .count .left{
    border-radius: .1rem 0 0 .1rem;
}
.mobile .count .right{
    border-radius: 0 .1rem .1rem 0;
}
.mobile .count .left,
.mobile .count .right{
    width: .8rem;
    height: 100%;
    font-size: .34rem;
}
</style>