<script>
import { DownOutlined } from "@ant-design/icons-vue";
import dayjs from "dayjs";
import { message } from "ant-design-vue";
export default {
  name: "SoilMonitoring",
  components: { DownOutlined },
  inject: ["$axios"],
  data() {
    return {
      selectId: 0,
      time: null,
      data: [],
      loading: false,
      instrList: [],
      timeSelected: false,

      selectedIndex: [], // 存储当前选中的索引
      menuItems: ['温度', '湿度', 'pH值', '电导率', '氮含量', '磷含量', '钾含量']
    }
  },
  computed: {
    convertToJson() {
      return {
        sensor_id: this.selectId,
        start_time: this.timeSelected
          ? dayjs(this.time[0].$d).format("YYYY-MM-DDTHH:mm:ssZ")
          : undefined,
        end_time: this.timeSelected
          ? dayjs(this.time[1].$d).format("YYYY-MM-DDTHH:mm:ssZ")
          : undefined,
      };
    },
  },
  methods: {
    dayjs,
    async fetchData() {
      if (this.selectId === 0) {
        message.warn("请选择机器号");
        return;
      }
      if (this.timeSelected && this.time === null) {
        message.warn("请选择时间");
        return;
      }
      this.loading = true
      this.$axios.get('/soil-sensor/data', {
        params: this.convertToJson
      }).then(res => {
        this.data = res.data.data
      }).catch(() => {
        message.error('查询失败')
      }).finally(() => {
        this.loading = false
      })
    },
    handleClick(index) {
      const selectedIndexPosition = this.selectedIndex.indexOf(index);
      
      if (selectedIndexPosition !== -1) {
        // 如果已选中，则取消选中
        this.selectedIndex.splice(selectedIndexPosition, 1);
      } else {
        // 如果未选中，则添加到选中数组
        this.selectedIndex.push(index);
      }

      // this.fetchData(); // 视情况决定是否每次点击都调用 fetchData
    }
  },
  beforeMount() {
    // 获取仪器编号
    this.$axios
      .get("/sensor/data", {
        params: {
          sensor_category: "soil",
        },
      })
      .then((res) => {
        this.instrList = res.data.data;
      });
  },
};
</script>

<template>
  <body>
    <a-row>
      <a-col span="4">
        <ul id="side">
          <p id="general">Index</p>
          <li 
            v-for="(item, index) in menuItems" 
            :key="index" 
            @click="handleClick(index)" 
            :class="{ 'active-item': selectedIndex.includes(index), 'lighten': selectedIndex.includes(index) }"
          >
            {{ item }}
          </li>
          <p id="general">_______________</p>
          <router-link to="/home" exact>
            <li 
              id="setting" 
              :class="{ 'active-item': selectedIndex.includes('home'), 'lighten': selectedIndex.includes('home') }" 
              @click="handleClick('home')"
            >
              返回
            </li>
          </router-link>
        </ul>
      </a-col>
      <a-col span="20">
        <div class="main">
          <div class="top">
            <div class="button-group">
              <a-dropdown>
                <a @click.prevent style="font-size: 1.2em;margin-right: 30px;">
                  {{ selectId === 0 ? '选择仪器编号' : `已选中${selectId}号检测器` }}
                  <DownOutlined />
                </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item v-for="(item, index) in instrList" :key="index" @click="selectId = item.id">
                      <span>
                        {{item.id}}号 {{item.location}} {{item.function}}
                        <span v-if="item.status === '故障'" style="color: red">（故障）</span>
                      </span>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>

              <a-checkbox style="margin-right: 10px" v-model:checked="timeSelected"/>
              <a-range-picker v-model:value="time" show-time style="margin-right: 10px" :disabled="!timeSelected"/>
              
              <a-button type="primary" @click="fetchData">查询</a-button>
            </div>
          </div>
          
          <div class="results">
            <h3>查询结果</h3>
            <a-row v-if="loading" style="width: 100%">
              <a-spin :spinning="loading" style="margin: auto;"/>
            </a-row>
            <a-row v-if="!loading" style="width: 100%">
              <a-row v-if="data && data.length !== 0" style="width: 90%;margin: 10px auto;">
                传感器信息：{{data[0].sensor_info}}
              </a-row>
              <a-row v-else style="text-align: center; width: 100%; margin: 10vh auto;">
                暂无数据
              </a-row>
              <a-row v-if="data && data.length !== 0" style="width: 100%">
                <a-descriptions bordered class="data" v-for="(item, index) in data" :key="index">
                  <a-descriptions-item label="检测时间" :span="2">{{dayjs(item.sensor_data.detect_time).format('YYYY-MM-DD HH:mm:ss')}}</a-descriptions-item>
                  <a-descriptions-item label="温度(℃)">{{item.sensor_data.temperature}}</a-descriptions-item>
                  <a-descriptions-item label="电导率(us/cm)">{{item.sensor_data.conductivity}}</a-descriptions-item>
                  <a-descriptions-item label="湿度(%)">{{item.sensor_data.humidity}}</a-descriptions-item>
                  <a-descriptions-item label="PH值(pH)">{{item.sensor_data.ph}}</a-descriptions-item>
                  <a-descriptions-item label="氮指数(mg/kg)">{{item.sensor_data.nitrogen}}</a-descriptions-item>
                  <a-descriptions-item label="磷指数(mg/kg)">{{item.sensor_data.phosphorus}}</a-descriptions-item>
                  <a-descriptions-item label="钾指数(mg/kg)">{{item.sensor_data.potassium}}</a-descriptions-item>
                </a-descriptions>
              </a-row>
            </a-row>
          </div>
        </div>
      </a-col>
    </a-row>
  </body>
</template>

<style scoped>
body {
  background-size: cover;
  background-color: #c8ecc9;
  background: url(../css/background-image.png);
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
  font-family: '等线';
  border: #69a67c 0.13vw solid;
}

ul#side li {
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
  cursor: pointer;
}

ul#side li.active-item {
  background-color: rgb(105, 166, 124);
  color: white;
  transform: translateX(18%);
  transition: transform 0.3s ease;
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

.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 2vh;
}

.top {
  width: 95%;
  display: flex;
  flex-direction: column;
  align-items: left;
  background-color: rgb(200, 236, 201);
  margin: 2vw auto;
  padding: 2vh 2vw;
  border-radius: 2vw;
  font-family: '等线';
  border: #69a67c 0.13vw solid;
}

.button-group {
  margin-bottom: 2vh;
  text-align: center;
  display: flex ;
  align-items: center ;
  justify-content: flex-start ;
  flex-direction: row ;
}

.results {
  width: 95%;
  background-color: #c8ecc9;
  margin: 2vw auto;
  padding: 2vh 2vw;
  border-radius: 2vw;
  font-family: '等线';
  border: #69a67c 0.13vw solid;
}

.data:first-child {
  border-top: none 0;
}

.data {
  width: 90%;
  margin: 10px auto;
  border-top: 1px solid #a3a3a3;
  padding-top: 20px;
}
</style>
