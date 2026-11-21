# Chuva Forte

Projeto final de Programação Web II do ISUTC. A aplicação mostra a previsão de precipitação para 26 distritos de Moçambique, ao longo dos próximos sete dias. O utilizador pode comparar a previsão com um limite pessoal e enviar um resumo por e-mail.

A chuva intensa é um indicador de risco. O Chuva Forte não prevê cheias nem substitui os avisos oficiais das autoridades de Moçambique.

## Funcionalidades

- Pesquisa por distrito sem distinção de maiúsculas ou acentos e filtro por província.
- Gráfico de sete dias com precipitação acumulada em mm/24h, probabilidade diária e nível de alerta.
- Cache em memória por distrito e cancelamento do pedido pendente ao mudar de distrito.
- Limite pessoal ajustável, com reclassificação imediata dos dias já carregados.
- Resumo por e-mail a pedido, enviado pelo EmailJS.
- Caderno demonstrativo de precipitação, com entradas manuais mantidas em memória enquanto a tela está aberta.

A aplicação usa Vue 3, Vite, Vue Router em modo hash e Tailwind CSS. É executada inteiramente no navegador.

## Executar localmente

Usa Node.js 22.18 ou superior na série 22, ou Node.js 24.12 ou superior. Na pasta do projeto, corre:

```bash
npm ci
npm run dev
```

Abre o endereço indicado pelo Vite. Com a porta padrão, o endereço é `http://localhost:5173/alerta-de-chuvas-fortes/`. A previsão e os filtros funcionam antes de configurar o envio de e-mail.

Para gerar e pré-visualizar a versão de produção:

```bash
npm run build
npm run preview
```

## Configurar o EmailJS

1. Em **Email Services**, liga um serviço de envio e copia o **Service ID**. [Configurar um serviço de envio](https://www.emailjs.com/docs/tutorial/adding-email-service/)
2. Em **Email Templates**, cria um modelo, deixa **Use Default Email Address** marcado e configura os campos abaixo. Depois de guardar, copia o **Template ID**. [Configurar um modelo](https://www.emailjs.com/docs/tutorial/creating-email-template/)
3. Na página **Account**, copia a **Public Key**. [Configuração da chave pública](https://www.emailjs.com/docs/sdk/options/#publickey)

| Campo do modelo | Valor |
| --- | --- |
| To Email | `{{to_email}}` |
| Subject | `Chuva Forte — {{distrito}} ({{provincia}})` |
| From Name | `Chuva Forte` |
| Content | `{{resumo}}` |

Também podes usar `{{limite}}` no modelo. Para preservar as quebras de linha num corpo HTML, coloca o resumo em `<pre style="white-space: pre-wrap;">{{resumo}}</pre>`.

Na raiz do projeto, copia [`.env.example`](.env.example) para `.env` e preenche as três variáveis. O `.env` é ignorado pelo Git.

```dotenv
VITE_EMAILJS_PUBLIC_KEY=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
```

Em **EmailJS → Domains**, permite a origem de teste, por exemplo `http://localhost:5173`. Guarda e reinicia o Vite. O resumo é enviado quando o utilizador clica em **Enviar resumo**. [Configurar as origens permitidas](https://www.emailjs.com/docs/faq/can-i-add-my-domain-to-allowlist/)

## Publicar no GitHub Pages

1. Em **Settings → Pages → Build and deployment**, seleciona **GitHub Actions** como origem da publicação.
2. Em **Settings → Secrets and variables → Actions → Variables**, cria as três variáveis do EmailJS com os mesmos nomes do `.env.example`.
3. Em **EmailJS → Domains**, adiciona `https://mardencastro.github.io`. O EmailJS compara a origem completa, incluindo a porta quando aplicável. A origem do GitHub Pages termina em `.github.io`. [Configuração de domínios do EmailJS](https://www.emailjs.com/docs/faq/can-i-add-my-domain-to-allowlist/)
4. O [workflow de publicação](.github/workflows/deploy-pages.yml) corre após um push para `master`. Também pode ser executado manualmente em **Actions → Publicar no GitHub Pages**. [Vite no GitHub Pages](https://vite.dev/guide/static-deploy#github-pages)

O endereço previsto para a publicação é [mardencastro.github.io/alerta-de-chuvas-fortes](https://mardencastro.github.io/alerta-de-chuvas-fortes/). Por exemplo, a previsão de Búzi usa o caminho `/alerta-de-chuvas-fortes/#/distrito/buzi`. O modo hash permite recarregar a página do distrito no alojamento estático. [Vue Router em modo hash](https://router.vuejs.org/guide/essentials/history-mode)

## Fontes e critérios

A previsão vem da API do Open-Meteo com o fuso horário `Africa/Maputo`. A probabilidade mostrada é a máxima diária disponibilizada pela API. O [catálogo de distritos](public/dados/distritos.json) contém coordenadas aproximadas do projeto. Confirma cada par de coordenadas numa fonte citável, como o GeoNames, antes de o usar como referência no BRD. [Open-Meteo Forecast API](https://open-meteo.com/en/docs)

A classificação da previsão segue o [critério definido pelo grupo](src/utils/classificar.js):

| Nível | Precipitação prevista |
| --- | --- |
| Normal | Abaixo de 60% do limite pessoal |
| Atenção | A partir de 60% e abaixo do limite pessoal |
| Alerta | Igual ou acima do limite pessoal |

## Estrutura do código

| Caminho | Responsabilidade |
| --- | --- |
| `src/views/` | Liga os dados às telas de início e de distrito |
| `src/components/` | Interface, gráfico, formulário e páginas auxiliares |
| `src/composables/` | Catálogo, previsões, envio de e-mail e registos manuais |
| `src/router.js` | Rotas da aplicação e página 404 |
| `public/dados/distritos.json` | Catálogo local dos distritos |

## Verificação manual

- [ ] Pesquisa `Chokwe` e escolhe uma província no filtro.
- [ ] Abre Búzi, muda de distrito e volta a Búzi. Confirma no separador **Network** que a app reutiliza a previsão em cache.
- [ ] Muda o limite e confirma que a classificação se atualiza sem um novo pedido.
- [ ] Com a rede cortada, abre um distrito ainda sem cache. Restabelece a ligação e escolhe **Tentar de novo**.
- [ ] Testa um endereço inválido. Com o EmailJS configurado, envia um resumo para uma caixa de teste autorizada e confirma a entrega.
- [ ] Abre `#/distrito/nao-existe` e verifica que a tela 404 é apresentada.

