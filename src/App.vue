<script>
import LayoutHeader from '@/components/layout/LayoutHeader.vue'
import LayoutFooter from '@/components/layout/LayoutFooter.vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

export default {
  name: 'APP',
  components: { LayoutFooter, LayoutHeader },
  data () {
    return {
      // antd for vue 组件汉化，同步dayjs默认时区汉化，绑定在a-config-provider上
      locale: zhCN
    }
  }
}
</script>

<template>
  
    
      
        <LayoutHeader/>
     
      
          <router-view/>
      
     
        <LayoutFooter/>
  
</template>


<style scoped>



</style>
