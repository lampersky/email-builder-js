var integrator = (function() {
    if (window.integrator) {
        return window.integrator;
    }
    var iframes = [];
    var webComponents = [];
    var functions = {};
    
    const call = (name, messageId, args, element) => {
        var func = functions[name];
        if (!func) return;
        const recipient = /*event.source ??*/ window.parent;
        const origin = /*(event.origin === 'null' || !event.origin) ? "*" : event.origin */ "*";
        func(
            args,
            (result) => { 
                if (element) {
                    element.dispatchEvent(new CustomEvent(`response.${messageId}`, { 
                        detail : {
                            id: messageId, 
                            response: { success: true, error: null, result: result }
                        }
                    }));
                } else {
                    recipient.postMessage({ id: messageId, response: { success: true, error: null, result: result } }, origin);
                }
            },
            (error) => { 
                if (element) {
                    element.dispatchEvent(new CustomEvent(`response.${messageId}`, {
                        detail : {
                            id: messageId, 
                            response: { success: false, error: error, result: null }
                        }
                    }))
                } else {
                    recipient.postMessage({ id: messageId, response: { success: true, error: null, result: result } }, origin);
                }
            }
        );
    }

    return {
        /* This method needs to be called inside a WebComponent or inside an iframe. For a WebComponent, provide the element; for an iframe, provide null. */
        install: function(element) {
            const type = element ? 'execute' : 'message';
            const handleMessage = (event) => {
                if (element) {
                    call(event.detail?.payload?.method, event.detail.id, event.detail?.payload?.args, element);
                } else {
                    call(event.data?.payload?.method, event.data.id, event.data?.payload?.args);
                }
              };
              const el = element ?? window;
              el.addEventListener(type, handleMessage);
              return () => {
                el.removeEventListener(type, handleMessage);
              };
        },
        /* This method needs to be called on a page that is hosting the iframe. */
        installHostMessageRelay: function() {
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
                    ////tho whole object
                    //iframe.dispatchEvent(new CustomEvent(`watch`, {
                    //  detail: event.data,
                    //}));
                }
            });
        },
        register: function(name, callback) {
            functions[name] = callback;
        },
        unregister: function(name) {
            if (functions[name]) {
                delete functions[name];
            }
        },
        /* This method should be called when a variable changes inside the WebComponent or iframe, so we can notify the receivers. */
        update: function(reactiveVariables, element) {
            if (element) {
                for (var [variableName, variableValue] of Object.entries(reactiveVariables))
                {
                    element.dispatchEvent(new CustomEvent(`watch.${variableName}`, {
                        detail: variableValue,
                    }));
                }
                return;
            }
            if (window.parent) {
                window.parent.postMessage({ action: 'watch', reactiveVariables}, "*");
            }
        },
        addIframeById: function(iframeId) {
            var iframe = document.getElementById(iframeId);
            this.addIframe(iframe);
        },
        removeIframeById: function(iframeId) {
            var iframe = document.getElementById(iframeId);
            this.removeIframe(iframe);
        },
        addWebComponent: function(webComponent) {
            webComponents.push(webComponent);
            Object.assign(webComponent, {
                sendMessage(message) {
                    return new Promise((resolve, reject) => {
                        const webComponent = this;
                        const messageId = Math.random().toString(36).substring(7);
                        
                        function messageHandler(event) {
                            if (event.detail.id === messageId) {
                                webComponent.removeEventListener(`response.${messageId}`, messageHandler);
                                resolve(event.detail.response);
                            }
                        }

                        webComponent.addEventListener(`response.${messageId}`, messageHandler);

                        webComponent.dispatchEvent(new CustomEvent(`execute`, {
                            detail: { id: messageId, payload: message },
                        }));

                        setTimeout(() => {
                            webComponent.removeEventListener(`response.${messageId}`, messageHandler);
                            reject(new Error("Timeout waiting for child response"));
                        }, 5000);
                    });
                }
            });
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
        },
        getFunctions: function() {
            return Object.keys(functions);
        },
        getWebComponent: function() {
            return webComponents;
        },
    };
})();

window.integrator = window.integrator ?? integrator;