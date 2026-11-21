<template>
  <header class="fixed top-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)] pt-safe">
    <div class="h-16 px-gutter flex items-center justify-between">
      <div class="flex items-center gap-space-sm">
        <button aria-label="Voltar" class="w-11 h-11 flex items-center justify-center text-primary hover:text-primary-container transition-colors rounded-[8px_2px_8px_2px]" @click="voltar">
          <span class="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div class="flex flex-col">
          <span class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Estação Hidrométrica</span>
          <h1 class="font-headline-sm text-headline-sm text-primary tracking-tight">Detalhe Da Estação</h1>
        </div>
      </div>
      <div class="flex items-center gap-gutter">
        <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Posto Pluviométrico</span>
        <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-on-primary text-[18px]">person</span>
        </div>
      </div>
    </div>
  </header>

  <main class="flex flex-col relative w-full px-gutter pt-16 pb-safe bg-surface min-h-screen">
    <div class="flex flex-col w-full text-on-surface pb-12 select-none">
      <!-- 1. Cabeçalho -->
      <section class="flex flex-col pt-2 pb-6 px-1">
        <div class="flex items-center justify-between mb-3">
          <a class="inline-flex items-center gap-1.5 min-h-[48px] px-2 -ml-2 text-primary font-label-md text-label-md uppercase tracking-wider active:bg-surface-container transition-colors rounded-[8px_2px_8px_2px] cursor-pointer" @click="voltar">
            <span class="material-symbols-outlined text-[18px]">west</span>
            <span>Distritos</span>
          </a>
          <div class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase tracking-widest rounded-[4px_1px_4px_1px]">
            <span class="w-1.5 h-1.5 bg-primary rounded-full"></span>
            <span>Rede Telemétrica</span>
          </div>
        </div>
        <div class="flex items-baseline justify-between gap-2">
          <h2 class="font-headline-xl-mobile text-headline-xl-mobile text-primary tracking-tight font-semibold">Búzi</h2>
          <span class="font-label-sm text-label-sm tabular-nums text-on-surface-variant">Posto: MZ-SOF-04</span>
        </div>
        <p class="font-body-md text-body-md text-on-surface-variant mt-0.5">
          Província de Sofala · Bacia do Rio Púngoè / Búzi
        </p>
        <div class="flex items-center gap-2 mt-2 pt-2 bg-surface-container-low px-2.5 py-1.5 rounded-[6px_2px_6px_2px]">
          <span class="material-symbols-outlined text-primary text-[15px]">explore</span>
          <span class="font-label-sm text-label-sm tabular-nums uppercase text-on-surface-variant tracking-wider">
            Estação Hidrométrica 19°53'S 34°36'E · Cota 14m
          </span>
        </div>
      </section>

      <div class="w-full h-px bg-surface-container-highest my-1"></div>

      <!-- 2. Destaque do Dia -->
      <section class="pt-4 pb-4 px-1 flex flex-col transition-all duration-150">
        <div class="flex items-center justify-between">
          <span class="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-medium">{{ focalDate }}</span>
          <span :class="focalBadgeClass">
            <span :class="focalBadgeDotClass"></span>
            <span>{{ focalLevel }}</span>
          </span>
        </div>
        <div class="flex items-baseline gap-2 mt-1">
          <div class="font-headline-xl text-headline-xl text-primary font-bold tabular-nums tracking-tighter">{{ focalVal }}</div>
          <span class="font-headline-sm text-headline-sm text-secondary font-medium lowercase">mm / 24h</span>
        </div>
        <p class="font-body-sm text-body-sm text-on-surface-variant mt-1" v-html="focalDesc"></p>
      </section>

      <!-- 3. Gráfico -->
      <section class="mt-2 w-full bg-surface-container-lowest pt-5 pb-3 px-2 rounded-[14px_4px_14px_4px]">
        <div class="flex items-center justify-between px-1 mb-6">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 bg-primary-container rounded-[2px_0_2px_0]"></span>
            <span class="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">Hietograma Diário (7 Dias)</span>
          </div>
          <span class="font-label-sm text-label-sm text-on-surface-variant tabular-nums">Unidade: milímetros (mm)</span>
        </div>

        <div class="relative w-full h-56 flex flex-col justify-end pt-4 pb-1">
          <div class="absolute inset-x-0 top-0 flex items-center justify-between text-on-surface-variant/40">
            <span class="font-label-sm text-[9px] tabular-nums">100 mm</span>
            <div class="flex-1 ml-2 h-px bg-surface-container-high"></div>
          </div>
          <div class="absolute inset-x-0 top-1/2 flex items-center justify-between text-on-surface-variant/40">
            <span class="font-label-sm text-[9px] tabular-nums">50 mm</span>
            <div class="flex-1 ml-2 h-px bg-surface-container-high"></div>
          </div>

          <!-- Linha do Limite -->
          <div class="absolute inset-x-0 z-20 pointer-events-none transition-all duration-150" :style="{ bottom: thresholdPercentage + '%' }">
            <div class="relative w-full flex items-center">
              <div class="w-full h-[2px] bg-primary"></div>
              <span class="absolute right-0 -top-5 bg-primary text-on-primary font-label-sm text-[10px] px-1.5 py-0.5 rounded-[4px_1px_4px_1px] tabular-nums whitespace-nowrap shadow-none tracking-wider uppercase font-semibold">
                Limite: {{ currentThreshold }} mm/dia
              </span>
            </div>
          </div>

          <!-- Barras Dinâmicas com v-for -->
          <div class="relative z-10 w-full h-full flex items-end justify-between px-1 pt-6">
            <button 
              v-for="(bar, index) in barsData" 
              :key="index"
              class="bar-col group flex-1 h-full flex flex-col items-center justify-end px-1 focus:outline-none"
              @click="selectBar(index)"
            >
              <span :class="getBarLabelClass(bar, index)">{{ bar.mm }}</span>
              <div :class="getBarFillClass(bar, index)" :style="{ height: bar.mm + '%' }">
                <!-- Renderiza o hachurado SVG apenas se o nível for Alerta ou Atenção -->
                <svg v-if="bar.level !== 'Normal'" class="absolute inset-0 w-full h-full opacity-35" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern height="4" :id="'hatch-' + index" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse" width="4">
                      <line :stroke="bar.level === 'Alerta' ? '#ffffff' : '#1b4965'" stroke-width="1.2" x1="0" x2="0" y1="0" y2="4"></line>
                    </pattern>
                  </defs>
                  <rect :fill="'url(#hatch-' + index + ')'" height="100%" width="100%"></rect>
                </svg>
              </div>
            </button>
          </div>
        </div>

        <div class="w-full h-px bg-primary/20 my-1"></div>
        <div class="w-full flex items-center justify-between px-1 text-center font-label-md text-label-md">
          <div v-for="(bar, index) in barsData" :key="'label-'+index" :class="getDayLabelClass(index)">
            <span class="uppercase font-semibold">{{ getDayShortName(bar.day) }}</span>
            <span class="text-[10px] tabular-nums">{{ bar.mm }}</span>
          </div>
        </div>
      </section>

      <!-- 4. Aviso -->
      <aside class="mt-3 px-2 py-2.5 bg-surface-container-low rounded-[8px_2px_8px_2px]">
        <div class="flex items-start gap-2">
          <span class="material-symbols-outlined text-primary text-[17px] shrink-0 mt-0.5">verified_user</span>
          <p class="font-body-sm text-body-sm text-on-surface-variant leading-snug">
            A precipitação intensa constitui um indicador de risco hidrológico; este serviço não substitui os avisos oficiais de cheia da DNGRH.
          </p>
        </div>
      </aside>

      <!-- 5. Slider -->
      <section class="mt-6 px-1 flex flex-col">
        <div class="flex items-baseline justify-between mb-2">
          <span class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-medium">Parâmetro de Vigilância</span>
          <span class="font-label-md text-label-md tabular-nums text-primary font-bold">Limite pessoal de alerta: {{ currentThreshold }} mm/24h</span>
        </div>
        <div class="relative flex items-center py-2">
          <input v-model.number="currentThreshold" class="w-full h-1.5 bg-surface-container-highest appearance-none cursor-pointer accent-primary rounded-none" max="100" min="10" step="5" type="range" />
        </div>
        <div class="flex justify-between font-label-sm text-[10px] text-on-surface-variant/70 tabular-nums px-0.5">
          <span>10 mm</span>
          <span>25 mm</span>
          <span>50 mm (Referência)</span>
          <span>75 mm</span>
          <span>100 mm</span>
        </div>
      </section>

      <div class="w-full h-px bg-surface-container-highest my-6"></div>

      <!-- 6. Formulário de E-mail -->
      <section class="px-1 flex flex-col">
        <div class="flex items-center gap-1.5 mb-1.5">
          <span class="material-symbols-outlined text-primary text-[18px]">outgoing_mail</span>
          <h3 class="font-label-md text-label-md uppercase tracking-wider text-primary font-bold">Resumo Diário de Bacia</h3>
        </div>
        <p class="font-body-sm text-body-sm text-on-surface-variant mb-3">
          Enviaremos um único resumo diário às 06:00 quando a previsão exceder o limite estabelecido.
        </p>
        <form class="flex flex-col gap-2.5" @submit.prevent="handleEmailSubmit">
          <div class="relative w-full">
            <input v-model="emailInput" class="w-full h-12 px-3.5 bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-on-surface-variant/40 rounded-[8px_2px_8px_2px] focus:outline-none focus:bg-surface-bright transition-all" placeholder="nome@dominio.mz" required type="email"/>
          </div>
          <button class="w-full min-h-[48px] px-4 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider font-semibold rounded-[14px_4px_14px_4px] active:bg-primary-container transition-colors flex items-center justify-center gap-2" :disabled="feedbackState === 'sending'" type="submit">
            <span>Receber resumo</span>
            <span class="material-symbols-outlined text-[18px]">send</span>
          </button>
        </form>
        
        <div v-if="feedbackState" :class="getFeedbackClass()">
          <span class="material-symbols-outlined text-[18px]" :class="{ 'animate-spin': feedbackState === 'sending' }">{{ getFeedbackIcon() }}</span>
          <span>{{ getFeedbackMessage() }}</span>
        </div>
      </section>

      <div class="w-full h-px bg-surface-container-highest my-6"></div>

      <!-- 7. Painel de Estados -->
      <section class="px-1 flex flex-col">
        <div class="flex items-center justify-between mb-3">
          <span class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Painel de Estados do Sistema</span>
          <span class="font-label-sm text-label-sm text-on-surface-variant/60 font-mono text-[9px]">DIAG_MODE</span>
        </div>
        <div class="grid grid-cols-2 gap-1.5 mb-3 bg-surface-container p-1 rounded-[8px_2px_8px_2px]">
          <button @click="activeTab = 'clear'" :class="activeTab === 'clear' ? 'py-1.5 px-2 text-center font-label-sm text-label-sm uppercase tracking-wide bg-surface-bright text-primary font-bold rounded-[6px_2px_6px_2px] transition-all' : 'py-1.5 px-2 text-center font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant hover:text-primary rounded-[6px_2px_6px_2px] transition-all'">
            Sem Excedência
          </button>
          <button @click="activeTab = 'loading'" :class="activeTab === 'loading' ? 'py-1.5 px-2 text-center font-label-sm text-label-sm uppercase tracking-wide bg-surface-bright text-primary font-bold rounded-[6px_2px_6px_2px] transition-all' : 'py-1.5 px-2 text-center font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant hover:text-primary rounded-[6px_2px_6px_2px] transition-all'">
            A Carregar
          </button>
        </div>
        
        <div v-show="activeTab === 'clear'" class="p-3 bg-surface-container-low rounded-[10px_3px_10px_3px] flex flex-col gap-2">
          <div class="flex items-start gap-2.5">
            <span class="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">water_drop</span>
            <div class="flex flex-col">
              <span class="font-label-md text-label-md text-primary font-semibold">Sem dias acima do limite</span>
              <p class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Nenhum dia acima de {{ currentThreshold }} mm nos próximos 7 dias. Condições pluviais dentro dos parâmetros basais.
              </p>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'loading'" class="p-3 bg-surface-container-low rounded-[10px_3px_10px_3px] flex flex-col gap-2">
          <div class="flex items-center justify-between mb-1">
            <span class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Sincronizando Boletim...</span>
            <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          </div>
          <div class="w-full h-20 flex items-end justify-between px-2 pt-2 pb-1 bg-surface-bright rounded-[6px_2px_6px_2px]">
            <div class="w-5 h-8 bg-surface-container rounded-[3px_1px_0_0]"></div>
            <div class="w-5 h-12 bg-surface-container rounded-[3px_1px_0_0]"></div>
            <div class="w-5 h-14 bg-surface-container rounded-[3px_1px_0_0]"></div>
            <div class="w-5 h-6 bg-surface-container rounded-[3px_1px_0_0]"></div>
            <div class="w-5 h-10 bg-surface-container rounded-[3px_1px_0_0]"></div>
            <div class="w-5 h-4 bg-surface-container rounded-[3px_1px_0_0]"></div>
            <div class="w-5 h-3 bg-surface-container rounded-[3px_1px_0_0]"></div>
          </div>
          <span class="font-label-sm text-[10px] text-on-surface-variant text-center">Aguardando telemetria das 18 estações de bacia</span>
        </div>

        <div class="mt-4 pt-3 flex flex-col gap-2">
          <span class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-medium">Simulador de Estados do Formulário:</span>
          <div class="grid grid-cols-2 gap-1.5">
            <button @click="setFormFeedback('invalid')" class="text-left px-2 py-1.5 bg-surface-container font-label-sm text-label-sm text-on-surface-variant hover:text-primary rounded-[6px_2px_6px_2px]">1. E-mail inválido</button>
            <button @click="setFormFeedback('sending')" class="text-left px-2 py-1.5 bg-surface-container font-label-sm text-label-sm text-on-surface-variant hover:text-primary rounded-[6px_2px_6px_2px]">2. A enviar...</button>
            <button @click="setFormFeedback('success')" class="text-left px-2 py-1.5 bg-surface-container font-label-sm text-label-sm text-on-surface-variant hover:text-primary rounded-[6px_2px_6px_2px]">3. Subscrição confirmada</button>
            <button @click="setFormFeedback('network')" class="text-left px-2 py-1.5 bg-surface-container font-label-sm text-label-sm text-on-surface-variant hover:text-primary rounded-[6px_2px_6px_2px]">4. Falha de ligação</button>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'

