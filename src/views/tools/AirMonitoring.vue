<script>
import { DownOutlined } from "@ant-design/icons-vue";
import dayjs from "dayjs";
import { message } from "ant-design-vue";
import * as echarts from "echarts";
import PageWithMenu from "../../components/global/PageWithMenu.vue";
import solidIcon from "@/assets/icons/土壤监测设备 1.png";
import { markRaw } from "vue";

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

      selectedItems: [], // 所有被选中的项目
      menuOpts: [
        { iconUrl: solidIcon, name: "温度", value: "temperature" },
        { iconUrl: solidIcon, name: "湿度", value: "humidity" },
        { iconUrl: solidIcon, name: "二氧化碳浓度", value: "co2concentration" },
      ],
    };
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
    getPast24Hours() {
      return {
        sensor_id: this.selectId,
        start_time: dayjs()
          .subtract(24, "hours")
          .format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: dayjs().format("YYYY-MM-DDTHH:mm:ssZ"),
      };
    },
  },
  mounted() {
    this.fetchInstrumentList();
    this.interval = setInterval(() => {
      this.fetch24HourData(); // 每小时更新数据
    }, 3600000); // 每3600000毫秒（1小时）更新一次
  },
  beforeDestroy() {
    clearInterval(this.interval); // 清除定时器防止内存泄漏
  },
  watch: {
    selectedItems: {
      handler(newVal, oldVal) {
        if (this.data && this.data.length > 0) {
          this.updateChart(); // 当选择项变化时更新图表
        }
      },
      deep: true,
    },
  },
  methods: {
    dayjs,
    fetchInstrumentList() {
      this.$axios
        .get("/sensor/data", {
          params: {
            sensor_category: "air-quality",
          },
        })
        .then((res) => {
          this.instrList = res.data.data;
        })
        .catch((error) => {
          console.error("Failed to load instruments", error);
          message.error("仪器加载失败");
        });
    },
    // 左侧大表
    initChart() {
      this.chartInstance = markRaw(echarts.init(this.$refs.chartContainer));
      this.updateChart();
    },
    updateChart() {
      if (!this.chartInstance || !this.data || this.data.length === 0) {
        console.error("图表实例未初始化或数据为空");
        return; // 如果图表实例未初始化或数据为空，则不执行任何操作
      }

      // 动态创建 series 数组，基于选中的项目
      const series = this.menuOpts
        .filter((opt) => this.selectedItems.includes(opt.value))
        .map((opt) => ({
          name: opt.name,
          type: "line", // 确保每个系列都有明确的 'type' 设置
          data: this.data.map((item) => {
            const value = item.sensor_data[opt.value];
            return value !== undefined ? value : null; // 确保所有数据点都是有效的，避免 undefined
          }),
        }));

      if (series.length === 0) {
        console.error("没有选中的数据项");
        return; // 如果没有有效的系列数据，则不更新图表
      }

      const option = {
        title: {
          text: " ",
        },
        //显示横纵坐标
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            if (!params || params.length === 0) {
              return "";
            }
            let result = "";
            const formattedTime = dayjs(params[0].axisValue).format(
              "YYYY年MM月DD日HH:mm:ss",
            );
            result += `${formattedTime}<br/>`; // 显示格式化后的时间
            params.forEach((param) => {
              if (param.data !== undefined) {
                result += `${param.marker}${param.seriesName} : ${param.data}<br/>`; // 显示每个系列的颜色标记和数据
              }
            });
            return result;
          },
        },
        legend: {
          data: series.map((s) => s.name),
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.data.map((item) => item.sensor_data.detect_time),
          axisLabel: {
            formatter: function (value) {
              // 使用 dayjs 格式化日期
              return dayjs(value).format("YYYY年MM月DD日HH:mm:ss");
            },
          },
        },
        yAxis: {
          type: "value",
        },
        series: series,
        //局部放大
        dataZoom: [
          {
            // 这个dataZoom组件，默认显示为滑动条形式
            type: "slider", // 使用 slider 类型
            start: 0, // 左边在 0% 的位置（即一开始显示图表的开头部分）
            end: 100, // 右边在 10% 的位置（即一开始显示图表的前 10% 部分，用户可以滑动查看后续数据）
          },
          {
            // 这个dataZoom组件，也可以添加一个内置型数据区域选择
            type: "inside",
            start: 0,
            end: 100,
          },
        ],
      };

      this.chartInstance.setOption(option, true); // 使用 true 参数来清除之前的配置
    },
    fetchData() {
      this.loading = true;
      this.$axios
        .get("/air-quality-sensor/data", {
          params: this.convertToJson,
        })
        .then((res) => {
          this.data = res.data.data;
          if (this.data && this.data.length > 0) {
            this.$nextTick(() => {
              console.log(
                "Checking if chart container is available:",
                this.$refs.chartContainer,
              );
              if (this.$refs.chartContainer) {
                console.log("Initializing chart");
                this.initChart(); // Now we're sure the DOM element is there
              } else {
                console.error("Chart container DOM element is not available.");
              }
            });
          } else {
            message.info("暂无数据");
          }
        })
        .catch((error) => {
          console.error("查询失败", error);
          message.error("查询失败");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 右三小表
    init24hCharts() {
      this.temperatureChart = markRaw(
        echarts.init(this.$refs.temperatureChart),
      );
      this.updateTemperatureChart();

      this.humidityChart = markRaw(echarts.init(this.$refs.humidityChart));
      this.updateHumidityChart();

      this.CO2Chart = markRaw(echarts.init(this.$refs.CO2Chart));
      this.updateCO2Chart();
    },
    // 更新温度图表
    updateTemperatureChart() {
      if (!this.data || this.data.length === 0) {
        console.log("No temperature data available");
        return;
      }

      // 将数据按小时分组并计算平均温度
      const groupedByHour = this.data.reduce((acc, item) => {
        const hour = dayjs(item.sensor_data.detect_time).format(
          "YYYY-MM-DD HH:00",
        );
        if (!acc[hour]) {
          acc[hour] = { sum: 0, count: 0 };
        }
        acc[hour].sum += item.sensor_data.temperature;
        acc[hour].count += 1;
        return acc;
      }, {});

      const averageTemperatureByHour = Object.keys(groupedByHour).map(
        (hour) => ({
          time: hour,
          avgTemp: groupedByHour[hour].sum / groupedByHour[hour].count,
        }),
      );

      const maxTemperature = Math.max(
        ...averageTemperatureByHour.map((item) => item.avgTemp),
      );
      const minTemperature = Math.min(
        ...averageTemperatureByHour.map((item) => item.avgTemp),
      );

      const temperatureOption = {
        //显示横纵坐标
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            if (!params || params.length === 0) {
              return "";
            }
            let result = "";
            const formattedTime = dayjs(params[0].axisValue).format(
              "YYYY年MM月DD日HH:mm:ss",
            );
            result += `${formattedTime}<br/>`; // 显示格式化后的时间
            params.forEach((param) => {
              if (param.data !== undefined) {
                let formattedData = parseFloat(param.data).toFixed(4); // 格式化数据保留4位小数
                result += `${param.marker}湿度 : ${formattedData}<br/>`; // 显示每个系列的颜色标记和数据
              }
            });
            return result;
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: averageTemperatureByHour.map((item) => item.time),
          axisLabel: {
            formatter: function (value) {
              // 格式化日期显示
              return dayjs(value).format("MM月DD日HH:mm");
            },
          },
        },
        yAxis: {
          type: "value",
          // 控制y轴的最小值和最大值略微比实际数据小和大，确保视觉效果
          min: Math.floor(minTemperature - 1),
          max: Math.ceil(maxTemperature + 1),
          // 设置间隔
          interval:
            Math.ceil(maxTemperature + 1) - Math.floor(minTemperature - 1),
        },
        series: [
          {
            data: averageTemperatureByHour.map((item) => item.avgTemp),
            type: "bar",
            markPoint: {
              data: [
                {
                  type: "max",
                  name: "最大值",
                  label: {
                    formatter: "{c}℃",
                    normal: {
                      formatter: function (param) {
                        return param.value.toFixed(1) + "℃"; // 最大值标签，保留一位小数
                      },
                    },
                  },
                },
                {
                  type: "min",
                  name: "最小值",
                  label: {
                    formatter: "{c}℃",
                    normal: {
                      formatter: function (param) {
                        return param.value.toFixed(1) + "℃"; // 最小值标签，保留一位小数
                      },
                    },
                  },
                },
              ],
            },
            markLine: {
              data: [{ type: "average", name: "平均值" }],
              label: {
                formatter: "{c}℃",
                normal: {
                  formatter: function (param) {
                    return param.value.toFixed(1) + "℃"; // 最小值标签，保留一位小数
                  },
                },
              },
            },
          },
        ],
      };

      this.temperatureChart.setOption(temperatureOption);
    },
    // 更新湿度图表
    updateHumidityChart() {
      if (!this.data || this.data.length === 0) {
        console.log("No humidity data available");
        return;
      }
      // 获取最新的数据点
      const latestData = this.data[this.data.length - 1];
      const latestHumidity = latestData.sensor_data.humidity;

      // 计算最小值，最大值和平均值
      const humidityValues = this.data.map((item) => item.sensor_data.humidity);
      const minHumidity = Math.min(...humidityValues).toFixed(1);
      const maxHumidity = Math.max(...humidityValues).toFixed(1);
      const avgHumidity = (
        humidityValues.reduce((a, b) => a + b, 0) / humidityValues.length
      ).toFixed(1);

      const humidityOption = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        series: [
          {
            name: "Humidity",
            type: "pie",
            radius: ["60%", "90%"], // 配置为环形图
            center: ["30%", "50%"], // 将圆环左移至容器的40%位置
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              {
                value: latestHumidity,
                name: "当前湿度",
                itemStyle: { color: "#80a6e2" },
              }, // 蓝色
              {
                value: 100 - latestHumidity,
                name: "其他",
                itemStyle: { color: "#a4514f" },
              }, // 红色
            ],
          },
        ],
        graphic: {
          elements: [
            {
              type: "text",
              left: "55%",
              top: "20%",
              style: {
                text: `当前湿度: ${latestHumidity}%`,
                fontSize: 14,
                fontWeight: "bold",
                lineHeight: 20,
                fill: "#333", // 文本颜色
              },
            },
            {
              type: "text",
              left: "55%",
              top: "40%",
              style: {
                text: `最小值: ${minHumidity}%`,
                fontSize: 14,
                fontWeight: "bold",
                lineHeight: 20,
                fill: "#333", // 文本颜色
              },
            },
            {
              type: "text",
              left: "55%",
              top: "60%",
              style: {
                text: `最大值: ${maxHumidity}%`,
                fontSize: 14,
                fontWeight: "bold",
                fill: "#333",
              },
            },
            {
              type: "text",
              left: "55%",
              top: "80%",
              style: {
                text: `平均值: ${avgHumidity}%`,
                fontSize: 14,
                fontWeight: "bold",
                fill: "#333",
              },
            },
          ],
        },
      };
      this.humidityChart.setOption(humidityOption);
    },
    // 更新CO2图表
    updateCO2Chart() {
      if (!this.data || this.data.length === 0) {
        console.log("没有CO2数据");
        return;
      }
      // 获取最新的数据点
      const latestData = this.data[this.data.length - 1];
      const latestCO2 = latestData.sensor_data.co2concentration;

      // 计算最小值，最大值和平均值
      const co2Values = this.data.map(
        (item) => item.sensor_data.co2concentration,
      );
      const minCO2 = Math.min(...co2Values).toFixed(1);
      const maxCO2 = Math.max(...co2Values).toFixed(1);
      const avgCO2 = (
        co2Values.reduce((a, b) => a + b, 0) / co2Values.length
      ).toFixed(1);

      const CO2Option = {
        tooltip: {
          formatter: "{a} <br/>{b}: {value}",
        },
        series: [
          {
            name: "CO2水平",
            type: "gauge",
            center: ["30%", "50%"], // 左移仪表盘
            radius: "100%", // 增大仪表盘半径
            detail: {
              formatter: "{value}",
              offsetCenter: [0, "70%"], // 向下移动当前CO2值的位置
            },
            min: 0,
            max: 14,
            data: [{ value: latestCO2 }],
            axisLine: {
              // 控制表盘外圈样式
              lineStyle: {
                width: 10,
                color: [
                  [
                    1,
                    new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                      {
                        offset: 0,
                        color: "#ffffff",
                      },
                      { offset: 1, color: "#80a6e2" },
                    ]),
                  ],
                ],
              },
            },
            splitLine: {
              //设置分隔线样式
              show: false, //设置是否显示分隔线，默认true
            },
            axisTick: {
              //设置刻度(线)样式
              show: true, //设置是否显示刻度(线)，默认true
              splitNumber: 1,
            },
            axisLabel: {
              //设置刻度标签
              show: false, //设置是否显示标签，默认true
            },
          },
        ],
        graphic: {
          elements: [
            {
              type: "text",
              left: "55%",
              top: "20%",
              style: {
                text: `最小值: ${minCO2}`,
                fontSize: 14,
                fontWeight: "bold",
                fill: "#333",
              },
            },
            {
              type: "text",
              left: "55%",
              top: "40%",
              style: {
                text: `最大值: ${maxCO2}`,
                fontSize: 14,
                fontWeight: "bold",
                fill: "#333",
              },
            },
            {
              type: "text",
              left: "55%",
              top: "60%",
              style: {
                text: `平均值: ${avgCO2}`,
                fontSize: 14,
                fontWeight: "bold",
                fill: "#333",
              },
            },
          ],
        },
      };
      this.CO2Chart.setOption(CO2Option);
    },
    fetch24HourData() {
      console.log("Fetching past 24 hours data");
      this.loading = true;
      this.$axios
        .get("/air-quality-sensor/data", {
          params: this.getPast24Hours,
        })
        .then((res) => {
          this.data = res.data.data;
          this.init24hCharts(); // 如果图表尚未初始化或需要在新数据到来时重置
          console.log("24 hours data:", this.data);
        })
        .catch((error) => {
          console.error("查询失败", error);
          this.message.error("查询失败");
        })
        .finally(() => {
          this.loading = false;
        });
    },
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
            <a @click.prevent style="font-size: 1.2em; margin-right: 30px">
              {{
                selectId === 0 ? "选择仪器编号" : `已选中${selectId}号检测器`
              }}
              <DownOutlined />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item
                  v-for="(item, index) in instrList"
                  :key="index"
                  @click="
                    selectId = item.id;
                    fetchData();
                    fetch24HourData();
                  "
                >
                  <span>
                    {{ item.id }}号 {{ item.location }} {{ item.function }}
                    <span v-if="item.status === '故障'" style="color: red"
                      >（故障）</span
                    >
                  </span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-checkbox
            style="margin-right: 10px"
            v-model:checked="timeSelected"
          />
          <a-range-picker
            v-model:value="time"
            show-time
            style="margin-right: 10px"
            :disabled="!timeSelected"
          />

          <a-button type="primary" @click="fetchData">查询</a-button>
        </div>
      </div>
      <div class="main">
        <div class="results">
          <h3 style="color: rgb(200, 236, 201)">监控面板</h3>
          <a-row v-if="loading" style="width: 100%">
            <a-spin :spinning="loading" style="margin: auto" />
          </a-row>
          <a-row v-if="!loading" style="width: 100%">
            <a-row v-if="!data || data.length == 0"> 暂无数据 </a-row>
          </a-row>
          <div ref="chartContainer" style="width: 100%; height: 400px"></div>
        </div>
        <div class="right-panel">
          <div class="info-box">
            <h3 style="color: #69a67c">温度</h3>
            <a-row v-if="loading" style="width: 100%">
              <a-spin :spinning="loading" style="margin: auto" />
            </a-row>
            <a-row v-if="!loading" style="width: 100%">
              <a-row v-if="!data || data.length == 0"> 暂无数据 </a-row>
            </a-row>
            <div
              ref="temperatureChart"
              style="height: 110px; width: 100%"
            ></div>
          </div>
          <div class="info-box">
            <h3 style="color: #69a67c">湿度</h3>
            <a-row v-if="loading" style="width: 100%">
              <a-spin :spinning="loading" style="margin: auto" />
            </a-row>
            <a-row v-if="!loading" style="width: 100%">
              <a-row v-if="!data || data.length == 0"> 暂无数据 </a-row>
            </a-row>
            <div ref="humidityChart" style="height: 110px; width: 100%"></div>
          </div>
          <div class="info-box">
            <h3 style="color: #69a67c">CO2</h3>
            <a-row v-if="loading" style="width: 100%">
              <a-spin :spinning="loading" style="margin: auto" />
            </a-row>
            <a-row v-if="!loading" style="width: 100%">
              <a-row v-if="!data || data.length == 0"> 暂无数据 </a-row>
            </a-row>
            <div ref="CO2Chart" style="height: 110px; width: 100%"></div>
          </div>
        </div>
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
  margin-bottom: 0vw;
  padding: 2vh 2vw;
  border-radius: 2vw;
  font-family: "等线";
  border: #69a67c 0.13vw solid;
}

