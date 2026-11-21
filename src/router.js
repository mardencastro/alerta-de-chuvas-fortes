import { createRouter, createWebHashHistory } from 'vue-router'
import InicioView from './views/InicioView.vue'
import DistritoView from './views/DistritoView.vue'
import Limiares from './components/Limiares.vue'
import Pagina404 from './components/Pagina404.vue'
import Registo from './components/Registo.vue'
import Sobre from './components/Sobre.vue'

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', alias: '/distritos', name: 'distritos', component: InicioView },
    { path: '/distrito/:id', name: 'distrito', component: DistritoView },
    { path: '/distritos/buzi', redirect: { name: 'distrito', params: { id: 'buzi' } } },
    { path: '/limiares', name: 'limiares', component: Limiares },
    { path: '/registo', name: 'registo', component: Registo },
    { path: '/sobre', name: 'sobre', component: Sobre },
    { path: '/nao-encontrado', name: 'nao-encontrado', component: Pagina404 },
    { path: '/:pathMatch(.*)*', name: '404', component: Pagina404 },
  ],
  scrollBehavior(_, __, posicao) {
    return posicao ?? { top: 0 }
  },
})
