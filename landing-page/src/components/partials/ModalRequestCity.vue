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
        :endpoint="endpoint"
        @close="close"
      >
        <section>
          <label>Obec</label>
          <input id="city" title="Prosím zadejte název obce" required>
        </section>

        <section>
          <label>PSČ</label>
          <input id="psc" title="Prosím zadejte PSČ ve správném formátu" pattern="\d{5}" required>
        </section>

        <section>
          <label>Váš e-mail</label>
          <input id="email" type="email" title="Prosím zadejte platnou emailovou adresu" required>
        </section>

        <section>
          <label>Vaše jméno</label>
          <input id="name" title="Prosím zadejte Vaše jméno" required>
          <div>Vaše jméno můžeme uvést v seznamu zájemců o Cityvizor při jednání s vedením obce</div>  
        </section>

        <section class="checkbox">
          <input id="subscribe" type="checkbox">
          <label for="subscribe">Chci dostávat informace o propojení mé obce a Cityvizoru</label>
        </section>
        
        <section class="checkbox">
          <input id="gdpr" type="checkbox" title="Souhlas je povinný"required>
          <label for="gdpr">Souhlasím se zpracováním osobních údajů</label>
        </section>
      </ModalForm>
    </template>
    
    <template slot="footer">
      <ModalButton @clicked="trySubmit" label="Odeslat"/>
    </template>
  </Modal>
</template>

<script>
import Modal from './Modal'
import ModalForm from './ModalForm'
import ModalButton from './ModalButton'

export default {
  name: "ModalRequestCity",
  components: {
    Modal,
    ModalForm,
    ModalButton
  },
  data() {
    return {
      formName: 'requestCity',
      endpoint: 'https://cityvizor.cesko.digital/api/v2/service/cityrequest',
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
