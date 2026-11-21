<script setup>
import { computed, onUnmounted, ref } from 'vue'

defineProps({ links: { type: Object, required: true } })

const stations = [
  { id: 'buzi', district: 'Búzi', station: 'Posto Estúrio', basin: 'Bacia do Búzi' },
  { id: 'mocuba', district: 'Mocuba', station: 'Ponte Licungo', basin: 'Bacia do Licungo' },
  { id: 'chokwe', district: 'Chókwè', station: 'Eclusas Macarretane', basin: 'Rio Limpopo' },
  { id: 'marromeu', district: 'Marromeu', station: 'Baixo Zambeze', basin: 'Rio Zambeze' },
  { id: 'xai-xai', district: 'Xai-Xai', station: 'Foz do Limpopo', basin: 'Rio Limpopo' },
  { id: 'caia', district: 'Caia', station: 'Ponte Guebuza', basin: 'Rio Zambeze' },
  { id: 'mutarara', district: 'Mutarara', station: 'Posto Dona Ana', basin: 'Rio Zambeze' },
]

const stationsById = Object.fromEntries(stations.map(station => [station.id, station]))
const presets = ['12.5', '45.0', '70.0', '95.0']
const filters = [
  { value: 'todos', label: 'Todos' },
  { value: 'alerta', label: 'Acima do limite' },
  { value: '48h', label: 'Últimas 48h' },
]

const badgeStyles = {
  Alerta: { badge: 'bg-inverse-surface text-inverse-on-surface', marker: 'bg-error' },
  Atenção: { badge: 'bg-surface-container-highest font-semibold text-on-surface', marker: 'bg-secondary' },
  Normal: { badge: 'bg-surface text-on-surface-variant', marker: '' },
}

const readings = ref([
  { id: 1, stationId: 'buzi', date: '26 Fev', time: '06:00', mm: 92, hours: 12 },
  { id: 2, stationId: 'mocuba', date: '26 Fev', time: '06:00', mm: 88, hours: 12 },
  { id: 3, stationId: 'chokwe', date: '25 Fev', time: '18:00', mm: 74, hours: 24, stationName: 'Macarretane' },
  { id: 4, stationId: 'marromeu', date: '25 Fev', time: '06:00', mm: 48, hours: 36 },
  { id: 5, stationId: 'xai-xai', date: '24 Fev', time: '06:00', mm: 35, hours: 48 },
  { id: 6, stationId: 'caia', date: '23 Fev', time: '06:00', mm: 18, hours: 72 },
])

const selectedStationId = ref(stations[0].id)
const amount = ref('45.0')
const activeFilter = ref('todos')
const saved = ref(false)
let nextReadingId = readings.value.length + 1
let feedbackTimer

function readingStatus(mm) {
  if (mm >= 70) return 'Alerta'
  if (mm >= 30) return 'Atenção'
  return 'Normal'
}

const visibleReadings = computed(() => {
  const entries = readings.value.map(reading => ({
    ...reading,
    station: stationsById[reading.stationId],
    status: readingStatus(reading.mm),
  }))

  if (activeFilter.value === 'alerta') return entries.filter(reading => reading.status === 'Alerta')
  if (activeFilter.value === '48h') return entries.filter(reading => reading.hours <= 48)
  return entries
})

function saveReading() {
  readings.value.unshift({
    id: nextReadingId++,
    stationId: selectedStationId.value,
    date: 'Hoje',
    time: 'Agora',
    mm: Number(amount.value),
    hours: 0,
    added: true,
  })

  saved.value = true
  clearTimeout(feedbackTimer)
  feedbackTimer = setTimeout(() => { saved.value = false }, 1800)
}

onUnmounted(() => clearTimeout(feedbackTimer))
</script>

