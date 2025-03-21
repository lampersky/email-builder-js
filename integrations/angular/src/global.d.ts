export {};

interface Integrator {
    addIframe(iframe: any): void;
}

declare global {
  interface Window {
    integrator?: Integrator; 
  }
}