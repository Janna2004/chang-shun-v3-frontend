<script>
import { DownOutlined } from "@ant-design/icons-vue";
import dayjs from "dayjs";
import { message } from "ant-design-vue";
import * as echarts from 'echarts';

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
      menuItems: ['温度', '湿度', 'pH值', '电导率', '氮含量', '磷含量', '钾含量'],

      chartInstance: null,
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
  mounted() {
    this.fetchInstrumentList();
  },
  methods: {
    dayjs,
    fetchInstrumentList() {
      this.$axios.get("/sensor/data", {
        params: {
          sensor_category: "soil",
        },
      }).then((res) => {
        this.instrList = res.data.data;
      }).catch(error => {
        console.error("Failed to load instruments", error);
        message.error("仪器加载失败");
      });
    },
    initChart() {
      this.chartInstance = echarts.init(this.$refs.chartContainer);
      this.updateChart();
    },
    updateChart() {
      if (!this.chartInstance) {
        return;
      }
      const option = {
        title: {
          text: '土壤传感器数据'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['温度', '湿度', 'pH值', '电导率', '氮含量', '磷含量', '钾含量']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.data.map(item => item.sensor_data.detect_time)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '温度',
            type: 'line',
            data: this.data.map(item => item.sensor_data.temperature)
          },
          {
            name: '湿度',
            type: 'line',
            data: this.data.map(item => item.sensor_data.humidity)
          },
          {
            name: 'pH值',
            type: 'line',
            data: this.data.map(item => item.sensor_data.ph)
          },
          {
            name: '电导率',
            type: 'line',
            data: this.data.map(item => item.sensor_data.conductivity)
          },
          {
            name: '氮含量',
            type: 'line',
            data: this.data.map(item => item.sensor_data.nitrogen)
          },
          {
            name: '磷含量',
            type: 'line',
            data: this.data.map(item => item.sensor_data.phosphorus)
          },
          {
            name: '钾含量',
            type: 'line',
            data: this.data.map(item => item.sensor_data.potassium)
          }
        ]
      };
      this.chartInstance.setOption(option, true); // 使用 true 参数来清除之前的配置
    },
    fetchData() {
      this.loading = true;
      this.$axios.get('/soil-sensor/data', {
          params: this.convertToJson
      }).then(res => {
          this.data = res.data.data;
          if (this.data && this.data.length > 0) {
              this.$nextTick(() => {
                  if (this.$refs.chartContainer) {
                      this.initChart();  // Now we're sure the DOM element is there
                  } else {
                      console.error('Chart container DOM element is not available.');
                  }
              });
          } else {
              message.info('暂无数据');
          }
      }).catch(error => {
          console.error('查询失败', error);
          message.error('查询失败');
      }).finally(() => {
          this.loading = false;
      });
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
  }
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
                    <a-menu-item 
                      v-for="(item, index) in instrList" 
                      :key="index" 
                      @click="selectId = item.id; fetchData()">
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
              <a-row v-if="data && data.length > 0" style="width: 90%; margin: 10px auto;">
                <div ref="chartContainer" style="width: 100%; height: 400px;"></div>
              </a-row>
              <a-row v-else style="text-align: center; width: 100%; margin: 10vh auto;">
                暂无数据
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
