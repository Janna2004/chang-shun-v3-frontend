<script>
export default {
  name: "LayoutFooter",
};
</script>

<template>
  <div class="main">
    <div class="info">
      <div class="links">
        <span style="font-size: 1.5em; color: #10411f">快捷入口</span>
        <div class="links-link">
          <a href="https://www.bupt.edu.cn/" target="_blank">北京邮电大学</a>
          <a href="https://scs.bupt.edu.cn/" target="_blank"
            >北京邮电大学计算机学院（国家示范性软件学院）</a
          >
          <a href="https://www.gzcsx.gov.cn/" target="_blank">长顺县人民政府</a>
        </div>
      </div>
      <div style="margin-left: 5vw">
        <img alt src="@/assets/footimg1.png" />
        <span style="font-size: 1.1rem">贵州省 长顺县</span>
      </div>
      <div style="margin-left: 8vw">
        <a href="https://www.bupt.edu.cn" target="_blank">
          <img alt src="@/assets/footlogo.png" />
        </a>
      </div>
    </div>
    <div class="copyright">
      ChangShun @2024 Created by BUPT-SCS-BluePrint
      <span style="color: #10411f; margin-left: 3vw">备案号：</span>
      <a
        href="https://beian.miit.gov.cn/#/Integrated/index"
        style="color: #10411f"
        target="_blank"
        >京ICP备xxxxxx号</a
      >
    </div>
  </div>
</template>

<style scoped>
.main {
  width: 100%;
  background-color: #c8ecc9;
  color: #10411f;
  position: relative;
}

.info {
  padding: 4vw 0 4vw 10vw;
  display: flex;
  flex-direction: row;
}

.links-link {
  display: flex;
  flex-direction: column;
  margin-top: 1.5vw;
}

.links-link a {
  margin-bottom: 0.5vw;
  color: #10411f;
  font-size: 1.1rem;
}

.copyright {
  width: 100%;
  text-align: center;
  font-size: 1.1rem;
  position: relative;
  border-top: solid 0.1vh #10411f;
  padding-top: 1vw;
  padding-bottom: 1vw;
}
</style>
