<script>
import { DownOutlined } from "@ant-design/icons-vue";
import dayjs from "dayjs";
import { message } from "ant-design-vue";
import PageWithMenu from '../../components/global/PageWithMenu.vue';
import solidIcon from '@/assets/icons/土壤监测设备 1.png'

export default {
  name: "AirMonitoring",
  components: { DownOutlined, PageWithMenu },
  inject: ["$axios"],
  data() {
    return {
      selectId: 0,
      time: null,
      data: [],
      loading: false,
      instrList: [],

      selectedItems: [],   // 所有被选中的项目
      menuOpts: [
        { iconUrl: solidIcon, name: '温度', value: 'temperature' },
        { iconUrl: solidIcon, name: '湿度', value: 'humidity' },
        { iconUrl: solidIcon, name: '二氧化碳浓度', value: 'CO2' },
      ],
    }
  },
  computed: {
    convertToJson() {
      return {
        sensor_id: this.selectId,
        start_time: dayjs(this.time[0].$d).format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: dayjs(this.time[1].$d).format("YYYY-MM-DDTHH:mm:ssZ"),
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
      if (this.time === null) {
        message.warn("请选择时间线");
        return;
      }
      this.loading = true
      this.$axios.get('/air-quality-sensor/data', {
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
          sensor_category: "air-quality",
        },
      })
      .then((res) => {
        this.instrList = res.data.data;
      });
  },
};
</script>

<template>
  <PageWithMenu
    :isHome="false"
    :options="menuOpts"
    :multiple="true"
    :selected="selectedItems"
  >
    <template #content>
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

          <a-range-picker v-model:value="time" show-time style="margin-right: 10px"/>
          
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
              <a-descriptions-item label="湿度(%)">{{item.sensor_data.humidity}}</a-descriptions-item>
              <a-descriptions-item label="二氧化碳浓度">{{item.sensor_data.co2concentration}}</a-descriptions-item>
            </a-descriptions>
          </a-row>
        </a-row>
      </div>
    </template>
  </PageWithMenu>
</template>

<style scoped>
.top {
  width: 95%;
  display: flex;
  flex-direction: column;
  align-items: left;
  background-color: rgb(200, 236, 201);
  margin: 2vw auto;
  margin-top: 0vw;
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
