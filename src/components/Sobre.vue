<script setup>
const emit = defineEmits(['navegar'])

const specifications = [
  { label: 'Modelo meteorológico', value: 'Open-Meteo Ensemble & ECMWF' },
  { label: 'Frequência de actualização', value: 'Diária, às 06:00 CAT' },
  { label: 'Georreferenciação', value: 'WGS84 / Sedes distritais oficiais' },
]

const thresholds = [
  {
    level: 'Normal',
    range: '< 30 mm/24h',
    description: 'Regime base',
    badge: 'bg-surface-container-lowest text-on-surface',
    caption: 'text-on-surface-variant',
    bar: 'w-1/4 bg-surface-dim',
  },
  {
    level: 'Atenção',
    range: '30 a 60 mm/24h',
    description: 'Vigilância local',
    badge: 'bg-secondary-container text-on-secondary-container',
    caption: 'font-medium text-secondary',
    bar: 'sobre-bar-striped w-3/5',
  },
  {
    level: 'Alerta',
    range: '> 60 mm/24h',
    description: 'Precipitação intensa',
    badge: 'bg-primary text-on-primary',
    caption: 'font-bold text-primary',
    bar: 'w-4/5 bg-primary',
  },
]

const destinations = [
  { page: 'registo', label: 'Registo', icon: 'water_drop' },
  { page: 'distritos', label: 'Bacias', icon: 'map' },
  { page: 'limiares', label: 'Limiares', icon: 'warning' },
]
</script>

