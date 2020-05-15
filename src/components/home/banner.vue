<template>
   <van-swipe :autoplay="3000" indicator-color="white" :stop-propagation="false">
        <van-swipe-item v-for="item in bannerList" :key="item.id">
            <img v-lazy="item.picUrl" alt="">
        </van-swipe-item>
   </van-swipe>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component({})
export default class banner extends Vue {
    @Prop({default: []}) 
    bannerList!: Array<object>
}
</script>