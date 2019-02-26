<template>
    <div :style="showThumb" @click="$emit('click')"></div>
</template>
<script>
export default {
  props:['thumb'],
  data(){
      return{
          showThumb:'',
      }
  },
  watch:{
      thumb: function(){
          this.checkImage();
      }
  },
  created(){
      this.checkImage();
  },
  methods:{
      checkImage(){
        let img = document.createElement('img');
        img.src = this.thumb;
        img.onload = () => {
            img.onload = null;
            this.showThumb = `background-image:url("${this.thumb}");`;
            img = null;
        }
        img.onerror = () => {
            img.onerror = null;
            this.showThumb = `background-image:url("${this.errorImageUrl}");`;
            img = null;
        }
      },
  },
}
</script>
