export const TOAST_EVENT = "@moaqzdev/toast";

export const toast = {
  /**
   * @param {import("./toast.d").ToastType} type
   * @param {import("./utils.d").ToastEvent} detail
   */
  _dispatchToast(type, detail) {
    /**
     * @type {CustomEvent<import("./toast.d").Toast>}
     */
    Object.assign(detail, { type });
    const toast = new CustomEvent(TOAST_EVENT, {
      detail,
    });

    document.dispatchEvent(toast);
  },

  /**
   * @param {import("./utils.d").ToastEvent} details
   */
  success(details) {
    this._dispatchToast("success", details);
  },

  /**
   * @param {import("./utils.d").ToastEvent} details
   */
  error(details) {
    this._dispatchToast("error", details);
  },

  /**
   * @param {import("./utils.d").ToastEvent} details
   */
  warning(details) {
    this._dispatchToast("warning", details);
  },

  /**
   * @param {import("./utils.d").ToastEvent} details
   */
  info(details) {
    this._dispatchToast("info", details);
  },

  /**
   * @param {import("./utils.d").ToastEvent & { onConfirm: () => void; onCancel?: () => void }} details
   */
  confirm(details) {
    this._dispatchToast("confirm", details);
  },
};
