<script setup>
import { computed, onUnmounted, ref, useTemplateRef } from 'vue'

defineProps({ links: { type: Object, required: true } })

const provinces = [
  {
    name: 'Província de Sofala',
    basin: 'Bacia do Púngoè / Zambeze',
    districts: [
      {
        name: 'Búzi',
        station: 'Posto Hidrométrico Estúrio • Bacia do Búzi',
        mm: 92,
        note: 'Pico em 48h',
        risk: 'Alerta',
        hasDetails: true,
      },
      {
        name: 'Marromeu',
        station: 'Baixo Zambeze • Margem Sul',
        mm: 48,
        note: 'Subida contínua',
        risk: 'Atenção',
      },
      {
        name: 'Caia',
        station: 'Estação Ponte Armando Guebuza',
        mm: 18,
        note: 'Nível de base',
        risk: 'Normal',
      },
    ],
  },
  {
    name: 'Província de Gaza',
    basin: 'Bacia do Limpopo',
    districts: [
      {
        name: 'Chókwè',
        station: 'Regadio do Limpopo • Eclusas de Macarretane',
        mm: 74,
        note: 'Descarga a montante',
        risk: 'Alerta',
      },
      {
        name: 'Xai-Xai',
        station: 'Foz do Rio Limpopo • Cota de maré',
        mm: 35,
        note: 'Preia-mar crítica',
        risk: 'Atenção',
      },
    ],
  },
  {
    name: 'Província da Zambézia',
    basin: 'Bacia do Licungo / Chinde',
    districts: [
      {
        name: 'Mocuba',
        station: 'Ponte Licungo • Monitorização de crista',
        mm: 88,
        note: 'Subida rápida',
        risk: 'Alerta',
      },
      {
        name: 'Chinde',
        station: 'Delta do Zambeze • Estuário costeiro',
        mm: 52,
        note: 'Vento marítimo',
        risk: 'Atenção',
      },
    ],
  },
  {
    name: 'Província de Nampula',
    basin: 'Faixa Litoral Norte',
    districts: [
      {
        name: 'Angoche',
        station: 'Canal de Moçambique • Estação de Superfície',
        mm: 14,
        note: 'Pluviometria estável',
        risk: 'Normal',
      },
    ],
  },
  {
    name: 'Província de Maputo',
    basin: 'Bacia do Rio Umbeluzi',
    districts: [
      {
        name: 'Boane',
        station: 'Albufeira dos Pequenos Libombos',
        mm: 61,
        note: 'Enchimento a 86%',
        risk: 'Alerta',
      },
    ],
  },
]

const riskStyles = {
  Alerta: { value: 'font-bold text-primary', badge: 'bg-primary font-bold text-on-primary' },
  Atenção: { value: 'font-semibold text-primary', badge: 'attention-stripes bg-surface-container-highest font-bold text-primary' },
  Normal: { value: 'font-medium text-on-surface-variant', badge: 'bg-surface-container-low font-medium text-on-surface-variant' },
}

const districtCount = provinces.reduce((total, province) => total + province.districts.length, 0)
const views = [
  { id: 'list', label: `Ledger activo (${districtCount})` },
  { id: 'empty', label: 'Sem resultados' },
  { id: 'error', label: 'Falha de telemetria' },
]
const suggestions = ['Búzi', 'Chókwè', 'Mocuba', 'Boane']

const search = ref('')
const searchInput = useTemplateRef('searchInput')
const selectedView = ref('list')
const isRetrying = ref(false)
let retryTimer

function normalize(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[-\s]+/g, ' ').trim()
}

const filteredProvinces = computed(() => {
  const query = normalize(search.value)
  return provinces
    .map(province => ({
      ...province,
      districts: province.districts.filter(district => normalize(district.name).includes(query)),
    }))
    .filter(province => province.districts.length)
})

const visibleView = computed(() => {
  if (selectedView.value === 'list' && filteredProvinces.value.length === 0) return 'empty'

  return selectedView.value
})

function selectView(view) {
  clearTimeout(retryTimer)
  isRetrying.value = false
  selectedView.value = view
}

function searchFor(term) {
  search.value = term
  selectView('list')
}

function clearSearch() {
  searchFor('')
  searchInput.value?.focus()
}

function changeView(view) {
  if (view === 'list') {
    searchFor('')
  } else {
    selectView(view)
  }
}

