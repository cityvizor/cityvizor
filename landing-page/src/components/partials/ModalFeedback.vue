<template>
  <Modal @close="close">
    <template #header>
      <h1>Napište nám, co můžeme zlepšit.</h1>
    </template>

    <template #body>
      <ModalForm
        :ref="formName"
        :form-name="formName"
        :endpoint="endpoint"
        @close="close"
      >
        <section>
          <label>Váš e-mail</label>
          <input
            id="email"
            pattern=".+@.+\..+"
            title="Prosím zadejte platnou emailovou adresu"
            required
          />
        </section>

        <section>
          <label>Zpětná vazba</label>
          <!-- TODO: should be textarea instead -->
          <input
            id="feedback"
            :title="`Prosím zadejte text, max. ${maxFeedbackSize} znaků`"
            :maxlength="maxFeedbackSize"
            required
          />
        </section>
      </ModalForm>
    </template>

    <template #footer>
      <ModalButton label="Odeslat" @clicked="trySubmit" />
    </template>
  </Modal>
</template>

<script>
import Modal from "./Modal";
import ModalForm from "./ModalForm";
import ModalButton from "./ModalButton";

export default {
  name: "ModalFeedback",
  components: {
    Modal,
    ModalForm,
    ModalButton,
  },
  data() {
    return {
      formName: "feedback",
      endpoint: "/api/public/feedback",
      maxFeedbackSize: 2000,
    };
  },
  methods: {
    trySubmit() {
      this.$refs[this.formName].onSubmit();
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>
