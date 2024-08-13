<script>
import PageWithMenu from "@/components/global/PageWithMenu.vue";
import solidIcon from "@/assets/icons/土壤监测设备 1.png";
import dayjs from "dayjs";

export default {
  name: "AlertInfo",
  components: { PageWithMenu },
  inject: ["$axios"],
  data() {
    return {
      //目录
      activeKey: [],
      alertInfo: [],
      filter: {
        pest_name: "",
        handled: 0,
        time: null,
        checker: {
          pest_name: false,
          time: false,
        },
      },
      loading: false,

      menuOpts: [
        {
          iconUrl: solidIcon,
          name: "智能识别",
          value: "detection",
        },
        {
          iconUrl: solidIcon,
          name: "历史记录",
          value: "history",
        },
      ],
      selected: "detection", // 用于跟踪当前显示的模块
      //智能识别相关
      curStep: 0,
      steps: [
        {
          title: "上传图片",
        },
        {
          title: "分析和识别",
        },
        {
          title: "数据对比",
        },
        {
          title: "结果显示",
        },
        {
          title: "用户确认",
        },
      ],

      imgUrl: "",

      // 弹出框
      isModalVisible: false
    };
  },
  methods: {
    // 历史记录
    dayjs,
    async getAlertInfo() {
      if (this.filter.checker.time && this.filter.time === null) {
        message.warn("请选择时间线");
        return;
      }
      if (this.filter.checker.pest_name && this.filter.pest_name === "") {
        message.warn("请选择病虫害类型");
        return;
      }
      this.loading = true;
      console.log(this.convertToJson);
      this.$axios
        .post("/ai/getAlert", {
          ...this.convertToJson,
        })
        .then((res) => {
          this.alertInfo = res.data.data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async handleToggleProcessed(record) {
      try {
        const response = await this.$axios.put('/ai/alert', {
          id: record.id,
          handled: !record.handled,
        });

        if (response.data.code === 200) {
          // Update the local state
          record.handled = !record.handled;
          message.success(`状态已更新为${record.handled ? "已处理" : "未处理"}`);
        } else {
          message.error('处理失败，请重试');
        }
      } catch (error) {
        message.error('处理失败，请检查网络');
      }
    },
    // 智能识别
    uploadImg(file) {
      this.imgUrl = URL.createObjectURL(file);
      this.curStep = 1;
    },
    // 弹出框
    showDetails(record) {
      // Populate the selectedAlert object with the details of the clicked record
      this.selectedAlert = record;

      // Show the modal
      this.isModalVisible = true;
    },

    handleCancel() {
      // Hide the modal and reset selectedAlert
      this.isModalVisible = false;
      this.selectedAlert = {};
    },

    async handleToggleProcessed(record) {
      try {
        const response = await this.$axios.put('/ai/alert', {
          id: record.id,
          handled: !record.handled,
        });

        if (response.data.code === 200) {
          // Update the local state
          record.handled = !record.handled;
        } else {
          message.error('处理失败，请重试');
        }
      } catch (error) {
        message.error('处理失败，请检查网络');
      }
    }
  },
  computed: {
    // 将筛选条件转换为json格式
    convertToJson() {
      return {
        pest_name: this.filter.checker.pest_name
          ? this.filter.pest_name
          : undefined,
        handled:
          this.filter.handled === 2 ? undefined : this.filter.handled === 1,
        start_time: this.filter.checker.time
          ? dayjs(this.filter.time[0].$d).format("YYYY-MM-DDTHH:mm:ssZ")
          : undefined,
        end_time: this.filter.checker.time
          ? dayjs(this.filter.time[1].$d).format("YYYY-MM-DDTHH:mm:ssZ")
          : undefined,
      };
    },
  },
};
</script>

<template>
  <a-config-provider
    :theme="{
        token: {
          colorPrimary: '#69a67c',
        },

      }"
  >
  <PageWithMenu
    :isHome="false"
    :options="menuOpts"
    :multiple="false"
    v-model:selected="selected"
  >
    <template #content>
      <template v-if="selected === 'detection'">
        <div class="content">
          <a-row>
            <a-col id="procedure" span="24">
              <div class="light card">
                <div class="light-title">识别流程</div>
                <div class="process">
                  <template v-for="(step, index) in steps" :key="index">
                    <div v-if="index > 0" class="divider">
                      <div
                        :class="curStep >= index ? 'color-dark' : 'color-light'"
                      ></div>
                    </div>
                    <div class="step">
                      <span
                        :class="
                          'circle ' +
                          (curStep >= index ? 'color-dark' : 'color-light')
                        "
                        @click="curStep = index"
                      >
                        {{ index + 1 }}
                      </span>
                      <span
                        :class="curStep >= index ? 'color-dark' : 'color-light'"
                      >
                        {{ step.title }}
                      </span>
                    </div>
                  </template>
                </div>
              </div>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col id="img" span="16">
              <div class="dark card">
                <div class="img-container">
                  <img v-if="imgUrl != ''" :src="imgUrl" alt="水稻图片" />
                  <div v-else class="upload">
                    <img src="@/assets/icons/照相 1.png" alt="上传图片" />
                    <div>点击上传图片</div>
                    <input
                      type="file"
                      @change="uploadImg($event.target.files[0])"
                    />
                  </div>
                </div>
              </div>
            </a-col>
            <a-col id="result" span="8">
              <div class="light card">
                <div class="light-title">识别结果</div>
                <div class="result-text">
                  <a-row>
                    <a-col span="24">
                      <div class="medium card text">
                        存在病虫害风险。病虫害类型:
                        烟粉虱。成、若虫刺吸植物汁液，受害叶褪绿萎蔫或枯死，使植物生理紊乱，植株瘦小;并能传播病毒病，诱发煤污病
                      </div>
                    </a-col>
                  </a-row>
                  <a-row :gutter="16">
                    <a-col span="12">
                      <div
                        class="medium card text button"
                        @click="
                          curStep = 0;
                          imgUrl = '';
                        "
                      >
                        重新识别
                      </div>
                    </a-col>
                    <a-col span="12">
                      <div class="dark card text button">记录并完成</div>
                    </a-col>
                  </a-row>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </template>
      
      <template v-else-if="selected === 'history'">
        <div class="filter" :bordered="false" title="筛选条件">
          <a-space direction="vertical" size="middle">
            <a-row>
              <div style="display: flex; align-items: center; font-size: 1.2em">
                是否已处理：
              </div>
              <a-radio-group v-model:value="filter.handled" button-style="solid">
                <a-radio-button :value="0">未处理</a-radio-button>
                <a-radio-button :value="1">已处理</a-radio-button>
                <a-radio-button :value="2">全部</a-radio-button>
              </a-radio-group>
            </a-row>
            <a-row>
              <a-checkbox
                v-model:checked="filter.checker.time"
                style="display: flex; align-items: center; font-size: 1.2em"
                >时间范围：</a-checkbox
              >
              <a-range-picker
                v-model:value="filter.time"
                show-time
                style="margin-right: 10px"
                :disabled="!filter.checker.time"
              />
            </a-row>
            <a-row>
              <a-checkbox
                v-model:checked="filter.checker.pest_name"
                style="display: flex; align-items: center; font-size: 1.2em"
                >病虫害名称：</a-checkbox
              >
              <a-dropdown :disabled="!filter.checker.pest_name">
                <a @click.prevent style="font-size: 1.2em; margin-right: 30px">
                  {{
                    filter.pest_name === ""
                      ? "选择病虫害类型"
                      : `已选中${filter.pest_name}`
                  }}
                  <DownOutlined />
                </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="filter.pest_name = '原神'">
                      <span>原神</span>
                    </a-menu-item>
                    <a-menu-item @click="filter.pest_name = '一级病虫害'">
                      <span>一级病虫害</span>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-row>
            <a-row>
              <a-button type="primary" @click="getAlertInfo">查询</a-button>
              <a-spin :spinning="loading" />
            </a-row>
          </a-space>

          <div class="table-container">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>病虫害名称</th>
                  <th>预警时间</th>
                  <th>预警地点</th>
                  <th>农田编号</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in alertInfo" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.pest_name }}</td>
                  <td>{{ dayjs(item.alert_time).format("YYYY-MM-DD HH:mm:ss") }}</td>
                  <td>经纬度({{ item.latitude }}°, {{ item.longitude }}°)</td>
                  <td>{{ item.field_id }}</td>
                  <td>
                    <button @click="showDetails(item)">详细</button>
                    <button @click="handleToggleProcessed(item)">
                      {{ item.handled ? "已处理" : "处理" }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        
      </template>
    </template>
  </PageWithMenu>

    <!-- 详细信息弹出框 --> 
    <div v-if="isModalVisible" class="custom-modal-overlay" @click="handleCancel">
      <div class="custom-modal" @click.stop>
        <div class="custom-modal-header">
          <h3>详细信息</h3>
          <button class="custom-modal-close" @click="handleCancel">×</button>
        </div>
        <div class="custom-modal-body">
          <div class="custom-descriptions-item">
              <strong>详细信息:</strong> {{ selectedAlert.pest_description }}
            </div>
          <div class="custom-descriptions">
            
            <div class="custom-descriptions-item">
              <strong>病虫害类别:</strong> {{ selectedAlert.pest_name }}
            </div>
            <div class="custom-descriptions-item">
              <strong>预警时间:</strong>
              {{ dayjs(selectedAlert.alert_time).format("YYYY-MM-DD HH:mm:ss") }}
            </div>
            <div class="custom-descriptions-item">
              <strong>预警地点:</strong>
              经纬度({{ selectedAlert.latitude }}°, {{ selectedAlert.longitude }}°)
            </div>
            <div class="custom-descriptions-item">
              <strong>预警概率:</strong> {{ selectedAlert.pest_probability }}
            </div>
            <div class="custom-descriptions-item">
              <strong>勘测无人机编号:</strong> {{ selectedAlert.drone_id }}
            </div>
            <div class="custom-descriptions-item">
              <strong>勘测农田编号:</strong> {{ selectedAlert.field_id }}
            </div>
            <div class="custom-descriptions-item">
              <strong>处理状态:</strong>
              {{ selectedAlert.handled ? "已处理" : "未处理" }}
            </div>
            <div class="custom-descriptions-item custom-image-gallery">
              <strong>现场图片:</strong>
              <div class="custom-images">
                <img
                  v-for="(image, index) in selectedAlert.image_paths"
                  :key="index"
                  :src="image"
                  class="custom-image"
                  :alt="'Image ' + (index + 1)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-config-provider>
</template>

<style  scoped>
/* 历史记录 */

.filter {
  border:solid  #69a67c;
  border-width: vw;
  background-color: #c8ecc9;
  border-radius: 1vw;
  padding: 6vh 4vw 6vh 4vw;
  margin: 1vh 2vw 1vh 2vw;
}

.info {
  border-top: 1px solid #939393;
  margin: 1px auto;
}

.info:first-child {
  border-top: none;
}

.image {
  display: grid;
  grid-row-gap: 25px;
  grid-column-gap: 25px;
  grid-template-columns: auto auto auto auto;
  margin-left: 20px;
}

/* 弹窗 */
div h3{
  color: white;
  font-size: 1.5rem;
}
.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.custom-modal {
  background: rgba(105, 166, 124, 0.9);
  padding: 1vw;
  border-radius: 1vw;
  width: 85%;
  max-width: 90vw;
  position: relative;
}

.custom-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2vh;
}

.custom-modal-close {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
}

.custom-descriptions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0vw;
  
}

.custom-descriptions-item {
  padding: 1.4vw;
  border: 0.2vw solid #558b5a;
  border-radius: 1vw;
  background-color: #ffffff;
  font-size: 1.4rem;
  margin:0.5vh 0.5vw;
}

.custom-image-gallery {
  grid-column: span 3;
}

.custom-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1vw;
}

