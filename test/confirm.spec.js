/* global it, describe, before */
import { expect } from "@wdio/globals";
import { spyOn } from "@wdio/browser-runner";
import { SELECTORS, createToaster } from "./utils.js";
import { toast } from "../src/index.js";

describe("confirm toast", () => {
  let $toaster;
  let onConfirmSpy;

  before(async () => {
    $toaster = await createToaster();

    onConfirmSpy = spyOn(console, "log");

    toast.confirm({
      title: "Example #1",
      confirmText: "Confirm",
      cancelText: "Cancel",
      onConfirm: () => {
        // eslint-disable-next-line no-console
        console.log("confirm button clicked");
      },
      duration: "none"
    });
  });

  it("should render action buttons correctly", async () => {
    const $toast = await $toaster.$(SELECTORS.TOAST);
    await expect($toast).toExist();

    const $confirmBtn = await $toast.$(SELECTORS.CONFIRM_BUTTON);

    await expect($confirmBtn).toExist();
    await expect($confirmBtn).toBeClickable();
    await expect($confirmBtn).toHaveText("Confirm");

    const $cancelBtn = await $toast.$(SELECTORS.CANCEL_BUTTON);

    await expect($cancelBtn).toExist();
    await expect($cancelBtn).toBeClickable();
    await expect($cancelBtn).toHaveText("Cancel");
  });

  it("should trigger confirm action when clicked", async () => {
    const $toast = await $toaster.$(SELECTORS.TOAST);
    await expect($toast).toExist();

    const $confirmBtn = await $toast.$(SELECTORS.CONFIRM_BUTTON);
    await $confirmBtn.click();

    await expect(onConfirmSpy).toHaveBeenCalled();
  });
});
