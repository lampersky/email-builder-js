<template>
  <div>
    <div class="iframeWrapper">
      <iframe
        ref="iframeRef"
        width="100%"
        height="100%"
        :src="url"
        @load="onIframeLoad"
      ></iframe>
    </div>
    <button @click="getJsonTemplate">JSON</button>
    <button @click="getHtmlTemplate">HTML</button>
    <button @click="toggleSamples">toggle samples</button>
    <button @click="toggleInspector">toggle inspector</button>
    <button @click="loadTemplate(json)">load template</button>
    <textarea v-model="json"></textarea>
    <textarea v-model="html" readonly></textarea>
  </div>
</template>

<script>
export default {
  name: 'EmailEditor',
  props: {
    url: String
  },
  data() {
    return {
      json: "",
      html: "",
    };
  },
  methods: {
    getJsonTemplate() {
      return this.$refs.iframeRef.sendMessage({ method: 'getJson' }).then(response => {
        console.log("Response from child:", response);
        return response;
      }).catch(err => console.error(err));
    },
    getHtmlTemplate() {
      return this.$refs.iframeRef.sendMessage({ method: 'getHtml' }).then(response => {
        console.log("Response from child:", response);
        return response;
      }).catch(err => console.error(err));
    },
    toggleSamples() {
      return this.$refs.iframeRef.sendMessage({ method: 'toggleSamplesDrawerOpen' }).then(response => {
        console.log("Response from child:", response);
        return response;
      }).catch(err => console.error(err));
    },
    toggleInspector() {
      return this.$refs.iframeRef.sendMessage({ method: 'toggleInspectorDrawerOpen' }).then(response => {
        console.log("Response from child:", response);
        return response;
      }).catch(err => console.error(err));
    },
    loadTemplate(jsonText) {
      return this.$refs.iframeRef.sendMessage({
        method: 'resetDocument',
        args: [jsonText]
      }).then(response => {
        console.log("Response from child:", response);
        return response
      }).catch(err => console.error(err));
    },
    onIframeLoad() {
    }
  },
  mounted() {
    const iframe = this.$refs.iframeRef;
    if (window.integrator) {
      window.integrator.addIframe(iframe);
      iframe.addEventListener('watch.json', e => {
        this.json = e.detail;
      });
      iframe.addEventListener('watch.html', e => {
        this.html = e.detail;
      });
    }
  },
};
</script>

<style scoped>
.iframeWrapper {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>