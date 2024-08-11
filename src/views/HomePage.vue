<script>
import { DotChartOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import MarkdownViewer from '@/components/global/MarkdownViewer.vue'
import PageWithMenu from '../components/global/PageWithMenu.vue'
import solidIcon from '@/assets/icons/土壤监测设备 1.png'
import airIcon from '@/assets/icons/摸清空气质量现状 1.png'
import warningIcon from '@/assets/icons/预警 1.png'
import uavIcon from '@/assets/icons/照相 1.png'
import userIcon from '@/assets/icons/个人中心 1.png'
import settingIcon from '@/assets/icons/setting1.png'

export default {
  name: 'HomePage',
  components: {
    MarkdownViewer,
    PageWithMenu,
  },
  data() {
    return {
      menuOpts: [ 
        {
          iconUrl: solidIcon,
          name: '土壤检测 ',
          value: 'soil',
        },
        {
          iconUrl: airIcon,
          name: '空气监测',
          value: 'air',
        },
        {
          iconUrl: warningIcon,
          name: '预警信息',
          value: 'warning',
        },
        {
          iconUrl: uavIcon,
          name: '无人拍摄',
          value: 'uav',
        },
        {
          iconUrl: userIcon,
          name: '用户中心',
          value: 'user',
        },
        {
          iconUrl: settingIcon,
          name: '使用指南',
          value: 'setting',
        },
      ],
      currentModule: 'soil', // 用于跟踪当前显示的模块
      // 登录注册相关
      login: {
        phone: '',
        password: '',
      },
      register: {
        username: '',
        phone: '',
        code: '',
        password1: '',
        password2: '',
      },
      loginLoading: false,
      registerLoading: false,
      isRegister: false,
      sendCodeInfo: '发送验证码',
      // 背景图片轮播
      bgImg: {
        index: 0,
        images: [
          'https://www.gzcsx.gov.cn/syqt/jxcsbjqh/202310/W020231017426763808586_ORIGIN.png',
          'https://www.gzcsx.gov.cn/syqt/jxcsbjqh/202310/W020231017427000118087_ORIGIN.png',
        ],
      },
      // 侧边栏模块
      tools: [
        {
          icon: DotChartOutlined,
          name: '土壤数据监控',
          path: '/soil-monitoring',
        },
      ],
      // 用户指南
      markdownText: '',
      isLoggedIn: false,
    }
  },
  beforeMount() {
    if (this.currentModule === 'setting') {
      this.loadMarkdown()
    }
  },
  watch: {
    currentModule(newValue) {
      if (newValue === 'setting') {
        this.loadMarkdown()
      }
    },
  },
  computed: {
    user() {
      return this.$store.getters.userInfo
    },
    userRole() {
      const userRole = {
        'super-admin': '超级管理员',
        admin: '管理员',
        customer: '游客',
      }
      return userRole[this.user.role]
    },
  },
  methods: {
    // 登录注册相关
    async userRegister() {
      if (this.register.password1 !== this.register.password2) {
        message.error('两次密码不一致！')
        return
      }
      this.registerLoading = true
      await this.$store
        .dispatch('register', {
          username: this.register.username,
          password: this.register.password1,
          phone: this.register.phone,
          code: this.register.code,
        })
        .then(() => {
          message.info('注册成功！')
          this.$router.push({ name: 'Home' })
        })
        .catch((err) => {
          message.error('注册失败！')
          console.log(err)
        })
        .finally(() => {
          this.registerLoading = false
        })
    },
    async userLogin() {
      this.loginLoading = true
      this.$store
        .dispatch('login', this.login)
        .then(() => {
          message.info('登录成功！')
          this.isLoggedIn = true
          this.changeModule('soil')
        })
        .catch((err) => {
          if (err.status === 401) message.error('账号不存在或密码错误！')
          else message.error('登录失败！')
          console.log(err)
        })
        .finally(() => {
          this.loginLoading = false
        })
    },
    async sendCode() {
      if (
        this.register.phone.length !== 11 ||
        !this.register.phone.startsWith('1')
      ) {
        message.error('手机号格式不正确！')
        return
      }
      await this.$axios
        .post('/user/phone-verify', {
          phone: this.register.phone,
        })
        .then(() => {
          message.info('验证码发送成功！')
        })
        .catch((err) => {
          message.error('验证码发送失败！')
          console.log(err)
        })
        .finally(() => {
          // 倒计时60秒
          let time = 60
          this.sendCodeInfo = `${time}秒后重发`
          const timer = setInterval(() => {
            if (time === 0) {
              clearInterval(timer)
              this.sendCodeInfo = '发送验证码'
            } else {
              this.sendCodeInfo = `${time}秒后重发`
              time--
            }
          }, 1000)
        })
    },
    // 用户中心相关
    logout() {
      this.$store.dispatch('logout').then(() => {
        message.info('登出成功！')
        this.isLoggedIn = false
        this.changeModule('soil')
      })
    },
    addAdmin() {
      this.$axios
        .post('/user/add-admin', {
          phone: this.phone,
        })
        .then((res) => {
          message.info('添加成功！')
          this.phone = ''
        })
        .catch((err) => {
          message.error('添加失败！')
          console.log(err)
        })
    },
    // 用户指南相关
    loadMarkdown() {
      this.$axios.get('@/instructions.md').then((res) => {
        this.markdownText = res.data
      })
    },
    handleBack() {
      this.changeModule('soil')
    },
  },
  inject: ['$axios'],
  mounted() {
    // 主页背景图片轮播
    setInterval(() => {
      this.bgImg.index = (this.bgImg.index + 1) % this.bgImg.images.length
    }, 6000)
  },
}
</script>

<template>
  <PageWithMenu
    :isHome="true"
    :options="menuOpts"
    :multiple="false"
    v-model:selected="currentModule"
  >
    <template #content>
      <template
        v-if="['soil', 'air', 'warning', 'uav'].includes(currentModule)"
      >
        <div
          class="img"
          :style="{ backgroundImage: `url(${bgImg.images[bgImg.index]})` }"
        >
          <div class="changshun" />
        </div>
        <a-row>
          <a-col span="14">
            <div id="left">
              <template v-if="currentModule === 'soil'">
                <t-left>
                  <h1 class="topic">土壤监测</h1>
                  <p class="text">
                    土壤监测是指对土壤的物理、化学、生物等特性进行定期检测和分析的过程。
                  </p>
                  <div id="more">
                    <p>了解更多</p>
                  </div>
                </t-left>
              </template>
              <template v-else-if="currentModule === 'air'">
                <t-left>
                  <h1 class="topic">空气监测</h1>
                  <p class="text">
                    空气监测是对大气中空气质量参数进行定期检测和分析的过程，是环境保护工作中至关重要的一个方面。
                  </p>
                  <div id="more">
                    <p>了解更多</p>
                  </div>
                </t-left>
              </template>
              <template v-else-if="currentModule === 'warning'">
                <t-left>
                  <h1 class="topic">预警信息</h1>
                  <p class="text">
                    预警信息指的是对农作物、林木、花卉等植物病虫害状况进行定期监测和分析所得到的信息。
                  </p>
                  <div id="more">
                    <p>了解更多</p>
                  </div>
                </t-left>
              </template>
              <template v-else-if="currentModule === 'uav'">
                <t-left>
                  <h1 class="topic">无人拍摄</h1>
                  <p class="text">
                    无人拍摄指的是利用无人机进行空中观察和图像记录，以便进行实时的农作物监测、农业资源管理和病虫害防治。
                  </p>
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
      </template>
      <template
        v-else-if="currentModule === 'user' || currentModule === 'setting'"
      >
        <div id="content" class="translucent-box">
          <template v-if="currentModule === 'user'">
            <div v-if="isLoggedIn" style="height: 100%; width: 100%">
              <!-- 插入 userpage 的内容 --> 
              <a-page-header
                style="
                  border-bottom: 1px solid rgb(235, 237, 240);
                  padding: 10px 20px;
                  font-size: 1.1em;
                "
                title="用户信息"
                @back="handleBack"
              />
              <div style="margin: 20px 50px; display: flex">
                <a-descriptions :column="1" style="width: 20em">
                  <a-descriptions-item label="用户名">{{
                    user.username
                  }}</a-descriptions-item>
                  <a-descriptions-item label="UID">{{
                    user.uid
                  }}</a-descriptions-item>
                  <a-descriptions-item label="权限">{{
                    userRole
                  }}</a-descriptions-item>
                </a-descriptions>
                <div>
                  <a-button @click="logout">登出</a-button>
                  <a-row
                    v-if="user.role === 'super-admin'"
                    style="margin-top: 40px"
                  >
                    <a-input-group compact>
                      <a-input v-model:value="phone" style="width: 120px" />
                      <a-button type="primary" @click="addAdmin"
                        >添加管理员</a-button
                      >
                    </a-input-group>
                  </a-row>
                </div>
              </div>
            </div>
            <div v-else style="height: 100%; width: 100%">
              <!-- 插入 loginpage 的内容 -->
              <div style="height: 100%; width: 100%">
                <div class="user">
                  <div class="ad" :style="{ order: isRegister ? 0 : 1 }">
                    
                    <img class="pic" src="https://www.gzcsx.gov.cn/syqt/jxcsbjqh/202310/W020231017426763808586_ORIGIN.png">
                  </div>
                 
                  <!--登陆界面-->
                  <div
                    class="info"
                    v-if="!isRegister"
                    :style="{ order: 0, width: '100%' }"
                  >
                    <h1 class="login-text1" >
                      长顺县智慧农业
                    </h1>
                    <h1 class="login-text2" >
                       登录
                    </h1>
                    
                    <div class="input">
                      <div style=" margin-top: 3vh">
                        <p>手机号码</p>
                        <input class="phone-num"
                          v-model="login.phone"
                          placeholder="输入手机号"
                        />
                        <p>密码</p>                      
                        <input class="password"
                          v-model="login.password"
                          placeholder="输入密码"
                          @keydown.enter="userLogin"
                        />
                        <button class="login"
                          
                          
                          :loading="loginLoading"
                          :disabled="
                            login.password.length === 0 ||
                            login.phone.length === 0
                          "
                          @click="userLogin"
                          >登 录 -></button
                        >
                      </div>
                      <div
                        class="register"
                        style="width: 80%; display: flex; flex-direction: row"
                      >
                        <button class="down" type="link" @click="isRegister = true"
                          >立即注册</button
                        >
                        <button class="down" type="link">忘记密码</button>
                      </div>
                    </div>
                  </div>

                  <!--注册页面-->
                  <div v-if="isRegister" :style="{ order: 1, width: '100%' }">
                    <h1 class="login-text1" >
                      长顺县智慧农业
                    </h1>
                    <h1 class="login-text2" >
                       注册
                    </h1>
  
                    <div class="input">
                      <input
                        v-model="register.username"
                        placeholder="输入用户名"
                      />
                      <input
                        v-model="register.phone"
                        placeholder="输入手机号"
                        :enter-button="sendCodeInfo"
                        @search="sendCode"
                        :disabled="sendCodeInfo !== '发送验证码'"
                      />
                      <button class="down" @click="sendCode">发送验证码</button>
                      <input
                        v-model="register.password1"
                        placeholder="输入密码"
                      />
                      <input
                        v-model="register.password2"
                        placeholder="重复密码"
                        @keydown.enter="userRegister"
                      />
                      <input
                          v-model="register.code"
                          placeholder="输入验证码"
                      />
                      <div class="inline-flex">
                        
                        <p>已有帐号？</p>
                        <button  class="down" type="link" @click="isRegister = false"
                          >去登录</button
                        >
                      </div>
                      <button class="login"
                        type="primary"
                        
                        :loading="registerLoading"
                        :disabled="
                          register.password1.length === 0 ||
                          register.username.length === 0 ||
                          register.phone === 0 ||
                          register.password2.length === 0
                        "
                        @click="userRegister"
                      >
                        注册
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <!--用户指南-->
          <template v-else-if="currentModule === 'setting'">
            <div class="setting">
              <MarkdownViewer :source="markdownText" />
            </div>
          </template>
        </div>
      </template>
    </template>
  </PageWithMenu>
</template>

<style scoped>
.img {
  width: 95%;
  background-size: 100% 100%;
  margin: 0 0 0 1.5%;
  height: 52vh;
  border-radius: 2vw;
  transition: 2s;
  border: #69a67c 2px solid;
}

.changshun {
  background-image: url('@/assets/image.png');
  position: relative;
  width: 7vw;
  height: 15vw;
  top: 10%;
  left: 84%;
  background-size: 100% 100%;
}

#left {
  background-color: rgba(105, 166, 124, 0.9);
  background-image: url('css/soiltest-icon.png');
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
  background-image: url('css/入口.png');
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

/* tools页面样式 */
.translucent-box {
  margin-top: 0vh;
  margin-left: 2vh;
  margin-right: 7vh;
  height: 82vh;
  background-color: #69a67ce5;
  border-radius: 1.34vw;
}
/* 登录注册页面样式 */
.user {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.user div {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content:left;
  align-items:normal;
  
}
img.pic{
  width: 100%;
  background-size: cover;
}

/* 登录标题文字样式 */
.login-text1{
  align-items:normal;
  font-size: 3rem; 
  color: #fcd85e; 
  width: 100%;
  font-family:"Microsoft Yahei", "微软雅黑", Arial, sans-serif;
  font-weight: bolder;
  position: relative;
  left: 5vw;
  padding-top: 10vh;
}
.login-text2{
  align-items:normal;
  font-size: 2.5rem; 
  color: #ffffff; 
  width: 100%;
  font-family:"Microsoft Yahei", "微软雅黑", Arial, sans-serif;
  font-weight:500;
  position: relative;
  left: 5vw;
}
/*输入框上面的小字*/
p{
  align-items: center !important;
  color: #ffffff;
}

/*输入框*/
div.input{
  padding-left: 5vw;
}
input{
  width: 75%;
  color: #3b3b3b; 
  font-size: 1.3rem;
  border-radius: 0.5vw;
  border-color: #ffffff;
  background-color: #c8ecc9;
  padding-top:0.7vh ;
  padding-bottom:0.4vh ;
  padding-left:0.7vh ;  


  margin-bottom: 2vh;
}
button.login{
  width: 75%;
  background: linear-gradient(to right, #69A67C, #90C29B);
  border-radius: 0.5vw;
  border-color: #ffffff;
  padding-top:1.2vh ;
  padding-bottom:1.2vh ;
  margin-top: 1vh;
  margin-bottom: 2vh;
  color: #ffffff;
}
button.down{
  width: 25%;
  color: #c8ecc9;
  background-color: rgba(0,0,0,0);
  border-color: rgba(0,0,0,0);
  text-decoration: underline;
  margin-top: -1vh;
  margin-bottom: 1vh;
  font-size: 1.3rem;
}



.ad {
  transition: 1s;
  border: solid 1px rgb(255, 255, 255);
  border-radius: 1.34vw;
  height: 82vh;
}



.inline-flex {
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  flex-direction: row !important;
  margin-bottom: 20px;
  width: 100% !important;
}
/* 使用指南页面样式 */
.setting {
  max-height: 82vh; /* 设置最大高度，根据需要调整 */
  overflow-y: auto; /* 启用垂直滚动 */
  padding-right: 2cqb; /* 滚动时右侧留出一些空隙 */
  border: 1px solid #98ba7c; /* 添加边框以区分滚动区域 */
  background-color: #f9f9f9; /* 滚动区域背景色 */
  border-radius: 1.34vw;
}
</style>