function retryConnection() {
  isRetrying.value = true
  retryTimer = setTimeout(() => searchFor(''), 900)
}

onUnmounted(() => clearTimeout(retryTimer))
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 bg-surface/90 pt-safe backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
    <div class="flex h-20 items-center justify-between gap-2 px-gutter">
      <div class="flex flex-col justify-center">
        <div class="flex items-center gap-space-xs">
          <span class="h-1.5 w-1.5 shrink-0 bg-primary-container" aria-hidden="true"></span>
          <span class="font-headline-sm text-headline-sm uppercase tracking-widest text-primary">chuva forte</span>
        </div>
        <span class="mt-0.5 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Monitorização hidrológica distrital</span>
      </div>
      <div class="flex items-center gap-2 sm:gap-gutter">
        <nav class="flex items-center gap-2 sm:gap-gutter" aria-label="Navegação principal">
          <a :href="links.distritos" aria-current="page" class="flex min-h-[44px] items-center font-semibold uppercase tracking-wider text-primary">Distritos</a>
          <a :href="links.sobre" class="flex min-h-[44px] items-center font-label-md text-label-md uppercase tracking-wider text-on-surface-variant transition-colors hover:text-primary">Sobre</a>
        </nav>
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary" aria-hidden="true">
          <span class="material-symbols-outlined text-[18px] text-on-primary">person</span>
        </div>
      </div>
    </div>
  </header>

  <main id="distritos" class="home-content min-h-screen w-full bg-surface px-gutter">
    <div class="flex items-baseline justify-between gap-2 border-b border-[#D0D9DF] pb-1 pt-2">
      <div class="flex items-center gap-1.5">
        <span class="h-1.5 w-1.5 shrink-0 bg-primary" aria-hidden="true"></span>
        <span class="font-label-sm text-label-sm font-medium uppercase tracking-widest text-on-surface-variant">Caderno Hidrológico • Série 2025</span>
      </div>
      <span class="font-label-sm text-label-sm tabular-nums text-on-surface-variant">REF: 19°49'S 34°52'E</span>
    </div>

    <div class="pb-3 pt-4">
      <h1 class="font-headline-lg-mobile text-headline-lg-mobile tracking-tight text-primary">Previsão distrital</h1>
      <p class="mt-0.5 font-body-sm text-body-sm leading-snug text-on-surface-variant">
        Precipitação acumulada máxima esperada para os próximos 7 dias com base nas bacias hidrográficas nacionais.
      </p>
    </div>

    <div class="flex items-center justify-between gap-2 rounded-br-xl rounded-tl-xl bg-surface-container px-3 py-2.5">
      <div class="flex items-center gap-2">
        <span class="h-2 w-2 shrink-0 bg-primary" aria-hidden="true"></span>
        <span class="font-label-md text-label-md font-semibold uppercase tracking-wider text-primary">{{ districtCount }} distritos sob monitorização prioritária</span>
      </div>
      <span class="rounded-br-md rounded-tl-md bg-surface px-1.5 py-0.5 font-label-sm text-label-sm tabular-nums text-on-surface-variant">DNGRH 06:00</span>
    </div>

    <div class="mb-2 mt-4">
      <label for="district-search" class="mb-1.5 block font-label-sm text-label-sm font-medium uppercase tracking-wider text-on-surface-variant">Localizar posto distrital</label>
      <div class="relative flex items-center">
        <span class="material-symbols-outlined pointer-events-none absolute left-3 text-[20px] text-on-surface-variant" aria-hidden="true">search</span>
        <input
          id="district-search"
          ref="searchInput"
          v-model="search"
          autocomplete="off"
          class="h-12 w-full rounded-br-xl rounded-tl-xl bg-surface-container pl-10 pr-11 font-body-md text-body-md text-on-surface transition-colors placeholder:text-on-surface-variant/70 focus:bg-surface-container-highest focus-visible:outline-primary [&::-webkit-search-cancel-button]:appearance-none"
          placeholder="Pesquisar distrito (ex. Búzi, Chókwè)..."
          spellcheck="false"
          type="search"
          @input="selectView('list')"
        />
        <button
          v-if="search"
          type="button"
          aria-label="Limpar pesquisa"
          class="absolute right-1 flex h-10 w-10 items-center justify-center text-on-surface-variant transition-colors hover:text-primary"
          @click="clearSearch"
        >
          <span class="material-symbols-outlined text-[18px]" aria-hidden="true">close</span>
        </button>
      </div>
    </div>

    <div class="field-views flex items-center gap-4 overflow-x-auto whitespace-nowrap border-b border-[#D0D9DF] py-2" role="group" aria-label="Vistas de campo">
      <span class="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">Vistas de campo:</span>
      <button
        v-for="view in views"
        :key="view.id"
        type="button"
        :aria-pressed="visibleView === view.id"
        class="border-b-2 pb-1 font-label-sm text-label-sm uppercase tracking-wider transition-colors"
        :class="visibleView === view.id ? 'border-primary font-semibold text-primary' : 'border-transparent text-on-surface-variant hover:text-primary'"
        @click="changeView(view.id)"
      >{{ view.label }}</button>
    </div>

    <div v-if="visibleView === 'list'" class="divide-y divide-[#D0D9DF]" aria-label="Distritos monitorizados">
      <section v-for="province in filteredProvinces" :key="province.name" class="pb-1 pt-4">
        <div class="flex items-center justify-between gap-2 pb-1.5">
          <h2 class="font-label-sm text-label-sm font-semibold uppercase tracking-widest text-primary">{{ province.name }}</h2>
          <span class="text-right font-label-sm text-label-sm tabular-nums text-on-surface-variant">{{ province.basin }}</span>
        </div>
        <ul class="divide-y divide-[#D0D9DF]/60">
          <li v-for="district in province.districts" :key="district.name">
            <component
              :is="district.hasDetails ? 'a' : 'div'"
              :href="district.hasDetails ? links.buzi : undefined"
              class="flex min-h-[52px] items-center justify-between gap-2 py-2.5"
              :class="{ 'group transition-colors hover:bg-surface-container-low focus-visible:outline-primary': district.hasDetails }"
            >
              <span class="flex min-w-0 flex-col">
                <span class="font-headline-sm text-headline-sm text-primary group-hover:underline">{{ district.name }}</span>
                <span class="font-body-sm text-body-sm text-on-surface-variant">{{ district.station }}</span>
              </span>
              <span class="flex shrink-0 items-center gap-2.5 text-right">
                <span class="flex flex-col items-end">
                  <span class="font-label-lg text-label-lg tabular-nums" :class="riskStyles[district.risk].value">
                    {{ district.mm }} <span class="font-label-sm text-label-sm font-normal text-on-surface-variant">mm/24h</span>
                  </span>
                  <span class="font-label-sm text-label-sm text-on-surface-variant">{{ district.note }}</span>
                </span>
                <span
                  class="flex items-center gap-1.5 rounded-br-lg rounded-tl-lg px-2 py-1 font-label-sm text-label-sm uppercase tracking-wider"
                  :class="riskStyles[district.risk].badge"
                >
                  <span v-if="district.risk === 'Alerta'" class="h-1.5 w-1.5 bg-on-primary" aria-hidden="true"></span>
                  {{ district.risk }}
                </span>
              </span>
            </component>
          </li>
        </ul>
      </section>
    </div>

    <section v-else-if="visibleView === 'empty'" class="flex flex-col items-start border-b border-[#D0D9DF] py-8" aria-labelledby="empty-title">
      <div class="mb-2 flex items-center gap-2 text-on-surface-variant">
        <span class="material-symbols-outlined text-[20px]" aria-hidden="true">location_off</span>
        <h2 id="empty-title" class="font-label-md text-label-md font-bold uppercase tracking-wider text-primary">Sem correspondência hidrológica</h2>
      </div>
      <p class="mb-4 max-w-sm font-body-md text-body-md text-on-surface-variant">
        Nenhum distrito encontrado para a pesquisa. Verifica a ortografia ou consulta a lista provincial completa.
      </p>
      <div class="w-full rounded-br-xl rounded-tl-xl bg-surface-container p-3">
        <p class="mb-1 font-label-sm text-label-sm font-semibold uppercase text-on-surface-variant">Sugestões de busca directa:</p>
        <div class="flex flex-wrap gap-2 pt-1">
          <button
            v-for="term in suggestions"
            :key="term"
            type="button"
            class="rounded-br-md rounded-tl-md bg-surface px-2 py-1 font-label-sm text-label-sm uppercase text-primary transition-colors hover:bg-surface-container-high"
            @click="searchFor(term)"
          >{{ term }}</button>
        </div>
      </div>
    </section>

    <section v-else class="flex flex-col items-start border-b border-[#D0D9DF] py-8" aria-labelledby="error-title">
      <div class="mb-1.5 flex items-center gap-2 text-error">
        <span class="material-symbols-outlined text-[20px]" aria-hidden="true">cloud_off</span>
        <h2 id="error-title" class="font-label-md text-label-md font-bold uppercase tracking-wider">Falha no sinal de telemetria</h2>
      </div>
      <span class="mb-2 font-label-sm text-label-sm tabular-nums text-on-surface-variant">ERRO: HTTP 503 • DNGRH API INALCANÇÁVEL</span>
      <p class="mb-5 max-w-sm font-body-md text-body-md text-on-surface-variant">
        Não foi possível sincronizar as cotas das estações pluviométricas. Os dados em cache offline são de há 4 horas.
      </p>
      <button
        type="button"
        :disabled="isRetrying"
        class="flex h-11 items-center justify-center gap-2 rounded-br-xl rounded-tl-xl bg-primary px-5 font-label-md text-label-md uppercase tracking-wider text-on-primary transition-colors active:bg-primary-container disabled:cursor-wait"
        @click="retryConnection"
      >
        <span class="material-symbols-outlined text-[18px]" :class="{ 'animate-spin': isRetrying }" aria-hidden="true">{{ isRetrying ? 'refresh' : 'sync' }}</span>
        <span aria-live="polite">{{ isRetrying ? 'A restabelecer...' : 'Tentar de novo' }}</span>
      </button>
    </section>

    <div id="sobre" class="mt-6 flex scroll-mt-24 flex-col gap-1 pb-8 pt-3 text-on-surface-variant">
      <div class="flex items-center justify-between gap-2 font-label-sm text-label-sm uppercase tracking-wider">
        <span>Actualização de campo: Hoje, 06:00 CAT</span>
        <span class="tabular-nums">1.020 hPa</span>
      </div>
      <p id="limiares" class="scroll-mt-24 font-body-sm text-body-sm text-on-surface-variant/80">
        Limiares: Alerta ≥ 60 mm/24h ou saturação do solo &gt; 80%. Atenção ≥ 30 mm/24h.
      </p>
    </div>
  </main>

  <footer class="fixed inset-x-0 bottom-0 z-50 bg-surface/95 pb-safe backdrop-blur-xl shadow-[0_-1px_8px_rgba(0,0,0,0.03)]">
    <div class="flex items-center justify-between gap-2 px-gutter py-space-xs font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
      <span class="flex items-center gap-space-xs text-on-surface-variant/80">
        <span class="h-1 w-1 shrink-0 bg-secondary" aria-hidden="true"></span>
        Fonte técnica: Open-Meteo • DNGRH
      </span>
      <span class="shrink-0">MOZ • WGS84</span>
    </div>
    <nav class="flex h-14 items-center justify-around px-gutter" aria-label="Navegação inferior">
      <a :href="links.registo" class="flex min-h-[44px] items-center gap-space-xs px-space-sm font-label-md text-label-md uppercase tracking-wider text-on-surface-variant transition-colors hover:text-primary">
        <span class="material-symbols-outlined text-[18px]" aria-hidden="true">water_drop</span><span>Registo</span>
      </a>
      <a :href="links.distritos" aria-current="page" class="flex min-h-[44px] items-center gap-space-xs border-b-2 border-primary px-space-sm font-label-md text-label-md uppercase tracking-wider text-primary">
        <span class="material-symbols-outlined text-[18px]" aria-hidden="true">map</span><span>Bacias</span>
      </a>
      <a :href="links.limiares" class="flex min-h-[44px] items-center gap-space-xs px-space-sm font-label-md text-label-md uppercase tracking-wider text-on-surface-variant transition-colors hover:text-primary">
        <span class="material-symbols-outlined text-[18px]" aria-hidden="true">warning</span><span>Limiares</span>
      </a>
    </nav>
  </footer>
</template>

<style scoped>
.home-content {
  padding-top: calc(5rem + env(safe-area-inset-top, 0px));
  padding-bottom: calc(6rem + env(safe-area-inset-bottom, 0px));
}

.field-views {
  scrollbar-width: none;
}

.attention-stripes {
  background-image: repeating-linear-gradient(
    45deg,
    transparent 0 3px,
    rgb(0 50 75 / 8%) 3px 6px
  );
}
</style>
