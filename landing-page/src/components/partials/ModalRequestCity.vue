<template>
  <Modal @close="close">
    <template #header>
      <h1>Chcete Cityvizor i ve vaší obci?</h1>
      <h2>Vyplněním následujícího formuláře nám o tom dáte vědět.</h2>
    </template>

    <template #body>
      <ModalForm
        :ref="formName"
        :form-name="formName"
        :endpoint="endpoint"
        @close="close"
      >
        <section>
          <label>Obec</label>
          <input id="city" title="Prosím zadejte název obce" required />
        </section>

        <section>
          <label>PSČ</label>
          <input
            id="psc"
            title="Prosím zadejte PSČ ve správném formátu"
            pattern="\d{5}"
            required
          />
        </section>

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
          <label>Vaše jméno</label>
          <input id="name" title="Prosím zadejte Vaše jméno" required />
          <div>
            Vaše jméno můžeme uvést v seznamu zájemců o Cityvizor při jednání s
            vedením obce.
          </div>
        </section>

        <section class="checkbox">
          <input id="subscribe" type="checkbox" />
          <label for="subscribe"
            >Chci dostávat informace o propojení mé obce a Cityvizoru</label
          >
        </section>

        <section class="checkbox">
          <input
            id="gdpr"
            type="checkbox"
            title="Souhlas je povinný"
            required
          />
          <label for="gdpr">Souhlasím se zpracováním osobních údajů</label>
        </section>
      </ModalForm>
    </template>

    <template slot="footer">
      <ModalButton label="Odeslat" @clicked="trySubmit" />
    </template>
  </Modal>
</template>

<script>
import Modal from "./Modal";
import ModalForm from "./ModalForm";
import ModalButton from "./ModalButton";

export default {
  name: "ModalRequestCity",
  components: {
    Modal,
    ModalForm,
    ModalButton,
  },
  data() {
    return {
      formName: "requestCity",
      endpoint: "/api/public/feedback/requestcity",
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
