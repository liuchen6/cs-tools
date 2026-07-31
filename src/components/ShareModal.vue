<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="$emit('close')">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div class="relative bg-white rounded-2xl shadow-xl max-w-sm w-full animate-scale-in overflow-hidden">
        <div ref="cardEl" class="p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div class="text-center">
            <div class="text-4xl mb-3">{{ result.emoji }}</div>
            <h3 class="text-lg font-bold">{{ result.title }}</h3>
            <p class="text-sm text-gray-300 mt-1">{{ result.subtitle }}</p>
          </div>
          <div class="mt-4 p-4 rounded-xl bg-white/10" v-html="result.detailHTML" />
          <div class="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
            <span class="w-6 h-6 rounded bg-brand-500 flex items-center justify-center text-white font-bold text-xs">C</span>
            <span>CS Breakout Tools &middot; tools.csbreakout.com</span>
          </div>
          <div class="mt-3 pt-3 border-t border-white/10 flex items-center gap-3">
            <img src="/zsxq-qr.png" alt="知识星球" class="w-14 h-14 rounded-lg shrink-0" />
            <div>
              <p class="text-xs text-gray-300">扫码加入知识星球</p>
              <p class="text-xs text-gray-400">获取更多CS成长干货</p>
            </div>
          </div>
        </div>
        <div class="p-4 flex gap-3 bg-gray-50">
          <button @click="downloadImage" class="btn-primary flex-1 text-sm">
            保存图片
          </button>
          <button @click="$emit('close')" class="btn-secondary text-sm">
            关闭
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import html2canvas from 'html2canvas'

const props = defineProps({
  result: Object,
})

defineEmits(['close'])

const cardEl = ref(null)

const downloadImage = async () => {
  await nextTick()
  const canvas = await html2canvas(cardEl.value, {
    backgroundColor: null,
    scale: 2,
  })
  const link = document.createElement('a')
  link.download = 'cs-breakout-result.png'
  link.href = canvas.toDataURL()
  link.click()
}
</script>