// Estado do botão voltar
const voltar = () => {
  window.history.back()
}

// Estado do Gráfico (Array reativo)
const barsData = ref([
  { day: 'Segunda-feira, 24 de Fevereiro', mm: 12, level: 'Normal', desc: 'Escoamento superficial estável. Precipitação ligeira sem impacto nos leitos secundários.' },
  { day: 'Terça-feira, 25 de Fevereiro', mm: 38, level: 'Atenção', desc: 'Vigiar valas de drenagem urbana e pequenos afluentes na margem direita do Búzi.' },
  { day: 'Quarta-feira, 26 de Fevereiro', mm: 92, level: 'Alerta', desc: 'Probabilidade de precipitação: <strong class="text-primary font-semibold">85%</strong> · Risco elevado de transbordo pluvial e saturação acelerada do solo.' },
  { day: 'Quinta-feira, 27 de Fevereiro', mm: 64, level: 'Alerta', desc: 'Precipitação contínua sobre solo saturado. Monitorar secções baixas de Guara-Guara.' },
  { day: 'Sexta-feira, 28 de Fevereiro', mm: 25, level: 'Normal', desc: 'Tendência decrescente. Níveis de precipitação moderados sem agravamento hidrológico.' },
  { day: 'Sábado, 01 de Março', mm: 10, level: 'Normal', desc: 'Precipitação pontual e fraca. Capacidade de infiltração normalizada.' },
  { day: 'Domingo, 02 de Março', mm: 4, level: 'Normal', desc: 'Céu pouco nublado a limpo. Fluxo hídrico do rio em estabilização progressiva.' }
])

