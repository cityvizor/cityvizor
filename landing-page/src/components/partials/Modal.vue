<template>
  <div class="cv_modal">
    <div class="cv_modal__overlay" @click.stop="close"></div>
    <div class="cv_modal__content">
      <div class="cv_modal__content__header">
        <slot name="header" />
        <div class="cv_close-button" @click.stop="close">
          <Close
            :size="16"
            :thickness="5"
            stroke="#757575"
            linecap="round" />
        </div>
      </div>
      <div class="cv_modal__content__body">
        <slot name="body" />
      </div>
      <div class="cv_modal__content__footer">
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
      const modalContentElement = document.getElementsByClassName("modal__content")[0];
      const elementRect = modalContentElement.getBoundingClientRect();
      const elementHeight = Math.floor(elementRect.height);
      console.log(this, modalContentElement, elementRect, elementHeight);
      if (elementHeight < window.innerHeight) return;
      modalContentElement.style.height = `${window.innerHeight - 64}px`;
      modalContentElement.style['overflow-y'] = 'auto';
    },
    close() {
      this.$emit('close');
    },
    keydownHandler (e) {
      if (e.key === 'Escape') this.close();
    }
  }
}
</script>

<style lang="scss" scoped>
@import './../../assets/styles/common/variables';

// TODO: get rid of magic values, convert into variables
.cv_modal {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.cv_modal__overlay {
  width: 100%;
  height: 100%;
  background: #000;
  opacity: .4;
  cursor: pointer;
}

.cv_modal__content {
  width: 532px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 24px;
  text-align: left;
  border-radius: 8px;
}

.cv_modal__content__header {
  position: relative;

  h1 {
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 32px;
    letter-spacing: 0em;
    color: #1E2A37;

    max-width: calc(100% - 32px);
    margin: 0;
    margin-bottom: 16px;
  }

  h2 {
    font-size: 14px;
    color: #1E2A37;
    text-decoration: none;
    margin: 0;
  }

  .cv_close-button {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
  }
}

.cv_modal__content__body {
  margin-top: 24px;
}

.cv_modal__content__footer {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

// TODO: replace temp layout fix for mobile devices
@media screen and (max-width: 480px) {
  .cv_modal__content {
    width: calc(100vw - 48px);
    padding: 32px 18px 24px 18px;
  }

  .cv_modal__content__header {
    h1 {
      font-size: 24px;
    }
    h2 {
      font-size: 18px;
    }
  }

  .cv_modal__content__body {
    margin-top: 32px;
  }
}
</style>