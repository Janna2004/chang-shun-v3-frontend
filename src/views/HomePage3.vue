<script>
import { DotChartOutlined, SendOutlined, WarningOutlined } from '@ant-design/icons-vue'
import { mapGetters } from 'vuex'
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
        },      ]
    }
  }
}
</script>

<template>
  <body>
  <a-row>
    <a-col span="4">
      <ul id="side">
        <p id="general">General</p>
        <router-link :to="{name: 'Home'}" exact>
          <li id="soil">土壤检测</li>
        </router-link>
        <router-link to="/home2" exact>
        <li id="air">空气监测</li>
        </router-link>
        <router-link to="/home3" exact>
        <li id="warning">预警信息</li>
        </router-link>
        <router-link to="/home4" exact>
        <li id="uav">无人拍摄</li>
        </router-link> 
        <p id="tools">Tools</p>
        <router-link :to="{name: isLogin ? 'UserInfo' : 'Login'}" exact>
        <li id="user">用户中心</li>
        </router-link>
        <router-link to="/about" exact>
        <li id="setting">设置</li>
        </router-link>
      </ul>

    </a-col>
    <a-col span="20">
      

            <div class="img" :style="{backgroundImage: `url(${bgImg.images[bgImg.index]})`}">
              <div class="changshun"/>
            </div>
      <a-row>
        <a-col span="14">
          <div id="left">
            <t-left>
              <h1 class="topic">
                预警信息
              </h1>
              <p class="text">
                预警信息指的是对农作物、林木、花卉等植物病虫害状况进行定期监测和分析所得到的信息。
              </p>
              <div id="more">
              <p>了解更多</p>
              </div>
            </t-left>
            
          </div>
        </a-col>
        <a-col span="10">
            <div id="right">
              <t-right>
                <h1 class="topic">
                预警信息<br/>查询入口
                </h1>
                  <router-link to="/alert" id="tool" exact>
                    <div id="enter">
                      <p>点击进入</p>
                    </div>
                  </router-link>
              </t-right>
            </div>
        </a-col>
      </a-row>      
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



.img {
  width: 95%;
  background-size: 100% 100%;
  margin: 40px 0% auto 1.5%;
  height: 500px;
  border-radius: 30px;
  transition: 2s;
  border: #69A67C 2px solid;
}

.changshun {
  background-image: url(@/assets/image.png);
  position: relative;
  width: 110px;
  height: 225px;
  top: 10%;
  left: 84%;
  background-size: 100% 100%;
}

ul#side {
  list-style: none ;
  margin: 40px auto 70px 0px;
  position:relative;
 width: 90%;
  background-color: #C8ECC9;
  padding-left: 0px;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  height: 720px;
  font-family: '等线';
  border: #69A67C 2px solid;
}

.router-link-exact-active li#warning{
    position: relative;
    top:0px;
    background-color:rgb(105,166,124,0.6);
    color: white;
}

#general{
  color: #69A67C;
  font-size: 30px;
  margin:0px auto 20px 7px;
  padding-top: 12px;
}
#tools{
  color: #69A67C;
  font-size: 30px;
  margin:-20px auto 20px 7px;
  padding-top: 8px;
}




#air{
  font-size: 32px;
  color:black;

  position:relative;
  
  background-color: #B0DAB5;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  width: 85%;
  padding-top: 14px;
  padding-bottom: 11px;
  padding-left: 17px;
  margin-bottom: 35px;
}
#air::before{
  
  content: '';
  display: inline-block;
  background: url(css/摸清空气质量现状 1.png);
  background-size: cover;
  width: 26px;
  height: 26px;
  position:relative;
  top:5px;
  left:-5px;
  
  
}
#soil{
  font-size: 32px;
  color:black;

  position:relative;
  
  background-color: #B0DAB5;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  width: 85%;
  padding-top: 14px;
  padding-bottom: 11px;
  padding-left: 17px;
  margin-bottom: 35px;
}
#soil::before{
  
  content: '';
  display: inline-block;
  background: url(css/土壤监测设备 1.png);
  background-size: cover;
  width: 26px;
  height: 26px;
  position:relative;
  top:5px;
  left:-5px;
  
  
}
#warning{
  font-size: 32px;
  color:black;

  position:relative;
  
  background-color: #B0DAB5;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  width: 85%;
  padding-top: 14px;
  padding-bottom: 11px;
  padding-left: 17px;
  margin-bottom: 35px;
}
#warning::before{
  
  content: '';
  display: inline-block;
  background: url(css/预警 1.png);
  background-size: cover;
  width: 26px;
  height: 26px;
  position:relative;
  top:5px;
  left:-5px;
  
  
}

