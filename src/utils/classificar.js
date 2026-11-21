// Critérios do grupo, relativos ao limite pessoal de precipitação.
export function classificar(mm, limite) {
  if (!Number.isFinite(mm)) return 'normal'
  if (mm >= limite) return 'alerta'
  if (mm >= limite * 0.6) return 'atencao'
  return 'normal'
}

export function nivelMaximo(dias) {
  if (dias.some(dia => dia.nivel === 'alerta')) return 'alerta'
  if (dias.some(dia => dia.nivel === 'atencao')) return 'atencao'
  return 'normal'
}
