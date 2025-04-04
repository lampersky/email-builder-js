var integrator = (function() {
    if (window.integrator) {
        return window.integrator;
    }
    var iframes = [];
    var webComponents = [];
    var functions = {};
    
    const call = (name, messageId, args, element) => {
        const isIframe = element === window.parent;
        /* if name is not provided, assume that first arg is method name */
        if (!name) {
            name = args[0];
            args = args.splice(1);
        }
        var func = isIframe ? functions[name] : element?.functions[name];
        if (!func) return;
        /*todo*/
        const recipient = /*event.source ??*/ window.parent;
        const origin = /*(event.origin === 'null' || !event.origin) ? "*" : event.origin */ "*";
        func(
            args,
            (result) => { 
                if (!isIframe) {
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
                if (!isIframe) {
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
            const inIframe = element === window.parent;
            const type = inIframe ? 'message' : 'execute';
            const handleMessage = (event) => {
                if (!inIframe) {
                    call(event.detail?.payload?.method, event.detail.id, event.detail?.payload?.args, element);
                } else {
                    call(event.data?.payload?.method, event.data.id, event.data?.payload?.args, element);
                }
              };
              const el = inIframe ? window : element;
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
        /* This method should be called when you want to register method available on web-element or iframe. */
        register: function(element, obj) {
            if (obj != null && typeof obj === 'object' && Array.isArray(obj) === false) {
                if (element !== window.parent) {
                    element.functions = element.functions ?? {};
                    Object.assign(element.functions, obj);
                } else {
                    //only for iframe
                    Object.assign(functions, obj);
                }
            }
        },
        unregister: function(element, name) {
            if (element?.functions[name]) {
                delete element?.functions[name];
            }
        },
        /* This method should be called when a variable changes inside the WebComponent or iframe, so we can notify the receivers. */
        update: function(reactiveVariables, element) {
            if (element === window.parent) {
                /* todo, check if iframe is registered */
                window.parent.postMessage({ action: 'watch', reactiveVariables}, "*");
                return;
            }
            if (element) {
                for (var [variableName, variableValue] of Object.entries(reactiveVariables))
                {
                    /* todo, check if element is registered */
                    element.dispatchEvent(new CustomEvent(`watch.${variableName}`, {
                        detail: variableValue,
                    }));
                }
                return;
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
        /* This method should be called when you want to add web-components or iframes */
        addElement: function(element) {
            const elementTagName = element?.tagName?.toLowerCase();
            const isIframe = elementTagName === 'iframe';
            const isCustomElement = customElements.get(elementTagName) !== undefined;
            if (!isIframe && !isCustomElement) {
                return;
            }

            (isIframe ? iframes : webComponents).push(element);

            const f = (item) => function(...args) {
                return new Promise((resolve, reject) => {
                    const messageId = Math.random().toString(36).substring(7);
                    const type = isIframe ? 'message' : `response.${messageId}`;
                    const el = isIframe ? window : element;
                    const getPayload = (event) => isIframe ? event.data : event.detail;
                    
                    function messageHandler(event) {
                        if (isIframe && event.source !== element.contentWindow) return;
                        //console.log('event', event);
                        //console.log('element', element);
                        if (getPayload(event).id === messageId) {
                            el.removeEventListener(type, messageHandler);
                            resolve(getPayload(event).response);
                        }
                    }

                    el.addEventListener(type, messageHandler);

                    if (isIframe) {
                        element.contentWindow.postMessage({ id: messageId, payload: { method: item, args: args } }, "*");
                    } else {
                        element.dispatchEvent(new CustomEvent(`execute`, {
                            detail: { id: messageId, payload: { method: item, args: args } },
                        }));
                    }

                    setTimeout(() => {
                        el.removeEventListener(type, messageHandler);
                        reject(new Error(`Timeout waiting for ${isIframe ? 'iframe' : 'web-element'} response`));
                    }, 5000);
                });
            };

            element.call = element.call ?? f();

            if (element.functions) {
                Object.keys(element.functions).map(item => 
                    Object.assign(element.call, {
                        [item]: f(item)
                    })
                );
            }
        },
        removeElement: function (element) {
            if (element?.call) {
                delete element.call;
            }
            for (var arr of [iframes, webComponents]) {
                var idx = arr.indexOf(element);
                if (idx !== -1) {
                    arr.splice(idx, 1);
                    return;
                }
            }
        },
        getIframes: function() {
            return iframes;
        },
        getWebComponents: function() {
            return webComponents;
        },
    };
})();

window.integrator = window.integrator ?? integrator;