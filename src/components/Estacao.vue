<script setup>
import { computed, onUnmounted, ref } from 'vue'

defineProps({ distritosHref: { type: String, required: true } })

const forecast = [
  {
    weekday: 'seg',
    date: '24',
    day: 'Segunda-feira, 24 de Fevereiro',
    mm: 12,
    level: 'Normal',
    description: 'Escoamento superficial estável. Precipitação ligeira sem impacto nos leitos secundários.',
  },
  {
    weekday: 'ter',
    date: '25',
    day: 'Terça-feira, 25 de Fevereiro',
    mm: 38,
    level: 'Atenção',
    description: 'Vigiar valas de drenagem urbana e pequenos afluentes na margem direita do Búzi.',
    hatch: { size: 4, strokeWidth: 1.2, color: '#1b4965', opacity: 0.35 },
  },
  {
    weekday: 'qua',
    date: '26',
    day: 'Quarta-feira, 26 de Fevereiro',
    mm: 92,
    level: 'Alerta',
    probability: 85,
    description: 'Risco elevado de transbordo pluvial e saturação acelerada do solo.',
    hatch: { size: 5, strokeWidth: 1.5, color: '#ffffff', opacity: 0.2 },
  },
  {
    weekday: 'qui',
    date: '27',
    day: 'Quinta-feira, 27 de Fevereiro',
    mm: 64,
    level: 'Alerta',
    description: 'Precipitação contínua sobre solo saturado. Monitorar secções baixas de Guara-Guara.',
    hatch: { size: 4, strokeWidth: 1.2, color: '#ffffff', opacity: 0.25 },
  },
  {
    weekday: 'sex',
    date: '28',
    day: 'Sexta-feira, 28 de Fevereiro',
    mm: 25,
    level: 'Normal',
    description: 'Tendência decrescente. Níveis de precipitação moderados sem agravamento hidrológico.',
  },
  {
    weekday: 'sáb',
    date: '01',
    day: 'Sábado, 01 de Março',
    mm: 10,
    level: 'Normal',
    description: 'Precipitação pontual e fraca. Capacidade de infiltração normalizada.',
  },
  {
    weekday: 'dom',
    date: '02',
    day: 'Domingo, 02 de Março',
    mm: 4,
    level: 'Normal',
    description: 'Céu pouco nublado a limpo. Fluxo hídrico do rio em estabilização progressiva.',
  },
]

const levelStyles = {
  Normal: {
    badge: 'bg-surface-container text-on-surface-variant font-medium',
    marker: 'bg-on-surface-variant rounded-full',
  },
  Atenção: {
    badge: 'bg-surface-container-highest text-primary font-semibold',
    marker: 'bg-primary',
  },
  Alerta: {
    badge: 'bg-primary text-on-primary font-semibold',
    marker: 'bg-surface-bright',
  },
}

const diagnosticViews = [
  { id: 'clear', label: 'Sem Excedência' },
  { id: 'loading', label: 'A Carregar' },
]

const loadingBars = ['h-8', 'h-12', 'h-14', 'h-6', 'h-10', 'h-4', 'h-3']

const feedbackStates = {
  invalid: {
    label: 'E-mail inválido',
    icon: 'error',
    message: 'E-mail inválido. Por favor confirme o endereço.',
    tone: 'bg-error-container text-on-error-container',
  },
  sending: {
    label: 'A enviar...',
    icon: 'sync',
    message: 'A enviar subscrição telemétrica...',
    tone: 'bg-surface-container text-on-surface-variant',
  },
  success: {
    label: 'Subscrição confirmada',
    icon: 'check_circle',
    message: 'Subscrição confirmada. Receberá alertas diários caso o limiar seja atingido.',
    tone: 'bg-secondary-container text-on-secondary-container',
  },
  network: {
    label: 'Falha de ligação',
    icon: 'cloud_off',
    message: 'Falha de ligação ao posto de dados. Tente novamente.',
    tone: 'bg-surface-container-highest text-on-surface-variant',
  },
}

