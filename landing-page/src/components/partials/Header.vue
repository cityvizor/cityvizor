<template>
    <header>
        <nav 
        class="navigation-bar align-items-center" 
        role="navigation" 
        aria-label="Main">
            <div class="col-4 col-md-4">

                <!-- Brand -->
                <router-link class="header-logo" to="/">
                    <img 
                    src="./../../assets/images/logo.svg" 
                    width="280" 
                    alt="CityVizor.cz - logo">
                </router-link>

            </div>
            <div class="col-8 col-md-8 text-right">

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
    </header>
</template>

<script>
import Hamburger from './Hamburger';

export default {
    name: 'ComponentsPartialsHeader',
    components: {
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
            return this.$router.options.routes.filter(p => p.name && p.path != "/")
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

<style lang="scss">
@import '../../assets/styles/main.scss';
.navigation-bar {
    position: relative;
    z-index: 2;
    padding: 40px 50px;
    display: flex;
}

.underline {
    text-decoration: underline $primary;
}

</style>
