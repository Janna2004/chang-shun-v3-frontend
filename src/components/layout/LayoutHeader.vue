<script>
import { UserOutlined } from "@ant-design/icons-vue";
import { mapGetters } from "vuex";

export default {
  name: "LayoutHeader",
  components: { UserOutlined },
  computed: {
    tab: {
      get() {
        return [this.$route.name];
      },
      set() {},
    },
    ...mapGetters(["userInfo"]),
    isLogin() {
      return this.$store.getters.userInfo.role !== "unregistered";
    },
  },
};
</script>

<template>
  <body>
    <div class="container" style="background-color: #c8ecc9">
      <div>
        <div class="logo">
          <router-link :to="{ name: 'Home' }">
            <img alt src="@/assets/footimg1.png" style="height: 10vh" />
          </router-link>
        </div>
      </div>
      <div>
        <div class="word">
          <router-link :to="{ name: 'Home' }" style="text-decoration: none;">
            <p id="topic">长顺县智慧农业监测台</p>
          </router-link>
        </div>
      </div>
      
     
       
      
      
      <div>
        <div class="user">
          <router-link :to="{ name: 'Home', params: { mode: 'user' } }" style="text-decoration: none;">
            <a-avatar
              shape="square"
              :size="35"
              :style="{
                backgroundColor: isLogin
                  ? userInfo.role === 'admin'
                    ? '#69a67c'
                    : userInfo.role === 'super-admin'
                      ? '#ff9f3e'
                      : '#3e3ea3'
                  : '#bfbfbf',
              }"
            >
              <UserOutlined />
            </a-avatar>
            <span
              style="margin-left: 1.1vw; color: #3e3e3e; font-size: 1.1rem"
              >{{ isLogin ? userInfo.username : "登录" }}</span
            >
          </router-link>
        </div>
      </div>
    </div>
  </body>
</template>

<style scoped>
.container {
            display: flex;
            align-items: center;  /* 垂直居中 */
            justify-content: left;
            height: 11vh;  /* 设置容器高度 */
            
        }

div.word{
  margin-left: 2vw;
  position: relative;
  top:2.4vh;
  text-decoration: none;
  
}


.logo {
  float: left;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 0%;
  height: 100%;
  margin-left: 1vw;
}



#topic {
  color: black;
  font-size: 2.2rem;
  font-family: "等线";

  width: 100%;
  display: flex;
 ;
  text-decoration: none !important;
  text-underline-offset: none;

}

.user {
  margin-right: 0vw;
  position: relative;
  justify-content: right;
  margin-left: 60vw;
 
 
}

span{
  text-decoration: none;
}
</style>