<template>
  <div id="sobre-chuva-forte" class="w-full bg-surface font-body-md text-body-md text-on-surface">
    <header class="sobre-header fixed inset-x-0 top-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div class="flex h-20 items-center justify-between gap-2 px-gutter">
        <div class="flex flex-col justify-center">
          <span class="flex items-center gap-space-xs">
            <span class="h-1.5 w-1.5 shrink-0 bg-primary-container" aria-hidden="true"></span>
            <span class="font-headline-sm text-headline-sm uppercase tracking-widest text-primary">Chuva Forte</span>
          </span>
          <span class="mt-0.5 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Monitorização hidrológica distrital</span>
        </div>

        <div class="flex items-center gap-2 sm:gap-gutter">
          <nav class="flex items-center gap-2 sm:gap-gutter" aria-label="Navegação principal">
            <button
              type="button"
              class="flex min-h-[44px] items-center font-label-md text-label-md uppercase tracking-wider text-on-surface-variant transition-colors hover:text-primary"
              @click="emit('navegar', 'distritos')"
            >Distritos</button>
            <span aria-current="page" class="flex min-h-[44px] items-center font-semibold uppercase tracking-wider text-primary">Sobre</span>
          </nav>
          <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary" aria-hidden="true">
            <span class="material-symbols-outlined text-[18px] text-on-primary">person</span>
          </span>
        </div>
      </div>
    </header>

    <main class="sobre-main min-h-screen w-full px-gutter">
      <div class="pb-6 pt-2">
        <button
          type="button"
          class="inline-flex min-h-[44px] items-center gap-space-xs py-1 font-label-md text-label-md text-secondary transition-colors hover:text-primary"
          @click="emit('navegar', 'distritos')"
        >
          <span class="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_back</span>
          <span>Voltar aos distritos</span>
        </button>
      </div>

      <div class="flex flex-col gap-space-xs pb-space-lg">
        <div class="flex items-center gap-space-xs">
          <span class="h-0.5 w-2 bg-primary" aria-hidden="true"></span>
          <span class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Caderno Técnico • Referência</span>
        </div>
        <h1 class="font-headline-lg-mobile text-headline-lg-mobile tracking-tight text-primary">Sobre o Chuva Forte</h1>
      </div>

      <div class="divide-y divide-outline-variant/60 border-t border-outline-variant/60">
        <section class="flex flex-col gap-space-md py-space-lg leading-relaxed" aria-label="Objetivo da aplicação">
          <p>
            O Chuva Forte agrega previsões pluviométricas de alta resolução para os distritos de Moçambique com base em dados numéricos abertos do Open-Meteo e coordenadas do Instituto Nacional de Estatística (INE).
          </p>
          <p>
            A aplicação tem como único propósito assinalar a probabilidade de precipitação diária elevada, permitindo a técnicos e residentes definir limiares personalizados de atenção e alerta.
          </p>
          <p class="rounded bg-surface-container-low p-space-md text-on-surface-variant">
            A precipitação intensa é um sinal precursor de risco; esta aplicação não prevê inundações, cheias ribeirinhas ou caudais fluviais, matéria da competência exclusiva da Direcção Nacional de Gestão de Recursos Hídricos (DNGRH) e do INGD.
          </p>
        </section>

        <section class="flex flex-col gap-space-md py-space-lg" aria-labelledby="sobre-fontes">
          <h2 id="sobre-fontes" class="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-primary">Especificações das Fontes</h2>
          <dl class="divide-y divide-outline-variant/40">
            <div v-for="specification in specifications" :key="specification.label" class="flex flex-col py-space-sm">
              <dt class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">{{ specification.label }}</dt>
              <dd class="font-medium">{{ specification.value }}</dd>
            </div>
          </dl>
        </section>

        <section class="flex flex-col gap-space-md py-space-lg" aria-labelledby="sobre-limiares">
          <div class="flex items-center justify-between gap-2">
            <h2 id="sobre-limiares" class="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-primary">Convenção de Limiares Pluviométricos</h2>
            <span class="shrink-0 font-label-sm text-label-sm text-on-surface-variant">24 HORAS</span>
          </div>

          <ul class="flex flex-col gap-space-md">
            <li v-for="threshold in thresholds" :key="threshold.level" class="flex flex-col gap-space-xs rounded bg-surface-container-low p-space-md">
              <div class="flex flex-wrap items-center justify-between gap-space-xs">
                <div class="flex items-center gap-space-xs">
                  <span
                    class="rounded px-space-xs py-0.5 font-label-sm text-label-sm uppercase tracking-wider"
                    :class="threshold.badge"
                  >{{ threshold.level }}</span>
                  <span class="font-body-sm text-body-sm text-on-surface-variant">{{ threshold.range }}</span>
                </div>
                <span class="font-label-sm text-label-sm uppercase" :class="threshold.caption">{{ threshold.description }}</span>
              </div>
              <div class="h-3 w-full overflow-hidden rounded-t bg-surface-container-high" aria-hidden="true">
                <div class="h-full" :class="threshold.bar"></div>
              </div>
            </li>
          </ul>
        </section>

        <section class="flex flex-col gap-space-sm pb-10 pt-space-lg" aria-labelledby="sobre-notificacao">
          <div class="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
            <h2 id="sobre-notificacao" class="uppercase">Notificação Operacional</h2>
            <span>VERSÃO 1.4.2</span>
          </div>
          <p class="font-body-sm text-body-sm text-on-surface-variant/80">
            Em caso de condições meteorológicas severas, consulte sempre os avisos oficiais emitidos pelo INAM e as directivas da autoridade distrital de protecção civil.
          </p>
          <button
            type="button"
            class="mt-space-sm inline-flex min-h-[44px] w-full items-center justify-center gap-space-xs rounded bg-surface-container px-space-md py-3 font-label-md text-label-md uppercase tracking-wider text-primary transition-colors hover:bg-surface-container-high"
            @click="emit('navegar', 'distritos')"
          >
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_back</span>
            <span>Voltar aos distritos</span>
          </button>
        </section>
      </div>
    </main>

    <footer class="sobre-footer fixed inset-x-0 bottom-0 z-50 bg-surface/95 backdrop-blur-xl shadow-[0_-1px_8px_rgba(0,0,0,0.03)]">
      <div class="flex items-center justify-between gap-2 px-gutter py-space-xs font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
        <span class="flex items-center gap-space-xs text-on-surface-variant/80">
          <span class="h-1 w-1 shrink-0 bg-secondary" aria-hidden="true"></span>
          Fonte técnica: Open-Meteo • DNGRH
        </span>
        <span class="shrink-0">MOZ • WGS84</span>
      </div>
      <nav class="flex h-14 items-center justify-around px-gutter" aria-label="Navegação inferior">
        <button
          v-for="destination in destinations"
          :key="destination.page"
          type="button"
          class="flex min-h-[44px] items-center gap-space-xs px-space-sm font-label-md text-label-md uppercase tracking-wider text-on-surface-variant transition-colors hover:text-primary"
          @click="emit('navegar', destination.page)"
        >
          <span class="material-symbols-outlined text-[18px]" aria-hidden="true">{{ destination.icon }}</span>
          <span>{{ destination.label }}</span>
        </button>
      </nav>
    </footer>
  </div>
</template>

<style scoped>
.sobre-header {
  padding-top: env(safe-area-inset-top, 0px);
}

.sobre-main {
  padding-top: calc(5rem + env(safe-area-inset-top, 0px));
  padding-bottom: calc(6rem + env(safe-area-inset-bottom, 0px));
}

.sobre-footer {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.sobre-bar-striped {
  background-image: repeating-linear-gradient(45deg, #3e6378 0 4px, #e5e9eb 4px 8px);
}
</style>
