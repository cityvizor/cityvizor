import Vue from 'vue';
import Router from 'vue-router';
import WhyPage from '../components/pages/WhyPage'
import AboutAppPage from '../components/pages/AboutAppPage'
import ContactPage from '../components/pages/ContactPage'
import AboutUsPage  from '../components/pages/AboutUsPage'
import DocumentationPage from "../components/pages/DocumentationPage"
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
        component: AboutAppPage,
        name: 'O aplikaci',
    },
    {
        path: '/kontakt',
        component: ContactPage,
        name: 'Kontakt'
    },
    {
        path: '/o-nas',
        component: AboutUsPage,
        name: 'O nás'
    },
    {
        path: '/dokumentace',
        component: DocumentationPage,
    }
]

export default new Router({
    mode: 'history',
    routes,
    base: process.env.VUE_PUBLIC_PATH || "/landing"
})