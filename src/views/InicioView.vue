<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Inicio from '../components/Inicio.vue'
import { useDistritos } from '../composables/useDistritos.js'

defineProps({ links: { type: Object, required: true } })
const router = useRouter()
const pesquisa = ref('')
const provincia = ref('')
const { distritos, provincias, filtrados, aCarregar, erro, recarregar } = useDistritos(pesquisa, provincia)
const hrefDistrito = id => router.resolve({ name: 'distrito', params: { id } }).href
</script>

<template>
  <Inicio
    v-model:search="pesquisa"
    v-model:provincia="provincia"
    :links="links"
    :distritos="filtrados"
    :total="distritos.length"
    :provincias="provincias"
    :a-carregar="aCarregar"
    :erro="erro"
    :href-distrito="hrefDistrito"
    @recarregar="recarregar"
  />
</template>
