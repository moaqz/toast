/* global HTMLElement, customElements */

/**
 * The custom event name used by the toast notification system.
 */
export const TOAST_EVENT = "@moaqzdev/toast";

export const toast = {
  /**
   * @param {import("../index.d").ToastType} type
   * @param {import("../index.d").ToastEvent} details
   */
  _dispatchToast(type, { title, description }) {
    /**
     * @type {CustomEvent<import("../index.d").Toast>}
     */
    const toast = new CustomEvent(TOAST_EVENT, {
      detail: { title, description, type },
    });

    document.dispatchEvent(toast);
  },

  /**
   * @param {import("../index.d").ToastEvent} details
   */
  success(details) {
    this._dispatchToast("success", details);
  },

  /**
   * @param {import("../index.d").ToastEvent} details
   */
  error(details) {
    this._dispatchToast("error", details);
  },

  /**
   * @param {import("../index.d").ToastEvent} details
   */
  warning(details) {
    this._dispatchToast("warning", details);
  },

  /**
   * @param {import("../index.d").ToastEvent} details
   */
  info(details) {
    this._dispatchToast("info", details);
  },
};

class Toaster extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  /**
   * @param {import("../index.d").Toast}
   */
  async createToast({ title, type, description }) {
    /** @type {HTMLTemplateElement | null} */
    const toastTemplate = this.shadowRoot.querySelector("#toast-tmpl");

    if (toastTemplate == null) {
      throw new Error("toast template is not defined");
    }

    const clonedTemplate = toastTemplate.content.cloneNode(true);
    const toastTitleEl = clonedTemplate.querySelector("[data-title]");
    const toastDescriptionEl = clonedTemplate.querySelector("[data-description]");
    const toastEl = clonedTemplate.querySelector("[data-toast]");

    toastTitleEl.textContent = title;
    toastDescriptionEl.textContent = description;
    toastEl.setAttribute("data-type", type);

    this.shadowRoot.querySelector("[data-toaster]").appendChild(clonedTemplate);

    const animations = toastEl.getAnimations();
    await Promise.allSettled(animations.map(animation => animation.finished));
    toastEl.remove();
  }

  /**
   * @param {Event} event
   */
  handleEvent(event) {
    const isCustomEvent = event instanceof CustomEvent;

    if (isCustomEvent && event.type === TOAST_EVENT) {
      /** @type {import("../index.d").Toast} */
      const details = event.detail;
      this.createToast(details);
    }
  }

  connectedCallback() {
    document.addEventListener(TOAST_EVENT, this);
  }

  disconnectedCallback() {
    document.removeEventListener(TOAST_EVENT, this);
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${Toaster.STYLES}</style>

    <template id="toast-tmpl">
      <li data-toast>
        <p data-title></p>
        <p data-description></p>
      </li>
    </template>

    <ol data-toaster></ol>`;
  }

  static STYLES = /* css */`
  * {
    box-sizing: border-box;
  }

  :host {
    --travel-distance: 5vh;
    --animation-duration: 3s;

    --toast-background: #00000006;
    --toast-border: #00000026;
    --toast-title: #000000DF;
    --toast-description: #0000009B;

    --toast-success: #00924BA4;
    --toast-error: #D2000571;
    --toast-warning: #E35F00AA;
    --toast-info: #0084E6A1;
  }

  @media (prefers-color-scheme: dark) {
    :host {
      --toast-background: #FFFFFF09;
      --toast-border: #FFFFFF2C;
      --toast-title: #FFFFFFED;
      --toast-description: #FFFFFFAF;
  
      --toast-success: #54FFAD73;
      --toast-error: #FF5D61B0;
      --toast-warning: #FE84389D;
      --toast-info: #3094FEB9;
    }
  }

  @keyframes slide-in {
    from { 
      transform: translateY(var(--travel-distance, 10px)) 
    }
  }

  @keyframes fade-in {
    from { opacity: 0 }
    to { opacity: 1 }
  }
  
  @keyframes fade-out {
    to { opacity: 0 }
  }

  [data-toaster] {
    --container-width: 20rem;

    position: fixed;
    width: var(--container-width);
    height: 100dvh;
    max-height: 100dvh;
    overflow: hidden;
    top: 0;
    right: 0;
    pointer-events: none;
    margin: 0;
    padding: 1rem;
    display: flex;
    flex-direction: column-reverse;
    gap: 0.5rem;
  }

  [data-toast] {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    list-style: none;
    background-color: var(--toast-background);
    padding: 1rem;
    border: 1px solid var(--toast-border);
    border-radius: 0.25rem;
    pointer-events: all;

    will-change: transform;
    animation: 
      fade-in .3s ease,
      slide-in .3s ease,
      fade-out .3s ease var(--animation-duration);

    @media (prefers-reduced-motion: reduce){
      --travel-distance: 0;
    }

    & p {
      margin: 0;
      font-family: inherit;
    }
  
    &[data-type="success"] {
      border-top: 4px solid var(--toast-success);
    }
  
    &[data-type="error"] {
      border-top: 4px solid var(--toast-error);
    }
  
    &[data-type="info"] {
      border-top: 4px solid var(--toast-info)
    }

    &[data-type="warning"] {
      border-top: 4px solid var(--toast-warning)
    }
  }

  [data-title] {
    font-size: 1rem;
    font-weight: 600;
    color: var(--toast-title);
  }

  [data-description] {
    font-size: 0.875rem;
    color: var(--toast-description);
    text-wrap: pretty;
  }`;
}

customElements.define("moaqz-toaster", Toaster);
