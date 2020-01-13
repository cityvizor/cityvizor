<template>
    <header 
        class="l-header">
        <nav 
        class="navbar row align-items-center" 
        role="navigation" 
        aria-label="Main">
            <div class="col-10 col-md-6">

                <!-- Brand -->
                <router-link to="/"
                    class="c-brand">
                    <img 
                    src="./../../assets/images/logo.svg" 
                    width="280" 
                    height="73" 
                    alt="CityVizor.cz - logo">
                </router-link>

            </div>
            <div class="col-2 col-md-6 text-right">

                <!-- Menu: Primary -->
                <ul class="c-menu"
                    :class="[{ 'show' : mobileMenuShow }]">
                    <li><router-link to="/proc-cityvizor">Proč Cityvizor</router-link></li>
                    <li><router-link to="/jak-zapojit-obci">Jak zapojit obci</router-link></li>
                    <li><router-link to="/kontakt">O nás / kontakt</router-link></li>
                </ul>

                <!-- Hamburger -->
                <Hamburger 
                    :mobileMenuShow="mobileMenuShow"
                    @click="toggleMobileMenu"></Hamburger>

            </div>
        </nav>
        <Hero v-show="isHome"></Hero>
    </header>
</template>

<script>
import Hero from './Hero.vue'
import Hamburger from './Hamburger';

export default {
    name: 'ComponentsPartialsHeader',
    components: {
        Hero,
        Hamburger
    },
    props: {
        isHome: {
            type: Boolean,
            default: false,
        },
        mobileMenuShow: {
            type: Boolean,
            default: false,
        }
    },
    methods: {
        toggleMobileMenu() {
            console.log(this.mobileMenuShow); // eslint-disable-line
            this.mobileMenuShow = !this.mobileMenuShow;
        }
    }
}
</script>
