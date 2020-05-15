<template>
    <div>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
        <div class="app_bottom">
            <bottom/>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import bottom from '@/components/layout/bottom.vue'
// import { mapState } from 'vuex'
@Component({
  components: {
    bottom
  }
})
export default class index extends Vue {

}
</script>