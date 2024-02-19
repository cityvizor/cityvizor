<template>
  <div>
    <Pending-popup ref="pendingPopup"></Pending-popup>
    <div v-if="loading">
      <b-row>
        <b-col>
          <div class="text-center">
            <b-spinner class="loading-right-margin"></b-spinner
            ><span>Načítání zapojených obcí...</span>
          </div>
        </b-col>
      </b-row>
    </div>
    <div v-if="!loading">
      <div v-for="section in sections" :key="section.sectionId" class="pb-4">
        <b-row>
          <h2>{{ section.sectionName }}</h2>
        </b-row>
        <b-row>
          <b-col
            v-for="profile in section.profiles"
            :key="profile.name"
            class="city-item-margin-top text-justify"
            md="4"
            sm="6"
            xl="3"
          >
            <b-row cols="12" no-gutters>
              <b-col class="city-item-icon-right-margin" cols="1">
                <a
                  v-if="profile.status == 'pending'"
                  class="fake-link"
                  @click="pendingPopup()"
                >
                  <img src="@/assets/images/pages/home/city_avatar.svg" />
                </a>
                <a
                  v-else-if="profile.childrenCount > 0"
                  :href="'/landing/profil-rozcestnik/' + profile.id"
                >
                  <img src="@/assets/images/pages/home/city_avatar.svg" />
                </a>
                <a
                  v-else
                  :target="profile.type == 'external' ? '_blank' : ''"
                  :href="profile.url"
                >
                  <img src="@/assets/images/pages/home/city_avatar.svg" />
                </a>
              </b-col>
              <b-col cols="10">
                <a
                  v-if="profile.status == 'pending'"
                  class="fake-link"
                  @click="pendingPopup()"
                >
                  <b class="pending">{{ profile.name }}</b>
                </a>
                <a
                  v-else-if="profile.childrenCount > 0"
                  class="fake-link"
                  :href="'/landing/profil-rozcestnik/' + profile.id"
                >
                  <b>{{ profile.name }}</b>
                </a>
                <a
                  v-else
                  :target="profile.type == 'external' ? '_blank' : ''"
                  :href="profile.url"
                >
                  <b>{{ profile.name }}</b>
                </a>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import PendingPopup from "./PendingPopup.vue";

export default {
  name: "ActiveCities",
  components: { PendingPopup },
  props: {},
  data() {
    return {
      sections: [],
      loading: true,
    };
  },
  mounted() {
    axios
      .get(`${this.apiBaseUrl}/public/profiles/sections`, {
        params: {
          status: "pending,visible",
          countChildren: true,
        },
      })
      .then(response => {
        (this.selectedCities = response.data.reduce(
          (acc, c) => ((acc[c.id] = false), acc),
          {}
        )),
          (this.sections = response.data
            .map(section => {
              const profiles = [];
              section.profiles.forEach(profile => {
                const p = {
                  url:
                    profile.type == "external"
                      ? profile.url
                      : `/${profile.url}`,
                  name: profile.name,
                  popupName: profile.popupName,
                  type: profile.type,
                  id: profile.id,
                  status: profile.status,
                  childrenCount: profile.childrencount,
                };
                profiles.push(p);
              });
              profiles.sort((a, b) => {
                return a.name.localeCompare(b.name, undefined, {
                  numeric: true,
                  sensitivity: "base",
                });
              });
              return {
                sectionName: section.section.csName,
                sectionId: section.section.sectionId,
                order: section.section.orderOnLanding,
                profiles: profiles,
              };
            })
            .sort((a, b) => b.orderOnLanding - a.orderOnLanding));
        this.loading = false;
      });
  },
  methods: {
    pendingPopup() {
      this.$refs.pendingPopup.pendingPopup();
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/common/_variables.scss";

a {
  color: #0645ad !important;
  text-decoration: none !important;
}
.city-item-margin-top {
  margin-top: 24px;
}
.city-item-icon-right-margin {
  margin-right: 8px;
  max-width: 64px;
}
.loading-right-margin {
  margin-right: 8px;
}

.selectCard {
  margin: 4px;
  position: relative;
  border-radius: 15px;
  border: 1px solid $primary;
}

.center {
  justify-content: center;
}

.children-list {
  text-align: left;
  list-style-type: disc;
}

.divider {
  border-color: $primary;
}

.fake-link {
  cursor: pointer;
}

.children-margin {
  margin-right: 15px;
  text-align: left;
}

.whole-screen {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.pending {
  color: grey !important;
}

.transparent-gray {
  background-color: gray;
  opacity: 0.1;
}
</style>
