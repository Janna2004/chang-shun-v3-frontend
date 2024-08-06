<script>
import { UserOutlined } from '@ant-design/icons-vue'
import { mapGetters } from 'vuex'

export default {
  name: 'LayoutHeader',
  components: { UserOutlined },
  computed: {
    tab: {
      get () {
        return [this.$route.name]
      },
      set () {}
    },
    ...mapGetters(['userInfo']),
    isLogin () {
      return this.$store.getters.userInfo.role !== 'unregistered'
    }
  }
}
</script>

<template>
  <body>
  <a-row style="background-color:#C8ECC9;">
    <a-col :span="2">
      <div class="logo">
        <router-link :to="{name: 'Home'}">
          <img alt src="@/assets/footimg1.png" style="height: 4vw;">
        </router-link>
      </div>
    </a-col>
    <a-col :span="7">
      <div class="word">
        <router-link :to="{name: 'Home'}">
          <p id="topic">长顺县智慧农业监测台</p>
        </router-link>
      </div>
    </a-col>
    <a-col :span="13">
      <menu >
        <router-link :to="{name: 'Home'}">
        <li id="home">
          首页
        </li>
      </router-link>
      <router-link :to="{name: 'About'}">
        <li id="about">
          指南
        </li>
      </router-link>
      </menu>
    </a-col>
    <a-col>
      <div class="user">
        <router-link :to="{name: isLogin ? 'UserInfo' : 'Login'}">
          <a-avatar shape="square" :size="40"
                    :style="{backgroundColor: isLogin ? userInfo.role === 'admin' ? '#ff9f3e' : userInfo.role === 'super-admin' ? '#ff3232' : '#3e3ea3' : '#bfbfbf'}">
            <UserOutlined/>
          </a-avatar>
          <span style="margin-left: 1.1vw;color: #3e3e3e;font-size: 1.1rem;">{{isLogin ? userInfo.username : '登录'}}</span>
        </router-link>
      </div>
    </a-col>
  </a-row>
  </body>
</template>

<style scoped>


.logo {
  float: left;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top:0%;
  height: 100%;
}

menu li#home{
  color: black;
  
  position: relative;
  top:-0.2vw;
  left: 2vw;

  list-style: none;
  
  font-size: 1.4rem;
  
  
  display:inline;
 text-align: center;
}

menu li#home::before{
  
  content: '';
  display: inline-block;
  background: url(Home.png);
  background-size: cover;
  width: 2vw;
  height: 2vw;
  position:relative;
  top:0.4vw;
  
}



menu li#about{
  color: black;
  
  position: relative;
  top:-0.2vw;
  left: 9vw;

  list-style: none;
  
  font-size: 1.4rem;
  
  
  display:inline;
 text-align: center;
}

menu li#about::before{
  content: '';
  display: inline-block;
  background: url(Compass.png);
  background-size: cover;
  width: 1.9vw;
  height: 1.9vw;
  position:relative;
  top:0.4vw;
  right:0.1vh;
  
}


#topic{
  color: black;
  font-Size: 1.9rem;
  font-Family: '等线' ;
  position:relative;
  top:1.2vw;
}

.user{
  padding-top: 13%;
}
</style>
