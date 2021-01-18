<template>
  <Modal @close="close">
    <template slot="header">
      <h1>Máte nápady a připomínky?</h1>
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
          <input id="email" type="email" title="Prosím zadejte platnou emailovou adresu" required>
        </section>

        <section>
          <label>Zpětná vazba</label>
          <!-- TODO: should be textarea instead -->
          <input id="feedback"
            :title="`Prosím zadejte text, max. ${maxFeedbackSize} znaků`"
            :pattern="`/^.{1, ${maxFeedbackSize}}$/`" required>
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
      endpoint: '', // TODO: add endpoint
      maxFeedbackSize: 2000, // TODO: find appropriate max length
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
