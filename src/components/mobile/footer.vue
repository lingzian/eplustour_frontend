<template>
    <ul v-if="selectIdx != -1" id="mb-footer" class="footer cl">
        <li :class="{'select':selectIdx == 1}">
            <div class="center">
                <router-link to="/">
                    <div class="img">
                        <img v-if="selectIdx == 1" src="../../assets/images/footer01.png" alt="">
                        <img v-else src="../../assets/images/footer01g.png" alt="">
                    </div>
                    <div>{{$t('footer.home')}}</div>
                </router-link>
            </div>
        </li>
        <li :class="{'select':selectIdx == 2}">
            <div class="center">
                <router-link to="/Hot">
                    <div class="img">
                        <img v-if="selectIdx == 2" src="../../assets/images/footer02.png" alt="">
                        <img v-else src="../../assets/images/footer02g.png" alt="">
                    </div>
                    <div>{{$t('footer.hot')}}</div>
                </router-link>
            </div>
        </li>
        <li :class="{'select':selectIdx == 3}">
            <div class="center">
                <router-link to="/Trip">
                    <div class="img">
                        <img v-if="selectIdx == 3" src="../../assets/images/footer03.png" alt="">
                        <img v-else src="../../assets/images/footer03g.png" alt="">
                    </div>
                    <div>{{$t('footer.trip')}}</div>
                </router-link>
            </div>
        </li>
        <li :class="{'select':selectIdx == 4}">
            <div class="center">
                <router-link to="/User">
                    <div class="img">
                        <img v-if="selectIdx == 4" src="../../assets/images/footer04.png" alt="">
                        <img v-else src="../../assets/images/footer04g.png" alt="">
                    </div>
                    <div>{{$t('footer.me')}}</div>
                </router-link>
            </div>
        </li>
    </ul>
</template>

<script>
export default {
    data(){
        return{
            selectIdx : -1
        }
    },
    watch:{
        $route(){
            this.setIdx();
        }
    },
    created(){
        this.setIdx();
    },
    methods:{
        setIdx(){
            let name = this.$route.name;
            if(name == 'Index'){
                this.selectIdx = 1;
            }else if(name == 'Hot'){
                this.selectIdx = 2;
            }else if(name == 'User'){
                this.selectIdx = 4;
            }else{
                this.selectIdx = -1;
            }
        }
    }
}
</script>

<style scoped>
.footer {
  height: 1.266667rem;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  border-top: 0.013333rem solid #efefef;
  box-shadow: 0px 1px 5px #ccc;
  background-color: #fff;
  z-index: 1;
}
.footer > li {
  float: left;
  width: 25%;
  height: 100%;
  text-align: center;
  font-size: 0.346667rem;
  position: relative;
}
.footer > li > div {
  padding-top: .053333rem;
}
.footer > li > div div:last-of-type {
  margin-top: .08rem;
}
.footer .img {
  width: 0.533333rem;
  height: 0.533333rem;
  margin: auto;
}
.footer > li.select a{
    color: #54B5FF;
}
</style>