.button-group {
  margin-bottom: 2vh;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
}

.results {
  flex: 0 0 55%; /* flex-grow, flex-shrink, flex-basis */
  background-color: #69a67cd2;
  margin: 2vw 1.25% 2vw 0; /* 适当调整左边距 */
  padding: 2vh 2vw;
  border-radius: 2vw;
  font-family: "等线";
  border: rgba(200, 236, 201, 0.358) 0.13vw solid;
}

.right-panel {
  flex: 0 0 45%; /* flex-grow, flex-shrink, flex-basis */
  margin: 0vw 0 2vw 1.25%; /* 适当调整右边距 */
  padding: 2vh 2vw;
  padding-left: 0vh;
  border-radius: 2vw;
  display: flex;
  flex-direction: column; /* 使子元素垂直排列 */
}

.data:first-child {
  border-top: none 0;
}

.main {
  width: 95%;
  margin-left: 2vw;
  display: flex; /* 启用 flex 布局 */
  justify-content: space-between; /* 确保两侧组件之间有空间 */
}

.info-box {
  background-color: #c8ecc9; /* 淡绿色背景 */
  margin: 10px 0; /* 上下间距 */
  padding: 10px;
  border-radius: 10px; /* 圆角 */
  border: 1px solid #69a67c; /* 边框 */
}
</style>
