<script>
import SideMenu from './SideMenu.vue'

export default {
  name: 'PageWithMenu',
  components: { SideMenu },
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
}
</script>

<template>
  <a-row id="page">
    <a-col span="4">
      <SideMenu :options="options" :multiple="multiple" v-model:selected="_selected" />
    </a-col>
    <a-col span="20">
      <slot name="content"></slot>
    </a-col>
  </a-row>
</template>

<style scoped>
#page {
  margin: 0;
  padding: 0;
  height: 90vh;
}
</style>
