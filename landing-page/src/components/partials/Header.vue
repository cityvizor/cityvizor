<template>
    <header 
        class="l-header"
        :class="{ 'l-header__home': isHome }"
    >
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
                <ul class="c-menu">
                    <li v-for="route in routes" 
                        :key="route.path">
                        <router-link :to="route.path">
                            {{ route.name }}
                        </router-link>
                    </li>
                </ul>

                <!-- Hamburger -->
                <Hamburger 
                    :mobileMenuShow="mobileMenuShow"
                    @click="toggleMobileMenu"></Hamburger>

            </div>
        </nav>
        <ul class="c-menu--mobile"
            :class="[{ 'show' : mobileMenuShow }]">
            <li v-for="route in routes" 
                :key="route.path">
                <router-link :to="route.path">
                    {{ route.name }}
                </router-link>
            </li>
        </ul>
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
    },
    computed: {
        routes() {
            return this.$router.options.routes.filter(p => p.path != "/")
        }
    },
    data() {
        return {
            mobileMenuShow: false,
        }
    },
    methods: {
        toggleMobileMenu() {
            this.mobileMenuShow = !this.mobileMenuShow;
        },
        hideMobileMenu() {
            this.mobileMenuShow = false;
        }
    },
    watch: {
        '$route'() {
            this.hideMobileMenu();
        }
    }
}
</script>
