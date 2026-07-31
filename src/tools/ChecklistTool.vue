<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
    <div class="text-center mb-8">
      <div class="text-4xl mb-3">{{ config.emoji }}</div>
      <h1 class="text-2xl sm:text-3xl font-bold">{{ config.title }}</h1>
      <p class="mt-2 text-gray-500">{{ config.subtitle }}</p>
    </div>

    <div class="card p-6 sm:p-8 mb-6">
      <div class="space-y-6">
        <div v-for="(cat, ci) in config.categories" :key="ci" class="animate-slide-up" :style="{ animationDelay: `${ci * 0.05}s` }">
          <h3 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span class="w-1.5 h-5 rounded-full bg-brand-500 inline-block" />
            {{ cat.name }}
            <span class="text-xs text-gray-400 font-normal">({{ checkedCount(cat.items) }}/{{ cat.items.length }})</span>
          </h3>
          <div class="space-y-2">
            <label
              v-for="(item, ii) in cat.items"
              :key="ii"
              class="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors"
              :class="checked[`${ci}-${ii}`] ? 'bg-brand-50 border border-brand-100' : 'bg-gray-50 hover:bg-gray-100 border border-transparent'"
            >
              <input
                type="checkbox"
                :checked="checked[`${ci}-${ii}`]"
                @change="toggle(`${ci}-${ii}`)"
                class="mt-0.5 w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
              />
              <span class="text-sm text-gray-700" :class="checked[`${ci}-${ii}`] ? 'line-through text-gray-400' : ''">{{ item }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="card p-6 sm:p-8 animate-slide-up text-center">
      <div class="text-5xl mb-3">{{ totalChecked }}/{{ totalItems }}</div>
      <h2 class="text-lg font-bold text-gray-900">完成度 {{ progress }}%</h2>
      <div class="mt-3 h-2.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          class="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500"
          :style="{ width: progress + '%' }"
        />
      </div>
      <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-brand-50 to-blue-50">
        <p class="text-lg font-semibold text-brand-700">{{ result.label }}</p>
        <p class="mt-1 text-sm text-gray-600">{{ result.desc }}</p>
        <p class="mt-2 text-sm font-medium text-brand-600">{{ result.suggestion }}</p>
      </div>
      <div class="mt-6 flex gap-3 justify-center">
        <button @click="share" class="btn-primary text-sm">分享进度</button>
        <button @click="reset" class="btn-secondary text-sm">重新勾选</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'

const props = defineProps({ config: Object })
const openShare = inject('openShare')

const checked = ref({})

function toggle(key) {
  checked.value[key] = !checked.value[key]
}

function checkedCount(items) {
  const ci = props.config.categories.findIndex(c => c.items === items)
  if (ci === -1) return 0
  let count = 0
  items.forEach((_, ii) => { if (checked.value[`${ci}-${ii}`]) count++ })
  return count
}

const totalItems = computed(() => {
  return props.config.categories.reduce((s, c) => s + c.items.length, 0)
})

const totalChecked = computed(() => {
  return Object.values(checked.value).filter(Boolean).length
})

const progress = computed(() => {
  if (totalItems.value === 0) return 0
  return Math.round((totalChecked.value / totalItems.value) * 100)
})

const result = computed(() => {
  const n = totalChecked.value
  const r = props.config.results.find(r => n >= r.min && n <= r.max) || props.config.results[0]
  return r
})

function reset() {
  checked.value = {}
}

function share() {
  const catBreakdown = props.config.categories.map(c =>
    `<tr><td style="padding:4px 8px;color:rgba(255,255,255,0.6)">${c.name}</td><td style="padding:4px 8px;text-align:right;font-weight:600">${checkedCount(c.items)}/${c.items.length}</td></tr>`
  ).join('')
  openShare({
    emoji: props.config.emoji,
    title: `${result.value.label} · ${progress.value}%`,
    subtitle: `${config.title}`,
    detailHTML: `
      <div style="text-align:center;margin-bottom:12px;">
        <div style="font-size:36px;font-weight:700;">${totalChecked.value}/${totalItems.value}</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.5);">完成项目</div>
      </div>
      <table style="width:100%;font-size:13px;border-collapse:collapse;">${catBreakdown}</table>
      <div style="margin-top:12px;padding:10px;background:rgba(255,255,255,0.08);border-radius:8px;font-size:13px;text-align:center;">
        ${result.value.suggestion}
      </div>
    `,
  })
}
</script>
