<template>
  <div class="bg-surface min-h-screen">
    <!-- O componente que está ativo no momento -->
    <Estacao v-if="paginaAtual === 'estacao'" @voltar="paginaAtual = 'incio'" />
    <InCio v-if="paginaAtual === 'incio'" />

    <!-- Menu Flutuante para teste -->
    <div class="fixed bottom-20 right-4 z-50 flex flex-col gap-2">
      <button @click="paginaAtual = 'estacao'" class="bg-white p-3 rounded-full shadow-lg text-primary border border-gray-200 text-sm font-bold">
        Ver Estação Búzi
      </button>
      <button @click="paginaAtual = 'incio'" class="bg-white p-3 rounded-full shadow-lg text-primary border border-gray-200 text-sm font-bold">
        Ver Início
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// Importando o nome exato que você deu ao arquivo
import Estacao from './components/Estacao.vue'
import InCio from './components/inCio.vue'    

const paginaAtual = ref('incio') // Começa no Início
</script>