const activeIndex = ref(2) // Quarta-feira selecionada por padrão
const currentThreshold = ref(50)

// Telemetria Focal (Computada com base na barra ativa)
const focalDate = computed(() => barsData.value[activeIndex.value].day)
const focalVal = computed(() => barsData.value[activeIndex.value].mm)
const focalDesc = computed(() => barsData.value[activeIndex.value].desc)
const focalLevel = computed(() => barsData.value[activeIndex.value].level)

const focalBadgeClass = computed(() => {
  const level = focalLevel.value
  if (level === 'Alerta') return 'inline-flex items-center gap-1 px-2 py-0.5 bg-primary text-on-primary font-label-sm text-label-sm rounded-[6px_2px_6px_2px] tracking-wider uppercase font-semibold'
  if (level === 'Atenção') return 'inline-flex items-center gap-1 px-2 py-0.5 bg-surface-container-highest text-primary font-label-sm text-label-sm rounded-[6px_2px_6px_2px] tracking-wider uppercase font-semibold'
  return 'inline-flex items-center gap-1 px-2 py-0.5 bg-surface-container text-on-surface-variant font-label-sm text-label-sm rounded-[6px_2px_6px_2px] tracking-wider uppercase font-medium'
})

const focalBadgeDotClass = computed(() => {
  const level = focalLevel.value
  if (level === 'Alerta') return 'w-1.5 h-1.5 bg-surface-bright rounded-none'
  if (level === 'Atenção') return 'w-1.5 h-1.5 bg-primary rounded-none'
  return 'w-1.5 h-1.5 bg-on-surface-variant rounded-full'
})

