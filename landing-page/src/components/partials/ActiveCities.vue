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
            <div v-on:click="selectCity(city.id)" class = "whole-screen" style="z-index:1"></div>
            <b-card class="selectCard text-center" style="z-index:2" >
              <b-card-text>
                <b-row class="center">
                  <a v-if="city.type !== 'empty'" :target="city.type == 'external' ? '_blank' : ''" :href="city.url">
                    <b>{{ city.name }}</b>
                  </a>
                  <b v-else>{{ city.name }}</b>
                <hr class="w-100 divider"/>
                </b-row>
                <b-row align-h="between">
                  <div v-if="filterType(children[city.id], 'municipality').length" class="children-margin">
                    <b-row>
                      <b>Městské obvody</b>
                    </b-row>
                    <b-row>
                      <ul>
                        <li v-for="child in filterType(children[city.id], 'municipality')" :key="child.id" class="children-list">
                          <a target="child.type == 'external' ? '_blank' : ''" :href="child.url">
                            {{child.name}}
                          </a>
                        </li>
                      </ul>
                    </b-row>
                  </div>
                  <div v-if="filterType(children[city.id], 'pbo').length" class="children-margin">
                    <b-row>
                      <b>Příspěvkové organizace</b>
                    </b-row>
                    <b-row>
                      <ul>
                        <li v-for="child in filterType(children[city.id], 'pbo')" :key="child.id" class="children-list">
                          <a target="child.type == 'external' ? '_blank' : ''" :href="child.url">
                            {{child.name}}
                          </a>
                        </li>
                      </ul>
                    </b-row>
                  </div>
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
    },
    filterType(arr, type) {
      return arr.filter(city => city.type == type);
    }
  },
  mounted() {
    axios.get(`${this.apiBaseUrl}/public/profiles`, {params: { status: "visible,preview"} })
        .then((response) => {
          this.selectedCities = response.data.reduce((acc, c) => (acc[c.id] = false, acc), {}),
          
          // Create a dict where the key is the city id and the value is an array of it's childrens
          this.children = response.data.reduce((acc, c) => {
            acc[c.id] = response.data.filter(cc => cc.parent == c.id)
            return acc
          }, {});
          this.cities = response.data.filter(city =>
              city.status == "visible"
          ).map(city => {
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


.children-margin {
  margin-right: 15px;
  text-align: left;
}

.whole-screen {
  position:fixed;
  left:0;
  top:0;
  right:0;
  bottom:0;
}

</style>
