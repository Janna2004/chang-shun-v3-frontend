<script>
import { DotChartOutlined, WarningOutlined } from '@ant-design/icons-vue'

export default {
  name: 'HomePage',
  components: { DotChartOutlined, WarningOutlined },
  data() {
    return {
      currentModule: 'soil', // 用于跟踪当前显示的模块
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
      ]
    }
  },
  methods: {
    changeModule(module) {
      this.currentModule = module;
    }
  },
  mounted() {
    // 主页背景图片轮播
    setInterval(() => {
      this.bgImg.index = (this.bgImg.index + 1) % this.bgImg.images.length
    }, 6000)
  }
}
</script>

<template>
  <body>
    <a-row>
      <a-col span="4">
        <ul id="side">
          <p id="general">General</p>
          <!-- 点击更改当前模块 -->
          <li id="soil" @click="changeModule('soil') " :class="{ 'active-item': currentModule === 'soil', 'lighten': currentModule === 'soil' }">土壤检测</li>
          <li id="air" @click="changeModule('air')" :class="{'active-item':currentModule === 'air', 'lighten': currentModule === 'air' }">空气监测</li>
          <li id="warning" @click="changeModule('warning')" :class="{'active-item':currentModule === 'warning', 'lighten': currentModule === 'warning' }">预警信息</li>
          <li id="uav" @click="changeModule('uav')" :class="{'active-item':currentModule === 'uav', 'lighten': currentModule === 'uav' }">无人拍摄</li>
          <p id="tools">Tools</p>
          <router-link :to="{ name: isLogin ? 'UserInfo' : 'Login' }" exact>
            <li id="user">用户中心</li>
          </router-link>
          <router-link to="/about" exact>
            <li id="setting">使用指南</li>
          </router-link>
        </ul>
      </a-col>
      <a-col span="20">
        <div class="img" :style="{ backgroundImage: `url(${bgImg.images[bgImg.index]})` }">
          <div class="changshun" />
        </div>
        <a-row>
          <a-col span="14">
            <div id="left">
              <template v-if="currentModule === 'soil'">
                <t-left>
                  <h1 class="topic">土壤监测</h1>
                  <p class="text">土壤监测是指对土壤的物理、化学、生物等特性进行定期检测和分析的过程。</p>
                  <div id="more">
                    <p>了解更多</p>
                  </div>
                </t-left>
              </template>
              <template v-else-if="currentModule === 'air'">
                <t-left>
                  <h1 class="topic">空气监测</h1>
                  <p class="text">空气监测是对大气中空气质量参数进行定期检测和分析的过程，是环境保护工作中至关重要的一个方面。</p>
                  <div id="more">
                    <p>了解更多</p>
                  </div>
                </t-left>
              </template>
              <template v-else-if="currentModule === 'warning'">
                <t-left>
                  <h1 class="topic">预警信息</h1>
                  <p class="text">预警信息指的是对农作物、林木、花卉等植物病虫害状况进行定期监测和分析所得到的信息。</p>
                  <div id="more">
                    <p>了解更多</p>
                  </div>
                </t-left>
              </template>
              <template v-else-if="currentModule === 'uav'">
                <t-left>
                  <h1 class="topic">无人拍摄</h1>
                  <p class="text">无人拍摄指的是利用无人机进行空中观察和图像记录，以便进行实时的农作物监测、农业资源管理和病虫害防治。</p>
                  <div id="more">
                    <p>了解更多</p>
                  </div>
                </t-left>
              </template>
            </div>
          </a-col>
          <a-col span="10">
            <div id="right">
              <template v-if="currentModule === 'soil'">
                <t-right>
                  <h1 class="topic">土壤<br />数据监控</h1>
                  <router-link to="/soil-monitoring" id="tool" exact>
                    <div id="enter">
                      <p>点击进入</p>
                    </div>
                  </router-link>
                </t-right>
              </template>
              <template v-else-if="currentModule === 'air'">
                <t-right>
                  <h1 class="topic">空气<br />数据监控</h1>
                  <router-link to="/air-monitoring" id="tool" exact>
                    <div id="enter">
                      <p>点击进入</p>
                    </div>
                  </router-link>
                </t-right>
              </template>
              <template v-else-if="currentModule === 'warning'">
                <t-right>
                  <h1 class="topic">预警<br />信息监控</h1>
                  <router-link to="/alert" id="tool" exact>
                    <div id="enter">
                      <p>点击进入</p>
                    </div>
                  </router-link>
                </t-right>
              </template>
              <template v-else-if="currentModule === 'uav'">
                <t-right>
                  <h1 class="topic">无人<br />拍摄监控</h1>
                  <router-link to="/UAVControl" id="tool" exact>
                    <div id="enter">
                      <p>点击进入</p>
                    </div>
                  </router-link>
                </t-right>
              </template>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </body>
