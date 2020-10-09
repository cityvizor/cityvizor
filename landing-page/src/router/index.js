import Vue from 'vue';
import Router from 'vue-router';
import WhyPage from '../components/pages/WhyPage'
import Home from '../components/pages/Home';

Vue.use(Router);

const routes = [
    {
        path: '/',
        component: Home,
        name: 'home'
    },
    { 
        path: '/proc-cityvizor', 
        component: WhyPage,
        name: 'Proč CityVizor?'
    },
]

export default new Router({
    mode: 'history',
    routes
})