<template>
    <div class="navIndex">
        <div class="nav_search">
            <navTop/>
        </div>
        <van-tabs v-model="activeName">
            <van-tab v-for="(item,index) in allData" :name="item.id+''" :title="item.name" :key="item.id">
                <div class="nav_right">
                    <div v-if="item.children.length>0">
                        <div class="right_con" v-for="items in item.children" :key="items.id">
                            <div class="right_top_title">{{items.name}}</div>
                            <ul>
                                <li v-for="item1 in items.children" @click="goProduct(item1)">
                                    <div class="rightImg">
                                        <img v-lazy="item1.icon" alt="">
                                    </div>
                                    <div class="rightTitle">{{item1.name}}</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="right_con" v-else>暂无数据</div>
                </div>
            </van-tab>
        </van-tabs>
    </div>
</template>
<script>
import navTop from './navTop'
import Vue from 'vue'
export default {
    name: 'navIndex',
    components:{
        navTop
    },
    data() {
        return {
            allList: [],
            childrenList: [],
            isActive: 0,
            activeName: null
        }
    },
    computed: {
        allData(){
            var newArr = []
            this.allList.forEach(ele => {
                if(ele.level == 1) {
                    let level2Arr = this.allList.filter(v => {
                        return ele.id == v.pid
                    })
                    if(level2Arr.length > 0) {
                        level2Arr.forEach(e => {
                            let level3Arr = this.allList.filter(v => {
                                return e.id == v.pid
                            })
                            e.children = level3Arr
                        })
                    }
                    ele.children = level2Arr
                    newArr.push(ele)
                }
            });
            return newArr
        },
        
    },
    methods: {
        categoryList(){
            this.$http.category().then((res)=>{
                this.allList = res.data.data
            })
        },
        goProduct(items){
            if(items.key == '1') {
                // sessionStorage.setItem('productObj',JSON.stringify({id: items.id,name:items.name}))
                this.$router.push({path: '/productList',query: {id: items.id,name:items.name}})
            } else {
                this.$router.push({path: '/productList',query: {name: items.name}})
            }
        }
    },
    created() {
        this.categoryList()
    },
    mounted() {
    },
    beforeRouteLeave(to, from, next) {
        this.$store.commit('updateClildrenAliveList', { name: 'navIndex', status: true });
        setTimeout(() => {
            next();
        }, 0)
    },
}
</script>