</template>

<style scoped>
body {
  background-size: cover;

  background-color: #c8ecc9;
  background: url(css/background-image.png);
}

.img {
  width: 95%;
  background-size: 100% 100%;
  margin: 2.8vw 0% auto 1.5%;
  height: 52vh;
  border-radius: 2vw;
  transition: 2s;
  border: #69a67c 2px solid;
}

.changshun {
  background-image: url(@/assets/image.png);
  position: relative;
  width: 7vw;
  height: 15vw;
  top: 10%;
  left: 84%;
  background-size: 100% 100%;
}

ul#side {
  list-style: none;
  margin: 2.6vw auto 4.6vw 0px;
  position: relative;
  width: 90%;
  background-color: #c8ecc9;
  padding-left: 0px;
  border-top-right-radius: 2vw;
  border-bottom-right-radius: 2vw;
  height: 83vh;
  font-family: '等线';
  border: #69a67c 0.13vw solid;
}

ul#side li.active-item {
  background-color: rgb(105, 166, 124); /* 更改背景色 */
  color: white; /* 更改文本颜色 */
  transform: translateX(18%); /* 向右移动 */
  transition: transform 0.3s ease; /* 添加动画效果 */
  border-top-right-radius: 0vw;
  border-bottom-right-radius: 0vw;
  border-top-left-radius: 0.66vw;
  border-bottom-left-radius: 0.66vw;
}

#general {
  color: #69a67c;
  font-size: 2vw;
  margin: 1vh auto 1.33vh 0.46vw;
  padding-top: 1.3vh;
}
#tools {
  color: #69a67c;
  font-size: 2vw;
  margin: -0.5vh auto 1.33vh 0.46vw;
  padding-top: 0.53vw;
}

#air {
  font-size: 2.13vw;
  color: black;

  position: relative;

  background-color: #b0dab5;
  border-top-right-radius: 0.66vw;
  border-bottom-right-radius: 0.66vw;
  width: 85%;
  padding-top: 1.3vh;
  padding-bottom: 1.2vh;
  padding-left: 1.13vw;
  margin-bottom: 2.5vh;
}
#air::before {
  content: '';
  display: inline-block;
  background: url(css/摸清空气质量现状 1.png);
  background-size: cover;
  width: 1.73vw;
  height: 1.73vw;
  position: relative;
  top: 1vh;
  left: -1vh;
}
#soil {
  font-size: 2.13vw;
  color: black;

  position: relative;

  background-color: #b0dab5;
  border-top-right-radius: 0.66vw;
  border-bottom-right-radius: 0.66vw;
  width: 85%;
  padding-top: 1.3vh;
  padding-bottom: 1.2vh;
  padding-left: 1.13vw;
  margin-bottom: 2.5vh;
}
#soil::before {
  content: '';
  display: inline-block;
  background: url(css/土壤监测设备 1.png);
  background-size: cover;
  width: 1.73vw;
  height: 1.73vw;
  position: relative;
  top: 1vh;
  left: -1vh;
}
#warning {
  font-size: 2.13vw;
  color: black;

  position: relative;

  background-color: #b0dab5;
  border-top-right-radius: 0.66vw;
  border-bottom-right-radius: 0.66vw;
  width: 85%;
  padding-top: 1.3vh;
  padding-bottom: 1.2vh;
  padding-left: 1.13vw;
  margin-bottom: 2.5vh;
}
#warning::before {
  content: '';
  display: inline-block;
  background: url(css/预警 1.png);
  background-size: cover;
  width: 1.73vw;
  height: 1.73vw;
  position: relative;
  top: 1vh;
  left: -1vh;
}

