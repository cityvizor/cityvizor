<template>
  <div class="modal">
    <div class="modal__overlay" @click.stop="close"></div>
    <div class="modal__content">
      <div class="modal__content__header">
        <slot name="header" />
        <div class="close-button" @click.stop="close">
          <Close :size="24" :thickness="3"></Close>
        </div>
      </div>
      <div class="modal__content__body">
        <slot name="body" />
      </div>
      <div class="modal__content__footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script>
import Close from '../icons/Close'

export default {
  name: 'Modal',
  components: {
    Close
  },
  created () { document.addEventListener('keydown', this.keydownHandler) },
  destroyed() { document.removeEventListener('keydown', this.keydownHandler) },
  mounted () {
    this.adjustModalHeight()
  },
  methods: {
    adjustModalHeight() {
      const modalContentElement = document.getElementsByClassName("modal__content")[0]
      const elementRect = modalContentElement.getBoundingClientRect()
      const elementHeight = Math.floor(elementRect.height)
      if (elementHeight < window.innerHeight) return
      modalContentElement.style.height = `${window.innerHeight - 64}px`
      modalContentElement.style['overflow-y'] = 'auto'
    },
    close() {
      this.$emit('close')
    },
    keydownHandler (e) {
      if (e.key === 'Escape') this.close()
    }
  }
}
</script>

<style lang="scss" scoped>
@import './../../assets/styles/common/variables';

// TODO: get rid of magic values, convert into variables
.modal {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.modal__overlay {
  width: 100%;
  height: 100%;
  background: #000;
  opacity: .4;
  cursor: pointer;
}

.modal__content {
  width: 600px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 48px 48px 24px 48px;
  text-align: left;
}

.modal__content__header {
  position: relative;

  h1 {
    font-size: 30px;
    max-width: calc(100% - 32px);
    margin-bottom: 18px;
  }
  h2 {
    font-size: 24px;
  }

  .close-button {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
  }
}

.modal__content__body {
  margin-top: 54px;
}

.modal__content__footer {
  margin-top: 24px;
  float: right;

  button {
    height: 40px;
    padding: 0 20px;
    font-size: 24px;
    border: none;
    border-radius: 4px;
    background: $primary;
    color: #fff;
    cursor: pointer;
  }
}

// TODO: replace temp layout fix for mobile devices
@media screen and (max-width: 480px) {
  .modal__content {
    width: calc(100vw - 48px);
    padding: 32px 18px 24px 18px;
  }

  .modal__content__header {
    h1 {
      font-size: 24px;
    }
    h2 {
      font-size: 18px;
    }
  }

  .modal__content__body {
    margin-top: 32px;
  }
}
</style>