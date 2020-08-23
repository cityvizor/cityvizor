<template>
  <div class="modal-form" :id="formName">
    <slot />
    <div class="modal-form__error">{{ errors[0] }}</div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ModalForm',
  props: {
    formName: {
      type: String,
      required: true
    },
    errorMessage: {
      type: String,
      default: 'Please fill out all the required fields.'
    },
    endpoint: {
      type: String,
      requried: true
    }
  },
  data() {
    return {
      errors: [],
      formDict: {},
    }
  },
  mounted() {
    this.adjustStylingOfLabels()
  },
  computed: {
    hasErrors() {
      return this.errors.length > 0
    }
  },
  methods: {
    findElements(selector) {
      return document.getElementById(this.formName).querySelectorAll(selector)
    },
    adjustStylingOfLabels() {
      this.findElements('input').forEach(input => {
        let labels = input.parentNode.getElementsByTagName('label')
        if (labels.length > 0) {
          if (input.required) {
            const span = document.createElement('span')
            span.textContent = ' *'
            span.style.color = 'red' 
            labels[0].append(span)
          }
          if (input.type == 'checkbox') {
            labels[0].classList.add('checkbox-label')
          }
        }
      })
    },
    onSubmit() {
      this.updateFormDict()
      this.validateForm()
      if (this.hasErrors) return
      this.submit()
    },
    updateFormDict() {
      this.findElements('input').forEach(input => {
        const value = input.type === 'checkbox' ? input.checked : input.value
        this.formDict[input.id] = value
      })
    },
    validateForm() {
      this.errors = []
      const requiredInputsIds = Array.from(this.findElements('input[required]')).map(x => x.id)
      Object.keys(this.formDict).forEach(key => {
        if (requiredInputsIds.includes(key)) {
          const value = this.formDict[key]
          if (value === '' || value === null || value === undefined || value === false)
            this.errors = [this.errorMessage]
        }
      })
    },
    async submit() {
      try {
        const response = await axios.post(this.endpoint, { ...this.formDict })
        console.log(response) // eslint-disable-line
        this.clearForm()
        this.close()
      } catch (error) {
        console.log(error) // eslint-disable-line
      }
    },
    clearForm() {
      this.errors = []
      this.formDict = {}
    },
    close() {
      this.$emit('close')
    },
  }
}
</script>

<style lang="scss" scoped>
.modal-form {
  section + section {
    margin-top: 20px;
  }

  label {
    display: block;
    margin-bottom: 6px;
  }
  label[readonly] {
    font-weight: 700;
  }

  div {
    font-size: 14px;
    margin-top: 6px;
  }

  input {
    height: 40px;
    width: 100%;
    border: 2px solid #828282;
  }
  input[type='checkbox'] {
    height: 28px;
    width: 28px;
    cursor: pointer;
  }
  .checkbox-label {
    display: inline;
    font-size: 14px;
    margin-left: 12px;
    cursor: pointer;
  }
}

.modal-form__error {
  height: 18px;
  margin: 12px 0;
  font-size: 18px;
  color: red;
}

// TODO: replace temp layout fix for mobile devices
@media screen and (max-width: 480px) {
  .modal-form {
    input {
      height: 32px;
    }
    input[type='checkbox'] {
      height: 16px;
      width: 16px;
    }
  }
}
</style>
