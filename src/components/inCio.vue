<template>
  <!-- Header -->
  <header class="fixed top-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)] pt-safe">
    <div class="h-20 px-gutter flex items-center justify-between">
      <div class="flex flex-col justify-center select-none">
        <div class="flex items-center gap-space-xs">
          <span class="w-1.5 h-1.5 bg-primary-container rounded-none"></span>
          <span class="font-headline-sm text-headline-sm text-primary uppercase tracking-widest">chuva forte</span>
        </div>
        <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-0.5">Monitorização hidrológica distrital</span>
      </div>
      <div class="flex items-center gap-gutter">
        <nav class="flex items-center gap-gutter hidden sm:flex">
          <a class="uppercase tracking-wider transition-colors min-h-[44px] flex items-center text-primary font-semibold" href="#">Distritos</a>
          <a class="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors min-h-[44px] flex items-center" href="#">Sobre</a>
        </nav>
        <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-on-primary text-[18px]">person</span>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="flex flex-col relative w-full px-gutter pt-20 pb-24 bg-surface min-h-screen">
    <div class="flex flex-col w-full">
      
      <!-- Header Context -->
      <div class="flex items-baseline justify-between pt-2 pb-1 border-b border-[#D0D9DF]">
        <div class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 bg-primary rounded-none"></span>
          <span class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant font-medium">CADERNO HIDROLÓGICO • SÉRIE 2025</span>
        </div>
        <span class="font-label-sm text-label-sm tabular-nums text-on-surface-variant">REF: 19°49'S 34°52'E</span>
      </div>

      <div class="pt-4 pb-3">
        <h1 class="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">Previsão distrital</h1>
        <p class="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-snug">
          Precipitação acumulada máxima esperada para os próximos 7 dias com base nas bacias hidrográficas nacionais.
        </p>
      </div>

      <!-- Telemetry Barometer -->
      <div class="py-2.5 px-3 bg-surface-container flex items-center justify-between rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 bg-primary rounded-none"></span>
          <span class="font-label-md text-label-md uppercase tracking-wider text-primary font-semibold">9 distritos sob monitorização prioritária</span>
        </div>
        <span class="font-label-sm text-label-sm tabular-nums text-on-surface-variant bg-surface px-1.5 py-0.5 rounded-tl-md rounded-br-md">DNGRH 06:00</span>
      </div>

      <!-- Search Input -->
      <div class="mt-4 mb-2">
        <label class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant block mb-1.5 font-medium" for="district-search">Localizar posto distrital</label>
        <div class="relative flex items-center">
          <div class="absolute left-3 flex items-center pointer-events-none text-on-surface-variant">
            <span class="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input 
            v-model="searchTerm"
            @input="handleSearchInput"
            autocomplete="off" 
            class="w-full h-12 pl-10 pr-9 bg-surface-container text-on-surface font-body-md text-body-md placeholder:text-on-surface-variant/70 focus:bg-surface-container-highest focus:outline-none focus:ring-0 rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none transition-colors" 
            id="district-search" 
            placeholder="Pesquisar distrito (ex. Búzi, Chókwè)..." 
            spellcheck="false" 
            type="search"
          />
          <button v-if="searchTerm" @click="clearSearch" aria-label="Limpar pesquisa" class="absolute right-2.5 text-on-surface-variant hover:text-primary transition-colors p-1" type="button">
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>

      <!-- State Toggle Tabs -->
      <div class="flex items-center gap-4 py-2 border-b border-[#D0D9DF] select-none overflow-x-auto text-nowrap">
        <span class="font-label-sm text-label-sm uppercase text-on-surface-variant font-semibold tracking-wider">Vistas de campo:</span>
        <button 
          @click="setView('list')"
          :class="viewState === 'list' ? 'text-primary border-b-2 border-primary font-semibold' : 'text-on-surface-variant hover:text-primary'"
          class="font-label-sm text-label-sm uppercase tracking-wider pb-1 transition-all" 
          type="button"
        >
          Ledger activo (9)
        </button>
        <button 
          @click="setView('empty')"
          :class="viewState === 'empty' ? 'text-primary border-b-2 border-primary font-semibold' : 'text-on-surface-variant hover:text-primary'"
          class="font-label-sm text-label-sm uppercase tracking-wider pb-1 transition-all" 
          type="button"
        >
          Sem resultados
        </button>
        <button 
          @click="setView('error')"
          :class="viewState === 'error' ? 'text-primary border-b-2 border-primary font-semibold' : 'text-on-surface-variant hover:text-primary'"
          class="font-label-sm text-label-sm uppercase tracking-wider pb-1 transition-all" 
          type="button"
        >
          Falha de telemetria
        </button>
      </div>

      <!-- MAIN VIEW: District List Ledger -->
      <div v-if="viewState === 'list'" class="flex flex-col w-full divide-y divide-[#D0D9DF]">
        <div v-for="(province, pIndex) in filteredProvinces" :key="pIndex" class="pt-4 pb-1">
          <div class="flex items-center justify-between pb-1.5">
            <span class="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">{{ province.name }}</span>
            <span class="font-label-sm text-label-sm tabular-nums text-on-surface-variant">{{ province.basin }}</span>
          </div>

          <div 
            v-for="(district, dIndex) in province.districts" 
            :key="dIndex"
            class="district-row min-h-[52px] py-2.5 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group"
            :class="{'border-t border-[#D0D9DF]/60': dIndex > 0}"
          >
            <div class="flex flex-col pr-2">
              <span class="font-headline-sm text-headline-sm text-primary group-hover:underline">{{ district.name }}</span>
              <span class="font-body-sm text-body-sm text-on-surface-variant">{{ district.details }}</span>
            </div>
            <div class="flex items-center gap-2.5 shrink-0 text-right">
              <div class="flex flex-col items-end">
                <span class="font-label-lg text-label-lg tabular-nums text-primary font-bold" :class="{'text-on-surface-variant font-medium': district.level === 'NORMAL'}">
                  {{ district.mm }} <span class="font-label-sm text-label-sm font-normal text-on-surface-variant">mm/24h</span>
                </span>
                <span class="font-label-sm text-label-sm text-on-surface-variant">{{ district.status }}</span>
              </div>
              
              <!-- Badges Dinâmicos -->
              <div v-if="district.level === 'ALERTA'" class="bg-primary text-on-primary px-2 py-1 flex items-center gap-1.5 rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none">
                <span class="w-1.5 h-1.5 bg-on-primary rounded-none"></span>
                <span class="font-label-sm text-label-sm uppercase tracking-wider font-bold">ALERTA</span>
              </div>
              <div v-else-if="district.level === 'ATENÇÃO'" class="bg-surface-container-highest text-primary px-2 py-1 flex items-center gap-1 rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none relative overflow-hidden" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0, 50, 75, 0.08) 3px, rgba(0, 50, 75, 0.08) 6px);">
                <span class="font-label-sm text-label-sm uppercase tracking-wider font-bold">ATENÇÃO</span>
              </div>
              <div v-else class="bg-surface-container-low text-on-surface-variant px-2 py-1 flex items-center gap-1 rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none">
                <span class="font-label-sm text-label-sm uppercase tracking-wider font-medium">NORMAL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- STATE: Empty Search Result -->
      <div v-if="viewState === 'empty'" class="flex flex-col items-start py-8 border-b border-[#D0D9DF]">
        <div class="flex items-center gap-2 mb-2 text-on-surface-variant">
          <span class="material-symbols-outlined text-[20px]">location_off</span>
          <span class="font-label-md text-label-md uppercase tracking-wider text-primary font-bold">Sem correspondência hidrológica</span>
        </div>
        <p class="font-body-md text-body-md text-on-surface-variant max-w-sm mb-4">
          Nenhum distrito encontrado para a pesquisa. Verifica a ortografia ou consulta a lista provincial completa.
        </p>
        <div class="p-3 bg-surface-container rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none w-full">
          <div class="font-label-sm text-label-sm uppercase text-on-surface-variant mb-1 font-semibold">Sugestões de busca directa:</div>
          <div class="flex flex-wrap gap-2 pt-1">
            <button v-for="tag in ['Búzi', 'Chókwè', 'Mocuba', 'Boane']" :key="tag" @click="selectQuickTag(tag)" class="font-label-sm text-label-sm uppercase bg-surface text-primary px-2 py-1 rounded-tl-md rounded-br-md hover:bg-surface-container-high transition-colors" type="button">{{ tag }}</button>
          </div>
        </div>
      </div>

      <!-- STATE: Network Telemetry Error -->
      <div v-if="viewState === 'error'" class="flex flex-col items-start py-8 border-b border-[#D0D9DF]">
        <div class="flex items-center gap-2 mb-1.5 text-red-600">
          <span class="material-symbols-outlined text-[20px]">cloud_off</span>
          <span class="font-label-md text-label-md uppercase tracking-wider font-bold">Falha no sinal de telemetria</span>
        </div>
        <span class="font-label-sm text-label-sm tabular-nums text-on-surface-variant mb-2">ERRO: HTTP 503 • DNGRH API INALCANÇÁVEL</span>
        <p class="font-body-md text-body-md text-on-surface-variant max-w-sm mb-5">
          Não foi possível sincronizar as cotas das estações pluviométricas. Os dados em cache offline são de há 4 horas.
        </p>
        <button @click="retryConnection" :disabled="isRetrying" class="h-11 px-5 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider flex items-center justify-center gap-2 rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none active:bg-primary-container transition-colors" type="button">
          <span class="material-symbols-outlined text-[18px]" :class="{'animate-spin': isRetrying}">{{ isRetrying ? 'refresh' : 'sync' }}</span>
          <span>{{ isRetrying ? 'A restabelecer...' : 'Tentar de novo' }}</span>
        </button>
      </div>

      <!-- Footer Note -->
      <div class="mt-6 pt-3 pb-8 flex flex-col gap-1 text-on-surface-variant">
        <div class="flex items-center justify-between font-label-sm text-label-sm uppercase tracking-wider">
          <span>Actualização de campo: Hoje, 06:00 CAT</span>
          <span class="tabular-nums">1.020 hPa</span>
        </div>
        <p class="font-body-sm text-body-sm text-on-surface-variant/80">
          Limiares: Alerta ≥ 60 mm/24h ou saturação do solo > 80%. Atenção ≥ 30 mm/24h.
        </p>
      </div>
    </div>
  </main>

  <!-- Footer Fixo -->
  <footer class="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface/95 backdrop-blur-xl shadow-[0_-1px_8px_rgba(0,0,0,0.03)]">
    <div class="px-gutter pt-space-xs pb-space-xs flex items-center justify-between text-on-surface-variant select-none">
      <div class="flex items-center gap-space-xs">
        <span class="w-1 h-1 bg-secondary"></span>
        <span class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant/80">FONTE TÉCNICA: OPEN-METEO • DNGRH</span>
      </div>
      <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">MOZ • WGS84</span>
    </div>
    <nav class="h-14 px-gutter flex items-center justify-around">
      <a class="flex items-center justify-center gap-space-xs min-h-[44px] px-space-sm font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors" href="#">
        <span class="material-symbols-outlined text-[18px]">water_drop</span><span>Registo</span>
      </a>
      <a class="flex items-center justify-center gap-space-xs min-h-[44px] px-space-sm font-label-md uppercase tracking-wider transition-colors text-primary border-b-2 border-primary" href="#">
        <span class="material-symbols-outlined text-[18px]">map</span><span>Bacias</span>
      </a>
      <a class="flex items-center justify-center gap-space-xs min-h-[44px] px-space-sm font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors" href="#">
        <span class="material-symbols-outlined text-[18px]">warning</span><span>Limiares</span>
      </a>
    </nav>
  </footer>
