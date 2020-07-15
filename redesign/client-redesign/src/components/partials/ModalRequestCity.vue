<template>
  <Modal @close="close">
    <div slot="header">
      <div>Chcete Cityvizor i ve Vaší obci?</div>
      <div>Dejte nám vědět a my to s vedením obce vyřídíme za Vás.</div>
    </div>

    <div slot="body">
      <section>
        <label>Obec</label>
        <label class="readonly">{{ municipality.hezkyNazev }}</label>
      </section>

      <section>
        <label for="email">Email <span class="required">*</span></label>
        <input 
          id="email"
          type="text"
          placeholder="Váš email"
          v-model="modalData.email">
      </section>

      <section>
        <label for="name">Jméno</label>
        <input 
          id='name'
          type='text'
          placeholder='Vaše jméno'
          v-model="modalData.name">
        <div>Vaše jméno můžeme uvést v seznamu zájemců o Cityvizor při jednání s vedením obce</div>  
      </section>

      <section class="checkbox">
        <input type="checkbox"
          v-model="modalData.subscribe"
          id="subscribe">
        <label for="subscribe">Chci dostávat informace o propojení mojí obce a Cityvizoru</label>
      </section>
      
      <section class="checkbox">
        <input type="checkbox"
          v-model="modalData.gdpr"
          id="gdpr">
        <label for="gdpr">Souhlasím se zpracováváním osobních údajů a jejich poskytnutím obci</label>
      </section>

      <div :class="[{ hidden: !hasErrors }, 'error']">{{ errors[0] }}</div>
    </div>
    
    <div slot="footer">
      <button
        value="Chci Cityvizor"
        @click="submit">Chci Cityvizor</button>
    </div>
  </Modal>
</template>

<script>
import axios from 'axios'
import Modal from './Modal'

// TODO: add global `axios` to `main.js`
// TODO: update `apiBaseUrl` in `main.js` and build this Url from it
const requestCityUrl = 'https://cityvizor.cesko.digital/api/v2/service/cityrequest';

export default {
  name: "ModalRequestCity",
  components: {
    Modal
  },
  props: {
    municipality: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      errors: [],
      modalData: {
        city: '',
        email: '',
        name: '',
        subscribe: false,
        gdpr: false
      }
    }
  },
  computed: {
    hasErrors() {
      return this.errors.length > 0
    }
  },
  methods: {
    submit() {
      this.validateForm()
      if (this.hasErrors) return

      this.modalData.city = this.municipality.hezkyNazev
      axios
        .post(requestCityUrl, { ...this.modalData })
        .then(response => {
          console.log(response) // eslint-disable-line
          this.clearForm()
          this.close()
        })
        .catch(error => {
          console.log(error) // eslint-disable-line
        })
    },
    validateForm() {
      let email = this.modalData.email
      if (email === null || email === '' || !this.isEmailValid(email))
        this.errors.push('Prosím vyplňte platnou emailovou adresu.')
      else
        this.errors = []
    },
    isEmailValid(email) { // TODO: swap out for `<input type="email">` validation
      let re = /\S+@\S+\.\S+/;
      return re.test(email);
    },
    clearForm() {
      this.modalData.email = ''
      this.modalData.name = ''
      this.modalData.subscribe = false
      this.modalData.gdpr = false
      this.errors = []
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>