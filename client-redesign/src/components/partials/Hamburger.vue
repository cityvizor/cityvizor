<template>
    <button
        class="c-hamburger btn btn--hamburger"
        :class="[{ 'opened' : mobileMenuShow }]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30" height="30" focusable="false">
            <title>Menu</title>
            <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" d="M4 7h22M4 15h22M4 23h22"></path>
        </svg>
    </button>
</template>

<script>
export default {
    name: 'ComponentsPartialsHamburger',
    props: {
        mobileMenuShow: {
            type: Boolean,
            default: false,
        }
    }
}
</script>