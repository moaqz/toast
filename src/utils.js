export const TOAST_EVENT = "@moaqzdev/toast";

export const toast = {
  /**
   * @param {import("./toast.d").ToastType} type
   * @param {import("./toast.d").ToastEvent} detail
   */
  _dispatchToast(type, detail) {
    Object.assign(detail, { type });

    /**
     * @type {CustomEvent<import("./toast.d").Toast>}
     */
    const toast = new CustomEvent(TOAST_EVENT, {
      detail,
    });

    document.dispatchEvent(toast);
  },

  /**
   * @param {import("./toast.d").ToastRegularEvent} details
   */
  success(details) {
    this._dispatchToast("success", details);
  },

  /**
   * @param {import("./toast.d").ToastRegularEvent} details
   */
  error(details) {
    this._dispatchToast("error", details);
  },

  /**
   * @param {import("./toast.d").ToastRegularEvent} details
   */
  warning(details) {
    this._dispatchToast("warning", details);
  },

  /**
   * @param {import("./toast.d").ToastRegularEvent} details
   */
  info(details) {
    this._dispatchToast("info", details);
  },

  /**
   * @param {import("./toast.d").ToastConfirmEvent} details
   */
  confirm(details) {
    this._dispatchToast("confirm", details);
  },
};
