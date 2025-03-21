<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <div>
      <div class="d-flex">
        <EmailEditor url="http://localhost:5176/email-builder-js/" />
      </div>

      <div class="d-flex">
        <EmailEditor url="http://localhost:5176/email-builder-js/" />
      </div>
    </div>
  </div>
</template>

<script>
import EmailEditor from './components/EmailEditor.vue';
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    EmailEditor
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
