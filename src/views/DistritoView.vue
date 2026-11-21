<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Estacao from '../components/Estacao.vue'
import { useDistritos } from '../composables/useDistritos.js'
import { usePrevisao } from '../composables/usePrevisao.js'

defineProps({ distritosHref: { type: String, required: true } })
const limiar = defineModel('limiar', { type: Number, default: 50 })
const rota = useRoute()
const router = useRouter()
const { distritos, aCarregar, erro, recarregar } = useDistritos()
const distrito = computed(() => distritos.value.find(item => item.id === rota.params.id))
const previsao = usePrevisao(distrito, limiar)

watchEffect(() => {
  if (rota.name === 'distrito' && !aCarregar.value && !erro.value && distritos.value.length && !distrito.value) {
    void router.replace({ name: 'nao-encontrado' })
  }
})
</script>

<template>
  <Estacao
    v-if="distrito"
    :key="distrito.id"
    v-model:limiar="limiar"
    :distritos-href="distritosHref"
    :distrito="distrito"
    :dias="previsao.dias.value"
    :a-carregar="previsao.aCarregar.value"
    :erro="previsao.erro.value"
    @recarregar="previsao.tentarDeNovo"
  />
  <main v-else class="min-h-screen w-full bg-surface p-gutter text-primary">
    <p role="status">{{ aCarregar ? 'A carregar o distrito…' : erro || 'Nenhum distrito disponível.' }}</p>
    <button v-if="!aCarregar && (erro || !distritos.length)" type="button" class="mr-4 underline" @click="recarregar">Tentar de novo</button>
    <a :href="distritosHref" class="underline">Voltar aos distritos</a>
  </main>
</template>
