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
    --_travel-distance: var(--toast-travel-distance, 5vh);
    --_animation-duration: var(--toast-animation-duration, 3s);

    --_toast-background: var(--toast-background, #FCFCFC);
    --_toast-border: var(--toast-border, #00000026);
    --_toast-title: var(--toast-title, #000000DF);
    --_toast-description: var(--toast-description, #0000009B);

    --_toast-success: var(--toast-success, #00924BA4);
    --_toast-error: var(--toast-error, #D2000571);
    --_toast-warning: var(--toast-warning, #E35F00AA);
    --_toast-info: var(--toast-info, #0084E6A1);
  }

  @media (prefers-color-scheme: dark) {
    :host {
      --_toast-background: var(--toast-background, #111111);
      --_toast-border: var(--toast-border,  #FFFFFF2C);
      --_toast-title: var(--toast-title, #FFFFFFED);
      --_toast-description: var(--toast-description, #FFFFFFAF);
  
      --_toast-success: var(--toast-success, #54FFAD73);
      --_toast-error: var(--toast-error, #FF5D61B0);
      --_toast-warning: var(--toast-warning, #FE84389D);
      --_toast-info: var(--toast-info, #3094FEB9);
    }
  }

  @keyframes slide-in {
    from { 
      transform: translateY(var(--_travel-distance)) 
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

    pointer-events: none;
    user-select: none;

    list-style: none;
    background-color: var(--_toast-background);
    padding: 1rem;
    border: 1px solid var(--_toast-border);
    border-radius: 0.25rem;
    pointer-events: all;

    will-change: transform;
    animation: 
      fade-in .3s ease,
      slide-in .3s ease,
      fade-out .3s ease var(--_animation-duration);

    @media (prefers-reduced-motion: reduce){
      --_travel-distance: 0;
    }

    & p {
      margin: 0;
      font-family: inherit;
    }
  
    &[data-type="success"] {
      border-top: 4px solid var(--_toast-success);
    }
  
    &[data-type="error"] {
      border-top: 4px solid var(--_toast-error);
    }
  
    &[data-type="info"] {
      border-top: 4px solid var(--_toast-info)
    }

    &[data-type="warning"] {
      border-top: 4px solid var(--_toast-warning)
    }
  }

  [data-title] {
    font-size: 1rem;
    font-weight: 600;
    color: var(--_toast-title);
  }

  [data-description] {
    font-size: 0.875rem;
    color: var(--_toast-description);
    text-wrap: pretty;
  }`;
}

customElements.define("moaqz-toaster", Toaster);
