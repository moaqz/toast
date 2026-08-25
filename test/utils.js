import { browser } from "@wdio/globals";

export const SELECTORS = {
  CANCEL_BUTTON: "button[data-action-type='cancel']",
  CLOSE_BUTTON: "[data-close-button]",
  CONFIRM_BUTTON: "button[data-action-type='confirm']",
  TOAST: "[data-toast]:first-child",
  TOASTER_CONTAINER: "[data-toaster]"
};

export async function createToaster(options = {}) {
  const node = document.createElement("moaqz-toaster");

  if (options.dismissable) {
    node.setAttribute("dismissable", true);
  }

  document.body.appendChild(node);

  return browser.$("moaqz-toaster").shadow$(SELECTORS.TOASTER_CONTAINER);
}
