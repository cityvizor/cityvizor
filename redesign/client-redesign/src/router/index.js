import Vue from 'vue';
import Router from 'vue-router';
import Page from './../components/pages/Page';
import Home from './../components/pages/Home';

Vue.use(Router);

const routes = [
    {
        path: '/',
        component: Home,
        name: 'home'
    },
    { 
        path: '/:slug', 
        component: Page,
        name: 'page'
    },
]

export default new Router({
    mode: 'history',
    routes
})