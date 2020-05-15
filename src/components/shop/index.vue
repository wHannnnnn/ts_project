<template>
  <div class="cart">
    <van-nav-bar title="购物车" fixed :z-index='999'>
      <div slot="right"
        @click="onStatusClicked">{{statusTip}}
      </div>
    </van-nav-bar>
    <van-skeleton
      title
      :row="3"
      :loading="loginUser?loading:false"
    >
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div class="content"
          v-if="goods.length">
          <!-- 可以购买的商品 -->
            <van-checkbox-group class="list"
              v-model="checkedGoods">
              <van-checkbox class="list-item"
                v-for="(item, index) in buyGoods"
                :key="index"
                :name="item.key"
                checked-color="#ff4444"
                label-disabled>
                <van-swipe-cell :before-close="beforeClose">
                  <van-card :title="item.name"
                    @click="goDetails(item.goodsId)"
                    :class="item.stores == 0?'noMore':''"
                    :desc="item.propTitle"
                    :price="item.price.toFixed(2)"
                    :thumb="item.pic">
                    <div slot="tags" class="tags">
                      <span v-for="skuItem in item.sku" :key="skuItem.optionId">
                        {{skuItem.optionName}}:{{skuItem.optionValueName}},
                      </span>
                    </div>
                    <!-- <div slot="num" class="noStores" v-if="item.stores == 0">
                      无货
                    </div> -->
                    <div slot="num">
                      <van-stepper
                        :disabled="item.stores == 0?true:false"
                        :value="item.number"
                        async-change
                        @minus="reduce(item,index)"
                        @plus="add(item,index)"
                      />
                    </div>

                  </van-card> 
                  <template slot="right">
                    <div class='right'>
                      <van-button square @click="deleteOne(item)" color="linear-gradient(to right, #EF9A9A, #D32F2F)" text="删除"/>
                      <van-button square color="linear-gradient(to right, #FFEB3B, #FFA726" text="收藏"/>
                    </div>
                </template>
                </van-swipe-cell>
              </van-checkbox>
            </van-checkbox-group>
          <!-- 已经失效的商品 -->
          <div class="list" v-if="oldGoods&&oldGoods.length>0">
            <div class="list_top">
              <div class="left">
                失效商品{{oldGoods.length}}件
              </div>
              <div class="right">
                <span class="add_collect">移到收藏夹</span>
                <span class="remove" @click="removeOld">清空失效商品</span>
              </div>
            </div>
            <div class="list-item" v-for="(item, index) in oldGoods" :key="item.key">
              <van-swipe-cell>
                <div class="listNoMore">
                  <div><van-tag round>失效</van-tag></div>
                  <van-card :title="item.name"
                    :class="item.stores == 0?'noMore':''"
                    :desc="item.propTitle"
                    :price="item.price.toFixed(2)"
                    :thumb="item.pic">
                    <div slot="tags" class="tags">
                      <span v-for="skuItem in item.sku" :key="skuItem.optionId">
                        {{skuItem.optionName}}:{{skuItem.optionValueName}},
                      </span>
                    </div>
                    <!-- <div slot="num" class="noStores" v-if="item.stores == 0">
                      无货
                    </div> -->
                    <div slot="num">
                      商品库存不足
                    </div>
                  </van-card>
                </div>
                <template slot="right">
                  <div class='right'>
                    <van-button square @click="deleteOne(item)" color="linear-gradient(to right, #EF9A9A, #D32F2F)" text="删除" />
                    <van-button square color="linear-gradient(to right, #FFEB3B, #FFA726" text="收藏"/>
                  </div>
                </template>
              </van-swipe-cell>
            </div>
          </div>
        </div>
      </van-pull-refresh>
      <!-- 结算栏 -->
      <van-submit-bar v-if="statusTip === '管理'"
        class="submit-bar"
        :price="totalPrice | formatPoint"
        :button-text="submitBarText"
        :disabled="!checkedGoods.length"
        @submit="onSubmit">
        <van-checkbox v-model="checkedAll">全选</van-checkbox>
      </van-submit-bar>
      <!-- 删除栏 -->
      <van-submit-bar v-else
        class="delete-bar"
        button-text="删除"
        :disabled="!checkedGoods.length"
        @submit="onDeleteClicked">
        <van-checkbox v-model="checkedAll">全选</van-checkbox>
      </van-submit-bar>
      <div class="no-data"
        v-if="!goods.length || !loginUser">
        <!-- <img src="../../assets/no-cart.png"
          alt=""> -->
        <div class="no-data-title">购物车空荡荡</div>
        <div class="no-data-txt">快给我挑点宝贝</div>
        <van-button class="no-data-btn"
          plain
          type="danger"
          @click="handleHomePage">去逛逛</van-button>
      </div>
    </van-skeleton>
  </div>
