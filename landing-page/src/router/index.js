import Vue from 'vue';
import Router from 'vue-router';
import WhyPage from '../components/pages/WhyPage'
import MarkdownPage from '../components/pages/MarkdownPage'
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
        name: 'Proč Cityvizor?'
    },
    {
        path: '/o-aplikaci',
        component: MarkdownPage,
        name: 'O aplikaci',
        props: {
            mdFileName: 'about'
        }
    },
    {
        path: '/dokumentace',
        component: MarkdownPage,
        name: 'Dokumentace',
        props: {
            mdFileName: 'documentation'
        }
    },
    {
        path: '/data',
        component: MarkdownPage,
        name: 'Data',
        props: {
            mdFileName: 'data'
        }
    },
    {
        path: '/kontakt',
        component: MarkdownPage,
        name: 'Kontakt',
        props: {
            mdFileName: 'contact'
        }
    }
]

export default new Router({
    mode: 'history',
    routes
})