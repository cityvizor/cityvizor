<template>
  <b-container>

    <b-row>
      <b-col class="text-center">
          <b-alert
              v-model="alertShown"
              class="position-fixed fixed-bottom m-0 rounded-0"
              style="z-index: 2000;"
              @click="alertShown = false"
              dismissible
          >
            Omlouváme se, nelze získat seznam apojených obcí, zkuste to prosím později
          </b-alert>
      </b-col>
    </b-row>

    <b-row v-if="loading && !error">
        <b-col>
          <div class="text-center">
            <b-spinner class="loading-right-margin"></b-spinner><span>Načítání...</span>
          </div>
        </b-col>
    </b-row>

    <div v-if="!loading && !error">
      <b-row>
        <h2>
          Zapojené obce
        </h2>
      </b-row>
      <b-row>
        <b-col v-for="city in cities" :key="city.name" class="city-item-margin-top text-justify" md="4" sm="6" xl="3">
          <b-row cols="12" no-gutters>
            <b-col class="city-item-icon-right-margin" cols="1">
              <img src="@/assets/images/pages/home/city_avatar.png">
            </b-col>
            <b-col cols="10">
              {{ city.name }}
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
import axios from "axios";

export default {
  name: 'ActiveCities',
  props: {},
  data() {
    return {
      cities: [],
      loading: true,
      error: false,
      alertShown: false
    }
  },
  mounted() {
    const params = { status: 'visible' }
    axios
        .get(this.cityVizorPublicBaseUrl, { params })
        .then((response) => this.cities = response.data )
        .catch((error) => {
          console.error(error) // eslint-disable-line
          this.alertShown = true
          this.error = true
        })
      .finally(() => this.loading = false )
  }
}
</script>

<style lang="scss">
@import '../../assets/styles/common/_variables.scss';

.city-item-margin-top {
  margin-top: $margin;
}

.city-item-icon-right-margin {
  margin-right: 4px;
}

.loading-right-margin {
  margin-right: 8px;
}

</style>
