<template>
  <div class="container">
    <h2>Příspěvkové organizace</h2>
    <div>
      <b-row>
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
        class="mb-3"><b-form-select-option :value="null" class="placeholder">Všechny kategorie</b-form-select-option>
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
        :filter="filter"
        responsive="sm"
      >
        <template #cell(name)="data">
          <a :href="`/${data.value.Url}`">{{ data.value.Name }}</a>
        </template>
      </b-table>
      <div>
  </div>
    </div>
  </div>
  
</template>

<script>
export default {
  name: "ProfileSelectionPage",
  props: {
    pbos: {
      type: Array,
      required: true,
    },
  },
  data() { // todo: pending popup
    return {
      fields: [
        { key: "Name", label: "Název", sortable: true },
        { key: "Category", label:"Kategorie", sortable: true },
      ],
      items: [],
      categories: [],
      filter: '',
      selectedCategory: null
    };
  },
  methods: {},
  mounted() {
    this.items = this.pbos.map((pbo) => {
      return { Name: { Name: pbo.name, Url: pbo.url }, Category: pbo.categoryCsName, CategoryId: pbo.categoryId };
    });
    this.categories = [... new Map(this.pbos.map(pbo => [pbo.categoryId, {text: pbo.categoryCsName, value: {id: pbo.categoryId, csName: pbo.categoryCsName}}])).values()]; // create set of categories 
  },
  computed: {
    itemsFilteredByCategory: function(){
      if(this.selectedCategory === null){
        return this.items;
      }
      return this.items.filter((pbo) => pbo.CategoryId === this.selectedCategory.id)
    }
  }
};
</script>

<style lang='scss'>
.table-header-green {
  border-bottom: 2px solid rgb(112, 204, 148);
  font-weight: 700;
}
</style>