</template>

<script setup>
import { ref, computed } from 'vue'

// --- ESTADO DA PÁGINA ---
const searchTerm = ref('')
const viewState = ref('list') // 'list', 'empty', 'error'
const isRetrying = ref(false)

// --- DADOS DOS DISTRITOS ---
// Transformamos o HTML estático em dados para o Vue conseguir filtrar
const provincesData = ref([
  {
    name: 'Província de Sofala',
    basin: 'Bacia do Púngoè / Zambeze',
    districts: [
      { name: 'Búzi', details: 'Posto Hidrométrico Estúrio • Bacia do Búzi', mm: 92, status: 'Pico em 48h', level: 'ALERTA', tags: 'buzi buzi' },
      { name: 'Marromeu', details: 'Baixo Zambeze • Margem Sul', mm: 48, status: 'Subida contínua', level: 'ATENÇÃO', tags: 'marromeu' },
      { name: 'Caia', details: 'Estação Ponte Armando Guebuza', mm: 18, status: 'Nível de base', level: 'NORMAL', tags: 'caia' }
    ]
  },
  {
    name: 'Província de Gaza',
    basin: 'Bacia do Limpopo',
    districts: [
      { name: 'Chókwè', details: 'Regadio do Limpopo • Eclusas de Macarretane', mm: 74, status: 'Descarga a montante', level: 'ALERTA', tags: 'chokwe chokwe chokwè' },
      { name: 'Xai-Xai', details: 'Foz do Rio Limpopo • Cota de maré', mm: 35, status: 'Preia-mar crítica', level: 'ATENÇÃO', tags: 'xai-xai xai xai' }
    ]
  },
  {
    name: 'Província da Zambézia',
    basin: 'Bacia do Licungo / Chinde',
    districts: [
      { name: 'Mocuba', details: 'Ponte Licungo • Monitorização de crista', mm: 88, status: 'Subida rápida', level: 'ALERTA', tags: 'mocuba' },
      { name: 'Chinde', details: 'Delta do Zambeze • Estuário costeiro', mm: 52, status: 'Vento marítimo', level: 'ATENÇÃO', tags: 'chinde' }
    ]
  },
  {
    name: 'Província de Nampula',
    basin: 'Faixa Litoral Norte',
    districts: [
      { name: 'Angoche', details: 'Canal de Moçambique • Estação de Superfície', mm: 14, status: 'Pluviometria estável', level: 'NORMAL', tags: 'angoche' }
    ]
  },
  {
    name: 'Província de Maputo',
    basin: 'Bacia do Rio Umbeluzi',
    districts: [
      { name: 'Boane', details: 'Albufeira dos Pequenos Libombos', mm: 61, status: 'Enchimento a 86%', level: 'ALERTA', tags: 'boane' }
    ]
  }
])

