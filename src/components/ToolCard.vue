<template>
  <router-link :to="to" class="group block card-hover p-6 animate-slide-up">
    <div class="flex items-start gap-4">
      <div
        class="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
        :style="{ backgroundColor: color + '15', color: color }"
      >
        {{ icon }}
      </div>
      <div class="min-w-0">
        <h3 class="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
          {{ title }}
        </h3>
        <p class="mt-1 text-sm text-gray-500 line-clamp-2">{{ description }}</p>
        <div class="mt-3 flex items-center gap-2">
          <span
            v-for="tag in tags"
            :key="tag"
            class="tag bg-gray-100 text-gray-500"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  to: String,
  icon: String,
  title: String,
  description: String,
  color: { type: String, default: '#2563eb' },
  tags: { type: Array, default: () => [] },
})
</script>
