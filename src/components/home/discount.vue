<template>
    <div class="home_discount">
        <div class="home_dis_con" v-for="item in discount" :key="item.id">
            <div class="home_dis_top">
                <div class="money">￥{{item.moneyMin}}</div>
                <div class="text">满{{item.moneyHreshold}}减{{item.moneyMin}}</div>
            </div>
            <div class="home_dis_bottom">
                <van-button type="default" size="mini" @click="getDiscount(item.id)">立即领取</van-button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { Component, Vue, Prop } from "vue-property-decorator";
    @Component({})
    export default class discount extends Vue {
        @Prop({default: []})
        discount!: Array<object>
        private getDiscount(id: number) {
            this.$http.discountsFetch({ id: id}).then((res: any) => {
                res.data.code == 0?this.$toast('领取成功'):this.$toast(res.data.msg)
            })
        } 
    }
</script>