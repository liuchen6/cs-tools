<template>
  <header class="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-gray-100">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <router-link to="/" class="flex items-center gap-2.5 group">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm group-hover:scale-105 transition-transform">
            C
          </div>
          <div>
            <span class="font-semibold text-gray-900">CS Breakout</span>
            <span class="text-gray-400 mx-1">/</span>
            <span class="text-gray-500 text-sm">互动工具</span>
          </div>
        </router-link>
        <div class="hidden sm:flex items-center gap-1">
          <router-link
            v-for="tool in tools"
            :key="tool.path"
            :to="tool.path"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            :class="$route.path === tool.path
              ? 'text-brand-600 bg-brand-50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'"
          >
            {{ tool.title }}
          </router-link>
          <a
            :href="zsxqUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="ml-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30 transition-all duration-200 active:scale-[0.97]"
          >
            加入知识星球 &rarr;
          </a>
        </div>
        <button @click="mobileOpen = !mobileOpen" class="sm:hidden p-2 rounded-lg hover:bg-gray-100">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div v-if="mobileOpen" class="sm:hidden pb-3 space-y-1">
        <router-link
          v-for="tool in tools"
          :key="tool.path"
          :to="tool.path"
          @click="mobileOpen = false"
          class="block px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path === tool.path
            ? 'text-brand-600 bg-brand-50'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'"
        >
          {{ tool.title }}
        </router-link>
        <a
          :href="zsxqUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="block px-3 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-600 text-center"
        >
          加入知识星球 &rarr;
        </a>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { tools } from '../data/tools-registry.js'

const zsxqUrl = 'https://t.zsxq.com/UfeHK'
const mobileOpen = ref(false)
</script>
