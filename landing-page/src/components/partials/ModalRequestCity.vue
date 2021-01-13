<template>
  <Modal @close="close">
    <template slot="header">
      <h1>Chcete Cityvizor i ve Vaší obci?</h1>
      <h2>Vyplněním následujícího formuláře nám o tom dáte vědět.</h2>
    </template>

    <template slot="body">
      <ModalForm 
        :form-name="formName"
        :ref="formName"
        endpoint="https://cityvizor.cesko.digital/api/v2/service/cityrequest"
        @close="close"
      >
        <section>
          <input id="city" required>
          <label>Obec</label>
        </section>

        <section>
          <input id="psc" required>
          <label>PSČ</label>
        </section>

        <section>
          <input id="email" type="email" title="Prosím vyplňte platnou emailovou adresu." required>
          <label>Váš e-mail</label>
        </section>

        <section>
          <input id="name" type='text' required>
          <label>Vaše jméno</label>
          <div>Vaše jméno můžeme uvést v seznamu zájemců o Cityvizor při jednání s vedením obce</div>  
        </section>

        <section class="checkbox">
          <input id="subscribe" type="checkbox">
          <label for="subscribe">Chci dostávat informace o propojení mé obce a Cityvizoru</label>
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
