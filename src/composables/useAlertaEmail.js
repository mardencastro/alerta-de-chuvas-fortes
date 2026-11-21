import emailjs from '@emailjs/browser'
import { readonly, ref } from 'vue'

const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const nomes = { normal: 'Normal', atencao: 'Atenção', alerta: 'Alerta' }
const emEnvio = ref(false)

export function useAlertaEmail() {
  const estado = ref('inicial')
  const mensagemErro = ref('')

  async function enviar(email, distrito, dias, limite) {
    if (emEnvio.value) return

    const destinatario = typeof email === 'string' ? email.trim() : ''
    if (!formatoEmail.test(destinatario)) {
      estado.value = 'erro'
      mensagemErro.value = 'Introduz um endereço de e-mail válido.'
      return
    }

    if (!distrito || !dias.length) {
      estado.value = 'erro'
      mensagemErro.value = 'Aguarda uma previsão disponível antes de enviar o resumo.'
      return
    }

    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim()
    const servico = import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim()
    const modelo = import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim()
    if (!publicKey || !servico || !modelo) {
      estado.value = 'erro'
      mensagemErro.value = 'O envio ainda não está configurado. Preenche as três variáveis VITE_EMAILJS.'
      return
    }

    const resumo = [
      `${distrito.nome} — ${distrito.provincia}`,
      `Limite pessoal: ${limite} mm/24h`,
      '',
      ...dias.map(({ data, mm, nivel }) => mm === null
        ? `${data}: precipitação indisponível`
        : `${nivel === 'alerta' ? '[ALERTA] ' : ''}${data}: ${mm} mm — ${nomes[nivel]}`),
      '',
      'Fonte: Open-Meteo. A previsão de precipitação não é uma previsão de cheias.',
    ].join('\n')

    mensagemErro.value = ''
    estado.value = 'a-enviar'
    emEnvio.value = true
    try {
      await emailjs.send(servico, modelo, {
        to_email: destinatario,
        distrito: distrito.nome,
        provincia: distrito.provincia,
        limite,
        resumo,
      }, { publicKey })
      estado.value = 'enviado'
    } catch {
      estado.value = 'erro'
      mensagemErro.value = 'Não foi possível enviar o resumo. Verifica a ligação e tenta novamente.'
    } finally {
      emEnvio.value = false
    }
  }

  return { estado: readonly(estado), mensagemErro: readonly(mensagemErro), emEnvio: readonly(emEnvio), enviar }
}
