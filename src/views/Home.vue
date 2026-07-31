<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
    <div class="text-center max-w-2xl mx-auto animate-fade-in">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-sm font-medium mb-6">
        <span class="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
        文章互动伴侣
      </div>
      <h1 class="text-4xl sm:text-5xl font-bold tracking-tight">
        计算机学生
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-700">互动工具集</span>
      </h1>
      <p class="mt-4 text-lg text-gray-500 leading-relaxed">
        读完文章，顺手玩一下。30 秒出结果，截图带走分享。
      </p>
    </div>

    <div class="mt-12 sm:mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <ToolCard
        v-for="tool in tools"
        :key="tool.path"
        :to="tool.path"
        :icon="tool.icon"
        :title="tool.title"
        :description="tool.description"
        :color="tool.color"
        :tags="tool.tags"
      />
    </div>

    <div class="mt-20 text-center animate-fade-in">
      <h2 class="text-lg font-semibold text-gray-900">更多互动内容开发中</h2>
      <p class="mt-2 text-sm text-gray-400">每篇新文章都会附带一款轻互动工具，敬请关注</p>
    </div>
  </div>
</template>

<script setup>
import ToolCard from '../components/ToolCard.vue'
import { tools } from '../data/tools-registry.js'
</script>
