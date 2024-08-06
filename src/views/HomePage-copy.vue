<script>
import { DotChartOutlined, SendOutlined, WarningOutlined } from '@ant-design/icons-vue'

export default {
  name: 'HomePage',
  components: { DotChartOutlined, WarningOutlined },
  mounted () {
    // 主页背景图片轮播
    setInterval(() => {
      this.bgImg.index = (this.bgImg.index + 1) % this.bgImg.images.length
    }, 6000)
  },
  data () {
    return {
      bgImg: {
        index: 0,
        images: [
          'https://www.gzcsx.gov.cn/syqt/jxcsbjqh/202310/W020231017426763808586_ORIGIN.png',
          'https://www.gzcsx.gov.cn/syqt/jxcsbjqh/202310/W020231017427000118087_ORIGIN.png'
        ]
      },
      tools: [
        {
          icon: DotChartOutlined,
          name: '土壤数据监控',
          path: '/soil-monitoring'
        },
        {
          icon: DotChartOutlined,
          name: '空气数据监控',
          path: '/air-monitoring'
        },
        {
          icon: WarningOutlined,
          name: '预警信息',
          path: '/alert'
        },
        {
          icon: SendOutlined,
          name: '无人机控制',
          path: '/UAVControl'
        }
      ]
    }
  }
}
</script>

<template>
  <body>
  <a-row>
    <a-col span="4">
      <ul>
        <li><router-link to="/soil-monitoring">土壤检测</router-link></li>
        <li>空气监测</li>
        <li>预警信息</li>
        <li>无人拍摄</li>
      </ul>

    </a-col>
    <a-col span="20">

  <div class="img" :style="{backgroundImage: `url(${bgImg.images[bgImg.index]})`}">
    <div class="changshun"/>
  </div>
  <div class="tools">
    <template v-for="(item, index) in tools" :key="index">
        <router-link :to="{path: item.path}" class="tool">
          <component :is="item.icon" />
          <span>{{item.name}}</span>
        </router-link>
    </template>
  </div>
    </a-col>
  </a-row>
</body>
</template>

<style scoped>

body{
 background-size:cover;
 
  background-color: #C8ECC9;
  background:url(css/background-image.png);
}

.tools {
  margin: auto auto 20vw auto;
  width: 70%;
  display: flex;
  flex-wrap: wrap; 
  
}

.tool {
  background-color: #e3e3e3;
  border-radius: 2%;
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 35px 3% 0 0;
  padding-top: 30px;
  padding-bottom: 40px;
}

.tool:hover {
  cursor: pointer;
  background-color: #d3d3d3;
}

.tool:deep(svg) {
  color: #003399;
  font-size: 90px;
}

.tools span {
  font-size: 20px;
  color: #3e3e3e;
  margin-top: 10px;
}

.img {
  width: 90%;
  background-size: 100% 100%;
  margin: 20px auto;
  height: 600px;
  border-radius: 30px;
  transition: 2s;
}

.changshun {
  background-image: url(@/assets/image.png);
  position: absolute;
  width: 110px;
  height: 225px;
  top: 5%;
  left: 85%;
  background-size: 100% 100%;
}




</style>
