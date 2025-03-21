<script setup>
import HelloWorld from './components/HelloWorld.vue'
import EmailEditor from './components/EmailEditor.vue'
</script>

<template>
  <div>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />
    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </div>

  <div>
    <div class="d-flex">
      <EmailEditor url="https://lampersky.github.io/email-builder-js/" />
    </div>

    <div class="d-flex">
      <EmailEditor url="https://lampersky.github.io/email-builder-js/" />
    </div>
  </div>
</template>

<style scoped>
.logo {
  display: block;
  margin: 0 auto 2rem;
}
</style>
