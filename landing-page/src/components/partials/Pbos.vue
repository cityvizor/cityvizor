<template>
  <div class="container">
    <Pending-popup ref="pendingPopup"></Pending-popup>
    <h2>Příspěvkové organizace</h2>
    <div>
      <b-row class="mt-lg-3">
        <b-col class="mr-3">
          <b-form-input
            v-model="filter"
            placeholder="Hledejte dle názvu"
            class="mb-3"
          ></b-form-input>
        </b-col>
        <b-col>
          <b-form-select
            v-model="selectedCategory"
            :options="categories"
            placeholder="Filtrujte dle kategorie"
            class="mb-3"
            ><b-form-select-option :value="null" class="placeholder"
              >Všechny kategorie</b-form-select-option
            >
          </b-form-select>
        </b-col>
      </b-row>
      <b-table
        thead-class="table-header-green"
        hover
        borderless
        small
        :items="itemsFilteredByCategory"
        :fields="fields"
        :filter-included-fields="filterOn"
        :filter="filter"
        responsive="sm"
      >
        <template #cell(name)="data">
          <a
            class="fake-link pending"
            v-if="data.item.status == 'pending'"
            v-on:click="pendingPopup()"
            >{{ data.value }}</a
          >
          <a v-else :href="`/${data.item.url}`">{{ data.value }}</a>
        </template>
      </b-table>
      <div></div>
    </div>
  </div>
</template>

<script>
import PendingPopup from "./PendingPopup.vue";

export default {
  components: { PendingPopup },
  name: "ProfileSelectionPage",
  props: {
    pbos: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      fields: [
        { key: "name", label: "Název", sortable: true },
        { key: "category", label: "Kategorie", sortable: true },
      ],
      items: [],
      categories: [],
      filter: "",
      filterOn: ["name"],
      selectedCategory: null,
    };
  },
  methods: {
    pendingPopup() {
      this.$refs.pendingPopup.pendingPopup();
    },
  },
  mounted() {
    this.items = this.pbos.map((pbo) => {
      return {
        name: pbo.name,
        url: pbo.url,
        status: pbo.status,
        category: pbo.pboCategoryCsName ?? "Nezařazeno",
        categoryId: pbo.pboCategoryId ?? 1,
      };
    });
    this.categories = [
      ...new Map(
        this.pbos.map((pbo) => [
          pbo.pboCategoryId,
          {
            text: pbo.pboCategoryCsName,
            value: { id: pbo.pboCategoryId, csName: pbo.pboCategoryCsName },
          },
        ])
      ).values(),
    ]; // create set of categories
  },
  computed: {
    itemsFilteredByCategory: function () {
      if (this.selectedCategory === null) {
        return this.items;
      }
      return this.items.filter(
        item => item.categoryId === this.selectedCategory.id
      );
    },
  },
};
</script>

<style lang='scss'>
.table-header-green {
  border-bottom: 2px solid rgb(112, 204, 148);
  font-weight: 700;
}

.pending {
  color: grey !important;
}

.fake-link {
  cursor: pointer;
}
</style>