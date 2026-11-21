<script setup>
import { computed, useTemplateRef } from 'vue'

const props = defineProps({
  links: { type: Object, required: true },
  distritos: { type: Array, required: true },
  total: { type: Number, required: true },
  provincias: { type: Array, required: true },
  aCarregar: Boolean,
  erro: String,
  hrefDistrito: { type: Function, required: true },
})
const emit = defineEmits(['recarregar'])
const search = defineModel('search', { type: String, default: '' })
const provincia = defineModel('provincia', { type: String, default: '' })
const searchInput = useTemplateRef('searchInput')

const grupos = computed(() => {
  const mapa = new Map()
  for (const distrito of props.distritos) {
    if (!mapa.has(distrito.provincia)) mapa.set(distrito.provincia, [])
    mapa.get(distrito.provincia).push(distrito)
  }
  return [...mapa]
})

function clearSearch() {
  search.value = ''
  searchInput.value?.focus()
}
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
        Escolhe um distrito para consultar a previsão de precipitação dos próximos 7 dias.
      </p>
    </div>

    <div class="flex items-center justify-between gap-2 rounded-br-xl rounded-tl-xl bg-surface-container px-3 py-2.5">
      <div class="flex items-center gap-2">
        <span class="h-2 w-2 shrink-0 bg-primary" aria-hidden="true"></span>
        <span class="font-label-md text-label-md font-semibold uppercase tracking-wider text-primary">{{ total }} distritos no catálogo</span>
      </div>
      <span class="rounded-br-md rounded-tl-md bg-surface px-1.5 py-0.5 font-label-sm text-label-sm tabular-nums text-on-surface-variant">Open-Meteo</span>
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

    <div class="field-views flex items-center gap-4 border-b border-[#D0D9DF] py-2">
      <label for="province-filter" class="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">Província</label>
      <select id="province-filter" v-model="provincia" class="min-h-10 rounded-br-xl rounded-tl-xl bg-surface-container px-3 font-body-md text-body-md text-on-surface">
        <option value="">Todas as províncias</option>
        <option v-for="nome in provincias" :key="nome">{{ nome }}</option>
      </select>
    </div>

    <p v-if="aCarregar" class="py-8 text-on-surface-variant" role="status">A carregar distritos…</p>

    <section v-else-if="erro" class="flex flex-col items-start border-b border-[#D0D9DF] py-8" aria-labelledby="error-title">
      <div class="mb-1.5 flex items-center gap-2 text-error">
        <span class="material-symbols-outlined text-[20px]" aria-hidden="true">cloud_off</span>
        <h2 id="error-title" class="font-label-md text-label-md font-bold uppercase tracking-wider">Falha ao carregar distritos</h2>
      </div>
      <p class="mb-5 max-w-sm font-body-md text-body-md text-on-surface-variant">{{ erro }}</p>
      <button type="button" class="flex h-11 items-center justify-center gap-2 rounded-br-xl rounded-tl-xl bg-primary px-5 font-label-md text-label-md uppercase tracking-wider text-on-primary" @click="emit('recarregar')">
        <span class="material-symbols-outlined text-[18px]" aria-hidden="true">sync</span>
        Tentar de novo
      </button>
    </section>

    <div v-else-if="grupos.length" class="divide-y divide-[#D0D9DF]" aria-label="Distritos monitorizados">
      <section v-for="[prov, lista] in grupos" :key="prov" class="pb-1 pt-4">
        <div class="flex items-center justify-between gap-2 pb-1.5">
          <h2 class="font-label-sm text-label-sm font-semibold uppercase tracking-widest text-primary">{{ prov }}</h2>
        </div>
        <ul class="divide-y divide-[#D0D9DF]/60">
          <li v-for="distrito in lista" :key="distrito.id">
            <a :href="hrefDistrito(distrito.id)" class="group flex min-h-[52px] items-center justify-between gap-2 py-2.5 transition-colors hover:bg-surface-container-low focus-visible:outline-primary">
              <span class="font-headline-sm text-headline-sm text-primary group-hover:underline">{{ distrito.nome }}</span>
              <span class="rounded-br-lg rounded-tl-lg bg-surface-container-low px-2 py-1 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Ver previsão</span>
            </a>
          </li>
        </ul>
      </section>
    </div>

    <section v-else class="flex flex-col items-start border-b border-[#D0D9DF] py-8" aria-labelledby="empty-title">
      <div class="mb-2 flex items-center gap-2 text-on-surface-variant">
        <span class="material-symbols-outlined text-[20px]" aria-hidden="true">location_off</span>
        <h2 id="empty-title" class="font-label-md text-label-md font-bold uppercase tracking-wider text-primary">Sem correspondência hidrológica</h2>
      </div>
      <p class="mb-4 max-w-sm font-body-md text-body-md text-on-surface-variant">
        Nenhum distrito corresponde à pesquisa e à província seleccionada.
      </p>
      <button v-if="search || provincia" type="button" class="rounded-br-md rounded-tl-md bg-surface-container px-2 py-1 font-label-sm text-label-sm uppercase text-primary" @click="clearSearch(); provincia = ''">
        Limpar filtros
      </button>
    </section>
  </main>

  <footer class="fixed inset-x-0 bottom-0 z-50 bg-surface/95 pb-safe backdrop-blur-xl shadow-[0_-1px_8px_rgba(0,0,0,0.03)]">
    <div class="flex items-center justify-between gap-2 px-gutter py-space-xs font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
      <span class="flex items-center gap-space-xs text-on-surface-variant/80">
        <span class="h-1 w-1 shrink-0 bg-secondary" aria-hidden="true"></span>
        Open-Meteo • Coordenadas aproximadas do projecto
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