// --- LÓGICA DE BUSCA (COMPUTED) ---
// Função para remover acentos e deixar tudo minúsculo
const normalizeText = (text) => {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

const filteredProvinces = computed(() => {
  const query = normalizeText(searchTerm.value.trim())
  
  // Se não houver busca, retorna tudo
  if (!query) return provincesData.value

  // Filtra os distritos
  const result = provincesData.value.map(prov => {
    const filteredDistricts = prov.districts.filter(dist => {
      const searchString = `${normalizeText(dist.name)} ${normalizeText(dist.tags)}`
      return searchString.includes(query)
    })
    return { ...prov, districts: filteredDistricts }
  }).filter(prov => prov.districts.length > 0) // Remove províncias que ficaram sem distritos

  return result
})

// --- AÇÕES ---
const handleSearchInput = () => {
  if (viewState.value === 'error') return // Não faz busca se estiver no erro
  
  if (searchTerm.value && filteredProvinces.value.length === 0) {
    viewState.value = 'empty'
  } else {
    viewState.value = 'list'
  }
}

const clearSearch = () => {
  searchTerm.value = ''
  viewState.value = 'list'
}

const selectQuickTag = (tag) => {
  searchTerm.value = tag
  handleSearchInput()
}

const setView = (view) => {
  viewState.value = view
  if (view === 'list') {
    searchTerm.value = ''
  }
}

const retryConnection = () => {
  isRetrying.value = true
  setTimeout(() => {
    isRetrying.value = false
    setView('list')
  }, 900)
}
</script>