const thresholdPercentage = computed(() => {
  return Math.min(Math.max(currentThreshold.value, 5), 98)
})

// Métodos de interação do Gráfico
const selectBar = (index) => {
  activeIndex.value = index
}

// Classes dinâmicas das barras
const getBarFillClass = (bar, index) => {
  const isActive = index === activeIndex.value
  if (isActive) {
    return 'bar-fill w-full bg-primary rounded-[6px_2px_0_0] transition-all relative overflow-hidden ring-2 ring-primary ring-offset-2 ring-offset-surface-container-lowest'
  }
  if (bar.mm >= currentThreshold.value) {
    return 'bar-fill w-full bg-secondary rounded-[6px_2px_0_0] transition-all relative overflow-hidden'
  }
  return 'bar-fill w-full bg-surface-container-high rounded-[6px_2px_0_0] transition-all'
}

const getBarLabelClass = (bar, index) => {
  const isActive = index === activeIndex.value
  if (isActive) return 'font-label-sm text-[10px] font-bold tabular-nums text-primary mb-1'
  if (bar.mm >= currentThreshold.value) return 'font-label-sm text-[10px] tabular-nums text-primary font-semibold mb-1'
  return 'font-label-sm text-[10px] tabular-nums text-on-surface-variant mb-1'
}

