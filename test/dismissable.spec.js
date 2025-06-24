/* global it, describe, before */
import { expect, browser } from "@wdio/globals";
import { SELECTORS, createToaster } from "./utils.js";

// register toast
import "../src/index.js";
import { toast } from "../src/utils.js";

describe("dismissable toast", () => {
  let $toaster;

  before(async () => {
    $toaster = await createToaster({ dismissable: true });
  });

  it("should remove toast after closing it", async () => {
    toast.info({ title: "test title", duration: "none" });

    const $toast = await $toaster.$(SELECTORS.TOAST);
    await expect($toast).toExist();

    const $closeBtn = await $toast.$(SELECTORS.CLOSE_BUTTON);
    await expect($closeBtn).toExist();
    await expect($closeBtn).toBeClickable();

    await $closeBtn.click();

    await browser.waitUntil(async () => {
      return await $toaster.$$(SELECTORS.TOAST).length === 0;
    }, { timeout: 10000 });

    await expect($toast).not.toExist();
  });
});