#uav{
  font-size: 32px;
  color:black;

  position:relative;
  
  background-color: #B0DAB5;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  width: 85%;
  padding-top: 14px;
  padding-bottom: 11px;
  padding-left: 17px;
  margin-bottom: 35px;
}
#uav::before{
  
  content: '';
  display: inline-block;
  background: url(css/Drone.png);
  background-size: cover;
  width: 26px;
  height: 26px;
  position:relative;
  top:5px;
  left:-5px;
  
  
}

#user{
  font-size: 32px;
  color:black;

  position:relative;
  
  background-color: #B0DAB5;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  width: 85%;
  padding-top: 14px;
  padding-bottom: 11px;
  padding-left: 17px;
  margin-bottom: 35px;
}
#user::before{
  
  content: '';
  display: inline-block;
  background: url(css/个人中心 1.png);
  background-size: cover;
  width: 26px;
  height: 26px;
  position:relative;
  top:5px;
  left:-5px;
  
  
}

#setting{
  font-size: 32px;
  color:black;

  position:relative;
  
  background-color: #B0DAB5;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  width: 85%;
  padding-top: 14px;
  padding-bottom: 11px;
  padding-left: 17px;
  margin-bottom: 35px;
}
#setting::before{
  
  content: '';
  display: inline-block;
  background: url(css/setting1.png);
  background-size: cover;
  width: 26px;
  height: 26px;
  position:relative;
  top:5px;
  left:-5px;
  
  
}

#left{
  
  background-color: rgba(105,166,124,0.9);
  background-image: url(css/soiltest-icon.png);
  background-position: 98% 40%;
  background-size: 33%;
  background-repeat: no-repeat;

  width: 90%;
  height: 200px;
  border-radius: 20px;
  margin:20px 0px auto 20px;
  padding: 20px auto auto 20px;

}
t-left{
  
  position: relative;
  top:25px;
  left:30px;
}
t-left h1{
  font-size: 40px;
  font-family: '等线';
  color: white;
}
t-left p{
  margin-top: -8px;
  font-size: 17px;
  font-family: '等线';
  color: white;
  width: 50%;
}

t-left div{
  margin: 20px auto auto 0px;
  
  
  height: 15%;
  background-color: #C8ECC9;
  border-radius: 60px;

  width: 19%;
}

t-left div p{
  font-size: 17px;
  font-family: '等线';
  color: black;
  position: relative;
  top: 20%;
  left: 22%;
  width: 120%;

}

#right{
  
  background-color: rgba(105,166,124,0.9);
  background-image: url(css/入口.png);
  background-position: 95% 40%;
  background-size: 33%;
  background-repeat: no-repeat;
 
  width: 97.5%;
  height: 200px;
  border-radius: 20px;
  margin:20px 0px auto 0px;
  position: relative;
  left:-6%;

}

t-right{
  
  position: relative;
  top:25px;
  left:30px;
}
t-right h1{
  font-size: 40px;
  font-family: '等线';
  color: white;
}
t-right div{
  margin: 27px auto auto 0px;
  
  
  height: 15%;
  background-color: #C8ECC9;
  border-radius: 60px;

  width: 23%;
}
t-right div p{
  font-size: 17px;
  font-family: '等线';
  color: black;
  position: relative;
  top: 18%;
  left: 22%;

}

</style>
