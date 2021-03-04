<template>
  <Modal @close="close">
    <template slot="header">
      <h1>Napište nám, co můžeme zlepšit</h1>
    </template>

    <template slot="body">
      <ModalForm 
        :form-name="formName"
        :ref="formName"
        :endpoint="endpoint"
        @close="close"
      >
        <section>
          <label>Váš e-mail</label>
          <input id="email" pattern=".+@.+\..+" title="Prosím zadejte platnou emailovou adresu" required>
        </section>

        <section>
          <label>Zpětná vazba</label>
          <!-- TODO: should be textarea instead -->
          <input id="feedback"
            :title="`Prosím zadejte text, max. ${maxFeedbackSize} znaků`"
            :maxlength=maxFeedbackSize required>
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
  name: 'ModalFeedback',
  components: {
    Modal,
    ModalForm,
    ModalButton
  },
  data() {
    return {
      formName: 'feedback',
      endpoint: '/api/public/feedback',
      maxFeedbackSize: 2000
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