<template>
    <van-swipe :autoplay="0" class="homeNav" :stop-propagation="false">
        <van-swipe-item v-for="(item, index) in firstList" :key="index">
            <van-grid :border="false" :column-num="5">
                <van-grid-item v-for="items in item" :key="items.id" @click.native="goProduct(items)">
                    <img v-lazy="items.icon" />
                    <div class="value">{{items.name}}</div>
                </van-grid-item>
            </van-grid>
        </van-swipe-item>
    </van-swipe>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({})
export default class navList extends Vue {
    @Prop({default: []})
    navList!: Array<object>
    get firstList(){
        var data = this.navList.filter((ele:any,index:number) =>{
            return ele.level == 1
        })
        var result = []
        for(var i=0;i<data.length;i+=10){
            result.push(data.slice(i,i+10));
        }
        return result
    }
}
</script>