// Eixo X dias da semana
const getDayLabelClass = (index) => {
  const base = 'flex-1 flex flex-col py-1'
  if (index === activeIndex.value) return `${base} text-primary font-bold bg-surface-container rounded-[4px_1px_4px_1px]`
  return `${base} text-on-surface-variant`
}

const getDayShortName = (fullDayName) => {
  const days = { 'Segunda-feira': 'seg', 'Terça-feira': 'ter', 'Quarta-feira': 'qua', 'Quinta-feira': 'qui', 'Sexta-feira': 'sex', 'Sábado': 'sáb', 'Domingo': 'dom' }
  const key = fullDayName.split(',')[0]
  return days[key] || ''
}

// Estado do Painel de Diagnóstico
const activeTab = ref('clear')

// Estado do Formulário de E-mail
const emailInput = ref('')
const feedbackState = ref('')

const handleEmailSubmit = () => {
  if (!emailInput.value || !emailInput.value.includes('@')) {
    setFormFeedback('invalid')
    return
  }
  setFormFeedback('sending')
  setTimeout(() => {
    setFormFeedback('success')
  }, 900)
}

const setFormFeedback = (state) => {
  feedbackState.value = state
}

const getFeedbackClass = () => {
  const base = 'mt-2 px-3 py-2 rounded-[6px_2px_6px_2px] font-body-sm text-body-sm flex items-center gap-2 '
  switch(feedbackState.value) {
    case 'invalid': return base + 'bg-error-container text-on-error-container'
    case 'sending': return base + 'bg-surface-container text-on-surface-variant'
    case 'success': return base + 'bg-secondary-container text-on-secondary-container'
    case 'network': return base + 'bg-surface-container-highest text-on-surface-variant'
    default: return 'hidden'
  }
}

const getFeedbackIcon = () => {
  switch(feedbackState.value) {
    case 'invalid': return 'error'
    case 'sending': return 'sync'
    case 'success': return 'check_circle'
    case 'network': return 'cloud_off'
    default: return ''
  }
}

const getFeedbackMessage = () => {
  switch(feedbackState.value) {
    case 'invalid': return 'E-mail inválido. Por favor confirme o endereço.'
    case 'sending': return 'A enviar subscrição telemétrica...'
    case 'success': return 'Subscrição confirmada. Receberá alertas diários caso o limiar seja atingido.'
    case 'network': return 'Falha de ligação ao posto de dados. Tente novamente.'
    default: return ''
  }
}
</script>

<style scoped>
/* Removemos os estilos do body/html daqui pois já estão no index.html */
::-webkit-scrollbar{display:none;}
</style>