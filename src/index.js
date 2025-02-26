/* global HTMLElement, customElements */

/**
 * The custom event name used by the toast notification system.
 */
export const TOAST_EVENT = "@moaqzdev/toast";

export const toast = {
  /**
   * @param {import("./index.d").ToastType} type
   * @param {import("./index.d").ToastEvent} detail
   */
  _dispatchToast(type, detail) {
    /**
     * @type {CustomEvent<import("./index.d").Toast>}
     */
    Object.assign(detail, { type });
    const toast = new CustomEvent(TOAST_EVENT, {
      detail,
    });

    document.dispatchEvent(toast);
  },

  /**
   * @param {import("./index.d").ToastEvent} details
   */
  success(details) {
    this._dispatchToast("success", details);
  },

  /**
   * @param {import("./index.d").ToastEvent} details
   */
  error(details) {
    this._dispatchToast("error", details);
  },

  /**
   * @param {import("./index.d").ToastEvent} details
   */
  warning(details) {
    this._dispatchToast("warning", details);
  },

  /**
   * @param {import("./index.d").ToastEvent} details
   */
  info(details) {
    this._dispatchToast("info", details);
  },

  /**
   * @param {import("./index.d").ToastEvent & { onConfirm: () => void; onCancel?: () => void }} details
   */
  confirm(details) {
    this._dispatchToast("confirm", details);
  },
};

