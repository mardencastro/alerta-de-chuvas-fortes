import { ref } from 'vue'

const stations = [
  { id: 'buzi', district: 'Búzi', station: 'Posto Estúrio', basin: 'Bacia do Búzi' },
  { id: 'mocuba', district: 'Mocuba', station: 'Ponte Licungo', basin: 'Bacia do Licungo' },
  { id: 'chokwe', district: 'Chókwè', station: 'Eclusas Macarretane', basin: 'Rio Limpopo' },
  { id: 'marromeu', district: 'Marromeu', station: 'Baixo Zambeze', basin: 'Rio Zambeze' },
  { id: 'xai-xai', district: 'Xai-Xai', station: 'Foz do Limpopo', basin: 'Rio Limpopo' },
  { id: 'caia', district: 'Caia', station: 'Ponte Guebuza', basin: 'Rio Zambeze' },
  { id: 'mutarara', district: 'Mutarara', station: 'Posto Dona Ana', basin: 'Rio Zambeze' },
]

export function useRegistos() {
  // Leituras do protótipo, separadas da previsão real.
  const readings = ref([
    { id: 1, stationId: 'buzi', date: '26 Fev', time: '06:00', mm: 92, hours: 12 },
    { id: 2, stationId: 'mocuba', date: '26 Fev', time: '06:00', mm: 88, hours: 12 },
    { id: 3, stationId: 'chokwe', date: '25 Fev', time: '18:00', mm: 74, hours: 24, stationName: 'Macarretane' },
    { id: 4, stationId: 'marromeu', date: '25 Fev', time: '06:00', mm: 48, hours: 36 },
    { id: 5, stationId: 'xai-xai', date: '24 Fev', time: '06:00', mm: 35, hours: 48 },
    { id: 6, stationId: 'caia', date: '23 Fev', time: '06:00', mm: 18, hours: 72 },
  ])
  return { stations, readings }
}
