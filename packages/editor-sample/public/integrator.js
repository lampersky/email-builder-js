//it works, but lot's of code needs to be cleared, I've only adjusted
var integrator = (function() {
    if (window.integrator) {
        return window.integrator;
    }
    var iframes = [];
    var webComponents = [];
    var functions = {};
    
    const installMessageRelay = () => {
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
    };

    const call = (name, messageId, args) => {
        var func = functions[name];
        if (!func) return;
        const recipient = /*event.source ??*/ window.parent;
        const origin = /*(event.origin === 'null' || !event.origin) ? "*" : event.origin */ "*";
        func(
            args,
            (result) => { 
                //console.log('Success! Result:', result); 
                recipient.postMessage({ id: messageId, response: { success: true, error: null, result: result } }, origin);
            },
            (error) => { 
                //console.log('Error:', error);
                recipient.postMessage({ id: messageId, response: { success: false, error: error, result: null } }, origin);
            }
        );
    }

    const call2 = (name, messageId, args, element) => {
        var func = functions[name];
        if (!func) return;
        func(
            args,
            (result) => { 
                //console.log('Success! Result:', result); 
                //element.postMessage({ id: messageId, response: { success: true, error: null, result: result } }, origin);
                element.dispatchEvent(new CustomEvent(`response.${messageId}`, { 
                    detail : {
                        id: messageId, 
                        response: { success: true, error: null, result: result }
                    }
                }))
            },
            (error) => { 
                //console.log('Error:', error);
                //element.postMessage({ id: messageId, response: { success: false, error: error, result: null } }, origin);
                element.dispatchEvent(new CustomEvent(`response.${messageId}`, {
                    detail : {
                        id: messageId, 
                        response: { success: false, error: error, result: null }
                    }
                }))
            }
        );
    }

    //web-componentsolution do not need message relay, it is for iframe
    //installMessageRelay();
 
    return {
        install: function() {
            const handleMessage = (event) => {
                call(event.data?.payload?.method, event.data.id, event.data?.payload?.args);
              };
              window.addEventListener("message", handleMessage);
              return () => {
                window.removeEventListener("message", handleMessage);
              };
        },
        installWebComponent: function(element) {
            const handleMessage = (event) => {
                call2(event.detail?.payload?.method, event.detail.id, event.detail?.payload?.args, element);
              };
              element.addEventListener("execute", handleMessage);
              return () => {
                element.removeEventListener("execute", handleMessage);
              };
        },
        register: function(name, callback) {
            functions[name] = callback;
        },
        unregister: function(name) {
            if (functions[name]) {
                delete functions[name];
            }
        },
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
                            window.removeEventListener(`response.${messageId}`, messageHandler);
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