const selectedIndex = ref(2)
const threshold = defineModel('limiar', { type: Number, default: 50 })
const diagnostic = ref('clear')
const feedbackState = ref(null)
let submissionTimer

const selectedDay = computed(() => forecast[selectedIndex.value])
const selectedLevel = computed(() => levelStyles[selectedDay.value.level])
const thresholdPosition = computed(() => Math.min(threshold.value, 98) + '%')
const feedback = computed(() => feedbackStates[feedbackState.value])

const bars = computed(() =>
  forecast.map((day, index) => {
    const selected = index === selectedIndex.value
    const meetsThreshold = day.mm >= threshold.value
    let color = day.level === 'Atenção' ? 'bg-surface-container-highest' : 'bg-surface-container-high'

    if (selected) {
      color = 'bg-primary ring-2 ring-primary ring-offset-2 ring-offset-surface-container-lowest'
    } else if (meetsThreshold) {
      color = 'bg-secondary'
    }

    return { ...day, selected, meetsThreshold, color }
  }),
)

function setFeedback(state) {
  clearTimeout(submissionTimer)
  feedbackState.value = state
}

function submitEmail() {
  if (feedbackState.value === 'sending') return

  setFeedback('sending')
  submissionTimer = setTimeout(() => setFeedback('success'), 900)
}

