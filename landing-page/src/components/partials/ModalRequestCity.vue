<template>
  <Modal @close="close">
    <template slot="header">
      <h1>Chcete Cityvizor i ve Vaší obci?</h1>
      <h2>Dejte nám vědět a my to s vedením obce vyřídíme za Vás.</h2>
    </template>

    <template slot="body">
      <ModalForm 
        :form-name="formName"
        :ref="formName"
        endpoint="https://cityvizor.cesko.digital/api/v2/service/cityrequest"
        @close="close"
      >
        <section>
          <label>Obec</label>
          <label readonly>{{ `${city.hezkyNazev} (PSČ ${city.adresaUradu.PSC})` }}</label>
          <input id="city" type="hidden" :value="city.hezkyNazev">
          <input id="psc" type="hidden" :value="city.adresaUradu.PSC">
        </section>

        <section>
          <label for="email">Email</label>
          <input id="email" type="email" placeholder="Váš email" title="Prosím vyplňte platnou emailovou adresu." required>
        </section>

        <section>
          <label for="name">Jméno</label>
          <input id="name" type='text' placeholder='Vaše jméno'>
          <div>Vaše jméno můžeme uvést v seznamu zájemců o Cityvizor při jednání s vedením obce</div>  
        </section>

        <section class="checkbox">
          <input id="subscribe" type="checkbox">
          <label for="subscribe">Chci dostávat informace o propojení mojí obce a Cityvizoru</label>
        </section>
        
        <section class="checkbox">
          <input id="gdpr" type="checkbox">
          <label for="gdpr">Souhlasím se zpracováním osobních údajů a jejich poskytnutím obci</label>
        </section>
      </ModalForm>
    </template>
    
    <template slot="footer">
      <button @click="trySubmit">Chci Cityvizor</button>
    </template>
  </Modal>
</template>

<script>
import Modal from './Modal'
import ModalForm from './ModalForm'

export default {
  name: "ModalRequestCity",
  components: {
    Modal,
    ModalForm
  },
  props: {
    city: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formName: 'requestCity',
    }
  },
  methods: {
    trySubmit () {
      this.$refs[this.formName].onSubmit()
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
