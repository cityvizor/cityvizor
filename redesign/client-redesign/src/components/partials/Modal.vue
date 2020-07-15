<template>
  <div class="modal">
    <div class="modal__overlay" @click.stop="close"></div>
    <div class="modal__content">
      <div class="modal__content__header">
        <slot name="header" />
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
export default {
  name: 'Modal',
  methods: {
    close() {
      this.$emit('close')
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
  width: 610px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 72px 62px 42px 62px;
  text-align: left;
}

.modal__content__header {
  div:first-child {
    font-size: 30px;
  }
  div:not(:first-child) {
    font-size: 24px;
  }
  div + div {
    margin-top: 18px;
  }
}

.modal__content__body {
  margin-top: 54px;

  section {
    .readonly {
      font-weight: 700;
    }

    input {
      height: 40px;
      width: 272px;
      border: 2px solid #828282;
    }

    input[type='checkbox'] {
      height: 14px;
      width: 14px;
    }

    label {
      display: inline-block;
      min-width: 108px;
    }

    div {
      font-size: 14px;
      margin-left: 108px;
      margin-top: 6px;
      width: 300px;
    }

    &.checkbox > label {
      display: inline;
      font-size: 14px;
      margin-left: 12px;
      max-width: 368px;
    }
  }

  section + section {
    margin-top: 20px;
  }
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
</style>