<script>
import PageWithMenu from "@/components/global/PageWithMenu.vue";
import solidIcon from "@/assets/icons/土壤监测设备 1.png";

export default {
  name: "AlertInfo",
  components: { PageWithMenu },
  data() {
    return {
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
      imgUrl: "",
      selected: "detection", // 用于跟踪当前显示的模块
    };
  },
  methods: {
    uploadImg(file) {
      this.imgUrl = URL.createObjectURL(file);
      this.curStep = 1;
    },
  },
};
</script>

<template>
  <PageWithMenu
    :isHome="false"
    :options="menuOpts"
    :multiple="false"
    v-model:selected="selected"
  >
    <template #content>
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
  </PageWithMenu>
</template>

<style scoped>
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
</style>
