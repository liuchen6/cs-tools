<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
    <div class="text-center mb-8">
      <div class="text-4xl mb-3">{{ config.emoji }}</div>
      <h1 class="text-2xl sm:text-3xl font-bold">{{ config.title }}</h1>
      <p class="mt-2 text-gray-500">{{ config.subtitle }}</p>
    </div>

    <div v-if="step < config.steps.length" class="animate-slide-up">
      <div class="flex gap-1 mb-8">
        <div
          v-for="(s, i) in config.steps"
          :key="i"
          class="flex-1 h-1.5 rounded-full transition-all duration-500"
          :class="i <= step ? 'bg-brand-500' : 'bg-gray-200'"
        />
      </div>

      <div class="card p-6 sm:p-8">
        <p class="text-xs font-medium text-brand-500 uppercase tracking-wider mb-2">
          第 {{ step + 1 }} / {{ config.steps.length }} 步
        </p>
        <h2 class="text-lg sm:text-xl font-semibold text-gray-900">{{ currentQ.question }}</h2>
        <p v-if="currentQ.hint" class="mt-1 text-sm text-gray-400">{{ currentQ.hint }}</p>

        <div class="mt-6 space-y-3">
          <button
            v-for="(opt, i) in currentQ.options"
            :key="i"
            @click="pick(i)"
            class="w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200"
            :class="selected === i
              ? 'border-brand-500 bg-brand-50 text-brand-700'
              : 'border-gray-100 bg-white hover:border-gray-200 text-gray-700 hover:bg-gray-50'"
          >
            <span class="font-medium">{{ opt.label }}</span>
            <p v-if="opt.desc" class="mt-0.5 text-sm text-gray-400">{{ opt.desc }}</p>
          </button>
        </div>
      </div>

      <div class="flex justify-between mt-4">
        <button v-if="step > 0" @click="prev" class="btn-secondary text-sm">&larr; 上一步</button>
        <div v-else />
        <button v-if="selected !== null" @click="next" class="btn-primary text-sm">
          {{ step === config.steps.length - 1 ? '查看结果' : '下一步 &rarr;' }}
        </button>
      </div>
    </div>

    <div v-else class="animate-slide-up">
      <div class="card p-6 sm:p-8 text-center">
        <div class="text-5xl mb-4">{{ result.emoji }}</div>
        <h2 class="text-2xl font-bold text-gray-900">{{ result.title }}</h2>
        <p class="mt-2 text-gray-500">{{ result.desc }}</p>
        <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-brand-50 to-blue-50 text-left">
          <p class="text-sm text-gray-700 leading-relaxed">{{ result.reason }}</p>
          <p v-if="resultAdvice" class="mt-2 text-sm font-medium text-brand-600">→ {{ resultAdvice }}</p>
        </div>
        <div v-if="result.path" class="mt-4 p-4 rounded-xl bg-gray-50 text-left">
          <h3 class="font-semibold text-gray-800 text-sm mb-2">推荐学习路径</h3>
          <ul class="space-y-2">
            <li v-for="(p, i) in result.path" :key="i" class="flex items-start gap-3 text-sm text-gray-600">
              <span class="w-5 h-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">{{ i + 1 }}</span>
              {{ p }}
            </li>
          </ul>
        </div>
        <div class="mt-8 flex gap-3 justify-center">
          <button @click="reset" class="btn-secondary text-sm">重新测试</button>
          <button @click="shareResult" class="btn-primary text-sm">分享结果</button>
        </div>
        <div v-if="relatedTools.length" class="mt-8 pt-6 border-t border-gray-100">
          <p class="text-xs font-medium text-gray-400 mb-3">相关工具推荐</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <RouterLink
              v-for="t in relatedTools"
              :key="t.path"
              :to="t.path"
              class="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-brand-300 hover:bg-brand-50 transition-colors text-left"
            >
              <span class="text-2xl">{{ t.icon }}</span>
              <span>
                <span class="block text-sm font-medium text-gray-800">{{ t.title }}</span>
                <span class="block text-xs text-gray-400 line-clamp-2">{{ t.description }}</span>
              </span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { tools } from '../data/tools-registry.js'

const props = defineProps({ config: Object })
const openShare = inject('openShare')

const step = ref(0)
const picks = ref([])
const selected = ref(null)

const currentQ = computed(() => props.config.steps[step.value])

function pick(i) {
  selected.value = i
}

function next() {
  if (selected.value === null) return
  picks.value[step.value] = currentQ.value.options[selected.value].value
  if (step.value < props.config.steps.length - 1) {
    step.value++
    selected.value = null
  } else {
    step.value++
  }
}

function prev() {
  if (step.value > 0) {
    step.value--
    selected.value = props.config.steps[step.value].options.findIndex(
      o => o.value === picks.value[step.value]
    )
  }
}

function reset() {
  step.value = 0
  picks.value = []
  selected.value = null
}

const dimMap = {
  stage: 0, goal: 0,
  aim: 1, motive: 1,
  pref: 2, ready: 2, style: 2,
  res: 3,
}

const resultKey = computed(() => {
  const rules = props.config.logic.split('|')
  const p = picks.value

  for (const rule of rules) {
    const [conds, key] = rule.split('/')
    if (conds === 'default') continue
    const parts = conds.split(',')
    let match = true
    for (const part of parts) {
      const m = part.trim().match(/^([a-z_]+):\$([^,]*)$/)
      if (!m) { match = false; break }
      const val = m[2]
      if (val === 'any') continue
      const idx = dimMap[m[1]]
      if (idx === undefined || p[idx] !== val) { match = false; break }
    }
    if (match) return key
  }
  return 'default'
})

const result = computed(() => {
  const key = resultKey.value
  return props.config.results[key] || props.config.results.default
})

const relatedTools = computed(() => {
  const rel = props.config.related || []
  return rel.map(p => tools.find(t => t.path === p)).filter(Boolean)
})

const resultAdvice = computed(() => {
  const r = result.value
  if (!r) return ''
  const stage = picks.value[0]
  if (r.adviceByStage && stage && r.adviceByStage[stage]) return r.adviceByStage[stage]
  return r.advice || ''
})

function shareResult() {
  const r = result.value
  const pathHTML = r.path
    ? `<div style="margin-top:10px;font-size:13px;text-align:left;color:rgba(255,255,255,0.8);">学习路径：${r.path.slice(0, 3).map((p, i) => `<div style="margin-top:4px;">${i + 1}. ${p}</div>`).join('')}</div>`
    : ''
  const adviceHTML = resultAdvice.value
    ? `<div style="margin-top:10px;padding:8px;background:rgba(255,255,255,0.08);border-radius:8px;font-size:13px;">${resultAdvice.value}</div>`
    : ''
  openShare({
    emoji: r.emoji,
    title: r.title,
    subtitle: props.config.title,
    filename: `cs-breakout-${props.config.id}.png`,
    detailHTML: `
      <div style="font-size:14px;line-height:1.7;text-align:center;">
        <p style="margin-bottom:8px;">${r.desc}</p>
        <div style="padding:10px;background:rgba(255,255,255,0.08);border-radius:8px;font-size:13px;text-align:left;">
          ${r.reason || ''}
        </div>
        ${adviceHTML}
        ${pathHTML}
      </div>
    `,
  })
}
</script>
