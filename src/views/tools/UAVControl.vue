<script>
import axios from "axios";
import { VideoCameraOutlined } from "@ant-design/icons-vue";
import dayjs from "dayjs";
import fixWebmDuration from "fix-webm-duration";
import { notification } from "ant-design-vue";
import PageWithMenu from '../../components/global/PageWithMenu.vue';
import solidIcon from '@/assets/icons/土壤监测设备 1.png'

const supported = MediaRecorder.isTypeSupported("video/webm;codecs=vp9");

export default {
  name: "UAVControl",
  components: { VideoCameraOutlined, PageWithMenu },
  data() {
    return {
      menuOpts: [
          { iconUrl: solidIcon, name: '水平校准', value: 'levelCalibration' },
          { iconUrl: solidIcon, name: '磁力计较准', value: 'magnetometerCalibration' },
          { iconUrl: solidIcon, name: '6面加速度校准', value: 'accelerometerCalibration' },
          { iconUrl: solidIcon, name: '陀螺仪校准', value: 'gyroscopeCalibration' },
          { iconUrl: solidIcon, name: '飞控解锁', value: 'unlock' },
          { iconUrl: solidIcon, name: '飞控上锁', value: 'lock' }
        ],
      currentModule: 'temperature',

      supported,
      // 无人机服务器地址
      host: "http://conc.ddns.net:5000/",
      // 录制状态
      recording: false,
      // 录制实例
      mediaRecord: null,
      // 录制开始时间
      startTime: 0,
      // 录制数据
      chunks: [],
      // 录制intervalID
      intervalID: null,
      // 录制时长
      duration: null,
      // 输入数据
      input: {
        // 是否展示输入页面
        input: false,
        // 输入提示
        notes: "",
        // 等待输入的数据
        waiting: {},
        // 路由
        route: "",
        // 数据
        mode: 0,
        height: 0,
        distance: 0,
        velocity: 0,
        dirAngle: 0,

      },
    };
  },
  methods: {
    dayjs,
    // 保存当前帧
    getFrame() {
      const canvas = document.getElementById("canvas-feed");
      const downloadLink = canvas.toDataURL({
        format: "image/png",
        quality: 1,
        width: 12000,
        height: 4000,
      });
      const link = document.createElement("a");
      link.download =
        dayjs().format("YYYY年MM月DD日HH时mm分ss秒") + " 飞行器拍摄";
      link.href = downloadLink;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      notification.success({
        message: "截图成功",
        description: "请注意浏览器右上方下载提示",
        placement: "bottomRight",
      });
    },
    // 开始录制
    startRecord() {
      this.recording = true;
      this.startTime = Date.now();
      this.chunks = [];
      this.duration = dayjs(0).format("mm:ss");
      this.intervalID = setInterval(() => {
        this.duration = dayjs(Date.now() - this.startTime).format("mm:ss");
      }, 1000);
      this.mediaRecord.start();
      notification.info({
        message: "开始录制",
        description: "录制已开始，点击停止录制按钮结束录制",
        placement: "bottomRight",
      });
    },
    // 结束录制
    async endRecord() {
      this.recording = false;
      this.mediaRecord.stop();
      clearInterval(this.intervalID);
    },
    setInput(input, notes, waiting, route) {
      this.input = {
        input,
        notes,
        waiting,
        route,
        mode: 0,
        height: 0,
        distance: 0,
        velocity: 0,
        dirAngle: 0,
      };
    },
    // 发送请求
    sendRequest(endpoint) {
      // 如果是输入模式
      endpoint = endpoint || this.input.route;
      endpoint += this.input.waiting.length === 0 ? "" : "?";
      for (const key in this.input.waiting) {
        endpoint += `${key}=${this.input[key]}&`;
      }
      endpoint = endpoint.substring(0, endpoint.length - 1);
      this.setInput(false, "", {}, "");
      axios
        .get(`${this.host}${endpoint}`)
        .then((response) => {
          const data = response.data;
          if (data.status === "success") {
            notification.success({
              message: "操作成功",
              description: "调试信息：" + data.data.response,
              placement: "bottomRight",
            });
          } else {
            notification.error({
              message: "操作失败",
              description:
                "调试信息：" +
                data.data.response +
                "\n" +
                "错误信息：" +
                data.message,
              placement: "bottomRight",
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    changeMode() {
      this.setInput(
        true,
        "0: Manual, 1: Altitude, 2: Position, 3: Auto",
        {
          mode: "请输入飞行模式（0-3）：",
        },
        "changeMode",
      );
    },
    onekeyTakeoff() {
      this.setInput(
        true,
        "请输入起飞高度（cm）：",
        {
          height: "请输入起飞高度（cm）：",
        },
        "takeOff",
      );
    },
    horizontalMove() {
      this.setInput(
        true,
        "请输入移动距离（cm）：",
        {
          distance: "请输入移动距离（cm）：",
          velocity: "请输入移动速度（cm/s）：",
          dirAngle: "请输入移动方向角度（0-360）：",
        },
        "move",
      );
    },
  },
  mounted() {
    const that = this;
    // 将图片复制到canvas上
    const img = new Image();
    img.src = `${this.host}video_feed?fps=10`;
    img.crossOrigin = "Anonymous";
    const video = document.querySelector(".video");
    const canvas = document.getElementById("canvas-feed");
    const ctx = canvas.getContext("2d");

    // 加载页面
    const width = parseFloat(getComputedStyle(video).width);
    const height = width * 0.454;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("加载中...", canvas.width / 2 - 40, canvas.height / 3);

    // 实时更新(fps=10)
    img.onload = function () {
      const ratio = img.height / img.width;
      setInterval(() => {
        const width = parseFloat(getComputedStyle(video).width);
        const height = width * ratio;
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }, 100);
    };

    // 获取视频流
    if (!supported) return;
    this.mediaRecord = new MediaRecorder(canvas.captureStream(), {
      mimeType: "video/webm;codecs=vp9",
    });
    this.mediaRecord.ondataavailable = function (e) {
      const data = e.data;
      if (data && data.size > 0) {
        that.chunks.push(data);
      }
    };
    this.mediaRecord.onstop = async function () {
      notification.info({
        message: "录制暂停",
        description: "正在处理录制数据......",
        placement: "bottomRight",
      });
      const duration = Date.now() - that.startTime;
      const buggyBlob = new Blob(that.chunks, {
        type: "video/webm;codecs=h264",
      });
      fixWebmDuration(buggyBlob, duration, { logger: false }).then(
        function (fixedBlob) {
          const downloadLink = URL.createObjectURL(fixedBlob);
          const link = document.createElement("a");
          link.href = downloadLink;
          link.download =
            dayjs(that.startTime).format("YYYY年MM月DD日HH时mm分ss秒") +
            " 视频录制";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          notification.success({
            message: "录制成功",
            description: "请注意浏览器右上方下载提示",
            placement: "bottomRight",
          });
        },
      );
    };
  },
};
</script>

<template>
    <PageWithMenu
    :isHome="false"
    :options="menuOpts"
    :multiple="false"
    v-model:selected="currentModule"
  >
    <template #content>
      <div class="main">
          <div class="top">
            <h3>无人机控制</h3>
            <div class="button-group">
              <p>飞控模式</p>
              <div class="custom-button-group">
                <button class="custom-button" @click="changeMode(0)">
                  Manual
                </button>
                <button class="custom-button" @click="changeMode(1)">
                  Altitude
                </button>
                <button class="custom-button" @click="changeMode(2)">
                  Position
                </button>
                <button class="custom-button" @click="changeMode(3)">
                  Auto
                </button>
              </div>
              <p>姿态控制</p>
              <div class="custom-button-group">
                <button
                  class="custom-button"
                  @click="sendRequest('returnHome')"
                >
                  一键返航
                </button>
                <button class="custom-button" @click="onekeyTakeoff()">
                  一键起飞
                </button>
                <button class="custom-button" @click="sendRequest('land')">
                  一键降落
                </button>
                <button class="custom-button" @click="horizontalMove()">
                  平移
                </button>
              </div>
            </div>
          </div>
          <div class="video">
            <div class="inner" v-if="recording">
              <a-row><VideoCameraOutlined class="recording" />录制中</a-row>
              <a-row style="margin-top: 1vh">当前帧率：10FPS</a-row>
              <a-row style="margin-top: 1vh">录制时长：{{ duration }}</a-row>
            </div>
            <canvas class="video-feed" id="canvas-feed" />
            <div class="controller">
              <div
                style="color: green"
                @click="startRecord"
                v-if="!recording && supported"
              >
                开始录制
              </div>
              <div style="color: red" v-if="!supported">不支持录制</div>
              <div style="color: red" @click="endRecord" v-if="recording">
                停止录制
              </div>
              <div style="color: #2b3f52" @click="getFrame">截取当前帧</div>
            </div>
          </div>
      </div>
      <a-modal
        title="参数输入"
        v-model:open="input.input"
        @ok="sendRequest()"
      >
        <p>{{ input.notes }}</p>
        <a-input
          v-for="(item, name, index) in input.waiting"
          :key="index"
          v-model:value="input[name]"
          style="margin-top: 2vh"
        >
          <template #prefix>
            {{ item }}
          </template>
        </a-input>
      </a-modal>
    </template>
  </PageWithMenu>
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
  font-family: "等线";
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

.custom-button-group {
  display: flex;
  gap: 1vw;
}

.custom-button {
  background-color: #69a67c;
  color: black;
  border: none;
  padding: 0.2vw 0.6vw;
  cursor: pointer;
}

.custom-button:first-child {
  border-top-left-radius: 1.33vw;
  border-bottom-left-radius: 1.33vw;
}

.custom-button:last-child {
  border-top-right-radius: 1.33vw;
  border-bottom-right-radius: 1.33vw;
}

.custom-button:hover {
  background-color: #558b6e;
  color: white;
}

.custom-button.active {
  background-color: #558b6e;
  color: white;
}

.video {
  width: 95%;
  user-select: none;
  position: relative;
  cursor: pointer;
  margin: 2vw auto;
  margin-top: 0vw;
}

.video:hover .controller {
  height: 7vh;
  display: flex;
  animation-name: cont;
  animation-duration: 0.3s;
}

@keyframes cont {
  from {
    height: 0;
    display: none;
  }
  to {
    height: 3.33vw;
    display: flex;
  }
}

.video-feed {
  border-radius: 1vw;
  width: 100% !important;
  height: auto !important;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #69a67c;
}

.controller {
  overflow: hidden;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  position: absolute;
  bottom: 0;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  display: none;
  align-items: center;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 2;
  padding: 0 20px;
}

.controller > div {
  margin: auto 10px;
}

.inner {
  margin: 10px 10px;
  position: absolute;
  color: rgb(255, 255, 255);
}

.recording {
  margin-right: 4px;
  color: red;
  animation-name: recording;
  animation-direction: alternate-reverse;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

@keyframes recording {
  from {
    color: rgba(255, 0, 0, 1);
  }
  to {
    color: rgba(255, 0, 0, 0);
  }
}
</style>
