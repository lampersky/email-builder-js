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

const resetDocument = (jsonText) => {
  return iframeRef.value.sendMessage({
    method: 'resetDocument',
    args: [jsonText]
  }).then(response => {
    console.log("Response from child:", response);
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

const loadTemplate = () => {
  const jsonText = '{\n  "root": {\n    "type": "EmailLayout",\n    "data": {\n      "backdropColor": "#F2F5F7",\n      "canvasColor": "#FFFFFF",\n      "textColor": "#242424",\n      "fontFamily": "MODERN_SANS",\n      "childrenIds": [\n        "block-1709571212684",\n        "block-1709571228545",\n        "block-1709571234315",\n        "block-1709571247550",\n        "block-1709571258507",\n        "block-1709571281151",\n        "block-1709571302968",\n        "block-1709571282795"\n      ]\n    }\n  },\n  "block-1709571212684": {\n    "type": "Image",\n    "data": {\n      "style": {\n        "padding": {\n          "top": 24,\n          "bottom": 24,\n          "right": 24,\n          "left": 24\n        }\n      },\n      "props": {\n        "url": "https://d1iiu589g39o6c.cloudfront.net/live/platforms/platform_A9wwKSL6EV6orh6f/images/wptemplateimage_JTNBBPGrNs2Ph4JL/marketbase.png",\n        "alt": "Marketbase",\n        "linkHref": "https://marketbase.app",\n        "contentAlignment": "middle"\n      }\n    }\n  },\n  "block-1709571228545": {\n    "type": "Text",\n    "data": {\n      "style": {\n        "fontWeight": "normal",\n        "padding": {\n          "top": 0,\n          "bottom": 16,\n          "right": 24,\n          "left": 24\n        }\n      },\n      "props": {\n        "text": "Hi Anna 👋,"\n      }\n    }\n  },\n  "block-1709571234315": {\n    "type": "Text",\n    "data": {\n      "style": {\n        "fontWeight": "normal",\n        "padding": {\n          "top": 0,\n          "bottom": 16,\n          "right": 24,\n          "left": 24\n        }\n      },\n      "props": {\n        "text": "Welcome to Marketbase! Marketbase is how teams within fast growing marketplaces effortlessly monitor conversations to prevent disintermediation, identify problematic users, and increase trust & safety within their community."\n      }\n    }\n  },\n  "block-1709571247550": {\n    "type": "Text",\n    "data": {\n      "style": {\n        "fontWeight": "normal",\n        "padding": {\n          "top": 0,\n          "bottom": 16,\n          "right": 24,\n          "left": 24\n        }\n      },\n      "props": {\n        "text": "Best of all, you can connect your existing messaging services in minutes:"\n      }\n    }\n  },\n  "block-1709571258507": {\n    "type": "Image",\n    "data": {\n      "style": {\n        "padding": {\n          "top": 16,\n          "bottom": 16,\n          "right": 24,\n          "left": 24\n        }\n      },\n      "props": {\n        "url": "https://d1iiu589g39o6c.cloudfront.net/live/platforms/platform_A9wwKSL6EV6orh6f/images/wptemplateimage_oWB821TUkDXvr2f4/Screenshot%202023-11-22%20at%2011.51.30%20AM.png",\n        "alt": "Video thumbnail",\n        "linkHref": "https://capture.dropbox.com/NBQEmoCKKP9RGBWr",\n        "contentAlignment": "middle"\n      }\n    }\n  },\n  "block-1709571281151": {\n    "type": "Text",\n    "data": {\n      "style": {\n        "fontWeight": "normal",\n        "padding": {\n          "top": 16,\n          "bottom": 16,\n          "right": 24,\n          "left": 24\n        }\n      },\n      "props": {\n        "text": "If you ever need help, just reply to this email and one of us will get back to you shortly. We’re here to help."\n      }\n    }\n  },\n  "block-1709571282795": {\n    "type": "Image",\n    "data": {\n      "style": {\n        "padding": {\n          "top": 16,\n          "bottom": 40,\n          "right": 24,\n          "left": 24\n        }\n      },\n      "props": {\n        "url": "https://d1iiu589g39o6c.cloudfront.net/live/platforms/platform_A9wwKSL6EV6orh6f/images/wptemplateimage_cAK8FpmBEGoSRNi3/Screenshot%202023-11-22%20at%2011.48.53%20AM.png",\n        "alt": "Illustration",\n        "linkHref": null,\n        "contentAlignment": "middle"\n      }\n    }\n  },\n  "block-1709571302968": {\n    "type": "Button",\n    "data": {\n      "style": {\n        "fontSize": 14,\n        "padding": {\n          "top": 16,\n          "bottom": 24,\n          "right": 24,\n          "left": 24\n        }\n      },\n      "props": {\n        "buttonBackgroundColor": "#0079cc",\n        "buttonStyle": "rectangle",\n        "text": "Open dashboard",\n        "url": "https://www.usewaypoint.com"\n      }\n    }\n  }\n}';
        
  resetDocument(jsonText).then(e => {
    console.log(e);
    html.value = e;
  });
};

onBeforeMount(() => {
  console.log("Component is about to be mounted");
});

onMounted(() => {

  const test = () => {
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
  };

  test();

  // if (!document.querySelector('script[src="/integrator.min.js"]')) {
  //   const script = document.createElement("script");
  //   script.src = "/integrator.min.js";
  //   script.async = true;
  //   document.body.appendChild(script);

  //   script.onload = () => {
  //   console.log("Integrator script loaded");
  //   if (window.integrator) {
  //     test();
  //   }
  // };
  // } else {
  //   test();
  // }


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
  <button @click="loadTemplate()">load template</button>
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
