<template>
  <div id="app">
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
        <!-- <router-view v-if="!$route.meta.keepAlive"></router-view> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component({})
export default class App extends Vue {
    mounted(){
      // window.addEventListener('scroll',this.handleScroll,true)
      var htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;

      //获取页面的HTML Dom
      var htmlDom = document.getElementsByTagName('html')[0];

      htmlDom.style.fontSize = htmlWidth / 10 + 'px';

      window.addEventListener('resize',function(e){
        var htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
        htmlDom.style.fontSize = htmlWidth / 10 + 'px';
      })
    }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
