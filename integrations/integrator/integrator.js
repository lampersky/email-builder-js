var integrator = (function() {
    var iframes = [];
    
    var installMessageRelay = function() {
        window.addEventListener("message", (event) => {
            var iframe = iframes.filter(i => i.contentWindow === event.source)?.at(0);
            if (iframe) {
                if (event.data.action !== 'watch') return;
                for (var [variableName, variableValue] of Object.entries(event.data.reactiveVariables))
                {
                    iframe.dispatchEvent(new CustomEvent(`watch.${variableName}`, {
                      detail: variableValue,
                    }));
                }
                //if (false) {
                //    //tho whole object
                //    iframe.dispatchEvent(new CustomEvent(`watch`, {
                //      detail: event.data,
                //    }));
                //}
            }
        });
    };
    
    installMessageRelay();
 
    return {
        addIframeById: function(iframeId) {
            var iframe = document.getElementById(iframeId);
            this.addIframe(iframe);
        },
        removeIframeById: function(iframeId) {
            var iframe = document.getElementById(iframeId);
            this.removeIframe(iframe);
        },
        addIframe: function(iframe) {
            iframes.push(iframe);
            Object.assign(iframe, {
                sendMessage(message) {
                    return new Promise((resolve, reject) => {
                        const iframe = this;
                        const messageId = Math.random().toString(36).substring(7);
                        
                        function messageHandler(event) {
                            if (event.source !== iframe.contentWindow) return;
                            if (event.data.id === messageId) {
                                window.removeEventListener("message", messageHandler);
                                resolve(event.data.response);
                            }
                        }

                        window.addEventListener("message", messageHandler);

                        iframe.contentWindow.postMessage({ id: messageId, payload: message }, "*");

                        setTimeout(() => {
                            window.removeEventListener("message", messageHandler);
                            reject(new Error("Timeout waiting for child response"));
                        }, 5000);
                    });
                }
            });
        },
        removeIframe: function (iframe) {
            if (iframe?.sendMessage) {
                delete iframe.sendMessage;
            }
            var idx = iframes.indexOf(iframe);
            if (idx !== -1) {
              iframes.splice(idx, 1);
            }
        },
        getIframes: function() {
            return iframes;
        }
    };
})();

window.integrator = window.integrator ?? integrator;