<template>
  <div v-if="config">
    <ChecklistTool v-if="config.type === 'checklist'" :config="config" />
    <DecisionFlowTool v-else-if="config.type === 'decision-flow'" :config="config" />
    <GraduatePathTool v-else-if="config.type === 'graduate-path'" :config="config" />
  </div>
  <div v-else class="text-center py-20">
    <p class="text-gray-400">工具加载中...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { tools } from '../data/tools-registry.js'
import ChecklistTool from './ChecklistTool.vue'
import DecisionFlowTool from './DecisionFlowTool.vue'
import GraduatePathTool from './GraduatePathTool.vue'

const route = useRoute()
const config = ref(null)

async function loadTool() {
  const tool = tools.find(t => t.path === route.path)
  if (tool && tool.data) {
    const mod = await tool.data()
    config.value = mod.default || mod
  }
}

onMounted(loadTool)
watch(() => route.path, loadTool)
</script>