class Toaster extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  /**
   * @param {import("./index.d").Toast}
   */
  async createToast({
    title,
    type,
    description,
    onConfirm,
    onCancel,
    confirmText = "✅",
    cancelText = "❌",
  }) {
    /** @type {HTMLTemplateElement | null} */
    const toastTemplate = this.shadowRoot.querySelector("#toast-tmpl");

    if (toastTemplate == null) {
      throw new Error("toast template is not defined");
    }

    const clonedTemplate = toastTemplate.content.cloneNode(true);
    const toastTitleEl = clonedTemplate.querySelector("[data-title]");
    const toastDescriptionEl =
      clonedTemplate.querySelector("[data-description]");
    const toastEl = clonedTemplate.querySelector("[data-toast]");

    toastTitleEl.textContent = title;
    toastDescriptionEl.textContent = description;
    toastEl.setAttribute("data-type", type);

    if (type === "confirm") {
      const confirmButton = clonedTemplate.querySelector("button[data-action-type=\"confirm\"]");
      confirmButton.textContent = confirmText;
      confirmButton.addEventListener("click", () => {
        onConfirm?.();
        toastEl.remove();
      }, { once: true });

      const cancelButton = confirmButton.nextElementSibling;
      cancelButton.textContent = cancelText;
      cancelButton.addEventListener("click", () => {
        onCancel?.();
        toastEl.remove();
      }, { once: true });
    } else {
      clonedTemplate.querySelector("[data-actions]")?.remove();
    }

    const isDismissable = this.hasAttribute("dismissable");
    if (!isDismissable) {
      clonedTemplate.querySelector("[data-close-button]")?.remove();
    }

    const closeBtn = clonedTemplate.querySelector("[data-close-button]");
    closeBtn.addEventListener("click", () => {
      toastEl.remove();
    }, { once: true });

    this.shadowRoot.querySelector("[data-toaster]").appendChild(clonedTemplate);

    const animations = toastEl.getAnimations();
    await Promise.allSettled(animations.map((animation) => animation.finished));
    toastEl.remove();
  }

  /**
   * @param {Event} event
   */
  handleEvent(event) {
    const isCustomEvent = event instanceof CustomEvent;

    if (isCustomEvent && event.type === TOAST_EVENT) {
      /** @type {import("./index.d").Toast} */
      const details = event.detail;
      this.createToast(details);
    }
  }

  connectedCallback() {
    this.render();
    document.addEventListener(TOAST_EVENT, this);
  }

  disconnectedCallback() {
    document.removeEventListener(TOAST_EVENT, this);
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `
    <style>${Toaster.STYLES}</style>

    <template id="toast-tmpl">
      <li data-toast>
        <button data-close-button aria-label="Close toast">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
          >
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
        <p data-title></p>
        <p data-description></p>
        <div data-actions>
          <button data-action-type="confirm"></button>
          <button data-action-type="cancel"></button>
        </div>
      </li>
    </template>

    <ol data-toaster></ol>`;
  }

  static STYLES = /* css */ `
  * {
    box-sizing: border-box;
  }

  :host {
    --_travel-distance: var(--toast-travel-distance, 5vh);
    --_animation-duration: var(--toast-animation-duration, 5s);

    --_toast-background: var(--toast-background, #FCFCFC);
    --_toast-border: var(--toast-border, #00000026);
    --_toast-title: var(--toast-title, #000000DF);
    --_toast-description: var(--toast-description, #0000009B);

    --_toast-success: var(--toast-success, #00924BA4);
    --_toast-error: var(--toast-error, #D2000571);
    --_toast-warning: var(--toast-warning, #E35F00AA);
    --_toast-info: var(--toast-info, #0084E6A1);
    --_toast-confirm: var(--toast-confirm, #6600C06C);

    --_toast-actions-direction: var(--toast-actions-direction, row);
    --_toast-actions-justify: var(--toast-actions-justify, flex-end);
    --_toast-actions-gap: var(--toast-actions-gap, 0.25rem);

    --_toast-actions-confirm-text-color: var(--toast-actions-confirm-text-color, white);
    --_toast-actions-confirm-background-color: var(--toast-actions-confirm-background-color, #00713FDE);
    --_toast-actions-cancel-text-color: var(--toast-actions-cancel-text-color, white);
    --_toast-actions-cancel-background-color: var(--toast-actions-cancel-background-color, #C40006D3);
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
      --_toast-confirm: var(--toast-confirm, #C47EFFA4);

      --_toast-actions-confirm-text-color: var(--toast-actions-confirm-text-color, white);
      --_toast-actions-confirm-background-color: var(--toast-actions-confirm-background-color, #54FFAD73);
      --_toast-actions-cancel-text-color: var(--toast-actions-cancel-text-color, white);
      --_toast-actions-cancel-background-color: var(--toast-actions-cancel-background-color, #FF5D61B0);
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
    z-index: 999;
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

  :host([position="bottom-right"]) [data-toaster] {
    top: 0;
    right: 0;
  }
  
  :host([position="bottom-left"]) [data-toaster] {
    top: 0;
    left: 0;
  }

  :host([position="bottom-center"]) [data-toaster] {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  
  :host([position="top-right"]) [data-toaster] {
    top: 0;
    right: 0;
    flex-direction: column;
  }
  
  :host([position="top-left"]) [data-toaster] {
    top: 0;
    left: 0;
    flex-direction: column;
  }

  :host([position="top-center"]) [data-toaster] {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    flex-direction: column;
  }

  [data-toast] {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    position: relative;

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

    &[data-type="confirm"] {
      border-top: 4px solid var(--_toast-confirm);
    }
  }

  [data-close-button] {
    --size: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--size);
    height: var(--size);
    position: absolute;
    top: 0;
    left: 0;
    color: var(--_toast-title);
    background-color: var(--_toast-background);
    border-radius: 50%;
    border: 1px solid var(--_toast-border);
    padding: 0.125rem;
    translate: -35% -35%;
    cursor: pointer;
  }

  [data-actions] {
    display: flex;
    flex-direction: var(--_toast-actions-direction);
    justify-content: var(--_toast-actions-justify);
    gap: var(--_toast-actions-gap);
    margin-top: 0.5rem;
  }

  button[data-action-type="confirm"],
  button[data-action-type="cancel"] {
    padding: 0.5rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    transition-property: opacity;
    transition-duration: 200ms;

    &:hover,
    &:focus {
      opacity: 0.8;
    }
  }
      
  button[data-action-type="confirm"] {
    color: var(--_toast-actions-confirm-text-color);
    font-weight: 600;
    background-color: var(--_toast-actions-confirm-background-color);
  }

  button[data-action-type="cancel"] {
    color: var(--_toast-actions-cancel-text-color);
    font-weight: 600;
    background-color:var(--_toast-actions-cancel-background-color);
  }
  
  [data-title], [data-description] {
    margin: 0;
    all: initial; 
    font-family: inherit;
    line-height: 1.5;
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
