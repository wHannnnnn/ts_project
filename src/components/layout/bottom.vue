<template>
    <van-tabbar route>
            <van-tabbar-item
                replace
                to="/homeIndex"
                icon="home-o"
            >首页
            </van-tabbar-item>
            <van-tabbar-item
                replace
                to="/navIndex"
                icon="coupon-o"
            >分类
            </van-tabbar-item>
            <van-tabbar-item
                replace
                to="/shopIndex"
                icon="cart-o"
            >购物车
            </van-tabbar-item>
            <van-tabbar-item
                replace
                to="/mineIndex"
                icon="manager-o"
            >个人
            </van-tabbar-item>
    </van-tabbar>
</template>
<script lang="ts">
import { Vue } from "vue-property-decorator"
export default class bottom extends Vue {
}
</script>