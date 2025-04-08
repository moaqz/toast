import { browser } from "@wdio/globals";

export const SELECTORS = {
  TOASTER_CONTAINER: "[data-toaster]",
  TOAST: "[data-toast]:first-child",
  CLOSE_BUTTON: "[data-close-button]",
  CONFIRM_BUTTON: "button[data-action-type='confirm']",
  CANCEL_BUTTON: "button[data-action-type='cancel']"
};

export async function createToaster(options = {}) {
  const node = document.createElement("moaqz-toaster");

  if (options.dismissable) {
    node.setAttribute("dismissable", true);
  }

  document.body.appendChild(node);

  return browser.$("moaqz-toaster").shadow$(SELECTORS.TOASTER_CONTAINER);
}
