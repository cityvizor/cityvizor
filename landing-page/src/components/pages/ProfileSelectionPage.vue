<template>
  <div>
    <div class="container">
      <b-row v-if="loading">
        <b-col>
          <div class="text-center">
            <b-spinner class="loading-right-margin"></b-spinner
            ><span>Načítání zapojených obcí...</span>
          </div>
        </b-col>
      </b-row>
      <div v-if="!loading">
        <b-row>
          <h1 class="underlined">
            {{ this.profile.name }}
          </h1>
        </b-row>
        <b-row align-v="center" class="mb-3">
          <b-col class="city-item-icon-right-margin" cols="1">
            <a
              :target="profile.type == 'external' ? '_blank' : ''"
              :href="'/' + profile.url"
            >
              <img
                width="64"
                src="@/assets/images/pages/home/city_avatar.svg"
              />
            </a>
          </b-col>
          <b-col>
            <a
              :target="profile.type == 'external' ? '_blank' : ''"
              :href="'/' + profile.url"
            >
              <b class="ml-2 type-lg font-weight-bold">{{
                this.profile.popupName
              }}</b>
            </a>
          </b-col>
        </b-row>
        <Municipalities v-if="municipatilies.length > 0" :municipatilies="municipatilies" class="mt-lg-4"></Municipalities>
        <Pbos v-if="pbos.length > 0" :pbos="pbos" class="mt-lg-4"></Pbos>
      </div>
    </div>
  </div>
</template>

<script>
import Municipalities from "../partials/Municipalities.vue";
import Pbos from "../partials/Pbos.vue";
import axios from "axios";

export default {
  components: { Municipalities, Pbos },
  name: "ProfileSelectionPage",
  data() {
    return {
      id: 0,
      loading: true,
      profile: null,
      pbos: [],
      municipatilies: [],
    };
  },
  methods: {},
  mounted() {
    this.id = Number(this.$route.params.id);
    axios
      .get(`${this.apiBaseUrl}/public/profiles/${this.id}/children`, {
        params: { status: "pending,visible" },
      })
      .then((response) => {
        let sortedData = response.data.children.sort((a, b) => {
          return a.name.localeCompare(b.name, undefined, {
            numeric: true,
            sensitivity: "base",
          });
        });

        this.profile = response.data.parent;
        this.pbos = sortedData.filter((profile) => profile.type == "pbo");
        this.municipatilies = sortedData.filter(
          (profile) => profile.type == "municipality"
        );
        this.loading = false;
      });
  },
};
</script>

<style lang='scss'>
a {
  color: #0645ad !important;
  text-decoration: none !important;
}

.city-item-icon-right-margin {
  margin-right: 8px;
  max-width: 64px;
}
.loading-right-margin {
  margin-right: 8px;
}
</style>