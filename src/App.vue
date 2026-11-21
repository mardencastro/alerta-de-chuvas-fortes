<script setup>
import { ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'

const router = useRouter()
const links = Object.fromEntries(
  ['distritos', 'limiares', 'registo', 'sobre'].map(name => [name, router.resolve({ name }).href]),
)
const limiar = ref(50)
const soloSaturado = ref(false)
const irPara = name => router.push({ name })

function seguirLink(event) {
  if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return

  const link = event.target.closest?.('a[href]')
  if (!link || link.target || link.hasAttribute('download')) return

  const destino = new URL(link.href)
  if (destino.origin !== window.location.origin || destino.pathname !== window.location.pathname ||
    !destino.hash.startsWith('#/')) return

  event.preventDefault()
  void router.push(destino.hash.slice(1))
}
</script>

<template>
  <div class="min-h-screen bg-surface" @click="seguirLink">
    <RouterView v-slot="{ Component, route }">
      <component :is="Component" v-if="route.name === 'distritos' || route.name === 'registo'" :links="links" />
      <component :is="Component" v-else-if="route.name === 'distrito'" v-model:limiar="limiar" :distritos-href="links.distritos" />
      <component :is="Component" v-else-if="route.name === 'limiares'" v-model:limiar="limiar" v-model:solo-saturado="soloSaturado" :links="links" />
      <component :is="Component" v-else-if="route.name === 'sobre'" @navegar="irPara" />
      <component :is="Component" v-else :distritos-href="links.distritos" @voltar="irPara('distritos')" />
    </RouterView>
  </div>
</template>
