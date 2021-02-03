<template>
  <div class="modal-form" :id="formName">
    <slot />
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
    this.adjustStylingOfLabels();
  },
  computed: {
    hasErrors() {
      return this.errors.length > 0;
    }
  },
  methods: {
    findElements(selector) {
      return document.getElementById(this.formName).querySelectorAll(selector)
    },
    adjustStylingOfLabels() {
      this.findElements('input').forEach(input => {
        const labels = input.parentNode.getElementsByTagName('label')
        if (labels.length > 0 && input.type === 'checkbox') {
          labels[0].classList.add('checkbox-label');
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
        const value = input.type === 'checkbox' ? input.checked : input.value;
        this.formDict[input.id] = value;
      })
    },
    validateForm() {
      this.errors = []
      const inputs = Array.from(this.findElements('input[required]'))
      inputs.forEach(input => {
          // purge errors div
          const errorsDivId = `${input.id}-field-errors`;
          const errorsDivOld = document.getElementById(errorsDivId);
          if (errorsDivOld)
            errorsDivOld.remove();

          // create errors div
          const errorsDiv = document.createElement('div');
          errorsDiv.classList.add('.modal-form__field__errors');
          errorsDiv.id = errorsDivId;
          input.parentNode.appendChild(errorsDiv);

          if (!input.checkValidity()){
            // populate errors div
            const fieldError = document.createElement('pre');
            fieldError.innerText = input.title;
            fieldError.style.color = 'red';
            errorsDiv.append(fieldError);

            this.errors.push(input.title);
            input.classList.add('error');
          } else {
            input.classList.remove('error');
          }
      });
    },

    async submit() {
      try {
        const response = await axios.post(this.endpoint, { ...this.formDict });
        this.clearForm();
        this.close();
      } catch (error) {
        console.log(error); // eslint-disable-line
      }
    },
    clearForm() {
      this.errors = [];
      this.formDict = {};
    },
    close() {
      this.$emit('close');
    },
  }
}
</script>

<style lang="scss" scoped>
.modal-form {
  section + section {
    margin-top: 12px;
  }

  input {
    border: 1px solid rgba(0, 0, 0, 0.38);
    border-radius: 8px;
    width: 344px;
    height: 56px;

    &:focus {
      border: 2px solid #248E56;
    }

    &.error {
      border: 2px solid red;
    }

    &:required ~ label:after {
      content: ' *';
    }

    &[type='checkbox'] {
      height: 20px;
      width: 20px;
      cursor: pointer;
    }
  }

  label {
    display: block;
    margin-bottom: 6px;
  }

  div {
    font-family: 'IBM Plex Sans';
    font-size: 12px;
    margin-top: 6px;
    color: #757575;
  }

  .checkbox-label {
    display: inline;
    font-size: 16px;
    line-height: 24px;
    margin-left: 8px;
    cursor: pointer;
  }
}

.modal-form__field__errors {
  margin: 12px 0;
  height: 12px;
  font-size: 12px;
  > pre {
    color: red;
  }
}

label {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;

  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0em;
}

// TODO: replace temp layout fix for mobile devices
@media screen and (max-width: 480px) {
  .modal-form {
    input[type='checkbox'] {
      height: 16px;
      width: 16px;
    }
  }
}
</style>
