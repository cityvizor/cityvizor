<template>
  <b-container>

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
import {environment} from "../../../../client/src/environments/environment";

export default {
  name: 'ActiveCities',
  props: {},
  data() {
    return {
      cities: [],
      loading: true,
      error: false
    }
  },
  mounted() {
    const url = environment.api_root + "/public"
    const params = { status: 'visible' }
    axios
        .get(url, { params })
        .then((response) => this.cities = response.data )
        .catch((error) => {
          console.error(error) // eslint-disable-line
          this.error = true
          this.downloadFailed()
        })
      .finally(() => this.loading = false )
  },
  methods: {
    downloadFailed() {
      this.$toastr.e(
          {
            msg: 'Je nám líto, nepodařilo se získat seznam zapojených obcí, zkuste to prosím později',
            progressbar: false,
            timeout: 2500
          }
      )
    }
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
