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
                    <li v-for="item in primaryMenu" 
                        :key="item.id">
                        <router-link :to="{ name: 'page', params: { slug: item.page.Slug } }">
                            {{ item.page.Title }}
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
            <li v-for="item in primaryMenu" 
                :key="item.id">
                <router-link :to="{ name: 'page', params: { slug: item.page.Slug } }">
                    {{ item.page.Title }}
                </router-link>
            </li>
        </ul>
        <Hero v-show="isHome"
            :cms="cms"></Hero>
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
        cms: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    computed: {
        primaryMenu() {
            if (this.cms && this.cms.menus && this.cms.menus.primary) {
                return this.cms.menus.primary.Menuitem;
            }
            return [];
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
