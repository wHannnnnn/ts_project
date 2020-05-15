<template>
  <div>
    <div class="app_top">
      <van-nav-bar fixed>
          <div class="search" slot="left">
              <div class="search_con" @click="goProduct">请输入内容</div>
          </div>
          <van-icon name="search" slot="right"/>
      </van-nav-bar>
    </div>
      <van-skeleton
        class="shopske"
        :row="6"
        row-width = []
        :loading="skeLoading"
      >
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              :error.sync="error"
              error-text="请求失败，点击重新加载"
              @load="onLoad"
            >
              <div class="app_banner">
                <banner :bannerList='bannerList'/>
              </div>
              <div class="app_nav">
                <navList :navList='navList' />
              </div>
              <div class="app_discount">
                <discount :discount='discountsList' />
              </div>
              <!-- <div class="app_hotshop">
                <hotShop :hotShop='hotShopList' />
              </div> -->
              <div class="app_con">
                  <contop :partnerList="partnerList" />
              </div>
              <!-- <div class="app_shopList">
                  <hotlist :shopList='shopList'/>
              </div> -->
            </van-list>
        </van-pull-refresh>
      </van-skeleton>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import banner from '@/components/home/banner.vue'
import navList from '@/components/home/nav.vue'
import discount from '@/components/home/discount.vue'
import contop from '@/components/home/contop.vue'
@Component({
  components: {
    banner,navList,discount,contop
  }
})
export default class homeIndex extends Vue {
  private skeLoading: boolean = true;
  private isLoading: boolean = false;
  private loading: boolean = false;
  private error: boolean = false;
  private pageSize: number = 10;
  private dataList: Array<object> = [];
  private bannerList: Array<object> = [];
  private navList: Array<object> = []; //导航
  private partnerList: Array<object> = []; //新品
  private finished: boolean = false;
  private homePageNum: number = 1;
  private shopList: Array<object> = [];
  private discountsList: Array<object> = [];
  private hotShopList: Array<object> = [];
  private first: boolean = true;
  created() {
    if (this.first == true) {
      this.$toast.loading({ duration: 0,forbidClick: true });
      this.getBanner()
      this.getPartner()
      this.categoryList()
      this.getDiscountsList()
      this.getHotList()
      this.first = false
    }
  }
  beforeRouteLeave(to: any, from: any, next: any) {
      // this.$store.commit('updateClildrenAliveList', { name: 'homeIndex', status: true });
      setTimeout(() => {
          next();
      }, 0)
  }
  private onRefresh() {
    this.loadfirst();
  }
  private loadfirst() {
    this.finished = false;
    this.isLoading = false;
    this.$toast.loading({ duration: 0, forbidClick: true });
    this.getBanner();
    this.categoryList();
    this.getDiscountsList();
    this.getHotList();
    this.shopList = [];
    this.homePageNum = 1;
    // this.loadmore()
  }
  // 上啦加载
  private onLoad() {
    this.loadmore();
  }
  private async loadmore() {
    var params = {
      page: this.homePageNum,
      pageSize: this.pageSize
    };
    this.$http.shopList(params)
      .then((res: any) => {
        if (res.data.code == 0) {
          this.shopList = this.shopList.concat(res.data.data);
          this.homePageNum++;
          this.loading = false;
          if (res.data.data.length < this.pageSize) {
            this.finished = true;
          }
        } else {
          this.finished = true;
        }
      })
      .catch(() => {
        this.error = true;
      });
  }
  private getBanner() {
    this.$http.banner().then((res: any) => {
      if (res.data.code == 0) {
        this.bannerList = res.data.data;
      }
    });
  }
  // 获取分类
  private categoryList() {
    const data = this.$http.category().then((res: any) => {
      this.navList = res.data.data;
      this.skeLoading = false;
      this.$toast.clear();
    });
  }
  // 获取优惠券
  private getDiscountsList() {
    this.$http.discountsList().then((res: any) => {
      if (res.data.code == 0) {
        this.discountsList = res.data.data;
      }
    });
  }
  // 获取首页图片
  private getPartner() {
    this.$http.partner().then((res: any) => {
      if (res.data.code == 0) {
        this.partnerList = res.data.data;
      }
    });
  }
  // 获取热门商品
  private getHotList() {
    var params = {
      page: 1,
      pageSize: 10,
      orderBy: "ordersDown"
    };
    this.$http.shopList(params).then((res: any) => {
      if (res.data.code == 0) {
        this.hotShopList = res.data.data;
      }
    });
  }
  goProduct() {
    this.$router.push({ path: "/productList" });
  }
}
</script>
