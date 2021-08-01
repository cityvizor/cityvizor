<template>
  <div>
    <b-row v-if="loading">
        <b-col>
          <div class="text-center">
            <b-spinner class="loading-right-margin"></b-spinner><span>Načítání zapojených obcí...</span>
          </div>
        </b-col>
    </b-row>
    <div v-if="!loading">
      <b-row>
        <h2>
          Zapojené obce
        </h2>
      </b-row>
      <b-row>
        <b-col v-for="city in cities" :key="city.name" class="city-item-margin-top text-justify" md="4" sm="6" xl="3">
          <b-row cols="12" no-gutters>
              <b-col class="city-item-icon-right-margin" cols="1">
                <a class="fake-link" v-if="children[city.id].length > 0" v-on:click="selectCity(city.id)">
                  <img src="@/assets/images/pages/home/city_avatar.svg">
                </a>
                <a v-else :target="city.type == 'external' ? '_blank' : ''" :href="city.url">
                  <img src="@/assets/images/pages/home/city_avatar.svg">
                </a>
              </b-col>
              <b-col cols="10">
                <a class="fake-link" v-if="children[city.id].length > 0" v-on:click="selectCity(city.id)">
                  <b>{{ city.name }}</b>
                </a>
                <a v-else :target="city.type == 'external' ? '_blank' : ''" :href="city.url">
                  <b>{{ city.name }}</b>
                </a>
              </b-col>
          </b-row>
          <b-collapse v-model="selectedCities[city.id]">
            <b-card class="selectCard text-center">
              <b-card-text>
                <b-row class="center">
                  <a :target="city.type == 'external' ? '_blank' : ''" :href="city.url">
                    <u>Hospodaření obce</u>
                  </a>
                <hr class="w-100 divider"/>
                </b-row>
                <b-row>
                  <b>Příspěvkové organizace</b>
                </b-row>
                <b-row>
                  <ul>
                    <li v-for="child in children[city.id]" :key="child.id" class="children-list">
                      <a target="child.type == 'external' ? '_blank' : ''" :href="child.url">
                        {{child.name}}
                      </a>
                    </li>
                  </ul>
                </b-row>
              </b-card-text>
            </b-card>
          </b-collapse>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
export default {
  name: 'ActiveCities',
  props: {},
  data() {
    return {
      cities: [],
      loading: true,
      selectedCities: {},
      children: {}
    }
  },
  methods: {
    selectCity: function (id) {
      this.selectedCities[id] = !this.selectedCities[id];
    }
  },
  mounted() {
    axios.get(`${this.apiBaseUrl}/public/profiles`, { params: { status: "visible"}})
        .then((response) => {
          this.selectedCities = response.data.reduce((acc, c) => (acc[c.id] = false, acc), {}),
          
          // Create a dict where the key is the city id and the value is an array of it's childrens
          this.children = response.data.reduce((acc, c) => {
            acc[c.id] = response.data.filter(cc => cc.parent == c.id)
            return acc
          }, {});
          this.cities = response.data.map(city => {
              return {
                url: city.type == 'external' ? city.url : `/${city.url}`,
                name: city.name,
                type: city.type,
                id: city.id
              }
            }).sort((a, b) => {
            return a.name.localeCompare(b.name, undefined, {
              numeric: true,
              sensitivity: 'base'
            })
          })
          this.loading = false 
         })
  },
}
</script>

<style scoped lang="scss">
@import '../../assets/styles/common/_variables.scss';

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
</style>