<template>
  <div id="registo" class="w-full bg-surface font-body-md text-body-md text-on-surface">
    <header class="registo-header fixed inset-x-0 top-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div class="flex h-20 items-center justify-between gap-2 px-gutter">
        <a :href="links.distritos" class="flex flex-col justify-center">
          <span class="flex items-center gap-space-xs">
            <span class="h-1.5 w-1.5 shrink-0 bg-primary-container" aria-hidden="true"></span>
            <span class="font-headline-sm text-headline-sm uppercase tracking-widest text-primary">Chuva Forte</span>
          </span>
          <span class="mt-0.5 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Monitorização hidrológica distrital</span>
        </a>
        <div class="flex items-center gap-gutter">
          <a :href="links.sobre" class="flex min-h-[44px] items-center font-label-md text-label-md uppercase tracking-wider text-on-surface-variant transition-colors hover:text-primary">Sobre</a>
          <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary" aria-hidden="true">
            <span class="material-symbols-outlined text-[18px] text-on-primary">person</span>
          </span>
        </div>
      </div>
    </header>

    <main class="registo-main min-h-screen w-full px-gutter">
      <header class="flex flex-col gap-space-xs pb-space-md">
        <div class="flex items-center justify-between gap-2">
          <span class="flex items-center gap-1.5 font-label-sm text-label-sm uppercase tracking-widest text-secondary">
            <span class="h-1.5 w-1.5 shrink-0 bg-primary" aria-hidden="true"></span>
            Caderno de Observação • 2024/2025
          </span>
          <span class="shrink-0 font-mono text-label-sm uppercase text-on-surface-variant/70">Folha n.º 42</span>
        </div>
        <h1 class="font-headline-lg-mobile text-headline-lg-mobile tracking-tight text-primary">Registo Pluviométrico</h1>
        <p class="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
          Entradas de precipitação acumulada recolhidas por postos telemétricos e observadores distritais em Moçambique.
        </p>
      </header>

      <div class="relative mb-space-md h-24 w-full overflow-hidden rounded-[12px_3px_12px_3px] bg-surface-container">
        <div class="registo-map absolute inset-0 bg-cover bg-center opacity-30 mix-blend-multiply" aria-hidden="true"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-surface-container via-transparent to-surface-container" aria-hidden="true"></div>
        <div class="relative flex h-full flex-col justify-between px-space-md py-space-sm">
          <div class="flex items-center justify-between gap-2">
            <span class="flex items-center gap-1 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
              <span class="material-symbols-outlined text-[14px] text-primary" aria-hidden="true">pin_drop</span>
              Postos Ativos: 6 Bacias
            </span>
            <span class="text-right font-label-sm text-label-sm font-semibold uppercase tracking-wider text-primary">Transmissão Satélite</span>
          </div>
          <div class="flex items-end justify-between gap-2">
            <div>
              <span class="block font-label-sm text-label-sm text-on-surface-variant/80">Último registo telemétrico</span>
              <span class="font-headline-sm text-headline-sm text-primary">Hoje, 06:00 CAT</span>
            </div>
            <span class="rounded-[6px_2px_6px_2px] bg-surface/90 px-2 py-0.5 font-label-sm text-label-sm text-primary">DNGRH • ONLINE</span>
          </div>
        </div>
      </div>

      <section class="rounded-[14px_4px_14px_4px] bg-surface-container-low p-space-md" aria-labelledby="nova-leitura">
        <div class="flex items-center justify-between gap-2 pb-space-sm">
          <div class="flex items-center gap-1.5 text-primary">
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">edit_note</span>
            <h2 id="nova-leitura" class="font-label-md text-label-md font-semibold uppercase tracking-wider">Nova Leitura de Campo</h2>
          </div>
          <span class="shrink-0 rounded-[4px_1px_4px_1px] bg-surface-container px-2 py-0.5 font-label-sm text-label-sm text-on-surface-variant">CAT (UTC+2)</span>
        </div>

        <form class="flex flex-col gap-space-md pt-space-xs" @submit.prevent="saveReading">
          <div class="flex flex-col gap-1">
            <label for="registo-posto" class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Posto Hidrométrico &amp; Distrito</label>
            <div class="relative">
              <select
                id="registo-posto"
                v-model="selectedStationId"
                class="w-full appearance-none rounded-[8px_2px_8px_2px] bg-surface-container-lowest py-2.5 pl-3 pr-10 font-body-md text-body-md text-on-surface focus:bg-surface-bright focus-visible:outline-primary"
              >
                <option v-for="station in stations" :key="station.id" :value="station.id">
                  {{ station.district }} — {{ station.station }} ({{ station.basin }})
                </option>
              </select>
              <span class="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant" aria-hidden="true">unfold_more</span>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <div class="flex items-center justify-between gap-2">
              <label for="registo-precipitacao" class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Lâmina de Água Acumulada</label>
              <span class="font-label-sm text-label-sm text-secondary">Escala Padrão 24h</span>
            </div>
            <div class="flex items-center rounded-[8px_2px_8px_2px] bg-surface-container-lowest px-3 py-1.5 focus-within:bg-surface-bright">
              <input
                id="registo-precipitacao"
                v-model="amount"
                type="number"
                min="0"
                max="350"
                step="0.5"
                required
                placeholder="0.0"
                aria-describedby="registo-unidade"
                class="min-w-0 flex-1 bg-transparent font-mono text-headline-lg tracking-tight text-primary focus-visible:outline-primary"
              />
              <span id="registo-unidade" class="ml-2 shrink-0 font-mono text-label-md uppercase text-on-surface-variant/80">mm / 24h</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-space-sm pt-0.5">
            <div class="flex min-w-0 flex-col gap-1">
              <span class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Horário Oficial</span>
              <span class="flex items-center gap-1.5 rounded-[6px_2px_6px_2px] bg-surface-container px-2.5 py-2 font-mono text-label-md text-on-surface">
                <span class="material-symbols-outlined shrink-0 text-[16px] text-secondary" aria-hidden="true">schedule</span>
                Hoje, 06:00
              </span>
            </div>
            <div class="flex min-w-0 flex-col gap-1">
              <span class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Método</span>
              <span class="flex items-center gap-1.5 rounded-[6px_2px_6px_2px] bg-surface-container px-2.5 py-2 font-label-md text-label-md text-on-surface">
                <span class="material-symbols-outlined shrink-0 text-[16px] text-secondary" aria-hidden="true">sensors</span>
                <span class="truncate">Pluviómetro Manual</span>
              </span>
            </div>
          </div>

          <div class="flex items-center gap-1.5 pt-1">
            <span class="shrink-0 font-label-sm text-label-sm text-on-surface-variant/80">Atalhos:</span>
            <div class="flex flex-wrap gap-1 py-0.5">
              <button
                v-for="preset in presets"
                :key="preset"
                type="button"
                class="rounded-[4px_1px_4px_1px] bg-surface px-2 py-1 font-mono text-label-sm text-on-surface hover:bg-surface-container-high"
                @click="amount = preset"
              >{{ preset }} mm</button>
            </div>
          </div>

          <button
            type="submit"
            class="mt-1 flex w-full items-center justify-center gap-2 rounded-[14px_4px_14px_4px] px-4 py-3.5 font-label-lg text-label-lg uppercase tracking-wider text-on-primary transition-colors active:scale-[0.99]"
            :class="saved ? 'bg-secondary' : 'bg-primary hover:bg-primary-container'"
          >
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">{{ saved ? 'check' : 'drive_file_rename_outline' }}</span>
            <span>{{ saved ? 'Registo Gravado com Sucesso' : 'Gravar registo no caderno' }}</span>
          </button>
          <span class="sr-only" role="status">{{ saved ? 'Registo gravado no caderno.' : '' }}</span>
        </form>
      </section>

      <section class="mt-space-lg" aria-labelledby="observacoes-recentes">
        <div class="flex flex-col gap-space-sm pb-space-sm">
          <div class="flex items-center justify-between gap-2">
            <div>
              <span class="block font-label-sm text-label-sm uppercase tracking-widest text-secondary">Arquivo Contínuo</span>
              <h2 id="observacoes-recentes" class="font-headline-md text-headline-md tracking-tight text-primary">Observações Recentes</h2>
            </div>
            <span class="shrink-0 rounded-[4px_1px_4px_1px] bg-surface-container px-2 py-1 font-mono text-label-sm text-on-surface-variant">{{ readings.length }} Entradas</span>
          </div>

          <div class="flex flex-wrap gap-1.5 pt-1" role="group" aria-label="Filtrar observações">
            <button
              v-for="filter in filters"
              :key="filter.value"
              type="button"
              :aria-pressed="filter.value === activeFilter"
              class="rounded-[8px_2px_8px_2px] px-3 py-1.5 font-label-sm text-label-sm uppercase tracking-wider transition-colors"
              :class="filter.value === activeFilter ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:text-primary'"
              @click="activeFilter = filter.value"
            >{{ filter.label }}</button>
          </div>
        </div>

        <div class="my-space-xs overflow-hidden rounded-[12px_3px_12px_3px] bg-surface-container-lowest">
          <table class="w-full table-fixed" aria-labelledby="observacoes-recentes">
            <colgroup>
              <col class="w-1/4" />
              <col class="w-5/12" />
              <col class="w-1/3" />
            </colgroup>
            <thead class="bg-surface-container font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
              <tr>
                <th scope="col" class="py-2 pl-3 pr-1 text-left font-medium">Data / Hora</th>
                <th scope="col" class="py-2 text-left font-medium">Posto / Bacia</th>
                <th scope="col" class="py-2 pl-1 pr-3 text-right font-medium">Lâmina / Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-surface-container">
              <tr
                v-for="reading in visibleReadings"
                :key="reading.id"
                class="transition-colors duration-100 hover:bg-surface-container-low"
                :class="{ 'bg-surface-container-low': reading.added }"
              >
                <td class="py-3 pl-3 pr-1 align-middle font-mono">
                  <span class="block text-label-md font-semibold text-primary">{{ reading.date }}</span>
                  <span class="block text-body-sm text-on-surface-variant/80">{{ reading.time }}</span>
                </td>
                <td class="py-3 pr-1 align-middle">
                  <span class="block truncate font-label-md text-label-md font-semibold text-on-surface">{{ reading.station.district }}</span>
                  <span class="block truncate font-body-sm text-body-sm text-on-surface-variant">{{ reading.stationName ?? reading.station.station }}</span>
                </td>
                <td class="py-3 pr-3 text-right align-middle">
                  <span class="block font-mono text-label-md font-semibold text-primary">{{ reading.mm.toFixed(1) }} mm</span>
                  <span
                    class="mt-0.5 inline-flex items-center gap-1 rounded-[6px_2px_6px_2px] px-1.5 font-label-sm text-label-sm uppercase"
                    :class="badgeStyles[reading.status].badge"
                  >
                    <span v-if="badgeStyles[reading.status].marker" class="h-1.5 w-1.5" :class="badgeStyles[reading.status].marker" aria-hidden="true"></span>
                    {{ reading.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="registo-info" class="mt-space-md flex scroll-mt-24 items-start gap-space-sm rounded-[10px_2px_10px_2px] bg-surface-container p-space-sm">
        <span class="material-symbols-outlined mt-0.5 shrink-0 text-[20px] text-secondary" aria-hidden="true">info</span>
        <div>
          <h2 class="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-primary">Regra de Observação Matinal</h2>
          <p class="mt-0.5 font-body-sm text-body-sm leading-snug text-on-surface-variant">
            As cotas de 06:00 CAT consolidam o acumulado pluviométrico de 24 horas. Valores a partir de 70 mm acionam prontidão amarela na bacia hidrográfica correspondente.
          </p>
        </div>
      </section>

      <aside class="flex items-center justify-between gap-2 pb-space-xs pt-space-md font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
        <span class="flex items-center gap-1.5">
          <span class="h-1.5 w-1.5 shrink-0 animate-pulse bg-primary" aria-hidden="true"></span>
          Sincronização com a rede DNGRH ativa
        </span>
        <span class="shrink-0 font-mono text-on-surface-variant/80">WGS84 • MOZ</span>
      </aside>
    </main>

    <footer class="registo-footer fixed inset-x-0 bottom-0 z-50 bg-surface/95 backdrop-blur-xl shadow-[0_-1px_8px_rgba(0,0,0,0.03)]">
      <div class="flex items-center justify-between gap-2 px-gutter py-space-xs font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
        <span class="flex items-center gap-space-xs text-on-surface-variant/80">
          <span class="h-1 w-1 shrink-0 bg-secondary" aria-hidden="true"></span>
          Fonte técnica: Open-Meteo • DNGRH
        </span>
        <span class="shrink-0">MOZ • WGS84</span>
      </div>
      <nav class="flex h-14 items-center justify-around px-gutter" aria-label="Navegação inferior">
        <a :href="links.distritos" class="flex min-h-[44px] items-center gap-space-xs px-space-sm font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
          <span class="material-symbols-outlined text-[18px]" aria-hidden="true">map</span>
          <span>Bacias</span>
        </a>
        <a :href="links.registo" aria-current="page" class="flex min-h-[44px] items-center gap-space-xs border-b-2 border-primary px-space-sm font-semibold uppercase tracking-wider text-primary">
          <span class="material-symbols-outlined text-[18px]" aria-hidden="true">edit_note</span>
          <span>Registo</span>
        </a>
        <a :href="links.limiares" class="flex min-h-[44px] items-center gap-space-xs px-space-sm font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
          <span class="material-symbols-outlined text-[18px]" aria-hidden="true">tune</span>
          <span>Limiares</span>
        </a>
      </nav>
    </footer>
  </div>
</template>

<style scoped>
.registo-header {
  padding-top: env(safe-area-inset-top, 0px);
}

.registo-main {
  padding-top: calc(5rem + env(safe-area-inset-top, 0px));
  padding-bottom: calc(6rem + env(safe-area-inset-bottom, 0px));
}

.registo-footer {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.registo-map {
  background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAyqADiezaAKd8KZ_HERJZ9gu1aHWxm6z6y0e75CVZgdJmIgmeAUR0R-D5urk5bBmiKe6BtMIG3BlMzN_ng6OpSHlgPnK1MxmB-pjuNoY719CMTlKoQLIPoqirxaDYKCf2tKTYUQcsBalwsWkzDjrE__ASWiyQyYbiAdJF6VoI3IsJO01W30-dRYyLGFvp7k-NF99koUGLuinAduxkhlgvQqKGQ3tL4H2E2O9QP6-sW');
}
</style>
