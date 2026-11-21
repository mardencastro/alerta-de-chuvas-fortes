import { computed, readonly, ref, toValue } from 'vue'

const distritos = ref([])
const aCarregar = ref(false)
const erro = ref('')
let carregado = false
let pedido

function normalizar(texto) {
  return texto.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[-\s]+/g, ' ').trim()
}

function carregar(forcar = false) {
  if (pedido) return pedido
  if (!forcar && (carregado || erro.value)) return

  aCarregar.value = true
  erro.value = ''
  pedido = (async () => {
    try {
      const resposta = await fetch(import.meta.env.BASE_URL + 'dados/distritos.json')
      if (!resposta.ok) throw new Error('HTTP ' + resposta.status)
      const dados = await resposta.json()
      if (!Array.isArray(dados) || dados.some(d => !d?.id || !d.nome || !d.provincia ||
        !Number.isFinite(d.lat) || !Number.isFinite(d.lon))) {
        throw new Error('Catálogo inválido')
      }
      distritos.value = dados
      carregado = true
    } catch {
      erro.value = 'Não foi possível carregar a lista de distritos.'
    } finally {
      aCarregar.value = false
    }
  })().finally(() => { pedido = undefined })
  return pedido
}

const provincias = computed(() =>
  [...new Set(distritos.value.map(distrito => distrito.provincia))].sort((a, b) => a.localeCompare(b, 'pt')),
)

export function useDistritos(pesquisa = '', provincia = '') {
  void carregar()
  const filtrados = computed(() => {
    const termo = normalizar(toValue(pesquisa))
    const selecionada = toValue(provincia)
    return distritos.value.filter(distrito =>
      (!selecionada || distrito.provincia === selecionada) && normalizar(distrito.nome).includes(termo),
    )
  })
  return {
    distritos: readonly(distritos),
    provincias,
    filtrados,
    aCarregar: readonly(aCarregar),
    erro: readonly(erro),
    recarregar: () => carregar(true),
  }
}
