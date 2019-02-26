<template>
  <router-view/>
</template>

<script>
import { removeNode } from './assets/js/utils'
export default {
  beforeMount(){
    removeNode(document.querySelector('#loading'))
    removeNode(document.querySelector('#loading_box'))
  },
  destroyed(){
    localStorage.removeItem('buy');
    localStorage.removeItem('choose');
  },
}
</script>

<style>
@import url("assets/css/initialization.css");
</style>
