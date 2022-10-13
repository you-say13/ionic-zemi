import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import Todo from '../views/TodoPage.vue';
import Create from '../views/CreateTodo.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/title'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
    props:{counter : 10}
  },
  {
    path: '/todo',
    name: 'todo',
    component: Todo,
    props: {Title: "Todo"}
  },
  {
    path: '/title',
    name: 'Title',
    component: () => import('@/views/TitlePage.vue')
  },
  {
    path: '/createTodo',
    name: 'create',
    component: Create,
    props: {Title: "CreateTodo"}
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
