<template>
  <div class="mine">
      <van-nav-bar title="我的" fixed>
          <van-icon name="setting-o" slot="right" @click='goSet'/>
      </van-nav-bar>
      <div class="mine_top bgc-radius-shadow">
          <div class="avatar">
            <img v-lazy='userDetail?userDetail.avatarUrl:avatar' alt=""> 
          </div>
          <div class="right">
            <div class="login" @click='login' v-if="!userDetail">登录/注册></div>
            <div class="userDetail" v-else>
              <div class="userName">{{userDetail?userDetail.nick:phoneReplace(userDetail.mobile)}}</div>
              <div class="level">普通用户</div>
            </div>
          </div>
      </div>
      <div class="money margin-bottom">
        <div class="money_top top_title">
          <span class="top_left">我的资产</span>
        </div>
        <van-grid :column-num="3">
          <van-grid-item>
            <div class="number">0</div>
            <div class="name">红包</div>
          </van-grid-item>
          <van-grid-item @click="goDiscountDetails">
            <div class="number">{{discountsLength}}</div>
            <div class="name">优惠券</div>
          </van-grid-item>
          <van-grid-item>
            <div class="number">0</div>
            <div class="name">积分</div>
          </van-grid-item>
        </van-grid>
      </div>
      <div class="order margin-bottom">
        <div class="order_top top_title">
          <span class="top_left">我的订单</span>
        </div>
        <van-grid :column-num="5">
          <van-grid-item v-for="item in orderList" @click="goOrderList(item.status)" :icon="item.icon" :text="item.title" :key="item.id" :info="item.info==0? '' : item.info"/>
        </van-grid>
      </div>
      <div class="logOut margin-bottom" v-if="userDetail">
          <van-button @click='logOut'>退出登录</van-button>
      </div>
  </div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
export default {
  data() {
    return {
        avatar: require('../../assets/images/avatar.png'),
        orderList: [
          {
            status: '0',
            title: '待付款',
            icon: 'credit-pay',
            info: 0
          },
          {
            status: '1',
            title: '待发货',
            icon: 'logistics',
            info: 0
          },
          {
            status: '2',
            title: '待收货',
            icon: 'send-gift-o',
            info: 0
          },
          {
            status: '3',
            title: '待评价',
            icon: 'comment-o',
            info: 0
          },
          {
            status: '4',
            title: '全部订单',
            icon: 'label-o',
          },
        ],
        statistics: {},
        discountsLength: 0
    }
  },
  computed: {
    ...mapState(['loginUser']),
    userDetail(){
      return this.loginUser?JSON.parse(this.loginUser):null
    }
  },
  methods: {
    ...mapMutations(['loginOut']),
    login(){
      this.$router.push({path: '/login'})
    },
    phoneReplace(tel){
        return this.$tools.phoneReplace(tel)
    },
    logOut(){
      this.$dialog.confirm({
          message: '确认退出？',
          cancelButtonText: '取消'
      }).then(() => {
          this.loginOut()
          this.$store.commit('resetChildrenAlive')
          this.$router.push({path: '/login'})
      }).catch(() => {
      });
    },
    goSet(){
      this.$router.push({path: '/setting'})
    },
    goOrderList(status){
      this.$router.push({path: '/orderList',query:{status:status}})
    },
    // 用户信息
    // getUserDetail(){
    //   this.$http.userDetail().then((res)=>{
    //     this.userDetail = res.data.data.base
    //     console.log(res)
    //   })
    // },
    // 订单统计
    orderStatistics(){
      this.$http.orderStatistics().then((res)=>{
        if(res.data.code == 0) {
          this.orderList[0].info = res.data.data.count_id_no_pay
          this.orderList[1].info = res.data.data.count_id_no_transfer
          this.orderList[2].info = res.data.data.count_id_no_confirm
          this.orderList[3].info = res.data.data.count_id_no_reputation
        }
      })
    },
    // 我的优惠券
    myDiscounts(){
      this.$http.myDiscounts().then((res)=>{
        if(res.data.code == 0){
          this.discountsLength = res.data.data.length
          this.discountsList = res.data.data
        }
      })
    },
    goDiscountDetails(){
      this.$router.push({name: '优惠券',params:{data: this.discountsList}})
    }
  },
  created() {
    this.orderStatistics()
    this.myDiscounts()
  },
  mounted() {
  },
}
</script>