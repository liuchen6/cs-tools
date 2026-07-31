<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
    <div class="text-center mb-8">
      <div class="text-4xl mb-3">{{ config.emoji }}</div>
      <h1 class="text-2xl sm:text-3xl font-bold">{{ config.title }}</h1>
      <p class="mt-2 text-gray-500">{{ config.subtitle }}</p>
    </div>

    <!-- Phase 1: Decision Flow -->
    <div v-if="phase === 'decision'" class="animate-slide-up">
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

    <!-- Phase 2: Result + Checklist -->
    <div v-else class="animate-slide-up">
      <div class="card p-6 sm:p-8 text-center mb-6">
        <div class="text-5xl mb-4">{{ goal.emoji }}</div>
        <h2 class="text-2xl font-bold text-gray-900">{{ goal.title }}</h2>
        <p class="mt-2 text-gray-500">{{ goal.desc }}</p>
        <div class="mt-6 p-4 rounded-xl bg-gradient-to-br from-brand-50 to-blue-50 text-left">
          <p class="text-sm text-gray-700 leading-relaxed">{{ goalAdvice }}</p>
        </div>
      </div>

      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-gray-800 flex items-center gap-2">
          <span class="w-1.5 h-5 rounded-full inline-block" :style="{ background: goal.color }" />
          {{ config.checklistTitle || '三年规划清单' }}
          <span class="text-xs text-gray-400 font-normal">({{ goalLabel }}专属)</span>
        </h3>
        <div class="text-sm text-gray-500">{{ totalChecked }}/{{ totalItems }}</div>
      </div>

      <div class="card p-6 sm:p-8 mb-6">
        <div class="mb-4 h-2.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :style="{ width: progress + '%', background: goal.color }"
          />
        </div>
        <div class="space-y-6">
          <div v-for="(cat, ci) in goalChecklist" :key="ci" class="animate-slide-up" :style="{ animationDelay: `${ci * 0.05}s` }">
            <h3 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span class="w-1.5 h-5 rounded-full inline-block" :style="{ background: goal.color }" />
              {{ cat.name }}
              <span class="text-xs text-gray-400 font-normal">({{ checkedCountInCat(ci) }}/{{ cat.items.length }})</span>
            </h3>
            <div class="space-y-2">
              <label
                v-for="(item, ii) in cat.items"
                :key="ii"
                class="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors"
                :class="checked[`${ci}-${ii}`] ? 'bg-gray-50 border border-gray-200' : 'bg-gray-50 hover:bg-gray-100 border border-transparent'"
              >
                <input
                  type="checkbox"
                  :checked="checked[`${ci}-${ii}`]"
                  @change="toggle(`${ci}-${ii}`)"
                  class="mt-0.5 w-4 h-4 rounded border-gray-300 focus:ring-brand-500"
                  :class="checked[`${ci}-${ii}`] ? 'accent-brand-500' : ''"
                />
                <span class="text-sm text-gray-700" :class="checked[`${ci}-${ii}`] ? 'line-through text-gray-400' : ''">{{ item.text }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="card p-6 sm:p-8 text-center">
        <div class="text-5xl mb-3">{{ totalChecked }}/{{ totalItems }}</div>
        <p class="text-lg font-semibold" :style="{ color: goal.color }">{{ result.label }}</p>
        <p class="mt-1 text-sm text-gray-600">{{ result.desc }}</p>
        <p class="mt-2 text-sm font-medium" :style="{ color: goal.color }">{{ result.suggestion }}</p>
        <div class="mt-6 flex gap-3 justify-center">
          <button @click="resetAll" class="btn-secondary text-sm">重新测试</button>
          <button @click="shareResult" class="btn-primary text-sm">分享结果</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'

const props = defineProps({ config: Object })
const openShare = inject('openShare')

const phase = ref('decision')
const step = ref(0)
const picks = ref([])
const selected = ref(null)
const checked = ref({})
const goalKey = ref(null)

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
    goalKey.value = computeGoal()
    phase.value = 'checklist'
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

function computeGoal() {
  const map = props.config.goalMap
  if (map) {
    for (const rule of map) {
      if (rule.default) return rule.goal
      const match = rule.match || {}
      let ok = true
      for (const [key, val] of Object.entries(match)) {
        const idx = parseInt(key.replace(/^p/, ''))
        if (val !== 'any' && picks.value[idx] !== val) { ok = false; break }
      }
      if (ok) return rule.goal
    }
    return 'default'
  }
  const [fin, tend] = picks.value
  if (fin === 'can') {
    if (tend === 'stable') return 'civil-servant'
    if (tend === 'money') return 'industry'
    if (tend === 'academic') return 'phd'
    return 'civil-servant'
  } else {
    if (tend === 'stable') return 'civil-servant'
    if (tend === 'money') return 'industry'
    if (tend === 'academic') return 'phd-invest'
    return 'civil-servant'
  }
}

const goal = computed(() => props.config.goals[goalKey.value])

const goalLabel = computed(() => {
  const labels = { 'civil-servant': '考公考编', industry: '进厂', phd: '读博', 'phd-invest': '读博' }
  return labels[goalKey.value] || goal.value?.title || ''
})

const gradeValue = computed(() => picks.value.length > 1 ? picks.value[picks.value.length - 1] : null)

const goalAdvice = computed(() => {
  const g = goal.value
  if (!g) return ''
  if (g.adviceByGrade && gradeValue.value && g.adviceByGrade[gradeValue.value]) {
    return g.adviceByGrade[gradeValue.value]
  }
  return g.advice || ''
})

const goalChecklist = computed(() => {
  const gk = goalKey.value
  return props.config.checklist.categories.map(cat => ({
    name: cat.name,
    items: cat.items.filter(item => item.goals.includes('all') || item.goals.includes(gk))
  }))
})

function toggle(key) {
  checked.value[key] = !checked.value[key]
}

const totalItems = computed(() => {
  return goalChecklist.value.reduce((s, c) => s + c.items.length, 0)
})

const totalChecked = computed(() => {
  return Object.values(checked.value).filter(Boolean).length
})

const progress = computed(() => {
  if (totalItems.value === 0) return 0
  return Math.round((totalChecked.value / totalItems.value) * 100)
})

function checkedCountInCat(ci) {
  const cat = goalChecklist.value[ci]
  if (!cat) return 0
  let count = 0
  // Build key prefix for this category
  const prefix = Object.keys(checked.value).filter(k => k.startsWith(`${ci}-`))
  prefix.forEach(k => { if (checked.value[k]) count++ })
  return count
}

const result = computed(() => {
  const n = totalChecked.value
  const pct = progress.value
  const rs = props.config.checklist.results
  let r = rs.find(r => (r.minPct !== undefined) ? (pct >= r.minPct && pct <= r.maxPct) : (n >= r.min && n <= r.max))
  return r || rs[0]
})

function resetAll() {
  phase.value = 'decision'
  step.value = 0
  picks.value = []
  selected.value = null
  checked.value = {}
  goalKey.value = null
}

function shareResult() {
  const g = goal.value
  const r = result.value
  const items = goalChecklist.value.map(c =>
    `<tr><td style="padding:4px 8px;color:rgba(255,255,255,0.6)">${c.name}</td><td style="padding:4px 8px;text-align:right;font-weight:600">${checkedCountInCatS(c)}/${c.items.length}</td></tr>`
  ).join('')
  openShare({
    emoji: g.emoji,
    title: `${g.title} · ${progress.value}%`,
    subtitle: `${props.config.title}`,
    detailHTML: `
      <div style="text-align:center;margin-bottom:8px;font-size:13px;color:rgba(255,255,255,0.5)">${g.desc}</div>
      <div style="text-align:center;margin-bottom:12px;">
        <div style="font-size:36px;font-weight:700;">${totalChecked.value}/${totalItems.value}</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.5);">完成项目</div>
      </div>
      <table style="width:100%;font-size:13px;border-collapse:collapse;">${items}</table>
      <div style="margin-top:12px;padding:10px;background:rgba(255,255,255,0.08);border-radius:8px;font-size:13px;text-align:center;">
        ${r.suggestion}
      </div>
    `,
  })
}

function checkedCountInCatS(cat) {
  const ci = goalChecklist.value.indexOf(cat)
  if (ci === -1) return 0
  let count = 0
  cat.items.forEach((_, ii) => { if (checked.value[`${ci}-${ii}`]) count++ })
  return count
}
</script>
