import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import Todo from '../views/TodoPage.vue';
import Create from '../views/CreateTodo.vue';
import Desc from '../views/TodoDesc.vue';
import Signup from '../views/SignupPage.vue';
import Signin from '../views/SigninPage.vue';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/signin'
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
  },
  {
    path: '/desc',
    name: 'desc',
    component: Desc,
    props:{Title: "Desc"}
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup,
    props:{Title: "Signup"}
  },
  {
    path: '/signin',
    name: 'signin',
    component: Signin,
    props:{Title: "Signin"}
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
