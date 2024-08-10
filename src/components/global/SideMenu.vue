<script>
export default {
  name: 'SideMenu',
  props: ['options', 'multiple', 'selected'],
  emits: ['update:selected'],
  computed: {
    _selected: {
      get() {
        console.log('selected:', this.selected)
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
        if (!Array.isArray(this._selected)) {
          this._selected = [this._selected]
        }
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
    <p class="side-title">目录</p>
    <li
      v-for="option in options"
      :key="option.value"
      @click="selectOpt(option.value)"
      :class="{ 'active-item': _selected.includes(option.value) }"
    >
      <img :src="option.iconUrl" alt="icon" />
      <span>{{ option.name }}</span>
    </li>
    <svg
      width="100%"
      height="36"
      viewBox="0 0 279 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M199.5 27C218.5 29.5175 226.5 13 229.187 1.5C224 5.5 218 8.5 211 9.5C204 10.5 196 17 199.5 27Z"
        fill="#B0DAB5"
      />
      <path
        d="M0 34.9999L196.5 34.9824M196.5 34.9824L279 34.9999M196.5 34.9824C197.5 31.4999 198.3 30 199.5 27M199.5 27C218.5 29.5175 226.5 13 229.187 1.5C224 5.5 218 8.5 211 9.5C204 10.5 196 17 199.5 27ZM199.5 27C201.5 22 206 17.5 209 16.5"
        stroke="#69A67C"
      />
    </svg>
    <route-link to="/home">
      <span class="back">
        <img src="@/assets/icons/返回.png" alt="back" />
        返回
      </span>
    </route-link>
  </ul>
</template>

<style scoped>
#side {
  list-style: none;
  width: 100%;
  padding: 1em 0 2em;
  background-color: #c8ecc9;
  border-radius: 0 2em 2em 0;
  font-family: '等线';
  border: #69a67c 0.15em solid;
}

#side .side-title {
  margin: 0 0 0.8em 0.5em;
  font-size: 2.2vw;
  color: #69a67c;
}

#side li {
  padding: 0.5em;
  margin: 0 2em 1em 0;
  cursor: pointer;
  background-color: #b0dab5;
  transition: background-color 0.3s ease;
  transition: transform 0.3s ease; /* 添加动画效果 */
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
  border-radius: 0.5em 0 0 0.5em;
  span {
    color: white;
  }
  img {
    filter: brightness(1.4); /* 增加亮度 */
    transition: filter 0.3s ease; /* 添加动画效果 */
  }
}

svg {
  margin: 0 0 1em 0;
}

.back {
  font-size: 1.6vw;
  background-color: #b0dab5;
  padding: 0.5em;
  border-radius: 0.5em;
  margin: 0 0 2em 2em;
  img {
    width: 1.2em;
    height: 1.2em;
    margin-right: 0.2em;
  }
}
</style>