</template>
<script>
import Vue from 'vue'
import {mapState} from 'vuex'
export default {
  name: 'shopIndex',
  data() {
    return {
      loading: false,
      isLoading: false,
      show: true,
      active: 0,
      statusTip: '管理', // 管理,完成
      checkedAll: false,
      checkedGoods: [],
      goods: [],
      first: true
    }
  },
  computed: {
    ...mapState(['loginUser']),
    submitBarText() {
      const count = this.checkedGoods.length
      return '结算' + (count ? `(${count})` : '')
    },
    totalPrice() {
      const price = this.buyGoods.reduce((total, item) => total + (this.checkedGoods.indexOf(item.key) !== -1 ? item.price * item.number : 0), 0)
      return parseFloat(price.toFixed(2))
    },
    buyGoods(){
      return this.goods.filter((ele,index) =>{
          return ele.stores > 0
      })
    },
    oldGoods(){
      return this.goods.filter((ele,index) =>{
          return ele.stores <= 0
      })
    },
  },
  filters: {
    formatPoint(val) {
      return parseFloat((val * 100).toFixed(2))
    }
  },
  watch: {
    checkedAll() {
      if(this.checkedAll) {
        this.checkedGoods = this.buyGoods.map(item => item.key)
      }
      if(!this.checkedAll && this.checkedGoods.length == this.buyGoods.length){
        this.checkedGoods = []
      }
    },
    checkedGoods() {
      this.checkedGoods.length > 0 && this.checkedGoods.length === this.buyGoods.length?this.checkedAll = true:this.checkedAll = false
    }
  },
  methods: {
    onRefresh(){
      this.getCartInfo()
    },
    getCartInfo(){
      this.$toast.loading({ duration: 0,forbidClick: true });
      this.$http.getCartInfo().then((res)=>{
        if(res.data.code == 0) {
          // this.goods = []
          this.checkedGoods = []
          this.checkedAll = false
          this.goods = res.data.data.items
          this.goods.forEach((v,i) => {
              this.getPrice(v).then((res)=>{
                Vue.set(this.goods[i],'stores',res.data.data?res.data.data.stores:0)
              })
          });
          this.isLoading = false
          this.loading = false
          this.$toast.clear()
        } else {
          this.isLoading = false
          this.loading = false
          this.$toast.clear()
        }
      })
    },
    handleHomePage() {
      this.$router.replace({ path: '/homeIndex' })
    },
    onStatusClicked() {
      this.statusTip === '管理' ? this.statusTip = '完成' : this.statusTip = '管理'
    },
    // 删除多选
    onDeleteClicked() {
      this.$dialog.confirm({
        message: `确定要删除这${this.checkedGoods.length}个商品吗?`,
        cancelButtonText: '我再想想'
      }).then(() => {
        this.checkedGoods.forEach((ele)=>{
          // 删除接口
          this.deleteCart(ele)
        })
      }).then(()=>{
        this.checkedGoods = []
        this.$toast.success('删除成功');
      })
    },
    reduce(item,index) {
      event.stopPropagation()
      this.$toast.loading({ forbidClick: true });
      var number = item.number - 1
      var params = {
        key: item.key,
        number: number
      }
      this.$http.cartNumber(params).then((res)=>{
        Vue.set(this.buyGoods[index],'number',--item.number)
        this.$toast.clear();
      })
    },
    add(item,index) {
      event.stopPropagation()
      this.$toast.loading({ forbidClick: true });
      //先获取商品库存
      var number = item.number + 1
      this.getPrice(item).then((res)=>{
        if(res.data.data.stores && number <= res.data.data.stores){
          var params = {
            key: item.key,
            number: number
          }
          this.$http.cartNumber(params).then((res)=>{
            Vue.set(this.buyGoods[index],'number',++item.number)
            this.$toast.clear();
          })
        } else {
          this.$toast('没有更多商品了')
        }
      })
    },
    // 获取商品库存价格
    async getPrice(item){
      var str = ''
      item.sku.forEach(v => {
        str += `${v.optionId}:${v.optionValueId},`
      });
      const res = this.$http.getPrice({goodsId: item.goodsId,propertyChildIds:str})
      return res
    },
    // 滑块删除
    beforeClose({ position, instance }){
      instance.close()
    },
    // 删除一条
    deleteOne(item){
      this.$dialog.confirm({
        message: '确定删除吗？',
        cancelButtonText: '我再想想'
      }).then(() => {
        this.deleteCart(item.key)
      }).then(()=>{
          this.$toast.success('删除成功');
      })
    },
    // 删除失效全部
    removeOld(){
      this.$dialog.confirm({
        message: `确定要清空这${this.oldGoods.length}个失效商品吗?`,
        cancelButtonText: '我再想想'
      }).then(() => {
        this.oldGoods.forEach((ele)=>{
          // 删除接口
          this.deleteCart(ele.key)
        })
      }).then(()=>{
        this.$toast.success('删除成功');
      })
    },
    // 删除接口
    deleteCart(key){
      this.$http.removeCart({key: key}).then((res)=>{
        if(res.data.code == 0){
          for (let i = 0; i < this.goods.length; i++) {
            if(this.goods[i].key == key){
              this.goods.splice(i,1)
              break
            }
          }
        }
      })
    },
    // 去详情页
    goDetails(goodsId){
      this.$router.push({path: '/detailsIndex',query:{id: goodsId}})
    },
    onSubmit() {
      const buyArr = this.buyGoods.filter(ele => {
        return this.checkedGoods.includes(ele.key) == true
      })
      buyArr.forEach(ele=>{
        ele.propertyChildIds = ''
        ele.propertyName = ''
        ele.sku.forEach(v => {
          ele.propertyChildIds += `${v.optionId}:${v.optionValueId},`
          ele.propertyName += `${v.optionName}:${v.optionValueName},`
        });
        ele.selectedNum = ele.number
      })
      sessionStorage.setItem('orderData',JSON.stringify(buyArr))
      this.$router.push({path: '/placeOrder'})
     }
  },
  created() {
    console.log(this.first)
    if (this.first == true) {
      this.getCartInfo()
      this.first = false
    }
  },
  activated() {
    if(sessionStorage.getItem('cartRefresh')){
        this.getCartInfo()
        sessionStorage.removeItem('cartRefresh')
    }
  },
  mounted() {
  },
  beforeRouteLeave(to, from, next) {
      const status = to.path !== '/login'
      console.log(status)
      this.$store.commit('updateClildrenAliveList', { name: 'shopIndex', status: status });
      setTimeout(() => {
          next();
      }, 0)
  },
}
</script>