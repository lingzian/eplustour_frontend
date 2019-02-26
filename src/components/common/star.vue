<template>
    <div class="rate-star" :style="`width:${width}px;`">
        <div id="rate-star-bottom" class="rate-star-bottom cl" :style="`color:${bgColor}`">
          <i v-for="(item,idx) in starCount" :key="idx" class="el-icon-star-off"></i>
        </div>
        <div class="rate-star-top" :style="`color:${color};width:${scopes / starCount * 100}%;`">
          <i v-for="(item,idx) in starCount" :key="idx" class="el-icon-star-on"></i>
        </div>
        <div class="template" :style="`padding-left:${width + 5}px`">{{template}}</div>
    </div>
</template>
<script>
const getRect =  el => {
	if (!el) return false;
  let rect = el.getBoundingClientRect();
  let _left = document.documentElement.clientLeft;
  let _top = document.documentElement.clientTop;
	return {
		left: rect.left - _left,
		top: rect.top - _top,
		right: rect.right - _left,
		bottom: rect.bottom - _top,
		width: rect.right - rect.left,
		height: rect.bottom - rect.top
	}
}
export default {
  props: {
      scopes : {
          type : [Number,String],
          default : 0
      },
      starCount : {
          type : Number,
          default : 5,
      },
      color : {
          type : String,
          default :'#409eff'
      },
      bgColor : {
          type : String,
          default : '#cccccc',
      },
      template : {
          type : String,
          default : ''
      }
  },
  data(){
      return {
          width : 120,
      }
  },
  mounted(){
    let timer = null;
    timer = setTimeout(() => {
      this.width = getRect(document.querySelector('#rate-star-bottom')).width;
    },0);
  }
};
</script>
<style scoped>
.rate-star{
    position: relative;
}
.rate-star-top,
.rate-star-bottom{
    position: absolute;
    white-space:nowrap;
    top: 0;
    left: 0;
}
.rate-star-top{
    overflow: hidden;
}
.template{
    white-space: nowrap;
    line-height: 0.42rem;
    color: rgb(31, 45, 61) !important;
}

i{
    font-size: 19px;
}
</style>