onUnmounted(() => clearTimeout(submissionTimer))
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
            <span>Rede Telemétrica</span>
          </div>
        </div>
        <div class="flex items-baseline justify-between gap-2">
          <h2 class="font-headline-xl-mobile text-headline-xl-mobile font-semibold tracking-tight text-primary">Búzi</h2>
          <span class="font-label-sm text-label-sm tabular-nums text-on-surface-variant">Posto: MZ-SOF-04</span>
        </div>
        <p class="mt-0.5 font-body-md text-body-md text-on-surface-variant">
          Província de Sofala · Bacia do Rio Púngoè / Búzi
        </p>
        <div class="mt-2 flex items-center gap-2 rounded-[6px_2px_6px_2px] bg-surface-container-low px-2.5 pb-1.5 pt-2">
          <span class="material-symbols-outlined text-[15px] text-primary" aria-hidden="true">explore</span>
          <span class="font-label-sm text-label-sm uppercase tabular-nums tracking-wider text-on-surface-variant">
            Estação Hidrométrica 19°53'S 34°36'E · Cota 14m
          </span>
        </div>
      </section>

      <div class="my-1 h-px w-full bg-surface-container-highest"></div>

      <section class="flex flex-col px-1 py-4" aria-label="Previsão do dia selecionado" aria-live="polite" aria-atomic="true">
        <div class="flex items-center justify-between">
          <span class="font-label-md text-label-md font-medium uppercase tracking-wider text-on-surface-variant">
            {{ selectedDay.day }}
          </span>
          <span
            class="inline-flex items-center gap-1 rounded-[6px_2px_6px_2px] px-2 py-0.5 font-label-sm text-label-sm uppercase tracking-wider"
            :class="selectedLevel.badge"
          >
            <span class="h-1.5 w-1.5" :class="selectedLevel.marker"></span>
            <span>{{ selectedDay.level }}</span>
          </span>
        </div>
        <div class="mt-1 flex items-baseline gap-2">
          <div class="font-headline-xl text-headline-xl font-bold tabular-nums tracking-tighter text-primary">
            {{ selectedDay.mm }}
          </div>
          <span class="font-headline-sm text-headline-sm font-medium lowercase text-secondary">mm / 24h</span>
        </div>
        <p class="mt-1 font-body-sm text-body-sm text-on-surface-variant">
          <template v-if="selectedDay.probability">
            Probabilidade de precipitação: <strong class="font-semibold text-primary">{{ selectedDay.probability }}%</strong> ·
          </template>
          {{ selectedDay.description }}
        </p>
      </section>

      <section class="mt-2 w-full rounded-[14px_4px_14px_4px] bg-surface-container-lowest px-2 pb-3 pt-5" aria-labelledby="chart-title">
        <div class="mb-6 flex items-center justify-between px-1">
          <div class="flex items-center gap-2">
            <span class="h-2 w-2 rounded-[2px_0_2px_0] bg-primary-container"></span>
            <h3 id="chart-title" class="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">Hietograma Diário (7 Dias)</h3>
          </div>
          <span class="font-label-sm text-label-sm tabular-nums text-on-surface-variant">Unidade: milímetros (mm)</span>
        </div>

        <div class="relative flex h-56 w-full flex-col justify-end pb-1 pt-4">
          <div class="absolute inset-x-0 top-0 flex items-center justify-between text-on-surface-variant/40" aria-hidden="true">
            <span class="font-label-sm text-[9px] tabular-nums">100 mm</span>
            <div class="ml-2 h-px flex-1 bg-surface-container-high"></div>
          </div>
          <div class="absolute inset-x-0 top-1/2 flex items-center justify-between text-on-surface-variant/40" aria-hidden="true">
            <span class="font-label-sm text-[9px] tabular-nums">50 mm</span>
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
              :key="bar.date"
              type="button"
              class="flex h-full min-w-0 flex-1 flex-col items-center justify-end px-1 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
              :aria-label="bar.day + ', ' + bar.mm + ' milímetros'"
              :aria-pressed="bar.selected"
              @click="selectedIndex = index"
            >
              <span
                class="mb-1 font-label-sm text-[10px] tabular-nums"
                :class="bar.selected || bar.meetsThreshold ? 'font-bold text-primary' : 'text-on-surface-variant'"
              >
                {{ bar.mm }}
              </span>
              <span
                class="relative block w-full overflow-hidden rounded-[6px_2px_0_0] transition-all"
                :class="bar.color"
                :style="{ height: Math.max(bar.mm, 6) + '%' }"
              >
                <svg
                  v-if="bar.hatch"
                  class="absolute inset-0 h-full w-full"
                  :style="{ opacity: bar.hatch.opacity }"
                  aria-hidden="true"
                >
                  <defs>
                    <pattern
                      :id="'hatch-' + bar.date"
                      :width="bar.hatch.size"
                      :height="bar.hatch.size"
                      patternUnits="userSpaceOnUse"
                      patternTransform="rotate(45)"
                    >
                      <line x1="0" y1="0" x2="0" :y2="bar.hatch.size" :stroke="bar.hatch.color" :stroke-width="bar.hatch.strokeWidth" />
                    </pattern>
                  </defs>
                  <rect :fill="'url(#hatch-' + bar.date + ')'" width="100%" height="100%" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        <div class="my-1 h-px w-full bg-primary/20"></div>
        <div class="flex w-full items-center px-1 text-center font-label-md text-label-md" aria-hidden="true">
          <div
            v-for="bar in bars"
            :key="bar.date"
            class="flex flex-1 flex-col py-1"
            :class="bar.selected ? 'rounded-[4px_1px_4px_1px] bg-surface-container font-bold text-primary' : 'text-on-surface-variant'"
          >
            <span class="uppercase" :class="{ 'font-semibold': !bar.selected }">{{ bar.weekday }}</span>
            <span class="text-[10px] tabular-nums" :class="{ 'opacity-75': !bar.selected }">{{ bar.date }}</span>
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
          <h3 class="font-label-md text-label-md font-bold uppercase tracking-wider text-primary">Resumo Diário de Bacia</h3>
        </div>
        <p class="mb-3 font-body-sm text-body-sm text-on-surface-variant">
          Enviaremos um único resumo diário às 06:00 quando a previsão exceder o limite estabelecido.
        </p>
        <form class="flex flex-col gap-2.5" @submit.prevent="submitEmail">
          <label for="email-input" class="sr-only">Endereço de e-mail</label>
          <input
            id="email-input"
            type="email"
            autocomplete="email"
            placeholder="nome@dominio.mz"
            required
            :aria-invalid="feedbackState === 'invalid' ? 'true' : undefined"
            :aria-describedby="feedbackState === 'invalid' ? 'email-feedback' : undefined"
            class="h-12 w-full rounded-[8px_2px_8px_2px] bg-surface-container-lowest px-3.5 font-body-md text-body-md text-on-surface transition-all placeholder:text-on-surface-variant/40 focus:bg-surface-bright focus-visible:outline-primary"
            @invalid.prevent="setFeedback('invalid')"
            @input="feedbackState === 'invalid' && setFeedback(null)"
          />
          <button
            type="submit"
            :disabled="feedbackState === 'sending'"
            class="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[14px_4px_14px_4px] bg-primary px-4 font-label-md text-label-md font-semibold uppercase tracking-wider text-on-primary transition-colors active:bg-primary-container disabled:cursor-wait disabled:opacity-70"
          >
            <span>Receber resumo</span>
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
              :class="{ 'animate-spin': feedbackState === 'sending' }"
              aria-hidden="true"
            >{{ feedback.icon }}</span>
            <span>{{ feedback.message }}</span>
          </div>
        </div>
      </section>

      <div class="my-6 h-px w-full bg-surface-container-highest"></div>

      <section class="flex flex-col px-1" aria-labelledby="diagnostic-title">
        <div class="mb-3 flex items-center justify-between">
          <h3 id="diagnostic-title" class="font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
            Painel de Estados do Sistema
          </h3>
          <span class="font-mono text-[9px] text-on-surface-variant/60">DIAG_MODE</span>
        </div>
        <div class="mb-3 grid grid-cols-2 gap-1.5 rounded-[8px_2px_8px_2px] bg-surface-container p-1">
          <button
            v-for="view in diagnosticViews"
            :key="view.id"
            type="button"
            :aria-pressed="diagnostic === view.id"
            class="rounded-[6px_2px_6px_2px] px-2 py-1.5 text-center font-label-sm text-label-sm uppercase tracking-wide transition-all"
            :class="diagnostic === view.id ? 'bg-surface-bright font-bold text-primary' : 'text-on-surface-variant hover:text-primary'"
            @click="diagnostic = view.id"
          >
            {{ view.label }}
          </button>
        </div>

        <div class="flex flex-col gap-2 rounded-[10px_3px_10px_3px] bg-surface-container-low p-3" aria-live="polite">
          <div v-if="diagnostic === 'clear'" class="flex items-start gap-2.5">
            <span class="material-symbols-outlined mt-0.5 shrink-0 text-[20px] text-secondary" aria-hidden="true">water_drop</span>
            <div class="flex flex-col">
              <span class="font-label-md text-label-md font-semibold text-primary">Sem dias acima do limite</span>
              <p class="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">
                Nenhum dia acima de 50 mm nos próximos 7 dias. Condições pluviais dentro dos parâmetros basais.
              </p>
            </div>
          </div>
          <template v-else>
            <div class="mb-1 flex items-center justify-between">
              <span class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Sincronizando Boletim...</span>
              <span class="h-2 w-2 animate-pulse rounded-full bg-secondary" aria-hidden="true"></span>
            </div>
            <div class="flex h-20 w-full items-end justify-between rounded-[6px_2px_6px_2px] bg-surface-bright px-2 pb-1 pt-2" aria-hidden="true">
              <div
                v-for="height in loadingBars"
                :key="height"
                class="w-5 rounded-[3px_1px_0_0] bg-surface-container"
                :class="height"
              ></div>
            </div>
            <span class="text-center font-label-sm text-[10px] text-on-surface-variant">
              Aguardando telemetria das 18 estações de bacia
            </span>
          </template>
        </div>

        <div class="mt-4 flex flex-col gap-2 pt-3">
          <span class="font-label-sm text-label-sm font-medium uppercase tracking-wider text-on-surface-variant">
            Simulador de Estados do Formulário:
          </span>
          <div class="grid grid-cols-2 gap-1.5">
            <button
              v-for="(state, key) in feedbackStates"
              :key="key"
              type="button"
              class="rounded-[6px_2px_6px_2px] bg-surface-container px-2 py-1.5 text-left font-label-sm text-label-sm text-on-surface-variant hover:text-primary"
              @click="setFeedback(key)"
            >
              {{ state.label }}
            </button>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>
