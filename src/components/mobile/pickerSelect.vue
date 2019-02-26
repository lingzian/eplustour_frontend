<template>
    <transition name="fade">
    <div class="mb-picker" @click="$emit('closeArea')">
        <div class="picker-box center" @click.stop>
            <div v-for="(item,index) in options" :key="index" class="picker_select_item" @click="sure(item)">{{item.value}}</div>
        </div>
    </div>
    </transition>
</template>

<script>
export default {
  props : ['options'],
  methods : {
    sure(res){
        this.$emit('selectArea',res.code);
        this.$emit('closeArea');
    }
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .15s;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
.mb-picker{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0,0,0,.5);
    z-index: 2;
}
.picker-box{
    width: 80%;
    background-color: #fff;
    text-align: center;
    border-radius: .133333rem;
}
.picker_select_item{
    height: .7rem;
    line-height: .7rem;
}
</style>