.custom-image {
  width: 100%;
  height: auto;
  border-radius: 1vw;
  object-fit: cover;
}
/* 智能识别 */
.content {
  margin: 0 1.5em;
}

.light {
  position: relative;
  background-color: #c8ecc9;
}

.medium {
  position: relative;
  background-color: #b5ddb9;
}

.dark {
  position: relative;
  background-color: #69a67c;
}

.card {
  margin-bottom: 1em;
  padding: 1em;
  border-radius: 0.5em;
}

.text {
  font-size: 1.25em;
  text-align: center;
  color: black;
  padding: 0.5em;
  &.dark {
    color: white;
  }
}

.light-title {
  font-size: 1.5em;
  color: #69a67c;
}

.process {
  width: fit-content;
  display: flex;
  align-items: center;
  margin: 1em auto;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  .circle {
    width: 2em;
    height: 2em;
    margin-bottom: 0.25em;
    line-height: 1.8em;
    font-size: 1.5em;
    text-align: center;
    border: 2px solid #69a67c;
    border-radius: 50%;
    transition:
      color 0.3s ease-in-out,
      border-color 0.3s ease-in-out;
  }
}

.color-light {
  color: #90c29b;
  border-color: #90c29b;
}

.color-dark {
  font-weight: 600;
  color: #69a67c;
  border-color: #69a67c;
}

.divider {
  height: 2em;
  div {
    width: 6em;
    border-width: 2px;
    border-style: dashed;
    transition: border-color 0.3s ease-in-out;
  }
}

.img-container {
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 40em;
    height: 30em;
    object-fit: contain;
  }
  .upload {
    width: 40em;
    height: 30em;
    border: 2px dashed white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      width: 8em;
      height: 8em;
    }
    div {
      font-size: 1.5em;
      color: white;
    }
    input {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
  }
}

.result-text {
  margin: 1em 1em 0;
}

.button {
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  &:hover {
    background-color: #90c29b;
  }
}

/* 表格 */
.table-container {
  margin: 0px;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1em;
  margin-top: 1.5em;

}

.custom-table th,
.custom-table td {
  border: 1px solid #69a67c;
  padding: 8px;
  text-align: left;
 
}

.custom-table th {
  background-color: #69a67c;
  color: white;
  
}


.custom-table tr {
  background-color: #f2f2f2;
}

.custom-table tr:hover {
  background-color: #ddd;
}

.custom-table button {
  background-color: #69a67c;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 0.5vw;
  gap:1vw;
}

.custom-table button:hover {
  background-color: #558b5a;
}
</style>
