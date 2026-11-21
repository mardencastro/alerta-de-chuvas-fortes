import { computed, ref, toValue, watch } from 'vue'
import { classificar } from '../utils/classificar.js'

const cache = new Map()
const urlBase = 'https://api.open-meteo.com/v1/forecast'

function lerDias(daily) {
  const { time, precipitation_sum: chuva, precipitation_probability_max: probabilidade } = daily ?? {}
  if (!Array.isArray(time) || !Array.isArray(chuva) || !Array.isArray(probabilidade)) {
    throw new Error('Previsão inválida')
  }
  return time.slice(0, 7).flatMap((data, index) => {
    if (typeof data !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data)) return []
    const mm = Number.isFinite(chuva[index]) && chuva[index] >= 0 ? chuva[index] : null
    const chance = probabilidade[index]
    return [{
      data,
      mm,
      probabilidade: Number.isFinite(chance) && chance >= 0 && chance <= 100 ? chance : null,
    }]
  })
}

export function usePrevisao(distrito, limite) {
  const brutos = ref([])
  const aCarregar = ref(false)
  const erro = ref('')
  const tentativa = ref(0)

  watch([() => toValue(distrito), tentativa], async ([selecionado], _, onCleanup) => {
    brutos.value = []
    erro.value = ''
    aCarregar.value = false
    if (!selecionado) return

    if (cache.has(selecionado.id)) {
      brutos.value = cache.get(selecionado.id)
      return
    }

    const controlador = new AbortController()
    onCleanup(() => controlador.abort())
    aCarregar.value = true

    const parametros = new URLSearchParams({
      latitude: selecionado.lat,
      longitude: selecionado.lon,
      daily: 'precipitation_sum,precipitation_probability_max',
      timezone: 'Africa/Maputo',
      forecast_days: '7',
    })

    try {
      const resposta = await fetch(urlBase + '?' + parametros, { signal: controlador.signal })
      if (!resposta.ok) throw new Error('HTTP ' + resposta.status)
      const lista = lerDias((await resposta.json()).daily)
      if (controlador.signal.aborted || toValue(distrito)?.id !== selecionado.id) return

      cache.set(selecionado.id, lista)
      brutos.value = lista
    } catch {
      if (!controlador.signal.aborted) erro.value = 'Não foi possível obter a previsão do Open-Meteo.'
    } finally {
      if (!controlador.signal.aborted) aCarregar.value = false
    }
  }, { immediate: true, flush: 'sync' })

  const dias = computed(() => brutos.value.map(dia => ({
    ...dia,
    nivel: classificar(dia.mm, toValue(limite)),
  })))

  function tentarDeNovo() {
    const selecionado = toValue(distrito)
    if (selecionado) cache.delete(selecionado.id)
    tentativa.value++
  }

  return { dias, aCarregar, erro, tentarDeNovo }
}
