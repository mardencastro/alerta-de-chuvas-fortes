<script setup>
import { computed, ref } from 'vue'
import { useAlertaEmail } from '../composables/useAlertaEmail.js'
import { nivelMaximo } from '../utils/classificar.js'

const props = defineProps({
  distritosHref: { type: String, required: true },
  distrito: { type: Object, required: true },
  dias: { type: Array, required: true },
  aCarregar: Boolean,
  erro: String,
})
const emit = defineEmits(['recarregar'])
const threshold = defineModel('limiar', { type: Number, default: 50 })
const selectedIndex = ref(0)
const email = ref('')
const { estado, mensagemErro, emEnvio, enviar } = useAlertaEmail()
const formatoDia = new Intl.DateTimeFormat('pt-MZ', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
const formatoCurto = new Intl.DateTimeFormat('pt-MZ', { weekday: 'short', timeZone: 'UTC' })
const levelStyles = {
  normal: {
    label: 'Normal', badge: 'bg-surface-container text-on-surface-variant font-medium',
    marker: 'bg-on-surface-variant rounded-full',
  },
  atencao: {
    label: 'Atenção', badge: 'bg-surface-container-highest text-primary font-semibold', marker: 'bg-primary',
  },
  alerta: {
    label: 'Alerta', badge: 'bg-primary text-on-primary font-semibold', marker: 'bg-surface-bright',
  },
}

const maxMm = computed(() => Math.max(100, ...props.dias.map(dia => Math.ceil((dia.mm ?? 0) / 20) * 20)))
const thresholdPosition = computed(() => Math.min(threshold.value / maxMm.value * 100, 98) + '%')
const selectedDay = computed(() => bars.value[selectedIndex.value] ?? bars.value[0])
const selectedLevel = computed(() => selectedDay.value?.mm == null ? null : levelStyles[selectedDay.value.nivel])
const temPrevisao = computed(() => props.dias.some(dia => dia.mm !== null))
const maximo = computed(() => levelStyles[nivelMaximo(props.dias)].label)

const bars = computed(() => props.dias.map((dia, index) => {
  const date = new Date(dia.data + 'T00:00:00Z')
  const selected = index === Math.min(selectedIndex.value, props.dias.length - 1)
  let color = 'bg-surface-container-high'
  if (dia.nivel === 'atencao') color = 'bg-surface-container-highest'
  if (dia.nivel === 'alerta') color = 'bg-secondary'
  if (selected) color = 'bg-primary ring-2 ring-primary ring-offset-2 ring-offset-surface-container-lowest'

  return {
    ...dia,
    selected,
    color,
    meetsThreshold: dia.nivel === 'alerta',
    day: formatoDia.format(date),
    weekday: formatoCurto.format(date).replace('.', ''),
    height: dia.mm === null ? 0 : Math.max(dia.mm / maxMm.value * 100, 2),
    hatch: dia.mm !== null && dia.nivel !== 'normal'
      ? { size: 4, strokeWidth: 1.2, color: dia.nivel === 'alerta' || selected ? '#ffffff' : '#1b4965', opacity: 0.25 }
      : null,
  }
}))

const feedback = computed(() => {
  if (estado.value === 'a-enviar') return { icon: 'sync', tone: 'bg-surface-container text-on-surface-variant', message: 'A enviar resumo…' }
  if (estado.value === 'enviado') return { icon: 'check_circle', tone: 'bg-secondary-container text-on-secondary-container', message: 'Resumo enviado.' }
  if (estado.value === 'erro') return { icon: 'error', tone: 'bg-error-container text-on-error-container', message: mensagemErro.value }
  return null
})

function submitEmail() {
  return enviar(email.value, props.distrito, props.dias, threshold.value)
}
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 bg-surface/90 pt-safe backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
    <div class="flex h-16 items-center justify-between px-gutter">
      <div class="flex items-center gap-space-sm">
        <a
          :href="distritosHref"
          aria-label="Voltar"
          class="flex h-11 w-11 items-center justify-center rounded-[8px_2px_8px_2px] text-primary transition-colors hover:text-primary-container"
        >
          <span class="material-symbols-outlined text-[20px]" aria-hidden="true">arrow_back</span>
        </a>
        <div class="flex flex-col">
          <span class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Estação Hidrométrica</span>
          <h1 class="font-headline-sm text-headline-sm tracking-tight text-primary">Detalhe Da Estação</h1>
        </div>
      </div>
      <div class="flex items-center gap-gutter">
        <span class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Posto Pluviométrico</span>
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
          <span class="material-symbols-outlined text-[18px] text-on-primary" aria-hidden="true">person</span>
        </div>
      </div>
    </div>
  </header>

  <main class="min-h-screen w-full bg-surface px-gutter pb-safe pt-header">
    <div class="flex w-full flex-col pb-12">
      <section class="flex flex-col px-1 pb-6 pt-2">
        <div class="mb-3 flex items-center justify-between">
          <a
            :href="distritosHref"
            class="-ml-2 inline-flex min-h-[48px] items-center gap-1.5 rounded-[8px_2px_8px_2px] px-2 font-label-md text-label-md uppercase tracking-wider text-primary transition-colors active:bg-surface-container"
          >
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">west</span>
            <span>Distritos</span>
          </a>
          <div class="inline-flex items-center gap-1.5 rounded-[4px_1px_4px_1px] bg-surface-container px-2 py-0.5 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
            <span class="h-1.5 w-1.5 rounded-full bg-primary"></span>
            <span>Open-Meteo</span>
          </div>
        </div>
        <div class="flex items-baseline justify-between gap-2">
          <h2 class="font-headline-xl-mobile text-headline-xl-mobile font-semibold tracking-tight text-primary">{{ distrito.nome }}</h2>
          <span class="font-label-sm text-label-sm tabular-nums text-on-surface-variant">{{ distrito.id }}</span>
        </div>
        <p class="mt-0.5 font-body-md text-body-md text-on-surface-variant">
          {{ distrito.provincia }}
        </p>
        <div class="mt-2 flex items-center gap-2 rounded-[6px_2px_6px_2px] bg-surface-container-low px-2.5 pb-1.5 pt-2">
          <span class="material-symbols-outlined text-[15px] text-primary" aria-hidden="true">explore</span>
          <span class="font-label-sm text-label-sm uppercase tabular-nums tracking-wider text-on-surface-variant">
            Coordenadas aproximadas {{ distrito.lat.toFixed(2) }}°, {{ distrito.lon.toFixed(2) }}°
          </span>
        </div>
      </section>

      <div class="my-1 h-px w-full bg-surface-container-highest"></div>

      <section v-if="selectedDay && temPrevisao" class="flex flex-col px-1 py-4" aria-label="Previsão do dia selecionado" aria-live="polite" aria-atomic="true">
        <div class="flex items-center justify-between">
          <span class="font-label-md text-label-md font-medium uppercase tracking-wider text-on-surface-variant">
            {{ selectedDay.day }}
          </span>
          <span
            class="inline-flex items-center gap-1 rounded-[6px_2px_6px_2px] px-2 py-0.5 font-label-sm text-label-sm uppercase tracking-wider"
            :class="selectedLevel?.badge ?? 'bg-surface-container text-on-surface-variant'"
          >
            <span class="h-1.5 w-1.5" v-if="selectedLevel" :class="selectedLevel.marker"></span>
            <span>{{ selectedLevel?.label ?? 'Dados indisponíveis' }}</span>
          </span>
        </div>
        <div class="mt-1 flex items-baseline gap-2">
          <div class="font-headline-xl text-headline-xl font-bold tabular-nums tracking-tighter text-primary">
            {{ selectedDay.mm ?? '—' }}
          </div>
          <span class="font-headline-sm text-headline-sm font-medium lowercase text-secondary">mm / 24h</span>
        </div>
        <p class="mt-1 font-body-sm text-body-sm text-on-surface-variant">
          Probabilidade de precipitação:
          <strong class="font-semibold text-primary">{{ selectedDay.probabilidade === null ? 'indisponível' : selectedDay.probabilidade + '%' }}</strong>
        </p>
      </section>

      <div v-else class="px-1 py-4 font-body-md text-body-md text-on-surface-variant" role="status">
        <p>{{ aCarregar ? 'A carregar a previsão…' : erro || 'Nenhuma previsão de precipitação disponível.' }}</p>
        <button v-if="!aCarregar" type="button" class="mt-2 text-primary underline" @click="emit('recarregar')">Tentar de novo</button>
      </div>

      <section v-if="temPrevisao" class="mt-2 w-full rounded-[14px_4px_14px_4px] bg-surface-container-lowest px-2 pb-3 pt-5" aria-labelledby="chart-title">
        <div class="mb-6 flex items-center justify-between px-1">
          <div class="flex items-center gap-2">
            <span class="h-2 w-2 rounded-[2px_0_2px_0] bg-primary-container"></span>
            <h3 id="chart-title" class="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">Hietograma Diário (7 Dias)</h3>
          </div>
          <span class="font-label-sm text-label-sm tabular-nums text-on-surface-variant">Unidade: milímetros (mm)</span>
        </div>

        <div class="relative flex h-56 w-full flex-col justify-end pb-1 pt-4">
          <div class="absolute inset-x-0 top-0 flex items-center justify-between text-on-surface-variant/40" aria-hidden="true">
            <span class="font-label-sm text-[9px] tabular-nums">{{ maxMm }} mm</span>
            <div class="ml-2 h-px flex-1 bg-surface-container-high"></div>
          </div>
          <div class="absolute inset-x-0 top-1/2 flex items-center justify-between text-on-surface-variant/40" aria-hidden="true">
            <span class="font-label-sm text-[9px] tabular-nums">{{ maxMm / 2 }} mm</span>
            <div class="ml-2 h-px flex-1 bg-surface-container-high"></div>
          </div>

          <div class="pointer-events-none absolute inset-x-0 z-20 transition-all duration-150" :style="{ bottom: thresholdPosition }">
            <div class="relative flex w-full items-center">
              <div class="h-[2px] w-full bg-primary"></div>
              <span class="absolute -top-5 right-0 whitespace-nowrap rounded-[4px_1px_4px_1px] bg-primary px-1.5 py-0.5 font-label-sm text-[10px] font-semibold uppercase tabular-nums tracking-wider text-on-primary">
                Limite: {{ threshold }} mm/dia
              </span>
            </div>
          </div>

          <div class="relative z-10 flex h-full w-full items-end justify-between px-1 pt-6">
            <button
              v-for="(bar, index) in bars"
              :key="bar.data"
              type="button"
              class="flex h-full min-w-0 flex-1 flex-col items-center justify-end px-1 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
              :aria-label="bar.day + (bar.mm === null ? ', valor indisponível' : ', ' + bar.mm + ' milímetros')"
              :aria-pressed="bar.selected"
              @click="selectedIndex = index"
            >
              <span
                class="mb-1 font-label-sm text-[10px] tabular-nums"
                :class="bar.selected || bar.meetsThreshold ? 'font-bold text-primary' : 'text-on-surface-variant'"
              >
                {{ bar.mm ?? '—' }}
              </span>
              <span
                class="relative block w-full overflow-hidden rounded-[6px_2px_0_0] transition-all"
                :class="bar.color"
                :style="{ height: bar.height + '%' }"
              >
                <svg
                  v-if="bar.hatch"
                  class="absolute inset-0 h-full w-full"
                  :style="{ opacity: bar.hatch.opacity }"
                  aria-hidden="true"
                >
                  <defs>
                    <pattern
                      :id="'hatch-' + bar.data"
                      :width="bar.hatch.size"
                      :height="bar.hatch.size"
                      patternUnits="userSpaceOnUse"
                      patternTransform="rotate(45)"
                    >
                      <line x1="0" y1="0" x2="0" :y2="bar.hatch.size" :stroke="bar.hatch.color" :stroke-width="bar.hatch.strokeWidth" />
                    </pattern>
                  </defs>
                  <rect :fill="'url(#hatch-' + bar.data + ')'" width="100%" height="100%" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        <div class="my-1 h-px w-full bg-primary/20"></div>
        <div class="flex w-full items-center px-1 text-center font-label-md text-label-md" aria-hidden="true">
          <div
            v-for="bar in bars"
            :key="bar.data"
            class="flex flex-1 flex-col py-1"
            :class="bar.selected ? 'rounded-[4px_1px_4px_1px] bg-surface-container font-bold text-primary' : 'text-on-surface-variant'"
          >
            <span class="uppercase" :class="{ 'font-semibold': !bar.selected }">{{ bar.weekday }}</span>
            <span class="text-[10px] tabular-nums" :class="{ 'opacity-75': !bar.selected }">{{ bar.data.slice(8) }}</span>
          </div>
        </div>
      </section>

      <aside class="mt-3 flex items-start gap-2 rounded-[8px_2px_8px_2px] bg-surface-container-low px-2 py-2.5">
        <span class="material-symbols-outlined mt-0.5 shrink-0 text-[17px] text-primary" aria-hidden="true">verified_user</span>
        <p class="font-body-sm text-body-sm leading-snug text-on-surface-variant">
          A precipitação intensa constitui um indicador de risco hidrológico; este serviço não substitui os avisos oficiais de cheia da DNGRH.
        </p>
      </aside>

      <section class="mt-6 flex flex-col px-1">
        <div class="mb-2 flex items-baseline justify-between gap-2">
          <label for="threshold-slider" class="font-label-sm text-label-sm font-medium uppercase tracking-wider text-on-surface-variant">
            Parâmetro de Vigilância
          </label>
          <output for="threshold-slider" class="font-label-md text-label-md font-bold tabular-nums text-primary" aria-live="off">
            Limite pessoal de alerta: {{ threshold }} mm/24h
          </output>
        </div>
        <div class="flex items-center py-2">
          <input
            id="threshold-slider"
            v-model.number="threshold"
            type="range"
            min="10"
            max="100"
            step="5"
            :aria-valuetext="threshold + ' milímetros por 24 horas'"
            class="h-1.5 w-full cursor-pointer appearance-none rounded-none bg-surface-container-highest accent-primary"
          />
        </div>
        <div class="flex justify-between px-0.5 font-label-sm text-[10px] tabular-nums text-on-surface-variant/70" aria-hidden="true">
          <span>10 mm</span>
          <span>25 mm</span>
          <span>50 mm (Referência)</span>
          <span>75 mm</span>
          <span>100 mm</span>
        </div>
      </section>

      <div class="my-6 h-px w-full bg-surface-container-highest"></div>

      <section class="flex flex-col px-1">
        <div class="mb-1.5 flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[18px] text-primary" aria-hidden="true">outgoing_mail</span>
          <h3 class="font-label-md text-label-md font-bold uppercase tracking-wider text-primary">Resumo da previsão</h3>
        </div>
        <p class="mb-3 font-body-sm text-body-sm text-on-surface-variant">
          Envia para o teu e-mail a previsão disponível e os dias que atingem o limite pessoal.
        </p>
        <form class="flex flex-col gap-2.5" novalidate @submit.prevent="submitEmail">
          <label for="email-input" class="sr-only">Endereço de e-mail</label>
          <input
            id="email-input"
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="nome@dominio.mz"
            required
            aria-describedby="email-feedback"
            class="h-12 w-full rounded-[8px_2px_8px_2px] bg-surface-container-lowest px-3.5 font-body-md text-body-md text-on-surface transition-all placeholder:text-on-surface-variant/40 focus:bg-surface-bright focus-visible:outline-primary"
          />
          <button
            type="submit"
            :disabled="emEnvio || !temPrevisao"
            class="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[14px_4px_14px_4px] bg-primary px-4 font-label-md text-label-md font-semibold uppercase tracking-wider text-on-primary transition-colors active:bg-primary-container disabled:cursor-wait disabled:opacity-70"
          >
            <span>Enviar resumo</span>
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">send</span>
          </button>
        </form>
        <div id="email-feedback" role="status">
          <div
            v-if="feedback"
            class="mt-2 flex items-center gap-2 rounded-[6px_2px_6px_2px] px-3 py-2 font-body-sm text-body-sm"
            :class="feedback.tone"
          >
            <span
              class="material-symbols-outlined shrink-0 text-[18px]"
              :class="{ 'animate-spin': estado === 'a-enviar' }"
              aria-hidden="true"
            >{{ feedback.icon }}</span>
            <span>{{ feedback.message }}</span>
          </div>
        </div>
      </section>

      <div class="my-6 h-px w-full bg-surface-container-highest"></div>

      <section class="flex flex-col px-1" aria-labelledby="diagnostic-title">
        <h3 id="diagnostic-title" class="mb-3 font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
          Estado da previsão
        </h3>
        <div class="flex flex-col gap-2 rounded-[10px_3px_10px_3px] bg-surface-container-low p-3">
          <p v-if="temPrevisao" class="font-body-sm text-body-sm text-on-surface-variant">
            Nível máximo nos dias disponíveis: {{ maximo }}.
          </p>
          <p class="font-body-sm text-body-sm text-on-surface-variant">Fonte: Open-Meteo. Coordenadas distritais aproximadas do projecto.</p>
        </div>
      </section>
    </div>
  </main>
</template>
