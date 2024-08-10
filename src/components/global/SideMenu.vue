<script>
export default {
  name: 'SideMenu',
  props: ['options', 'multiple', 'selected'],
  emits: ['update:selected'],
  computed: {
    _selected: {
      get() {
        return this.selected
      },
      set(val) {
        this.$emit('update:selected', val)
      },
    },
  },
  methods: {
    selectOpt(optionVal) {
      if (this.multiple) {
        if (this._selected.includes(optionVal)) {
          this._selected = this._selected.filter((item) => item !== optionVal)
        } else {
          this._selected.push(optionVal)
        }
      } else {
        this._selected = optionVal
      }
    },
  },
}
</script>

<template>
  <ul id="side">
    <li
      v-for="option in options"
      :key="option.value"
      @click="selectOpt(option.value)"
      :class="{ 'active-item': _selected.includes(option.value) }"
    >
      <img :src="option.iconUrl" alt="icon" />
      <span>{{ option.name }}</span>
    </li>
  </ul>
</template>

<style scoped>
#side {
  list-style: none;
  position: relative;
  width: 90%;
  margin: 2em 0;
  padding-top: 2em;
  padding-left: 0;
  background-color: #c8ecc9;
  border-radius: 0 2em 2em 0;
  height: 80vh;
  font-family: '等线';
  border: #69a67c 0.15em solid;
}

#side li {
  padding: 0.5em;
  margin: 2em 2em 1em 0;
  cursor: pointer;
  background-color: #b0dab5;
  transition: background-color 0.3s ease;
  border-radius: 0 0.15em 0.15em 0;
  display: flex;
  align-items: center;
  span {
    font-size: 1.5vw;
    color: black;
    margin-left: 0.5em;
  }
  img {
    width: 2em;
    height: 2em;
  }
}

#side .active-item {
  background-color: #69a67c; /* 更改背景色 */
  transform: translateX(2em); /* 向右移动 */
  transition: transform 0.3s ease; /* 添加动画效果 */
  border-radius: 0.5em 0 0 0.5em;
  span {
    color: white;
  }
  img {
    filter: brightness(1.4); /* 增加亮度 */
    transition: filter 0.3s ease; /* 添加动画效果 */
  }
}
</style>
