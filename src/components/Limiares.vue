<template>
  <header class="fixed top-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)] pt-safe">
    <div class="h-20 px-gutter flex items-center justify-between">
      <a class="flex flex-col justify-center select-none cursor-pointer" :href="links.distritos">
        <div class="flex items-center gap-space-xs">
          <span class="w-1.5 h-1.5 bg-primary-container rounded-none"></span>
          <span class="font-headline-sm text-headline-sm text-primary uppercase tracking-widest">chuva forte</span>
        </div>
        <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-0.5">Monitorização hidrológica distrital</span>
      </a>
      <div class="flex items-center gap-gutter">
        <nav class="flex items-center gap-gutter">
          <a class="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors min-h-[44px] flex items-center" :href="links.sobre">Sobre</a>
        </nav>
        <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-on-primary text-[18px]">person</span>
        </div>
      </div>
    </div>
  </header>

  <main class="flex flex-col relative w-full px-gutter limiares-conteudo bg-surface min-h-screen">
    <div class="flex flex-col w-full text-on-surface">
      
      <!-- Cabeçalho -->
      <div class="flex flex-col gap-space-xs pt-space-xs pb-space-lg">
        <div class="flex items-center gap-space-xs">
          <span class="w-1.5 h-1.5 bg-primary-container"></span>
          <span class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Caderno • Pág. 08</span>
          <span class="text-outline-variant">•</span>
          <span class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Ref. Hidro-MZ</span>
        </div>
        <span class="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">CALIBRAÇÃO DE VIGILÂNCIA • CRITÉRIOS DE RISCO</span>
        <h1 class="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight mt-space-xs">Limiares Pluviométricos</h1>
        <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">
          Definição de parâmetros pluviométricos para disparo de avisos pessoais e vigilância nos distritos monitorizados.
        </p>
      </div>

      <div class="w-full h-px bg-outline-variant mb-space-lg"></div>

      <!-- SEÇÃO 1: Parâmetro Pessoal -->
      <section class="flex flex-col mb-space-xl">
        <div class="flex items-center justify-between mb-space-sm">
          <span class="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Secção 01 / Configuração Local</span>
          <span class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant font-mono">CAL-24H</span>
        </div>
        <h2 class="font-headline-sm text-headline-sm text-primary mb-space-xs">Parâmetro Pessoal de Alerta (Notificação Diária)</h2>
        <p class="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
          Disparo de resumo por e-mail e destaque gráfico nos distritos que atinjam ou ultrapassem este valor.
        </p>

        <div class="bg-surface-container-low p-space-md rounded-[14px_4px_14px_4px] flex flex-col gap-space-md">
          <div class="flex items-baseline justify-between">
            <span class="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">Cota Operacional</span>
            <div class="flex items-baseline gap-space-xs">
              <span class="font-headline-xl-mobile text-headline-xl-mobile font-semibold text-primary tracking-tight">{{ baseThreshold }}</span>
              <span class="font-label-md text-label-md uppercase tracking-wider text-secondary">mm / 24h</span>
            </div>
          </div>

          <!-- Slider -->
          <div class="relative w-full pt-space-xs pb-space-sm flex flex-col justify-center select-none">
            <input v-model.number="baseThreshold" aria-label="Cota operacional em milímetros por 24 horas" class="w-full h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary focus:outline-none" max="100" min="10" step="5" type="range"/>
            
            <div class="w-full flex justify-between items-start mt-space-sm px-0.5 text-on-surface-variant font-label-sm text-label-sm">
              <div class="flex flex-col items-center"><span class="w-0.5 h-1.5 bg-outline-variant mb-0.5"></span><span>10</span></div>
              <div class="flex flex-col items-center"><span class="w-0.5 h-1.5 bg-outline-variant mb-0.5"></span><span>25</span></div>
              <div class="flex flex-col items-center text-primary font-semibold"><span class="w-0.5 h-2 bg-primary mb-0.5"></span><span>50 Ref.</span></div>
              <div class="flex flex-col items-center"><span class="w-0.5 h-1.5 bg-outline-variant mb-0.5"></span><span>75</span></div>
              <div class="flex flex-col items-center"><span class="w-0.5 h-1.5 bg-outline-variant mb-0.5"></span><span>100</span></div>
            </div>
          </div>

          <div class="flex items-center gap-space-xs pt-space-xs text-on-surface-variant">
            <span class="material-symbols-outlined text-[16px] text-secondary">tune</span>
            <span class="font-body-sm text-body-sm">Ajuste de sensibilidade contínuo em passos de 5 mm</span>
          </div>
        </div>
      </section>

      <div class="w-full h-px bg-outline-variant mb-space-lg"></div>

      <!-- SEÇÃO 2: Convenção Oficial DNGRH / INAM -->
      <section class="flex flex-col mb-space-xl">
        <div class="flex items-center justify-between mb-space-sm">
          <span class="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Secção 02 / Padrão Nacional</span>
          <span class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">TAB. MET-04</span>
        </div>
        <h2 class="font-headline-sm text-headline-sm text-primary mb-space-xs">Convenção Oficial de Níveis Hidrológicos (DNGRH / INAM)</h2>
        <p class="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
          Graduações regulamentares de escoamento superficial e probabilidade de transbordo fluvial.
        </p>

        <div class="flex flex-col w-full">
          <!-- Nível: NORMAL -->
          <div class="py-space-md flex flex-col gap-space-xs">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-space-sm">
                <span class="px-space-xs py-0.5 font-label-sm text-label-sm uppercase tracking-wider text-on-surface bg-surface-container rounded-[8px_2px_8px_2px]">Normal</span>
                <span class="font-headline-sm text-headline-sm text-primary font-semibold">&lt; 30 mm/24h</span>
              </div>
              <span class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Vigilância Passiva</span>
            </div>
            <div class="w-full h-2 rounded-[4px_1px_4px_1px] bg-surface-container-high relative overflow-hidden mt-space-xs">
              <div class="h-full w-1/3 bg-secondary/30"></div>
            </div>
            <p class="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">
              Regime pluvial de base. Escoamento superficial estável sem risco de saturação imediata.
            </p>
          </div>

          <div class="w-full h-px bg-outline-variant"></div>

          <!-- Nível: ATENÇÃO -->
          <div class="py-space-md flex flex-col gap-space-xs">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-space-sm">
                <span class="px-space-xs py-0.5 font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold bg-secondary-fixed rounded-[8px_2px_8px_2px]">Atenção</span>
                <span class="font-headline-sm text-headline-sm text-primary font-semibold">30 a 60 mm/24h</span>
              </div>
              <span class="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Aviso Nível 1</span>
            </div>
            <div class="w-full h-2 rounded-[4px_1px_4px_1px] bg-surface-container-high relative overflow-hidden mt-space-xs">
              <div class="h-full w-2/3 bg-secondary" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255, 255, 255, 0.4) 4px, rgba(255, 255, 255, 0.4) 8px);"></div>
            </div>
            <p class="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">
              Precipitação persistente. Solo em saturação moderada; vigilância de leitos de cheia e vias distritais.
            </p>
          </div>

          <div class="w-full h-px bg-outline-variant"></div>

          <!-- Nível: ALERTA -->
          <div class="py-space-md flex flex-col gap-space-xs">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-space-sm">
                <span class="px-space-xs py-0.5 font-label-sm text-label-sm uppercase tracking-wider text-on-primary bg-primary font-semibold rounded-[8px_2px_8px_2px] flex items-center gap-1">
                  <span class="w-1.5 h-1.5 bg-surface-bright rounded-none inline-block"></span> Alerta
                </span>
                <span class="font-headline-sm text-headline-sm text-primary font-semibold">&gt; 60 mm/24h</span>
              </div>
              <span class="font-label-sm text-label-sm uppercase tracking-wider text-error font-semibold">Aviso Severo</span>
            </div>
            <div class="w-full h-2 rounded-[4px_1px_4px_1px] bg-surface-container-high relative overflow-hidden mt-space-xs">
              <div class="h-full w-full bg-primary"></div>
            </div>
            <p class="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">
              Precipitação de alta intensidade com potencial de escoamento torrencial. Indicador precursor de cheia.
            </p>
          </div>
        </div>
      </section>

      <div class="w-full h-px bg-outline-variant mb-space-lg"></div>

      <!-- SEÇÃO 3: Saturação de Solo -->
      <section class="flex flex-col mb-space-xl">
        <div class="flex items-center justify-between mb-space-sm">
          <span class="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Secção 03 / Compensação de Solo</span>
          <span class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant font-mono">HYD-COEFF</span>
        </div>
        <h2 class="font-headline-sm text-headline-sm text-primary mb-space-xs">Critério Adicional de Saturação de Solo</h2>
        
        <div class="bg-surface-container-low p-space-md rounded-[14px_4px_14px_4px] mt-space-xs flex items-start justify-between gap-space-md">
          <div class="flex flex-col pr-space-xs">
            <label class="font-label-md text-label-md text-primary font-semibold cursor-pointer" for="soilSaturationToggle">
              Ajuste dinâmico por umidade prévia
            </label>
            <span class="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-normal">
              Considerar saturação prévia do solo &gt; 80% como fator de redução do limiar em 15 mm.
            </span>
            <div class="mt-space-sm inline-flex items-center gap-space-xs text-secondary font-label-sm text-label-sm uppercase tracking-wider">
              <span class="w-1.5 h-1.5 bg-secondary"></span>
              <span>Limiar efetivo ajustado: <strong class="font-mono">{{ effectiveThreshold }} mm</strong></span>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
            <input v-model="isSoilSaturated" class="sr-only peer" id="soilSaturationToggle" type="checkbox"/>
            <div class="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:border-surface-dim after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>
      </section>

      <!-- Nota Obrigatória -->
      <div class="bg-surface-container-high/60 p-space-md rounded-[8px_2px_8px_2px] mb-space-xl flex items-start gap-space-sm">
        <span class="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">info</span>
        <p class="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          A precipitação intensa constitui um indicador de risco hidrológico; este serviço não substitui os avisos oficiais de cheia da DNGRH.
        </p>
      </div>

      <!-- Botão Repor -->
      <div class="flex flex-col gap-space-sm pb-space-lg">
        <button 
          @click="resetThresholds" 
          :class="isResetting ? 'bg-primary' : 'bg-primary-container hover:bg-primary'"
          class="w-full min-h-[48px] px-space-md py-space-sm text-on-primary font-label-lg text-label-lg uppercase tracking-wider rounded-[14px_4px_14px_4px] transition-colors flex items-center justify-center gap-space-xs focus:outline-none active:scale-[0.99] select-none" 
          type="button"
        >
          <span class="material-symbols-outlined text-[18px]">restart_alt</span>
          <span>Repor valores de referência nacionais (50 mm)</span>
        </button>
        <div class="flex items-center justify-between text-on-surface-variant px-space-xs">
          <span class="font-label-sm text-label-sm uppercase tracking-widest">Protocolo: PNA-2024</span>
          <span class="font-label-sm text-label-sm font-mono">ESTADO: SINCRONIZADO</span>
        </div>
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
      <a class="flex items-center justify-center gap-space-xs min-h-[44px] px-space-sm font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors cursor-pointer" :href="links.distritos">
        <span class="material-symbols-outlined text-[18px]">map</span><span>Bacias</span>
      </a>
      <a class="flex items-center justify-center gap-space-xs min-h-[44px] px-space-sm font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors" :href="links.registo">
        <span class="material-symbols-outlined text-[18px]">edit_note</span><span>Registo</span>
      </a>
      <a class="flex items-center justify-center gap-space-xs min-h-[44px] px-space-sm uppercase tracking-wider transition-colors text-primary border-b-2 border-primary font-semibold" :href="links.limiares" aria-current="page">
        <span class="material-symbols-outlined text-[18px]">tune</span><span>Limiares</span>
      </a>
    </nav>
  </footer>
</template>

<script setup>
import { computed, onUnmounted, ref } from 'vue'

defineProps({ links: { type: Object, required: true } })
const baseThreshold = defineModel('limiar', { type: Number, default: 50 })
const isSoilSaturated = defineModel('soloSaturado', { type: Boolean, default: false })
const isResetting = ref(false)
let resetTimer

const effectiveThreshold = computed(() =>
  isSoilSaturated.value ? Math.max(5, baseThreshold.value - 15) : baseThreshold.value,
)

function resetThresholds() {
  baseThreshold.value = 50
  isSoilSaturated.value = false
  isResetting.value = true
  clearTimeout(resetTimer)
  resetTimer = setTimeout(() => { isResetting.value = false }, 250)
}

onUnmounted(() => clearTimeout(resetTimer))
</script>

<style scoped>
.limiares-conteudo {
  padding-top: calc(5rem + env(safe-area-inset-top, 0px));
  padding-bottom: calc(6rem + env(safe-area-inset-bottom, 0px));
}
</style>
