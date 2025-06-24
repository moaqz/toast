/* global HTMLElement, customElements */

const TOAST_EVENT = "@moaqzdev/toast";

class Toaster extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  /**
   * @param {import("./toast.d").Toast}
   */
  async createToast({
    title,
    type,
    description,
    onConfirm,
    onCancel,
    confirmText = "✅",
    cancelText = "❌",
    duration = 3000,
  }) {
    /** @type {HTMLTemplateElement} */
    const toastTemplate = this.shadowRoot.querySelector("#toast-tmpl");
    const clonedTemplate = toastTemplate.content.cloneNode(true);
    const toast = {
      container: clonedTemplate.querySelector("[data-toast]"),
      title: clonedTemplate.querySelector("[data-title]"),
      description: clonedTemplate.querySelector("[data-description]"),
      actions: clonedTemplate.querySelector("[data-actions]"),
      confirmBtn: clonedTemplate.querySelector("button[data-action-type='confirm']"),
      cancelBtn: clonedTemplate.querySelector("button[data-action-type='cancel']"),
      closeBtn: clonedTemplate.querySelector("[data-close-button]"),
    };

    toast.title.textContent = title || "";
    toast.container.setAttribute("data-type", type);

    if (description == null) {
      toast.description?.remove();
    } else {
      toast.description.textContent = description;
    }

    const closeToast = () => this.removeToast(toast.container);

    if (type === "confirm") {
      toast.confirmBtn.textContent = confirmText;
      toast.confirmBtn.addEventListener("click", () => {
        onConfirm?.();
        closeToast();
      }, { once: true });

      toast.cancelBtn.textContent = cancelText;
      toast.cancelBtn.addEventListener("click", () => {
        onCancel?.();
        closeToast();
      }, { once: true });
    } else {
      toast.actions?.remove();
    }

    const isDismissable = this.hasAttribute("dismissable");
    if (isDismissable) {
      toast.closeBtn.addEventListener("click", closeToast, { once: true });
    } else {
      toast.closeBtn?.remove();
    }

    this.shadowRoot.querySelector("[data-toaster]").appendChild(clonedTemplate);
    if (duration !== "none") {
      const toastDuration = Math.max(Number.parseInt(duration, 10) || 0, 3000);

      const controller = new AbortController();
      const initialTime = Date.now();
      let pauseTimestamp = null;
      let timeElapsed = 0;

      const close = () => {
        controller.abort();
        closeToast();
      };

      let timeoutId = setTimeout(close, toastDuration);

      const onHover = () => {
        if (pauseTimestamp != null) { // if it is already paused.
          return;
        }

        clearTimeout(timeoutId);
        pauseTimestamp = Date.now();
      };

      const onLeave = () => {
        if (pauseTimestamp == null) { // if not paused.
          return;
        };

        timeElapsed = pauseTimestamp - initialTime;
        pauseTimestamp = null;
        timeoutId = setTimeout(close, Math.max(toastDuration - timeElapsed, 0));
      };

      ["focusin", "pointerenter", "mouseenter"].forEach(type => {
        toast.container.addEventListener(type, onHover, { signal: controller.signal });
      });

      ["focusout", "pointerleave", "mouseleave"].forEach(type => {
        toast.container.addEventListener(type, onLeave, { signal: controller.signal });
      });
    }
  }

  /**
   * @param {HTMLElement} node
   */
  removeToast(node) {
    const exitAnimation = node.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 300, easing: "ease", fill: "forwards" }
    );

    exitAnimation.finished.then(() => node.remove());
  }

  /**
   * @param {Event} event
   */
  handleEvent(event) {
    const isCustomEvent = event instanceof CustomEvent;

    if (isCustomEvent && event.type === TOAST_EVENT) {
      /** @type {import("./toast.d").Toast} */
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
      <li data-toast tabindex="0">
        <button data-close-button aria-label="Close">
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
            aria-hidden="true"
          >
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
        <p data-title></p>
        <p data-description></p>
        <div data-actions>
          <button type="button" data-action-type="confirm"></button>
          <button type="button" data-action-type="cancel"></button>
        </div>
      </li>
    </template>

    <ol data-toaster tabindex="-1"></ol>`;
  }

  static STYLES = /* css */ `
  * {
    box-sizing: border-box;
  }

  :host {
    --_travel-distance: var(--toast-travel-distance, 5vh);

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
    animation: fade-in .3s ease, slide-in .3s ease;

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
