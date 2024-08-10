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
  <a-row class="page">
    <a-col span="4">
      <SideMenu
        :options="options"
        :multiple="multiple"
        v-model:selected="_selected"
      />
    </a-col>
    <a-col span="20">
      <slot name="content"></slot>
    </a-col>
  </a-row>
</template>

<style scoped>
.page {
  padding: 2em 0 !important;
}
</style>
