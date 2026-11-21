<script setup>
import { ref } from 'vue'

defineProps({
  distritosHref: { type: String, required: true },
})

const emit = defineEmits(['voltar'])
const estadoRede = ref('')

function testarLigacao() {
  estadoRede.value = navigator.onLine ? 'Dispositivo ligado à rede' : 'Dispositivo sem ligação à rede'
}
</script>

<template>
  <div class="pagina-404 min-h-screen w-full bg-surface font-body-md text-body-md text-on-surface">
    <header class="cabecalho-404 fixed inset-x-0 top-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div class="flex h-16 items-center justify-between gap-2 px-gutter">
        <div class="flex items-center gap-space-sm">
          <button
            type="button"
            aria-label="Voltar aos distritos"
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px_2px_8px_2px] text-primary transition-colors hover:text-primary-container"
            @click="emit('voltar')"
          >
            <span class="material-symbols-outlined text-[20px]" aria-hidden="true">arrow_back</span>
          </button>
          <div class="flex flex-col">
            <span class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Estação Hidrométrica</span>
            <span class="font-headline-sm text-headline-sm tracking-tight text-primary">Detalhe Da Estação</span>
          </div>
        </div>
        <div class="flex items-center gap-2 sm:gap-gutter">
          <span class="text-right font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Posto Pluviométrico</span>
          <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary" aria-hidden="true">
            <span class="material-symbols-outlined text-[18px] text-on-primary">person</span>
          </span>
        </div>
      </div>
    </header>

    <main class="conteudo-404 flex min-h-screen w-full flex-col px-gutter">
      <div class="flex flex-col gap-space-sm pb-space-lg pt-space-md">
        <div class="inline-flex items-center gap-space-xs self-start rounded-[8px_2px_8px_2px] bg-surface-container-highest px-space-sm py-0.5 text-on-surface-variant">
          <span class="h-1.5 w-1.5 rounded-full bg-outline" aria-hidden="true"></span>
          <span class="font-label-sm text-label-sm uppercase tracking-wider">Sistema Hidrológico · Maputo</span>
        </div>

        <div class="flex flex-wrap items-baseline gap-space-xs pt-space-xs font-label-md text-label-md uppercase">
          <span class="tracking-widest text-secondary">Registo não encontrado</span>
          <span class="text-outline" aria-hidden="true">·</span>
          <span class="font-semibold tracking-wider text-primary-container">Código 404</span>
        </div>
        <h1 class="font-headline-lg-mobile text-headline-lg-mobile tracking-tight text-primary">
          Distrito ou coordenada inexistente
        </h1>
      </div>

      <div class="relative mb-space-lg w-full overflow-hidden rounded-[14px_4px_14px_4px] bg-surface-container-low p-space-md">
        <div class="grelha-cartografica pointer-events-none absolute inset-0 opacity-40" aria-hidden="true"></div>
        <div class="relative flex flex-col gap-space-md">
          <div class="flex flex-wrap items-center justify-between gap-1 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
            <span class="flex items-center gap-space-xs">
              <span class="material-symbols-outlined text-[14px] text-secondary" aria-hidden="true">explore_off</span>
              Setor: indeterminado
            </span>
            <span class="tabular-nums">LAT --.----° / LON --.----°</span>
          </div>

          <div class="flex items-center justify-center py-space-md" aria-hidden="true">
            <div class="relative flex h-28 w-28 items-center justify-center">
              <svg class="h-full w-full text-outline-variant" fill="none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" stroke="currentColor" stroke-dasharray="2 3" />
                <circle cx="50" cy="50" r="32" stroke="currentColor" stroke-width="0.75" />
                <circle cx="50" cy="50" r="16" stroke="currentColor" stroke-dasharray="1 2" stroke-width="0.5" />
                <path d="M50 2v96M2 50h96" stroke="currentColor" stroke-width="0.5" />
              </svg>
              <div class="absolute flex flex-col items-center justify-center text-primary">
                <span class="material-symbols-outlined text-[24px]">location_searching</span>
                <span class="mt-0.5 font-label-sm text-label-sm tracking-widest text-outline">NULO</span>
              </div>
            </div>
          </div>

          <dl class="flex items-center justify-between gap-2 rounded-[8px_2px_8px_2px] bg-surface-container px-space-md py-space-sm">
            <div class="flex flex-col">
              <dt class="font-label-sm text-label-sm uppercase text-on-surface-variant">Referência</dt>
              <dd class="font-body-sm text-body-sm font-medium text-primary">WGS84 / UTM 36S</dd>
            </div>
            <div class="flex flex-col items-end text-right">
              <dt class="font-label-sm text-label-sm uppercase text-on-surface-variant">Estado do traçado</dt>
              <dd class="flex items-center gap-1 font-body-sm text-body-sm font-medium text-error">
                <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-error" aria-hidden="true"></span>
                Sem sinal de cota
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div class="mb-space-xl flex flex-col gap-space-md">
        <div class="flex items-start gap-space-sm">
          <span class="material-symbols-outlined mt-0.5 shrink-0 text-[20px] text-secondary" aria-hidden="true">description</span>
          <p>O identificador solicitado não consta na malha distrital georreferenciada ou foi removido do caderno de observação.</p>
        </div>
        <div class="flex items-start gap-space-sm">
          <span class="material-symbols-outlined mt-0.5 shrink-0 text-[20px] text-secondary" aria-hidden="true">travel_explore</span>
          <p class="text-on-surface-variant">Verifica a designação ou consulta os distritos actualmente sob monitorização na lista principal.</p>
        </div>
      </div>

      <a
        :href="distritosHref"
        class="inline-flex min-h-[50px] w-full items-center justify-center gap-space-sm rounded-[14px_4px_14px_4px] bg-primary-container px-gutter py-space-md text-center font-label-lg text-label-lg text-on-primary transition-colors hover:bg-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        @click.left.exact.prevent="emit('voltar')"
      >
        <span class="material-symbols-outlined text-[18px]" aria-hidden="true">view_list</span>
        <span>Regressar à lista de distritos</span>
      </a>

      <section class="mt-margin-lg flex flex-col gap-space-sm rounded-[8px_2px_8px_2px] bg-surface-container-high p-space-md" aria-labelledby="diagnostico-404">
        <div class="flex items-center gap-space-xs text-primary">
          <span class="material-symbols-outlined text-[16px] text-secondary" aria-hidden="true">wifi_tethering</span>
          <h2 id="diagnostico-404" class="font-label-sm text-label-sm uppercase tracking-wider">Estado da ligação do dispositivo</h2>
        </div>
        <p class="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
          Verifica se o dispositivo está ligado à rede antes de consultar uma previsão.
        </p>

        <div class="flex flex-wrap items-center justify-between gap-2 pt-space-xs">
          <button
            type="button"
            class="inline-flex min-h-10 items-center gap-space-xs py-space-xs font-label-sm text-label-sm uppercase tracking-wider text-primary hover:text-primary-container disabled:opacity-60"
            @click="testarLigacao"
          >
            <span class="material-symbols-outlined text-[16px]" aria-hidden="true">sync</span>
            <span>Verificar rede</span>
          </button>
          <span class="font-label-sm text-label-sm tabular-nums text-on-surface-variant" role="status">
            {{ estadoRede }}
          </span>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
:global(#app:has(> .pagina-404)) {
  display: block;
  width: 100%;
  max-width: none;
  padding: 0;
}

.cabecalho-404 {
  padding-top: env(safe-area-inset-top, 0px);
}

.conteudo-404 {
  padding-top: calc(4rem + env(safe-area-inset-top, 0px));
  padding-bottom: calc(3rem + env(safe-area-inset-bottom, 0px));
}

.grelha-cartografica {
  background-image: radial-gradient(circle at 1px 1px, #72787e 1px, transparent 0);
  background-size: 16px 16px;
}
</style>
