<script setup>
import { ref, onMounted, onBeforeMount } from "vue";

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
});

const iframeRef = ref(null);
const iframeUrl = ref(props.url);
const json = ref('');
const html = ref('');

const onIframeLoad = () => {
  console.log("Iframe loaded:", iframeUrl.value);
};

const loadTemplate = (jsonText) => {
  return iframeRef.value.sendMessage({
    method: 'resetDocument',
    args: [jsonText]
  }).then(response => {
    console.log("Response from child:", response);
    html.value = response;
    return response
  }).catch(err => console.error(err));
};

const getJsonFromIframe = () => {
  return iframeRef.value.sendMessage({ method: 'getJson' }).then(response => {
    console.log("Response from child:", response);
    return response;
  }).catch(err => console.error(err));
};

const getHtmlFromIframe = () => {
  return iframeRef.value.sendMessage({ method: 'getHtml' }).then(response => {
    console.log("Response from child:", response);
    return response;
  }).catch(err => console.error(err));
};

const toggleSamples = () => {
  return iframeRef.value.sendMessage({ method: 'toggleSamplesDrawerOpen' }).then(response => {
    console.log("Response from child:", response);
    return response;
  }).catch(err => console.error(err));
};

const toggleInspector = () => {
  return iframeRef.value.sendMessage({ method: 'toggleInspectorDrawerOpen' }).then(response => {
    console.log("Response from child:", response);
    return response;
  }).catch(err => console.error(err));
};

const getJsonTemplate = () => {
  getJsonFromIframe().then(e => {
    console.log(e);
    json.value = e;
  });
};

const getHtmlTemplate = () => {
  getHtmlFromIframe().then(e => {
    console.log(e);
    html.value = e;
  });
};

onBeforeMount(() => {
  console.log("Component is about to be mounted");
});

onMounted(() => {
  const iframe = iframeRef.value;
  if (window.integrator) {
    window.integrator.addIframe(iframe);
    iframe.addEventListener('watch.json', e => {
      json.value = e.detail;
    });
    iframe.addEventListener('watch.html', e => {
      html.value = e.detail;
    });
  }
});
</script>

<template>
  <div class="iframeWrapper">
    <iframe
      ref="iframeRef"
      width="100%"
      height="100%"
      :src="iframeUrl"
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
</template>

<style scoped>
.iframeWrapper {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
