// src/global.d.ts
export {};

type Callback = () => void | Destructor;

interface Integrator {
  update: (obj: any, element: any) => void;
  register: (element: HTMLElement, todo: {}) => void;
  install: (element: any) => Callback;
}
  
declare global {
  interface Window {
    integrator: Integrator;
  }
}