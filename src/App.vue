<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Estacao from './components/Estacao.vue'
import Inicio from './components/Inicio.vue'
import Limiares from './components/Limiares.vue'
import Pagina404 from './components/Pagina404.vue'
import Registo from './components/Registo.vue'
import Sobre from './components/Sobre.vue'

const base = new URL(import.meta.env.BASE_URL, window.location.origin).pathname.replace(/\/$/, '')
const links = {
  distritos: base + '/distritos',
  buzi: base + '/distritos/buzi',
  registo: base + '/registo',
  limiares: base + '/limiares',
  sobre: base + '/sobre',
}
const paginas = new Map([
  [base || '/', 'distritos'],
  [base + '/index.html', 'distritos'],
  ...Object.entries(links).map(([pagina, href]) => [href, pagina]),
])
const normalizarCaminho = caminho => caminho.replace(/\/+$/, '') || '/'
const caminho = ref(window.location.pathname)
const paginaAtual = computed(() => paginas.get(normalizarCaminho(caminho.value)) ?? '404')
const limiar = ref(50)
const soloSaturado = ref(false)

function atualizarCaminho() {
  caminho.value = window.location.pathname
}

function navegar(href) {
  if (caminho.value === href && !window.location.search && !window.location.hash) return

  window.history.pushState(null, '', href)
  atualizarCaminho()
  window.scrollTo(0, 0)
}

function seguirLink(event) {
  if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return

  const link = event.target.closest?.('a[href]')
  if (!link || link.target || link.hasAttribute('download')) return

  const destino = new URL(link.href)
  if (destino.origin !== window.location.origin || destino.search || destino.hash || !paginas.has(normalizarCaminho(destino.pathname))) return

  event.preventDefault()
  navegar(destino.pathname)
}

onMounted(() => window.addEventListener('popstate', atualizarCaminho))
onUnmounted(() => window.removeEventListener('popstate', atualizarCaminho))
</script>

<template>
  <div class="min-h-screen bg-surface" @click="seguirLink">
    <Inicio v-if="paginaAtual === 'distritos'" :links="links" />
    <Estacao v-else-if="paginaAtual === 'buzi'" v-model:limiar="limiar" :distritos-href="links.distritos" />
    <Limiares v-else-if="paginaAtual === 'limiares'" v-model:limiar="limiar" v-model:solo-saturado="soloSaturado" :links="links" />
    <Registo v-else-if="paginaAtual === 'registo'" :links="links" />
    <Sobre v-else-if="paginaAtual === 'sobre'" @navegar="pagina => navegar(links[pagina])" />
    <Pagina404 v-else :distritos-href="links.distritos" @voltar="navegar(links.distritos)" />
  </div>
</template>