#uav {
  font-size: 2.13vw;
  color: black;

  position: relative;

  background-color: #b0dab5;
  border-top-right-radius: 0.66vw;
  border-bottom-right-radius: 0.66vw;
  width: 85%;
  padding-top: 1.3vh;
  padding-bottom: 1.2vh;
  padding-left: 1.13vw;
  margin-bottom: 2.5vh;
}
#uav::before {
  content: '';
  display: inline-block;
  background: url(css/照相 1.png);
  background-size: cover;
  width: 1.73vw;
  height: 1.73vw;
  position: relative;
  top: 1vh;
  left: -1vh;
}

#user {
  font-size: 2.13vw;
  color: black;

  position: relative;

  background-color: #b0dab5;
  border-top-right-radius: 0.66vw;
  border-bottom-right-radius: 0.66vw;
  width: 85%;
  padding-top: 1.3vh;
  padding-bottom: 1.2vh;
  padding-left: 1.13vw;
  margin-bottom: 2.5vh;
}
#user::before {
  content: '';
  display: inline-block;
  background: url(css/个人中心 1.png);
  background-size: cover;
  width: 1.73vw;
  height: 1.73vw;
  position: relative;
  top: 1vh;
  left: -1vh;
}

#setting {
  font-size: 2.13vw;
  color: black;

  position: relative;

  background-color: #b0dab5;
  border-top-right-radius: 0.66vw;
  border-bottom-right-radius: 0.66vw;
  width: 85%;
  padding-top: 1.3vh;
  padding-bottom: 1.2vh;
  padding-left: 1.13vw;
  margin-bottom: 2.5vh;
}
#setting::before {
  content: '';
  display: inline-block;
  background: url(css/setting1.png);
  background-size: cover;
  width: 1.73vw;
  height: 1.73vw;
  position: relative;
  top: 1vh;
  left: -1vh;
}

.lighten::before {
  filter: brightness(1.2); /* 增加亮度 */
  transition: filter 0.3s ease; /* 添加动画效果 */
}

#left {
  background-color: rgba(105, 166, 124, 0.9);
  background-image: url(css/soiltest-icon.png);
  background-position: 98% 40%;
  background-size: 33%;
  background-repeat: no-repeat;

  width: 90%;
  height: 27.5vh;
  border-radius: 1.33vw;
  margin: 2.5vh 0px auto 1.33vw;
  padding: 2.5vh auto auto 1.33vw;
}
t-left {
  position: relative;
  top: 3vh;
  left: 2vw;
}
t-left h1 {
  font-size: 2.67vw;
  font-family: '等线';
  color: white;
}
t-left p {
  margin-top: -1vh;
  font-size: 1.13vw;
  font-family: '等线';
  color: white;
  width: 50%;
}

t-left div {
  margin: 4vh auto auto 0px;

  height: 15%;
  background-color: #c8ecc9;
  border-radius: 4vw;

  width: 19%;
}

t-left div p {
  font-size: 1.14vw;
  font-family: '等线';
  color: black;
  position: relative;
  top: 20%;
  left: 22%;
  width: 120%;
}

#right {
  background-color: rgba(105, 166, 124, 0.9);
  background-image: url(css/入口.png);
  background-position: 95% 40%;
  background-size: 33%;
  background-repeat: no-repeat;

  width: 97.5%;
  height: 27.5vh;
  border-radius: 1.34vw;
  margin: 2.5vh 0px auto 0px;
  position: relative;
  left: -6%;
}

t-right {
  position: relative;
  top: 3vh;
  left: 2vw;
}
t-right h1 {
  font-size: 2.7vw;
  font-family: '等线';
  color: white;
}
t-right div {
  margin: 4vh auto auto 0px;

  height: 15%;
  background-color: #c8ecc9;
  border-radius: 4vw;

  width: 23%;
}
t-right div p {
  font-size: 1.15vw;
  font-family: '等线';
  color: black;
  position: relative;
  top: 18%;
  left: 22%;
}
</style>
