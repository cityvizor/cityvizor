<template>
  <div class="container">
    <h2>Příspěvkové organizace</h2>
    <div>
      <b-form-input
        v-model="filter"
        placeholder="Hledejte dle názvu"
        class="mb-3"
      ></b-form-input>
      <b-table
        thead-class="table-header-green"
        hover
        borderless
        small
        :items="items"
        :fields="fields"
        :filter="filter"
        responsive="sm"
      >
        <template #cell(name)="data">
          <!-- `data.value` is the value after formatted by the Formatter -->
          <a :href="`/${data.value.Url}`">{{ data.value.Name }}</a>
        </template>
      </b-table>
      <div>
    <ul>
      <li v-for="cat in categories" :key="cat.id">
        {{ cat }}
      </li>
    </ul>
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
        { key: "Status", sortable: true },
      ],
      items: [],
      categories: [],
      filter: '',
    };
  },
  methods: {},
  mounted() {
    this.items = this.pbos.map((pbo) => {
      return { Name: { Name: pbo.name, Url: pbo.url }, Status: pbo.status };
    });
    this.categories = [... new Map(this.pbos.map(pbo => [pbo.categoryId, {id: pbo.categoryId, csName: pbo.categoryCsName}])).values()]; // create set of categories 
  },
};
</script>

<style lang='scss'>
.table-header-green {
  border-bottom: 2px solid rgb(112, 204, 148);
  font-weight: 700;
}
</style>