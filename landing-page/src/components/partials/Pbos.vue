<template>
  <div class="container">
    <Pending-popup ref="pendingPopup"></Pending-popup>
    <h2>Příspěvkové organizace</h2>
    <div>
      <b-row class="mt-lg-3">
        <b-col cols="12" md class="mr-md-3">
          <label class="sr-only" for="pbo-name-filter">
            Hledat organizaci
          </label>
          <b-form-input
            id="pbo-name-filter"
            v-model="filter"
            placeholder="Hledejte dle názvu"
            class="mb-3"
          ></b-form-input>
        </b-col>
        <b-col cols="12" md class="mr-md-3">
          <label class="sr-only" for="pbo-category-filter">Kategorie</label>
          <b-form-select
            id="pbo-category-filter"
            v-model="selectedCategory"
            :options="categories"
            placeholder="Filtrujte dle kategorie"
            class="mb-3"
          >
          </b-form-select>
        </b-col>
        <b-col cols="12" md>
          <label class="sr-only" for="pbo-parent-filter">Zřizovatel</label>
          <b-form-select
            id="pbo-parent-filter"
            v-model="selectedParent"
            :options="parents"
            placeholder="Filtrujte dle zřizovatele"
            class="mb-3"
          >
          </b-form-select>
        </b-col>
      </b-row>
      <b-table
        thead-class="table-header-green"
        hover
        borderless
        small
        :items="itemsFilteredByCategoryAndParent"
        :fields="fields"
        :filter-included-fields="filterOn"
        :filter="filter"
        responsive="md"
      >
        <template #cell(name)="data">
          <a
            v-if="data.item.status == 'pending'"
            class="fake-link pending"
            @click="pendingPopup()"
            >{{ data.value }}</a
          >
          <a v-else :href="profileUrl(data.item.url)">{{ data.value }}</a>
          <span
            v-if="data.item.hasPayments === true"
            class="ml-2 badge badge-pill badge-success"
          >
            Zveřejňuje faktury
          </span>
        </template>
      </b-table>
      <div></div>
    </div>
  </div>
</template>

<script>
import PendingPopup from "./PendingPopup.vue";

const allCategoriesOption = { id: "", csName: null };
const allParentsOption = { parentId: "", parentName: null };

export default {
  name: "ProfileSelectionPage",
  components: { PendingPopup },
  props: {
    pbos: {
      type: Array,
      required: true,
    },
    selectionProfileId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      fields: [
        { key: "name", label: "Název", sortable: true },
        { key: "category", label: "Kategorie", sortable: true },
        { key: "parentName", label: "Zřizovatel", sortable: true },
      ],
      items: [],
      categories: [],
      filter: "",
      filterOn: ["name"],
      selectedCategory: allCategoriesOption,
      parents: [],
      selectedParent: allParentsOption,
      filtersReady: false,
    };
  },
  watch: {
    filter: "saveFilters",
    selectedCategory: "saveFilters",
    selectedParent: "saveFilters",
  },
  computed: {
    itemsFilteredByCategoryAndParent: function () {
      let filteredItems = this.items;
      if ((this.selectedCategory?.id ?? "") !== "") {
        filteredItems = filteredItems.filter(
          item => item.categoryId === this.selectedCategory.id
        );
      }
      if ((this.selectedParent?.parentId ?? "") !== "") {
        filteredItems = filteredItems.filter(
          item => item.parentId === this.selectedParent.parentId
        );
      }

      return filteredItems;
    },
  },
  mounted() {
    this.items = this.pbos.map(pbo => {
      return {
        name: pbo.name,
        url: pbo.url,
        status: pbo.status,
        category: pbo.pboCategoryCsName ?? "Nezařazeno",
        categoryId: pbo.pboCategoryId ?? "unclassified",
        parentName: pbo.parentName,
        parentId: pbo.parent,
        hasPayments: pbo.hasPayments,
      };
    });

    this.categories = [
      { text: "Všechny kategorie", value: allCategoriesOption }, // Add default option
      ...new Map(
        // Create set of categories
        this.items.map(pbo => [
          pbo.categoryId,
          {
            text: pbo.category,
            value: { id: pbo.categoryId, csName: pbo.category },
          },
        ])
      ).values(),
    ].sort((a, b) => a.value.id >= b.value.id); // Sort by id
    this.parents = [
      { text: "Všichni zřizovatelé", value: allParentsOption },
      ...new Map(
        this.items.map(profile => [
          profile.parentId,
          {
            text: profile.parentName,
            value: {
              parentId: profile.parentId,
              parentName: profile.parentName,
            },
          },
        ])
      ).values(),
    ];
    this.restoreFilters();
    this.filtersReady = true;
  },
  methods: {
    profileUrl(url) {
      return `/${url};selectionProfile=${this.selectionProfileId}`;
    },
    saveFilters() {
      if (!this.filtersReady) return;
      try {
        sessionStorage.setItem(
          this.filterStorageKey(),
          JSON.stringify({
            name: this.filter,
            categoryId: this.selectedCategory?.id ?? "",
            parentId: this.selectedParent?.parentId ?? "",
          })
        );
      } catch {
        // Filtering remains usable when session storage is unavailable.
      }
    },
    restoreFilters() {
      try {
        const stored = JSON.parse(
          sessionStorage.getItem(this.filterStorageKey()) ?? "null"
        );
        if (!stored) return;

        this.filter = typeof stored.name === "string" ? stored.name : "";
        this.selectedCategory =
          this.categories.find(option => option.value.id === stored.categoryId)
            ?.value ?? allCategoriesOption;
        this.selectedParent =
          this.parents.find(option => option.value.parentId === stored.parentId)
            ?.value ?? allParentsOption;
      } catch {
        // Ignore invalid or unavailable session storage.
      }
    },
    filterStorageKey() {
      return `cityvizor.profileSelection.${this.selectionProfileId}.filters`;
    },
    pendingPopup() {
      this.$refs.pendingPopup.pendingPopup();
    },
  },
};
</script>

<style lang="scss">
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
