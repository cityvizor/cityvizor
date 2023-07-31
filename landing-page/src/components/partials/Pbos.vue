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
  data() {
    return {
      fields: [
        { key: "Name", label: "Název", sortable: true },
        { key: "Status", sortable: true },
      ],
      items: [],
      filter: '',
    };
  },
  methods: {},
  mounted() {
    this.items = this.pbos.map((pbo) => {
      return { Name: { Name: pbo.name, Url: pbo.url }, Status: pbo.status };
    });
  },
};
</script>

<style lang='scss'>
.table-header-green {
  //background-color: rgb(112,204,148);
  border-bottom: 2px solid rgb(112, 204, 148);
  font-weight: 700;
}
</style>